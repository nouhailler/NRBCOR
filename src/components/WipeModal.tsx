import React from 'react';

interface WipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmClean: () => void;
  onConfirmDemo?: () => void;
}

export const WipeModal: React.FC<WipeModalProps> = ({
  isOpen,
  onClose,
  onConfirmClean,
  onConfirmDemo
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-card max-w-lg w-full rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl border border-line-strong overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-on-navy pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tint text-ink flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px]">restart_alt</span>
            </div>
            <div>
              <h3 className="text-[18px] text-ink font-bold leading-tight">
                Gestion des données du prototype
              </h3>
              <p className="font-label text-[11px] text-brand-ink font-bold uppercase tracking-wider">
                Remise à zéro & feuille blanche
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-lg bg-subtle hover:bg-tint text-ink-muted flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-[13px] text-ink-muted leading-relaxed">
          Le prototype intègre par défaut des données d'exemple (famille modèle avec chat, point de ralliement fictif « Parc des Cèdres », contacts relais de démonstration et stocks types).
        </p>

        {/* Option 1 : Partir propre (Feuille blanche) */}
        <div className="bg-canvas border-2 border-brand-ink/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-brand-ink text-[20px]">
                ink_eraser
              </span>
              <h4 className="font-label text-[14px] font-bold text-ink">
                Option 1 : Partir propre (Feuille blanche)
              </h4>
            </div>
            <span className="font-label text-[10px] bg-ok-soft text-ok-ink px-2 py-0.5 rounded font-bold uppercase shrink-0">
              Recommandé
            </span>
          </div>

          <p className="text-[12px] text-ink leading-relaxed">
            Supprime toutes les données factices pour que vous puissiez saisir et tester vos propres informations réelles :
          </p>

          <ul className="text-[11px] text-ink-muted space-y-1 pl-1">
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-ok-ink">check</span>
              <span><strong>Plan Familial vidé :</strong> aucun membre fictif, aucun contact inventé, aucun point de ralliement.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-ok-ink">check</span>
              <span><strong>Checklist 72h à zéro :</strong> 0/24 éléments acquis, prêt à être coché selon vos vrais achats.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-ok-ink">check</span>
              <span><strong>Inventaire vidé :</strong> 0 aliment ou matériel pré-rempli.</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px] text-ok-ink">check</span>
              <span><strong>Foyer réinitialisé :</strong> 1 adulte de base, sans Seveso ni besoins spécifiques artificiels.</span>
            </li>
          </ul>

          <button
            type="button"
            onClick={onConfirmClean}
            className="w-full min-h-[46px] px-4 bg-navy hover:bg-brand-strong text-white font-label text-[12px] font-bold uppercase rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
            <span>Tout effacer & partir d'une feuille blanche</span>
          </button>
        </div>

        {/* Option 2 : Recharger la démo */}
        {onConfirmDemo && (
          <div className="bg-subtle border border-line-strong rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-ink text-[18px]">
                science
              </span>
              <h4 className="font-label text-[13px] font-bold text-ink">
                Option 2 : Recharger le scénario de démonstration
              </h4>
            </div>
            <p className="text-[11px] text-ink-muted leading-relaxed">
              Rétablit la famille modèle (enfants, PMR, chat), les contacts locaux et le point de ralliement « Parc des Cèdres » pour explorer facilement toutes les vues.
            </p>
            <button
              type="button"
              onClick={onConfirmDemo}
              className="w-full min-h-[42px] px-3 bg-card hover:bg-tint text-ink border border-line-strong font-label text-[11px] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">dataset</span>
              <span>Recharger les données d'exemple démo</span>
            </button>
          </div>
        )}

        {/* Footer cancel */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-4 text-ink-muted hover:text-ink font-label text-[12px] font-semibold transition-colors"
          >
            Annuler (ne rien changer)
          </button>
        </div>
      </div>
    </div>
  );
};
