import React, { useState, useEffect, useMemo } from 'react';
import { TabType, SubScreen, KitItem } from '../types';
import { FamilyPlanData, AppSettings, InventoryItem } from '../services/storage/StorageRepository';
import { storageService, DEFAULT_SPECIFIC_NEEDS } from '../services/storage/IndexedDbStorage';
import { calculateReadinessScore } from '../utils/readinessScore';
import { useTranslation } from '../i18n/I18nContext';

interface HomeViewProps {
  onNavigateTab: (tab: TabType) => void;
  onOpenSubScreen: (screen: SubScreen) => void;
  kitCompletionPercent?: number;
  kitItems?: KitItem[];
  canInstall?: boolean;
  onInstallClick?: () => void;
  onOpenWipeModal?: () => void;
  onStartTour?: () => void;
}

type Tone = 'ok' | 'warn' | 'danger' | 'info' | 'neutral';

const TONE_BAR: Record<Tone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  danger: 'bg-danger',
  info: 'bg-brand',
  neutral: 'bg-ink-faint',
};
const TONE_ICON_BG: Record<Tone, string> = {
  ok: 'bg-ok-soft text-ok-ink',
  warn: 'bg-warn-soft text-warn-ink',
  danger: 'bg-danger-soft text-danger-ink',
  info: 'bg-tint text-brand-ink',
  neutral: 'bg-subtle text-ink-muted',
};

const Icon: React.FC<{ name: string; className?: string; filled?: boolean }> = ({ name, className = '', filled }) => (
  <span
    className={`material-symbols-outlined ${className}`}
    aria-hidden="true"
    style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
  >
    {name}
  </span>
);

/** Carte d'indicateur de préparation (valeur réelle issue des données locales). */
const StatCard: React.FC<{
  icon: string;
  label: string;
  value: string;
  detail: string;
  tone: Tone;
  percent?: number;
  status: string;
  onClick: () => void;
  actionLabel: string;
}> = ({ icon, label, value, detail, tone, percent, status, onClick, actionLabel }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={`${label} : ${value}. ${status}. ${actionLabel}`}
    className="ds-card p-3 sm:p-4 text-left flex flex-col gap-2 sm:gap-3 hover:border-line-strong hover:shadow-[var(--shadow-raised)] transition-shadow cursor-pointer group"
  >
    <div className="flex items-center justify-between gap-2">
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TONE_ICON_BG[tone]}`}>
        <Icon name={icon} className="text-[20px]" />
      </span>
      <span className={`ds-badge ds-badge-${tone} max-[400px]:text-[10px] max-[400px]:px-1.5`}>{status}</span>
    </div>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-[12.5px] sm:text-[13px] font-semibold text-ink-muted leading-snug">{label}</span>
      <span className="text-[24px] leading-8 font-extrabold text-ink tabular-nums tracking-tight">{value}</span>
      <span className="text-[12px] sm:text-[12.5px] text-ink-muted leading-snug hidden min-[480px]:block">{detail}</span>
    </div>
    {typeof percent === 'number' && (
      <div className="ds-progress" aria-hidden="true">
        <span className={TONE_BAR[tone]} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      </div>
    )}
    <span className="mt-auto hidden sm:flex items-center gap-1 text-[13px] font-semibold text-brand-ink group-hover:underline">
      {actionLabel}
      <Icon name="arrow_forward" className="text-[16px]" />
    </span>
  </button>
);

/** Carte de raccourci vers une fonctionnalité. */
const QuickCard: React.FC<{
  icon: string;
  title: string;
  desc: string;
  onClick: () => void;
  tone?: Tone;
}> = ({ icon, title, desc, onClick, tone = 'info' }) => (
  <button
    type="button"
    onClick={onClick}
    className="ds-card p-3.5 sm:p-4 text-left flex items-start gap-3 hover:border-line-strong hover:bg-subtle transition-colors cursor-pointer group min-h-[76px]"
  >
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${TONE_ICON_BG[tone]}`}>
      <Icon name={icon} className="text-[22px]" />
    </span>
    <span className="flex flex-col min-w-0 flex-1 gap-0.5">
      <span className="text-[14.5px] font-bold text-ink leading-snug">{title}</span>
      <span className="text-[12.5px] text-ink-muted leading-snug">{desc}</span>
    </span>
    <Icon name="chevron_right" className="text-[20px] text-ink-faint group-hover:text-ink self-center shrink-0" />
  </button>
);

/** Ligne de liste cliquable (protocoles, gestes). */
const ListRow: React.FC<{ icon: string; title: string; desc: string; onClick: () => void; tone?: Tone }> = ({
  icon,
  title,
  desc,
  onClick,
  tone = 'info',
}) => (
  <li>
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-subtle transition-colors cursor-pointer group min-h-[56px]"
    >
      <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${TONE_ICON_BG[tone]}`}>
        <Icon name={icon} className="text-[20px]" />
      </span>
      <span className="flex flex-col min-w-0 flex-1">
        <span className="text-[14px] font-semibold text-ink leading-snug">{title}</span>
        <span className="text-[12.5px] text-ink-muted leading-snug line-clamp-2">{desc}</span>
      </span>
      <Icon name="chevron_right" className="text-[20px] text-ink-faint group-hover:text-ink shrink-0" />
    </button>
  </li>
);

const SectionHeader: React.FC<{ icon: string; title: string; aside?: React.ReactNode; id?: string }> = ({ icon, title, aside, id }) => (
  <div className="flex items-center justify-between gap-2 mb-3">
    <h2 id={id} className="ds-section-title flex items-center gap-2">
      <Icon name={icon} className="text-[20px] text-ink-muted" />
      {title}
    </h2>
    {aside}
  </div>
);

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigateTab,
  onOpenSubScreen,
  kitCompletionPercent = 0,
  kitItems = [],
  onInstallClick,
  onOpenWipeModal,
  onStartTour,
}) => {
  const { t, language } = useTranslation();
  const [familyPlan, setFamilyPlan] = useState<FamilyPlanData | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[] | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    storageService.getFamilyPlan().then(setFamilyPlan);
    storageService.getSettings().then(setSettings);
    storageService.getInventoryItems().then(setInventory);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Score de préparation : même moteur de calcul que l'écran « Suis-je prêt ? »
  const dashboard = useMemo(() => {
    if (!settings || !familyPlan || !inventory || kitItems.length === 0) return null;
    try {
      return calculateReadinessScore(settings.specificNeeds || DEFAULT_SPECIFIC_NEEDS, kitItems, inventory, familyPlan);
    } catch (e) {
      return null;
    }
  }, [settings, familyPlan, inventory, kitItems]);

  // ---- Indicateurs réels (aucune donnée inventée)
  const kitDone = kitItems.filter((i) => i.completed).length;
  const kitTotal = kitItems.length;
  const kitTone: Tone = kitCompletionPercent >= 80 ? 'ok' : kitCompletionPercent >= 40 ? 'warn' : 'danger';

  const planTasks = familyPlan?.tasks || [];
  const planDone = planTasks.filter((tk) => tk.done).length;
  const planPercent = planTasks.length ? Math.round((planDone / planTasks.length) * 100) : 0;
  const hasRallyPoint = !!(familyPlan?.assemblyPoints && familyPlan.assemblyPoints.length > 0);
  const contactCount = (familyPlan?.outZoneContact ? 1 : 0) + (familyPlan?.localContacts?.length || 0);
  const planTone: Tone =
    planPercent >= 80 && hasRallyPoint ? 'ok' : planPercent >= 40 || hasRallyPoint ? 'warn' : 'danger';

  const expiredCount = dashboard?.expiries.expired.length ?? 0;
  const soonCount = dashboard?.expiries.expiringSoon.length ?? 0;
  const toCheck = expiredCount + soonCount;
  const invTone: Tone = expiredCount > 0 ? 'danger' : soonCount > 0 ? 'warn' : 'ok';

  const pendingActions = dashboard?.recommendedActions.length ?? 0;
  const urgentActions = dashboard?.recommendedActions.filter((a) => a.urgency === 'high').length ?? 0;
  const actionTone: Tone = urgentActions > 0 ? 'danger' : pendingActions > 0 ? 'warn' : 'ok';

  const score = dashboard?.scoreResult.totalScore ?? null;
  const levelNumber = dashboard?.scoreResult.level.number ?? null;
  const scoreTone: Tone = levelNumber === 4 ? 'ok' : levelNumber === 3 ? 'info' : levelNumber === 2 ? 'warn' : 'danger';

  const expiryWatch = useMemo(() => {
    if (!dashboard) return [] as { name: string; days: number }[];
    const list = [
      ...dashboard.expiries.expired.map((it) => ({
        name: it.name,
        days: it.expiryDate ? Math.round((new Date(it.expiryDate).getTime() - Date.now()) / 86400000) : -1,
      })),
      ...dashboard.expiries.expiringSoon.map((e) => ({ name: e.item.name, days: e.daysRemaining })),
    ];
    return list.sort((a, b) => a.days - b.days).slice(0, 4);
  }, [dashboard]);

  const communeName = settings?.savedCommune?.name;
  const statusLabel = (tone: Tone) =>
    tone === 'ok' ? t('dash.statusGood') : tone === 'warn' ? t('dash.statusInProgress') : t('dash.statusToDo');

  return (
    <div className="ds-container pt-20 lg:pt-24 pb-28 lg:pb-12 flex flex-col gap-6 lg:gap-8">
      {/* ================= En-tête de page ================= */}
      <section data-tour="home-status" className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="ds-eyebrow">{t('dash.eyebrow')}</span>
          <h1 className="ds-page-title">{t('dash.title')}</h1>
          <p className="text-[14px] text-ink-muted max-w-2xl">{t('dash.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`ds-badge ${isOnline ? 'ds-badge-ok' : 'ds-badge-warn'}`}>
            <Icon name={isOnline ? 'wifi' : 'wifi_off'} className="text-[14px]" />
            {isOnline ? t('dash.online') : t('dash.offline')}
          </span>
          <span className="ds-badge ds-badge-info">
            <Icon name="offline_pin" className="text-[14px]" />
            {t('dash.offlineReady')}
          </span>
          <span className="ds-badge ds-badge-neutral">
            <Icon name="verified" className="text-[14px]" />
            {t('dash.corpusRevision')}
          </span>
        </div>
      </section>

      {/* ================= Urgence + niveau global ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
        <section
          data-tour="urgent-alert"
          aria-labelledby="urgent-title"
          className="lg:col-span-7 xl:col-span-8 rounded-[var(--radius-card)] border border-danger-line bg-danger-soft p-4 sm:p-5 flex flex-col gap-4"
        >
          <div className="flex items-start gap-3">
            <span className="w-11 h-11 rounded-xl bg-danger text-white flex items-center justify-center shrink-0">
              <Icon name="emergency" className="text-[26px]" />
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="ds-eyebrow !text-danger-ink">{t('home.vitalPriority')}</span>
              <h2 id="urgent-title" className="text-[20px] sm:text-[22px] font-extrabold text-ink leading-tight tracking-tight">
                {t('home.urgentSection')}
              </h2>
              <p className="text-[14px] text-ink-muted leading-relaxed mt-1">{t('home.urgentDesc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-2">
            <button
              onClick={() => onOpenSubScreen({ type: 'mode-crise' })}
              type="button"
              className="ds-btn ds-btn-danger min-h-[52px] text-[15px] font-bold"
            >
              <Icon name="crisis_alert" className="text-[22px]" />
              <span>{t('dash.openCrisis')}</span>
            </button>
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 xl:contents gap-2">
              <button onClick={() => onNavigateTab('reagir')} type="button" className="ds-btn ds-btn-secondary min-h-[48px]">
                <Icon name="bolt" className="text-[20px] text-danger-ink" />
                <span>{t('home.openReact')}</span>
              </button>
              <button
                onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })}
                type="button"
                className="ds-btn ds-btn-secondary min-h-[48px]"
              >
                <Icon name="radar" className="text-[20px] text-brand-ink" />
                <span>{t('dash.openRadarShort')}</span>
              </button>
            </div>
          </div>

          <p className="mt-auto flex items-center gap-1.5 text-[12.5px] text-ink-muted">
            <Icon name="info" className="text-[16px] shrink-0" />
            {t('home.noAutoCall')}
          </p>
        </section>

        <section aria-labelledby="score-title" className="lg:col-span-5 xl:col-span-4 ds-card p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 id="score-title" className="ds-section-title flex items-center gap-2">
              <Icon name="speed" className="text-[20px] text-ink-muted" />
              {t('dash.globalLevel')}
            </h2>
            {levelNumber !== null && <span className={`ds-badge ds-badge-${scoreTone}`}>{t('dash.level', { n: levelNumber })}</span>}
          </div>

          <div className="flex items-end gap-2">
            <span className="text-[44px] leading-none font-extrabold tracking-tight text-ink tabular-nums">
              {score !== null ? score : '—'}
            </span>
            <span className="text-[16px] font-semibold text-ink-muted pb-1">/ 100</span>
          </div>
          <div
            className="ds-progress h-2.5"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score ?? 0}
            aria-label={t('dash.globalLevel')}
          >
            <span className={TONE_BAR[scoreTone]} style={{ width: `${score ?? 0}%` }} />
          </div>
          <p className="text-[13px] text-ink-muted leading-snug">{t(`dash.levelDesc${levelNumber ?? 1}`)}</p>

          <button type="button" onClick={() => onOpenSubScreen({ type: 'suis-je-pret' })} className="mt-auto ds-btn ds-btn-primary w-full">
            <Icon name="insights" className="text-[20px]" />
            {t('dash.openReadiness')}
          </button>
        </section>
      </div>

      {/* ================= Indicateurs de préparation ================= */}
      <section aria-labelledby="indicators-title">
        <SectionHeader icon="monitoring" title={t('dash.indicators')} id="indicators-title" />
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-3 lg:gap-4">
          <StatCard
            icon="backpack"
            label={t('dash.kitLabel')}
            value={`${kitCompletionPercent} %`}
            detail={t('dash.kitDetail', { done: kitDone, total: kitTotal })}
            percent={kitCompletionPercent}
            tone={kitTone}
            status={statusLabel(kitTone)}
            onClick={() => onNavigateTab('preparation')}
            actionLabel={t('dash.kitAction')}
          />
          <StatCard
            icon="family_restroom"
            label={t('dash.planLabel')}
            value={planTasks.length ? `${planDone}/${planTasks.length}` : '—'}
            detail={`${hasRallyPoint ? t('dash.planRallyOk') : t('dash.planRallyMissing')} · ${t('dash.planContacts', { n: contactCount })}`}
            percent={planPercent}
            tone={planTone}
            status={statusLabel(planTone)}
            onClick={() => onNavigateTab('mon-plan')}
            actionLabel={t('dash.planAction')}
          />
          <StatCard
            icon="inventory_2"
            label={t('dash.invLabel')}
            value={inventory ? String(toCheck) : '—'}
            detail={t('dash.invDetail', { expired: expiredCount, soon: soonCount, total: inventory?.length ?? 0 })}
            tone={invTone}
            status={invTone === 'ok' ? t('dash.statusUpToDate') : invTone === 'warn' ? t('dash.statusWatch') : t('dash.statusExpired')}
            onClick={() => onOpenSubScreen({ type: 'inventory' })}
            actionLabel={t('dash.invAction')}
          />
          <StatCard
            icon="checklist"
            label={t('dash.actionsLabel')}
            value={dashboard ? String(pendingActions) : '—'}
            detail={t('dash.actionsDetail', { n: urgentActions })}
            tone={actionTone}
            status={actionTone === 'danger' ? t('dash.statusPriority') : statusLabel(actionTone)}
            onClick={() => onOpenSubScreen({ type: 'suis-je-pret' })}
            actionLabel={t('dash.actionsAction')}
          />
        </div>
      </section>

      {/* ================= Accès rapides ================= */}
      <section aria-labelledby="quick-title">
        <SectionHeader icon="apps" title={t('dash.quickAccess')} id="quick-title" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <QuickCard icon="bolt" tone="danger" title={t('dash.qReact')} desc={t('dash.qReactDesc')} onClick={() => onNavigateTab('reagir')} />
          <QuickCard icon="home_health" title={t('dash.qHome')} desc={t('dash.qHomeDesc')} onClick={() => onOpenSubScreen({ type: 'suis-je-pret' })} />
          <QuickCard icon="backpack" title={t('dash.qKit')} desc={t('dash.qKitDesc')} onClick={() => onNavigateTab('preparation')} />
          <QuickCard icon="family_restroom" title={t('dash.qPlan')} desc={t('dash.qPlanDesc')} onClick={() => onNavigateTab('mon-plan')} />
          <QuickCard icon="inventory_2" title={t('dash.qInventory')} desc={t('dash.qInventoryDesc')} onClick={() => onOpenSubScreen({ type: 'inventory' })} />
          <QuickCard icon="near_me" title={t('dash.qRisks')} desc={t('dash.qRisksDesc')} onClick={() => onOpenSubScreen({ type: 'georisques' })} />
          <QuickCard icon="local_library" title={t('dash.qGuides')} desc={t('dash.qGuidesDesc')} onClick={() => onNavigateTab('guides')} />
          <QuickCard icon="school" title={t('dash.qTraining')} desc={t('dash.qTrainingDesc')} onClick={() => onOpenSubScreen({ type: 'formation' })} />
        </div>
      </section>

      {/* ================= Protocoles, gestes, contexte ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <section data-tour="cbrn-cards" aria-labelledby="cbrn-title" className="ds-card p-3 sm:p-4">
          <div className="px-1">
            <SectionHeader
              icon="shield"
              title={t('dash.cbrnTitle')}
              id="cbrn-title"
              aside={
                <span className="ds-badge ds-badge-ok">
                  <Icon name="offline_pin" className="text-[14px]" />
                  {t('dash.offlineShort')}
                </span>
              }
            />
          </div>
          <ul className="flex flex-col">
            <ListRow
              icon="blur_on"
              title={language === 'fr' ? 'Nucléaire' : 'Nuclear'}
              desc={language === 'fr' ? 'Accidents industriels, centrales et installations civiles.' : 'Reactor accidents, nuclear facilities, and civil fallout.'}
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'nucleaire' })}
            />
            <ListRow
              icon="radiology"
              title={language === 'fr' ? 'Radiologique' : 'Radiological'}
              desc={language === 'fr' ? 'Sources orphelines, dispersion radiologique et irradiation.' : 'Orphan sources, dirty bombs, dispersion and external gamma.'}
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'radiologique' })}
            />
            <ListRow
              icon="coronavirus"
              title={language === 'fr' ? 'Biologique' : 'Biological'}
              desc={language === 'fr' ? 'Agents pathogènes, épidémies et toxines biologiques.' : 'Pathogenic agents, epidemics, spores and biological toxins.'}
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'bio' })}
            />
            <ListRow
              icon="science"
              title={language === 'fr' ? 'Chimique' : 'Chemical'}
              desc={language === 'fr' ? "Fuites toxiques d'usines, transports et produits industriels." : 'Toxic factory releases, chemical transport leaks and industrial vapors.'}
              onClick={() => onOpenSubScreen({ type: 'protocol', id: 'chimique' })}
            />
          </ul>
        </section>

        <section aria-labelledby="steps-title" className="ds-card p-3 sm:p-4">
          <div className="px-1">
            <SectionHeader icon="bolt" title={t('home.stepByStep')} id="steps-title" />
          </div>
          <ul className="flex flex-col">
            <ListRow
              icon="sanitizer"
              tone="ok"
              title={language === 'fr' ? 'Déshabillage & décontamination' : 'Undressing & Decontamination'}
              desc={language === 'fr' ? '8 étapes sans dispersion & rinçage' : '8 dispersion-free steps & rinsing'}
              onClick={() => onOpenSubScreen({ type: 'deshabillage' })}
            />
            <ListRow
              icon="meeting_room"
              title={language === 'fr' ? 'Guide confinement étanche' : 'Airtight Sheltering Guide'}
              desc={language === 'fr' ? "Calfeutrage & calcul d'oxygène" : 'Sealing joints & oxygen calculation'}
              onClick={() => onOpenSubScreen({ type: 'confinement-guide' })}
            />
            <ListRow
              icon="medication"
              tone="warn"
              title={language === 'fr' ? 'Fiche iode stable' : 'Stable Iodine Prophylaxis'}
              desc={language === 'fr' ? 'Calculateur de posologie KI' : 'KI 65mg dosage calculator'}
              onClick={() => onOpenSubScreen({ type: 'iode' })}
            />
            <ListRow
              icon="campaign"
              tone="neutral"
              title={language === 'fr' ? "Signaux d'alerte RNA" : 'Civil Siren Warning Signals'}
              desc={language === 'fr' ? 'Simulateur sonore & FR-Alert' : 'Audio simulator & Cell Broadcast'}
              onClick={() => onOpenSubScreen({ type: 'siren-guide' })}
            />
            <ListRow
              icon="history_edu"
              tone="neutral"
              title={language === 'fr' ? 'Histoire & doctrines' : 'History & CBRN Doctrines'}
              desc={language === 'fr' ? 'Origines, armées & traités' : 'Military origins & countermeasures'}
              onClick={() => onOpenSubScreen({ type: 'encyclopedie', tab: 'histoire' })}
            />
            <ListRow
              icon="spellcheck"
              tone="neutral"
              title={language === 'fr' ? 'Glossaire A-Z' : 'A-Z Glossary'}
              desc={language === 'fr' ? 'Dictionnaire & acronymes' : 'Dictionary & acronym index'}
              onClick={() => onOpenSubScreen({ type: 'encyclopedie', tab: 'glossaire' })}
            />
          </ul>
        </section>

        <div className="flex flex-col gap-4 lg:gap-6 md:col-span-2 lg:col-span-1 md:grid md:grid-cols-2 lg:flex">
          <section aria-labelledby="risks-title" className="ds-card p-4 flex flex-col gap-3">
            <SectionHeader
              icon="near_me"
              title={t('dash.localRisks')}
              id="risks-title"
              aside={
                <span className={`ds-badge ${communeName ? 'ds-badge-info' : 'ds-badge-warn'}`}>
                  {communeName ? t('dash.communeSet') : t('dash.communeMissing')}
                </span>
              }
            />
            <div className="flex items-center gap-2 text-[14px] min-w-0">
              <Icon name="location_on" className="text-[20px] text-ink-muted shrink-0" />
              <span className="text-ink-muted shrink-0">{t('dash.commune')}</span>
              <span className="font-semibold text-ink truncate">{communeName || t('dash.communeNotSet')}</span>
            </div>
            <div className="grid grid-cols-1 min-[360px]:grid-cols-2 gap-2">
              <button type="button" onClick={() => onOpenSubScreen({ type: 'georisques' })} className="ds-btn ds-btn-secondary text-[13px] px-2">
                <Icon name="travel_explore" className="text-[18px]" />
                {t('dash.openGeorisques')}
              </button>
              <button type="button" onClick={() => onOpenSubScreen({ type: 'carte-perimetres' })} className="ds-btn ds-btn-secondary text-[13px] px-2">
                <Icon name="radar" className="text-[18px]" />
                {t('dash.openPerimeters')}
              </button>
            </div>
            <p className="text-[12px] text-ink-faint leading-snug">
              {language === 'fr'
                ? 'Aucun risque affiché ne garantit une zone exempte de danger. Consultez régulièrement les plans communaux de sauvegarde.'
                : 'The absence of displayed risks never guarantees a hazard-free zone. Periodically check municipal safeguarding directives.'}
            </p>
          </section>

          <section aria-labelledby="expiry-title" className="ds-card p-4 flex flex-col gap-2">
            <SectionHeader
              icon="event_busy"
              title={t('dash.expiryTitle')}
              id="expiry-title"
              aside={<span className={`ds-badge ds-badge-${invTone}`}>{toCheck}</span>}
            />
            {expiryWatch.length === 0 ? (
              <p className="text-[13px] text-ink-muted flex items-center gap-2">
                <Icon name="check_circle" className="text-[18px] text-ok-ink" />
                {t('dash.expiryNone')}
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-line">
                {expiryWatch.map((e, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 py-2 text-[13.5px]">
                    <span className="text-ink truncate">{e.name}</span>
                    <span className={`ds-badge shrink-0 ${e.days < 0 ? 'ds-badge-danger' : 'ds-badge-warn'}`}>
                      {e.days < 0 ? t('dash.expired') : t('dash.daysLeft', { n: e.days })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => onOpenSubScreen({ type: 'inventory' })}
              className="ds-btn ds-btn-ghost justify-start px-2 text-brand-ink text-[13px] mt-auto"
            >
              {t('dash.invAction')}
              <Icon name="arrow_forward" className="text-[16px]" />
            </button>
          </section>
        </div>
      </div>

      {/* ================= Rappel d'autorité ================= */}
      <section className="rounded-[var(--radius-card)] border border-warn-line bg-warn-soft p-4 flex items-start gap-3">
        <Icon name="notifications_off" className="text-[22px] text-warn-ink shrink-0 mt-0.5" />
        <p className="text-[13.5px] text-ink leading-relaxed">
          {language === 'fr'
            ? "Rappel d'autorité : Cette application ne reçoit pas les alertes prioritaires FR-Alert transmises par diffusion cellulaire. En situation d'urgence réelle, fiez-vous au signal sonore national des sirènes (RNA) et aux canaux radio FM officiels (France Bleu, France Info)."
            : 'Operational Reminder: This application does not receive broadcast cell alerts (FR-Alert / Alertswiss / BE-Alert). In real emergencies, prioritize civil defense siren alerts and national emergency radio broadcasts.'}
        </p>
      </section>

      {/* ================= Utilitaires ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {onInstallClick && (
          <div className="ds-card p-4 flex flex-wrap items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-tint text-brand-ink flex items-center justify-center shrink-0">
              <Icon name="install_mobile" className="text-[22px]" />
            </span>
            <div className="flex flex-col min-w-0 flex-1 basis-40">
              <span className="text-[14px] font-bold text-ink leading-snug">{t('home.installTitle')}</span>
              <span className="text-[12.5px] text-ink-muted leading-snug">{t('home.installSubtitle')}</span>
            </div>
            <button type="button" onClick={onInstallClick} className="ds-btn ds-btn-primary shrink-0 px-3">
              {t('home.installBtn')}
            </button>
          </div>
        )}
        {onStartTour && (
          <div className="ds-card p-4 flex flex-wrap items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-tint text-brand-ink flex items-center justify-center shrink-0">
              <Icon name="explore" className="text-[22px]" />
            </span>
            <div className="flex flex-col min-w-0 flex-1 basis-40">
              <span className="text-[14px] font-bold text-ink leading-snug">{t('tour.startTour')}</span>
              <span className="text-[12.5px] text-ink-muted leading-snug">{t('tour.startTourDesc')}</span>
            </div>
            <button type="button" onClick={onStartTour} className="ds-btn ds-btn-secondary shrink-0 px-3">
              <Icon name="play_circle" className="text-[18px]" />
              {language === 'fr' ? 'Lancer' : 'Start'}
            </button>
          </div>
        )}
        {onOpenWipeModal && (
          <div className="ds-card p-4 flex flex-wrap items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-subtle text-ink-muted flex items-center justify-center shrink-0">
              <Icon name="restart_alt" className="text-[22px]" />
            </span>
            <div className="flex flex-col min-w-0 flex-1 basis-40">
              <span className="text-[14px] font-bold text-ink leading-snug">{language === 'fr' ? 'Données du prototype' : 'Prototype data'}</span>
              <span className="text-[12.5px] text-ink-muted leading-snug">
                {language === 'fr' ? "Effacer les données d'exemple pour démarrer de zéro" : 'Clear demo items to start from scratch'}
              </span>
            </div>
            <button type="button" onClick={onOpenWipeModal} className="ds-btn ds-btn-secondary shrink-0 px-3 !text-danger-ink">
              {language === 'fr' ? 'Remise à zéro' : 'Reset'}
            </button>
          </div>
        )}
      </div>

      {/* ================= Références officielles ================= */}
      <footer className="flex flex-col gap-3 pt-4 border-t border-line">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="ds-eyebrow flex items-center gap-1.5">
            <Icon name="account_balance" className="text-[16px]" />
            {language === 'fr' ? 'Portails officiels & références' : 'Official portals & references'}
          </span>
          <button
            type="button"
            onClick={() => onOpenSubScreen({ type: 'tracabilite' })}
            className="text-[13px] font-semibold text-brand-ink hover:underline flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <Icon name="verified_user" className="text-[16px]" />
            {language === 'fr' ? 'Sources & traçabilité' : 'Sources & audit'}
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'Info.gouv.fr', href: 'https://www.gouvernement.fr/risques' },
            { label: 'Min. Intérieur', href: 'https://www.interieur.gouv.fr' },
            { label: 'ASNR Nucléaire', href: 'https://www.asn.fr' },
            { label: 'Santé Publique Fr.', href: 'https://www.santepubliquefrance.fr' },
          ].map((l) => (
            <a
              key={l.href}
              className="min-h-[44px] rounded-xl border border-line bg-card px-3 py-2 flex items-center justify-between gap-2 text-[13px] font-medium text-ink hover:bg-subtle transition-colors"
              href={l.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="truncate">{l.label}</span>
              <Icon name="open_in_new" className="text-[16px] text-ink-faint" />
              <span className="sr-only">{t('dash.externalLink')}</span>
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};
