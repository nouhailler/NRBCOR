import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { FamilyPlanData } from '../services/storage/StorageRepository';
import { triggerHaptic } from '../utils/haptics';

interface FamilyPlanQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: FamilyPlanData;
  onImportPlan: (imported: FamilyPlanData) => void;
}

const QR_PREFIX = 'NRBCOR_PFMS_V1:';

export const FamilyPlanQrModal: React.FC<FamilyPlanQrModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onImportPlan,
}) => {
  const [activeTab, setActiveTab] = useState<'share' | 'scan'>('share');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Scanner state
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedPlan, setScannedPlan] = useState<FamilyPlanData | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Payload compact
  const getCompactPayload = (): string => {
    const compact = {
      v: 1,
      t: Date.now(),
      m: currentPlan.members || [],
      a: currentPlan.assemblyPoints || [],
      o: currentPlan.outZoneContact || null,
      l: currentPlan.localContacts || [],
      k: (currentPlan.tasks || []).map((t) => ({ id: t.id, d: t.done }))
    };
    return QR_PREFIX + btoa(unescape(encodeURIComponent(JSON.stringify(compact))));
  };

  // Décoder un payload
  const parsePayload = (raw: string): FamilyPlanData | null => {
    try {
      let jsonString = raw.trim();
      if (jsonString.startsWith(QR_PREFIX)) {
        jsonString = jsonString.slice(QR_PREFIX.length);
        const decoded = decodeURIComponent(escape(atob(jsonString)));
        const data = JSON.parse(decoded);
        return {
          members: data.m || [],
          assemblyPoints: data.a || [],
          outZoneContact: data.o || undefined,
          localContacts: data.l || [],
          tasks: (data.k || []).map((t: any) => ({
            id: t.id,
            title: '',
            desc: '',
            timeframe: '',
            done: !!t.d
          }))
        };
      }
      // Tentative JSON brut
      const direct = JSON.parse(jsonString);
      if (direct.members || direct.assemblyPoints || direct.outZoneContact) {
        return direct;
      }
      return null;
    } catch (e) {
      return null;
    }
  };

  // Génération du QR Code
  useEffect(() => {
    if (!isOpen || activeTab !== 'share') return;

    const timer = setTimeout(() => {
      if (canvasRef.current) {
        const payload = getCompactPayload();
        QRCode.toCanvas(canvasRef.current, payload, {
          width: 256,
          margin: 1.5,
          color: {
            dark: '#001126',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        }, (err) => {
          if (!err) setQrGenerated(true);
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOpen, activeTab, currentPlan]);

  // Gestion de la caméra
  useEffect(() => {
    if (!isOpen || activeTab !== 'scan') {
      stopCamera();
      return;
    }

    startCamera();

    return () => stopCamera();
  }, [isOpen, activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    setScannerActive(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Caméra non disponible dans ce navigateur.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        scanFrame();
      }
    } catch (err: any) {
      console.warn('Accès caméra:', err);
      setCameraError('Impossible d’activer la caméra (droits refusés ou non supporté). Utilisez le téléversement d’image ou le collage ci-dessous.');
      setScannerActive(false);
    }
  };

  const stopCamera = () => {
    setScannerActive(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const scanFrame = () => {
    if (!videoRef.current || !scanCanvasRef.current) return;

    const video = videoRef.current;
    const canvas = scanCanvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        const parsed = parsePayload(code.data);
        if (parsed) {
          triggerHaptic('success');
          setScannedPlan(parsed);
          stopCamera();
          return;
        }
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  };

  // Traitement d'un fichier image (téléversement)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code && code.data) {
          const parsed = parsePayload(code.data);
          if (parsed) {
            triggerHaptic('success');
            setScannedPlan(parsed);
            return;
          }
        }
        setManualError('Aucun QR code NRBCOR valide détecté sur cette image.');
      };
      img.src = evt.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Traitement manuel
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualError(null);
    if (!manualCode.trim()) return;

    const parsed = parsePayload(manualCode);
    if (!parsed) {
      setManualError('Code de plan familial invalide ou corrompu.');
      return;
    }
    triggerHaptic('success');
    setScannedPlan(parsed);
  };

  const handleConfirmImport = () => {
    if (!scannedPlan) return;
    triggerHaptic('heavy');
    onImportPlan(scannedPlan);
    onClose();
  };

  const copyPayloadToClipboard = () => {
    triggerHaptic('light');
    const p = getCompactPayload();
    navigator.clipboard?.writeText(p);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white max-w-md w-full rounded-2xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3 my-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-[#e4efff] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#001126] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px] text-[#98f6c5]">
                qr_code_2
              </span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#0036ce] uppercase font-bold">
                Partage Direct Sans Cloud
              </span>
              <h3 className="text-[17px] font-bold text-[#001126]">
                QR Code Plan Familial
              </h3>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474d] hover:text-[#001126] hover:bg-[#eef4ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Onglets Partager vs Scanner */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#eef4ff] rounded-xl border border-[#d6e4f8]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('share');
              stopCamera();
              setScannedPlan(null);
            }}
            className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all ${
              activeTab === 'share'
                ? 'bg-[#001126] text-white shadow-xs'
                : 'text-[#001126] hover:bg-white/60'
            }`}
          >
            Afficher mon QR Code
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light');
              setActiveTab('scan');
              setScannedPlan(null);
            }}
            className={`min-h-[40px] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-all ${
              activeTab === 'scan'
                ? 'bg-[#001126] text-white shadow-xs'
                : 'text-[#001126] hover:bg-white/60'
            }`}
          >
            Scanner / Importer
          </button>
        </div>

        {/* Limitation QR Code & Primauté de la Fiche Papier */}
        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-snug flex items-start gap-2">
          <span className="material-symbols-outlined text-[16px] text-amber-700 shrink-0 mt-0.5">warning</span>
          <span>
            <strong>Attention :</strong> Le QR Code nécessite un téléphone chargé et opérationnel. En cas de panne de réseau ou blackout prolongé, <strong>seule la fiche papier imprimée</strong> est utilisable en toute circonstance.
          </span>
        </div>

        {/* VUE 1 : PARTAGER MON PLAN */}
        {activeTab === 'share' && (
          <div className="flex flex-col items-center gap-3 py-1">
            <p className="text-[12px] text-[#44474d] text-center leading-snug">
              Présentez ce QR Code à un proche. Il lui suffit d'ouvrir NRBCOR sur son téléphone et de cliquer sur <strong>« Scanner »</strong> pour cloner le plan familial sans Internet.
            </p>

            {/* QR Canvas Box */}
            <div className="p-3 bg-white rounded-2xl shadow-sm border-2 border-[#001126] flex items-center justify-center">
              <canvas ref={canvasRef} className="max-w-full h-auto" />
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-[#002c1b] bg-[#f0fdf4] px-3 py-2 rounded-xl border border-[#bbf7d0]">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="material-symbols-outlined text-[16px] text-[#16a34a]">lock</span>
                Transmission 100% locale (zéro transit serveur)
              </span>
              <span className="font-['Space_Grotesk'] font-bold uppercase text-[10px]">P2P LOCAL</span>
            </div>

            <button
              type="button"
              onClick={copyPayloadToClipboard}
              className="w-full min-h-[44px] bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001126] rounded-xl font-['Space_Grotesk'] text-[11px] uppercase font-bold flex items-center justify-center gap-2 border border-[#d6e4f8] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>{copiedText ? 'Copié dans le presse-papier !' : 'Copier le code de secours en texte'}</span>
            </button>
          </div>
        )}

        {/* VUE 2 : SCANNER / IMPORTER UN PLAN */}
        {activeTab === 'scan' && (
          <div className="flex flex-col gap-3 py-1">
            {!scannedPlan ? (
              <>
                <p className="text-[12px] text-[#44474d] leading-snug">
                  Pointez votre appareil vers le QR Code affiché sur le téléphone d'un membre de votre famille.
                </p>

                {/* Caméra Live */}
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-[#c4c6ce] flex items-center justify-center">
                  <video ref={videoRef} className="w-full h-full object-cover" />
                  <canvas ref={scanCanvasRef} className="hidden" />

                  {/* Viseur visuel */}
                  <div className="absolute inset-8 border-2 border-[#98f6c5] rounded-lg pointer-events-none opacity-80 animate-pulse"></div>

                  {!scannerActive && (
                    <div className="absolute inset-0 bg-[#001126]/90 p-4 flex flex-col items-center justify-center text-center gap-2 text-white">
                      <span className="material-symbols-outlined text-[32px] text-[#ffdad6]">videocam_off</span>
                      <p className="text-[12px] text-[#ffdad6]">{cameraError || 'Caméra arrêtée'}</p>
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-3 py-1.5 bg-[#98f6c5] text-[#002c1b] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                      >
                        Réactiver la caméra
                      </button>
                    </div>
                  )}
                </div>

                {/* Fallbacks : Image ou Texte */}
                <div className="flex flex-col gap-2 pt-1 border-t border-[#e4efff]">
                  <label className="min-h-[44px] bg-[#f8f9ff] hover:bg-[#eef4ff] text-[#001126] border border-[#d6e4f8] rounded-xl flex items-center justify-center gap-2 text-[12px] font-bold font-['Space_Grotesk'] uppercase cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">photo_library</span>
                    <span>Téléverser une photo du QR Code</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <form onSubmit={handleManualSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      placeholder="Ou coller le code texte..."
                      className="flex-1 px-3 py-2 bg-white rounded-xl border border-[#c4c6ce] text-[12px] font-mono text-[#001126]"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#001126] text-white rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase shrink-0"
                    >
                      Valider
                    </button>
                  </form>
                  {manualError && (
                    <p className="text-[11px] text-[#ba1a1a] font-medium">{manualError}</p>
                  )}
                </div>
              </>
            ) : (
              /* Prévisualisation avant confirmation d'écrasement */
              <div className="bg-[#f0fdf4] p-4 rounded-xl border border-[#bbf7d0] flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-[#166534]">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                  <h4 className="font-bold text-[14px]">Plan Familial Détecté !</h4>
                </div>

                <div className="space-y-1 text-[12px] text-[#166534]">
                  <p>• <strong>{scannedPlan.members?.length || 0}</strong> membres configurés</p>
                  <p>• <strong>{scannedPlan.assemblyPoints?.length || 0}</strong> points de ralliement définis</p>
                  <p>• Contact relais : <strong>{scannedPlan.outZoneContact?.name || 'Non défini'}</strong> ({scannedPlan.outZoneContact?.phone || '-'})</p>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-[#bbf7d0] text-[11px] text-[#44474d]">
                  ⚠️ L'importation remplacera votre plan actuel sur cet appareil par celui du QR code.
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleConfirmImport}
                    className="flex-1 min-h-[46px] bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">download_done</span>
                    <span>Importer ce plan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setScannedPlan(null);
                      startCamera();
                    }}
                    className="px-3 min-h-[46px] bg-white text-[#44474d] rounded-xl font-['Space_Grotesk'] text-[11px] font-bold uppercase border border-[#c4c6ce]"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
