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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/70 backdrop-blur-xs overflow-y-auto"
    >
      <div className="bg-white max-w-md w-full rounded-2xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e4efff] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#001126] text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[22px] text-[#98f6c5]">
                notifications_active
              </span>
            </div>
            <div>
              <span className="font-['Space_Grotesk'] text-[10px] text-[#0036ce] uppercase font-bold">
                Cycle de Vie & Maintenance
              </span>
              <h3 className="text-[17px] font-bold text-[#001126]">
                Rappels & Audit Semestriel
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#44474d] hover:text-[#001126] hover:bg-[#eef4ff]"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Explication doctrinale */}
        <p className="text-[12px] text-[#44474d] leading-relaxed">
          Un kit de crise abandonné sans contrôle perd son efficacité : les piles coulent, l'eau stagne, les filtres à gaz se saturent d'humidité et les conserves périment. La Sécurité Civile préconise un audit physique tous les 6 mois.
        </p>

        {/* Carte Statut de l'Audit Semestriel */}
        <div className={`p-4 rounded-xl border flex flex-col gap-2 ${
          auditStatus.isAuditDue
            ? 'bg-[#ffdad6]/40 border-[#ffb4ab] text-[#93000a]'
            : 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wide">
              Contrôle Semestriel (6 Mois)
            </span>
            <span className={`text-[10px] font-['Space_Grotesk'] px-2 py-0.5 rounded font-bold uppercase ${
              auditStatus.isAuditDue ? 'bg-[#ba1a1a] text-white' : 'bg-[#16a34a] text-white'
            }`}>
              {auditStatus.isAuditDue ? 'Audit Requis' : 'À Jour'}
            </span>
          </div>

          <div className="flex items-baseline justify-between text-[13px]">
            <span>Dernier audit :</span>
            <strong className="font-['Space_Grotesk']">
              {auditStatus.lastAuditDate ? `Il y a ${auditStatus.daysSinceLastAudit} jours` : 'Jamais effectué'}
            </strong>
          </div>

          <div className="flex items-baseline justify-between text-[13px]">
            <span>Prochain contrôle recommandé :</span>
            <strong className="font-['Space_Grotesk']">{auditStatus.nextAuditDate}</strong>
          </div>

          <button
            type="button"
            onClick={handleValidateAudit}
            className="mt-1 w-full min-h-[40px] bg-white text-[#001126] border border-[#c4c6ce] hover:bg-[#eef4ff] rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#16a34a]">check_circle</span>
            <span>Valider l'audit physique aujourd'hui</span>
          </button>
        </div>

        {/* État des Péremptions dans l'Inventaire */}
        <div className="bg-[#eef4ff] p-3 rounded-xl border border-[#d6e4f8] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold uppercase">
              Péremptions Suivies dans l'Inventaire
            </span>
            <span className="text-[11px] font-['Space_Grotesk'] text-[#0036ce] font-bold">
              {auditStatus.totalTrackedWithExpiry} article(s) daté(s)
            </span>
          </div>

          {auditStatus.expiredItems.length > 0 && (
            <div className="p-2.5 bg-[#ffdad6] text-[#93000a] rounded-lg text-[11px] font-medium flex items-start gap-1.5 border border-[#ffb4ab]">
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
            <div className="p-2.5 bg-[#fefce8] text-[#854d0e] rounded-lg text-[11px] font-medium flex items-start gap-1.5 border border-[#fef08a]">
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
            <p className="text-[11px] text-[#44474d]">
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
              className="text-[#0036ce] text-[11px] font-['Space_Grotesk'] font-bold underline flex items-center gap-1 self-start pt-1"
            >
              <span>Ouvrir l'inventaire pour renseigner les dates de péremption</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          )}
        </div>

        {/* Contrôle des notifications locales */}
        <div className="pt-1 flex flex-col gap-2 border-t border-[#e4efff]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#001126]">
              Notifications Locales PWA
            </span>
            <span className={`text-[10px] font-['Space_Grotesk'] px-2 py-0.5 rounded font-bold uppercase ${
              permission === 'granted' ? 'bg-[#16a34a] text-white' : 'bg-[#e4efff] text-[#44474d]'
            }`}>
              {permission === 'granted' ? 'Activées' : 'Non autorisées'}
            </span>
          </div>

          {permission !== 'granted' ? (
            <button
              type="button"
              onClick={handleRequestPermission}
              className="w-full min-h-[44px] bg-[#001126] hover:bg-[#12263f] text-white rounded-xl font-['Space_Grotesk'] text-[11px] uppercase font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
              <span>Autoriser les rappels d'audit sur cet appareil</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTestNotification}
              className="w-full min-h-[40px] bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001126] border border-[#d6e4f8] rounded-xl font-['Space_Grotesk'] text-[11px] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Tester la notification locale maintenant</span>
            </button>
          )}

          {testSuccess && (
            <p className="text-[11px] text-[#16a34a] font-medium text-center">{testSuccess}</p>
          )}
        </div>
      </div>
    </div>
  );
};
