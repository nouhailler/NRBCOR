import React, { useState } from 'react';
import {
  CRISIS_GUIDES_METADATA,
  PrintableGuideKey,
  downloadGuidePdf
} from '../services/pdfExportService';
import { FamilyPlanData } from '../services/storage/StorageRepository';
import { triggerHaptic } from '../utils/haptics';

interface ExportPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialGuideKey?: PrintableGuideKey;
  familyPlan?: FamilyPlanData | null;
}

export const ExportPdfModal: React.FC<ExportPdfModalProps> = ({
  isOpen,
  onClose,
  initialGuideKey = 'pack-complet',
  familyPlan
}) => {
  const [selectedKey, setSelectedKey] = useState<PrintableGuideKey>(initialGuideKey);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownload = async (key: PrintableGuideKey) => {
    triggerHaptic('medium');
    setIsExporting(true);
    try {
      await downloadGuidePdf(key, familyPlan);
      setExportSuccess(`Le document PDF "${CRISIS_GUIDES_METADATA[key].title}" a été généré avec succès.`);
      setTimeout(() => setExportSuccess(null), 4000);
    } catch (err) {
      console.error('Erreur export PDF:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    triggerHaptic('light');
    window.print();
  };

  const currentMeta = CRISIS_GUIDES_METADATA[selectedKey];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-4 my-auto">
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-[#e4efff] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#001126] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px] text-[#98f6c5]">
                picture_as_pdf
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#0036ce] tracking-wider">
                Classeur de Crise Physique
              </span>
              <h3 className="text-[17px] font-bold text-[#001126]">
                Export PDF des Guides Clés
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474d] hover:text-[#001126] hover:bg-[#eef4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Message d'utilité */}
        <p className="text-[12px] text-[#44474d] leading-relaxed">
          En situation de coupure électrique prolongée ou d'impulsion électromagnétique (IEM), les smartphones peuvent être indisponibles. Imprimez ces fiches normalisées pour votre classeur de secours familial.
        </p>

        {/* Sélecteur de guide */}
        <div className="flex flex-col gap-1.5">
          <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold uppercase tracking-wider">
            Sélectionner la fiche à exporter :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {[
              { key: 'pack-complet', label: 'Pack Complet (4 en 1)', icon: 'folder_zip', badge: 'Recommandé' },
              { key: 'deshabillage', label: 'Déshabillage 8 Étapes', icon: 'sanitizer', badge: 'Vital' },
              { key: 'iode', label: 'Fiche Iode & Posologie', icon: 'medication', badge: 'ASNR' },
              { key: 'confinement', label: 'Guide Confinement', icon: 'meeting_room', badge: 'DGSCGC' },
              { key: 'plan', label: 'Plan Familial (PFMS)', icon: 'family_restroom', badge: 'Personnel' },
            ].map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => {
                  triggerHaptic('light');
                  setSelectedKey(g.key as PrintableGuideKey);
                }}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                  selectedKey === g.key
                    ? 'bg-[#001126] text-white border-[#001126] shadow-sm'
                    : 'bg-[#f8f9ff] hover:bg-[#eef4ff] text-[#001126] border-[#d6e4f8]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[18px] shrink-0">
                    {g.icon}
                  </span>
                  <span className="text-[12px] font-bold truncate">{g.label}</span>
                </div>
                <span className={`text-[9px] font-['Space_Grotesk'] px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                  selectedKey === g.key
                    ? 'bg-[#98f6c5] text-[#002c1b]'
                    : 'bg-white text-[#0036ce] border border-[#c4c6ce]'
                }`}>
                  {g.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu fiche sélectionnée */}
        <div className="bg-[#eef4ff] p-3 rounded-xl border border-[#d6e4f8] flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[10px] text-[#0036ce] font-bold uppercase">
              {currentMeta.category}
            </span>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#44474d]">
              {currentMeta.docId}
            </span>
          </div>
          <h4 className="text-[14px] font-bold text-[#001126] leading-tight">
            {currentMeta.title}
          </h4>
          <p className="text-[12px] text-[#44474d] leading-snug">
            {currentMeta.subtitle}
          </p>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#002c1b] font-medium">
            <span className="material-symbols-outlined text-[16px] text-[#3f9d73]">verified</span>
            <span>Doctrines officielles : {currentMeta.authority}</span>
          </div>
        </div>

        {/* Feedback message */}
        {exportSuccess && (
          <div className="p-3 bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0] rounded-xl text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#e4efff]">
          <button
            type="button"
            onClick={() => handleDownload(selectedKey)}
            disabled={isExporting}
            className="flex-1 min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white rounded-xl font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{isExporting ? 'Génération en cours...' : 'Télécharger le PDF (.pdf)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[48px] px-4 bg-white hover:bg-[#eef4ff] text-[#001126] rounded-xl font-['Space_Grotesk'] text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 border border-[#c4c6ce] transition-colors cursor-pointer"
            title="Lancer l'impression directe A4"
          >
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
