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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-card max-w-lg w-full rounded-2xl p-5 shadow-2xl border border-line-strong flex flex-col gap-4 my-auto">
        {/* En-tête */}
        <div className="flex items-start justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px] text-ok-bright">
                picture_as_pdf
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label text-[10px] uppercase font-bold text-brand-ink tracking-wider">
                Classeur de Crise Physique
              </span>
              <h3 className="text-[17px] font-bold text-ink">
                Export PDF des Guides Clés
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-subtle transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Message d'utilité */}
        <p className="text-[12px] text-ink-muted leading-relaxed">
          En situation de coupure électrique prolongée ou d'impulsion électromagnétique (IEM), les smartphones peuvent être indisponibles. Imprimez ces fiches normalisées pour votre classeur de secours familial.
        </p>

        {/* Sélecteur de guide */}
        <div className="flex flex-col gap-1.5">
          <span className="font-label text-[11px] text-ink font-bold uppercase tracking-wider">
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
                    ? 'bg-navy text-white border-ink shadow-sm'
                    : 'bg-canvas hover:bg-subtle text-ink border-line'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="material-symbols-outlined text-[18px] shrink-0">
                    {g.icon}
                  </span>
                  <span className="text-[12px] font-bold truncate">{g.label}</span>
                </div>
                <span className={`text-[9px] font-label px-1.5 py-0.5 rounded font-bold uppercase shrink-0 ${
                  selectedKey === g.key
                    ? 'bg-ok-soft text-ok-ink'
                    : 'bg-card text-brand-ink border border-line-strong'
                }`}>
                  {g.badge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aperçu fiche sélectionnée */}
        <div className="bg-subtle p-3 rounded-xl border border-line flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="font-label text-[10px] text-brand-ink font-bold uppercase">
              {currentMeta.category}
            </span>
            <span className="font-label text-[10px] text-ink-muted">
              {currentMeta.docId}
            </span>
          </div>
          <h4 className="text-[14px] font-bold text-ink leading-tight">
            {currentMeta.title}
          </h4>
          <p className="text-[12px] text-ink-muted leading-snug">
            {currentMeta.subtitle}
          </p>
          <div className="flex items-center gap-1.5 pt-1 text-[11px] text-ok-ink font-medium">
            <span className="material-symbols-outlined text-[16px] text-ok-ink">verified</span>
            <span>Doctrines officielles : {currentMeta.authority}</span>
          </div>
        </div>

        {/* Feedback message */}
        {exportSuccess && (
          <div className="p-3 bg-ok-soft text-ok-ink border border-ok-line rounded-xl text-[12px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>{exportSuccess}</span>
          </div>
        )}

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-line">
          <button
            type="button"
            onClick={() => handleDownload(selectedKey)}
            disabled={isExporting}
            className="flex-1 min-h-[48px] bg-navy hover:bg-navy-2 text-white rounded-xl font-label text-[12px] uppercase font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>{isExporting ? 'Génération en cours...' : 'Télécharger le PDF (.pdf)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="min-h-[48px] px-4 bg-card hover:bg-subtle text-ink rounded-xl font-label text-[12px] uppercase font-bold flex items-center justify-center gap-1.5 border border-line-strong transition-colors cursor-pointer"
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
