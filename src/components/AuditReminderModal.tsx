import React, { useState, useEffect } from 'react';
import { notificationService, AuditStatus } from '../services/notificationService';
import { InventoryItem } from '../services/storage/StorageRepository';
import { triggerHaptic } from '../utils/haptics';

interface AuditReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItems: InventoryItem[];
  onOpenInventory?: () => void;
  onAuditCompleted?: () => void | Promise<void>;
}

export const AuditReminderModal: React.FC<AuditReminderModalProps> = ({
  isOpen,
  onClose,
  inventoryItems,
  onOpenInventory,
  onAuditCompleted,
}) => {
  const [permission, setPermission] = useState<NotificationPermission>(notificationService.getPermission());
  const [auditStatus, setAuditStatus] = useState<AuditStatus>(() => notificationService.getAuditStatus(inventoryItems));
  const [testSuccess, setTestSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPermission(notificationService.getPermission());
      setAuditStatus(notificationService.getAuditStatus(inventoryItems));
    }
  }, [isOpen, inventoryItems]);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    triggerHaptic('medium');
    const perm = await notificationService.requestPermission();
    setPermission(perm);
    if (perm === 'granted') {
      triggerHaptic('success');
      setTestSuccess('Notifications locales autorisées ! Vous recevrez un rappel tous les 6 mois.');
      setTimeout(() => setTestSuccess(null), 4000);
    }
  };

  const handleTestNotification = async () => {
    triggerHaptic('light');
    if (permission !== 'granted') {
      const p = await notificationService.requestPermission();
      setPermission(p);
      if (p !== 'granted') return;
    }

    const sent = await notificationService.sendLocalNotification('NRBCOR • Test d’Alerte Réussi', {
      body: 'Le canal de rappel local d’audit semestriel et de péremption fonctionne parfaitement sur votre appareil.',
      data: { url: '/?tab=preparation' }
    });

    if (sent) {
      triggerHaptic('success');
      setTestSuccess('Notification de test émise sur votre écran.');
      setTimeout(() => setTestSuccess(null), 3500);
    }
  };

  const handleValidateAudit = () => {
    triggerHaptic('success');
    notificationService.markAuditCompleted();
    setAuditStatus(notificationService.getAuditStatus(inventoryItems));
    onAuditCompleted?.();
    setTestSuccess('Audit semestriel enregistré à la date du jour. Prochain contrôle dans 6 mois.');
    setTimeout(() => setTestSuccess(null), 4000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-card max-w-md w-full rounded-2xl p-5 shadow-2xl border border-line-strong flex flex-col gap-3 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px] text-ok-bright">
                notifications_active
              </span>
            </div>
            <div>
              <span className="font-label text-[10px] text-brand-ink uppercase font-bold">
                Cycle de Vie & Maintenance
              </span>
              <h3 className="text-[17px] font-bold text-ink">
                Rappels & Audit Semestriel
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-muted hover:text-ink hover:bg-subtle"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Explication doctrinale */}
        <p className="text-[12px] text-ink-muted leading-relaxed">
          Un kit de crise abandonné sans contrôle perd son efficacité : les piles coulent, l'eau stagne, les filtres à gaz se saturent d'humidité et les conserves périment. La Sécurité Civile préconise un audit physique tous les 6 mois.
        </p>

        {/* Carte Statut de l'Audit Semestriel */}
        <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
          auditStatus.isAuditDue
            ? 'bg-danger-soft/40 border-danger-line text-danger-ink-strong'
            : 'bg-ok-soft border-ok-line text-ok-ink'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] font-bold uppercase tracking-wide">
              Contrôle Semestriel (6 Mois)
            </span>
            <span className={`text-[10px] font-label px-2 py-0.5 rounded font-bold uppercase ${
              auditStatus.isAuditDue ? 'bg-danger text-white' : 'bg-ok text-white'
            }`}>
              {auditStatus.isAuditDue ? 'Audit Requis' : 'À Jour'}
            </span>
          </div>

          <div className="flex items-baseline justify-between text-[13px]">
            <span>Dernier audit :</span>
            <strong className="font-label">
              {auditStatus.lastAuditDate ? `Il y a ${auditStatus.daysSinceLastAudit} jours` : 'Jamais effectué'}
            </strong>
          </div>

          <div className="flex items-baseline justify-between text-[13px]">
            <span>Prochain contrôle recommandé :</span>
            <strong className="font-label">{auditStatus.nextAuditDate}</strong>
          </div>

          <button
            type="button"
            onClick={handleValidateAudit}
            className="mt-1 w-full min-h-[40px] bg-card text-ink border border-line-strong hover:bg-subtle rounded-lg font-label text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-ok-ink">check_circle</span>
            <span>Valider l'audit physique aujourd'hui</span>
          </button>
        </div>

        {/* État des Péremptions dans l'Inventaire */}
        <div className="bg-subtle p-3 rounded-xl border border-line flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-[11px] text-ink font-bold uppercase">
              Péremptions Suivies dans l'Inventaire
            </span>
            <span className="text-[11px] font-label text-brand-ink font-bold">
              {auditStatus.totalTrackedWithExpiry} article(s) daté(s)
            </span>
          </div>

          {auditStatus.expiredItems.length > 0 && (
            <div className="p-2.5 bg-danger-soft text-danger-ink-strong rounded-lg text-[11px] font-medium flex items-start gap-1.5 border border-danger-line">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
              <div>
                <strong>{auditStatus.expiredItems.length} article(s) périmé(s) :</strong>
                <ul className="list-disc pl-3 mt-0.5">
                  {auditStatus.expiredItems.map((e, idx) => (
                    <li key={idx}>{e.item.name} (dépassé depuis {e.daysDiff} jours)</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {auditStatus.soonExpiringItems.length > 0 && (
            <div className="p-2.5 bg-warn-soft text-warn-ink rounded-lg text-[11px] font-medium flex items-start gap-1.5 border border-warn-line">
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">warning</span>
              <div>
                <strong>{auditStatus.soonExpiringItems.length} article(s) à renouveler sous 30 jours :</strong>
                <ul className="list-disc pl-3 mt-0.5">
                  {auditStatus.soonExpiringItems.map((e, idx) => (
                    <li key={idx}>{e.item.name} (échéance dans {e.daysDiff} jours)</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {auditStatus.expiredItems.length === 0 && auditStatus.soonExpiringItems.length === 0 && (
            <p className="text-[11px] text-ink-muted">
              Aucune péremption critique détectée sur les articles renseignés.
            </p>
          )}

          {onOpenInventory && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenInventory();
              }}
              className="text-brand-ink text-[11px] font-label font-bold underline flex items-center gap-1 self-start pt-1"
            >
              <span>Ouvrir l'inventaire pour renseigner les dates de péremption</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Contrôle des notifications locales */}
        <div className="pt-1 flex flex-col gap-2 border-t border-line">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-ink">
              Notifications Locales PWA
            </span>
            <span className={`text-[10px] font-label px-2 py-0.5 rounded font-bold uppercase ${
              permission === 'granted' ? 'bg-ok text-white' : 'bg-tint text-ink-muted'
            }`}>
              {permission === 'granted' ? 'Activées' : 'Non autorisées'}
            </span>
          </div>

          {permission !== 'granted' ? (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="w-full min-h-[44px] bg-navy hover:bg-navy-2 text-white rounded-xl font-label text-[11px] uppercase font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Autoriser les rappels d'audit sur cet appareil</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTestNotification}
              className="w-full min-h-[40px] bg-subtle hover:bg-tint text-ink border border-line rounded-xl font-label text-[11px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Tester la notification locale maintenant</span>
            </button>
          )}

          {testSuccess && (
            <p className="text-[11px] text-ok-ink font-medium text-center">{testSuccess}</p>
          )}
        </div>
      </div>
    </div>
  );
};
