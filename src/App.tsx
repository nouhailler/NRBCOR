import React, { useState, useEffect } from 'react';
import { TabType, SubScreen, EmergencyCall, KitItem } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { CallModal } from './components/CallModal';
import { WipeModal } from './components/WipeModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { HomeView } from './views/HomeView';
import { ReagirView } from './views/ReagirView';
import { ProtocolDetailView } from './views/ProtocolDetailView';
import { PreparationView } from './views/PreparationView';
import { MonPlanView } from './views/MonPlanView';
import { GeorisquesView } from './views/GeorisquesView';
import { FormationView } from './views/FormationView';
import { TracabiliteView } from './views/TracabiliteView';
import { GuidesCatalogView } from './views/GuidesCatalogView';
import { DeshabillageView } from './views/DeshabillageView';
import { FicheIodeView } from './views/FicheIodeView';
import { ConfinementGuideView } from './views/ConfinementGuideView';
import { SirenGuideView } from './views/SirenGuideView';
import { InventoryView } from './views/InventoryView';
import { SettingsView } from './views/SettingsView';
import { SystemSettingsView } from './views/SystemSettingsView';
import { SuisJePretView } from './views/SuisJePretView';
import { OnboardingModal } from './components/OnboardingModal';
import { HamburgerMenu } from './components/HamburgerMenu';
import { storageService } from './services/storage/IndexedDbStorage';
import { updateService } from './services/updateService';
import { PROTOCOLS_DATA } from './data/protocols';
import { INITIAL_KIT_ITEMS } from './data/kitData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('accueil');
  const [subScreen, setSubScreen] = useState<SubScreen>(null);
  const [activeCallModal, setActiveCallModal] = useState<EmergencyCall | null>(null);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Thème Clair / Sombre / Système (accès centralisé via storageService)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => storageService.getInitialTheme());

  // Kit d'urgence 72h unifié (IndexedDB prioritaire avec miroir synchrone géré par storageService)
  const [kitItems, setKitItems] = useState<KitItem[]>(() => storageService.getInitialKitItems());

  // Sauvegarde unifiée dans IndexedDB & miroir local à chaque modification
  useEffect(() => {
    storageService.saveKitItems(kitItems);
  }, [kitItems]);

  // Synchronisation du thème avec le DOM et IndexedDB
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#001126' : '#f8f9ff');
    }

    // Persister dans les paramètres unifiés
    storageService.getSettings().then((curr) => {
      if (curr.preferredTheme !== theme) {
        storageService.saveSettings({
          ...curr,
          preferredTheme: theme
        });
      }
    });
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleToggleKitItem = (id: string) => {
    setKitItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it))
    );
  };

  const handleResetKitItems = () => {
    setKitItems((prev) => prev.map((it) => ({ ...it, completed: false })));
  };

  const handleAddKitItem = (item: KitItem) => {
    setKitItems((prev) => [item, ...prev]);
  };

  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    setSubScreen(null);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleOpenProtocol = (id: 'bio' | 'chimique' | 'nucleaire' | 'confinement') => {
    setSubScreen({ type: 'protocol', id });
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleOpenSubScreen = (screen: SubScreen) => {
    setSubScreen(screen);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const handleBack = () => {
    setSubScreen(null);
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  const [dataReloadKey, setDataReloadKey] = useState(0);

  const handleResetClean = async () => {
    setIsWipeModalOpen(false);
    await storageService.resetToCleanState();
    await handleDataReloaded();
  };

  const handleResetDemo = async () => {
    setIsWipeModalOpen(false);
    await storageService.resetToDemoState();
    await handleDataReloaded();
  };

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [textScale, setTextScale] = useState<'normal' | 'large' | 'extraLarge'>('normal');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  // Vérification, migration transparente et synchronisation au démarrage (IndexedDB + Service Worker)
  useEffect(() => {
    // 1. Migration automatique et test d'intégrité du stockage
    storageService.migrateLegacyData().then((mig) => {
      if (mig.migratedCount > 0) {
        console.info(`[NRBCOR Storage] Migration réussie : ${mig.migratedCount} ensembles de données synchronisés vers IndexedDB.`);
      }
    });

    storageService.testStorageHealth().then((health) => {
      if (!health.indexedDbOk) {
        console.warn('[NRBCOR Storage] IndexedDB indisponible (mode privé/restreint). Bascule automatique en mode localStorage tolérant.');
      }
    });

    storageService.getSettings().then((s) => {
      setTextScale(s.textScale || 'normal');
      if (s.preferredTheme) {
        setTheme(s.preferredTheme);
      }
      if (!s.onboardingCompleted) {
        setShowOnboarding(true);
      }
    });

    storageService.getKitItems().then((items) => {
      if (items && items.length > 0) {
        setKitItems(items);
      }
    });

    // Lancer le vérificateur de mises à jour en arrière-plan toutes les 15 minutes
    updateService.startBackgroundUpdater(15);

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleDataReloaded = async () => {
    const items = await storageService.getKitItems();
    setKitItems(items);
    const s = await storageService.getSettings();
    if (s.preferredTheme) {
      setTheme(s.preferredTheme);
    }
    if (s.textScale) {
      setTextScale(s.textScale);
    }
    setDataReloadKey((k) => k + 1);
  };

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    } else {
      // Si pas de prompt direct (ex: Safari iOS ou Desktop), ouvrir le guide visuel pas-à-pas
      setIsInstallModalOpen(true);
    }
  };

  const handleCompleteOnboarding = async (config: { householdSize: number; communeName: string }) => {
    setShowOnboarding(false);
    const curr = await storageService.getSettings();
    await storageService.saveSettings({
      ...curr,
      householdSize: config.householdSize,
      savedCommune: {
        ...curr.savedCommune,
        name: config.communeName
      },
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    });
  };

  const handleGoDirectToGuides = async () => {
    setShowOnboarding(false);
    const curr = await storageService.getSettings();
    await storageService.saveSettings({
      ...curr,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    });
    handleSelectTab('guides');
  };

  // Titre dynamique de l'en-tête
  let headerTitle = 'Accueil';
  let showHeaderBack = false;

  if (subScreen) {
    showHeaderBack = true;
    if (subScreen.type === 'protocol') {
      headerTitle = 'Protocole Détail';
    } else if (subScreen.type === 'georisques') {
      headerTitle = 'Géorisques';
    } else if (subScreen.type === 'formation') {
      headerTitle = 'Formation & Quiz';
    } else if (subScreen.type === 'tracabilite') {
      headerTitle = 'Sources & Traçabilité';
    } else if (subScreen.type === 'deshabillage') {
      headerTitle = 'Déshabillage & Décontamination';
    } else if (subScreen.type === 'iode') {
      headerTitle = 'Fiche Iode Stable';
    } else if (subScreen.type === 'confinement-guide') {
      headerTitle = 'Guide Confinement';
    } else if (subScreen.type === 'siren-guide') {
      headerTitle = 'Signaux d\'Alerte RNA';
    } else if (subScreen.type === 'inventory') {
      headerTitle = 'Inventaire Matériel';
    } else if (subScreen.type === 'settings') {
      headerTitle = 'Paramètres & Données';
    } else if (subScreen.type === 'system-settings') {
      headerTitle = 'Système & Mises à Jour';
    }
  } else {
    switch (activeTab) {
      case 'accueil':
        headerTitle = 'Accueil';
        break;
      case 'reagir':
        headerTitle = 'Réagir';
        break;
      case 'guides':
        headerTitle = 'Guides';
        break;
      case 'preparation':
        headerTitle = 'Préparation';
        break;
      case 'mon-plan':
        headerTitle = 'Mon Plan';
        break;
    }
  }

  const completedKitCount = kitItems.filter((i) => i.completed).length;
  const kitCompletionPercent = Math.round((completedKitCount / kitItems.length) * 100);

  const textScaleClass =
    textScale === 'large'
      ? 'text-[108%]'
      : textScale === 'extraLarge'
      ? 'text-[116%]'
      : 'text-[100%]';

  return (
    <div className={`min-h-screen bg-[#f8f9ff] text-[#0f1c2b] flex flex-col font-['Public_Sans'] selection:bg-[#d4e3ff] ${textScaleClass}`}>
      {/* Top Fixed Header avec bouton Thème et Installer */}
      <Header
        currentTitle={headerTitle}
        showBack={showHeaderBack}
        onBack={handleBack}
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenSources={() => handleOpenSubScreen({ type: 'tracabilite' })}
        onOpenSettings={() => handleOpenSubScreen({ type: 'system-settings' })}
        onInstallClick={handleInstallApp}
        canInstall={canInstall}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {subScreen ? (
          subScreen.type === 'protocol' ? (
            <ProtocolDetailView
              protocol={PROTOCOLS_DATA[subScreen.id]}
              onBack={handleBack}
              onOpenCallModal={setActiveCallModal}
            />
          ) : subScreen.type === 'georisques' ? (
            <GeorisquesView
              onBack={handleBack}
              onOpenSubScreen={handleOpenSubScreen}
              onOpenCallModal={setActiveCallModal}
            />
          ) : subScreen.type === 'formation' ? (
            <FormationView
              onBack={handleBack}
              onOpenSubScreen={handleOpenSubScreen}
              onGoToGuides={() => handleSelectTab('guides')}
            />
          ) : subScreen.type === 'tracabilite' ? (
            <TracabiliteView onBack={handleBack} />
          ) : subScreen.type === 'deshabillage' ? (
            <DeshabillageView
              onBack={handleBack}
              onOpenCallModal={setActiveCallModal}
            />
          ) : subScreen.type === 'iode' ? (
            <FicheIodeView onBack={handleBack} />
          ) : subScreen.type === 'confinement-guide' ? (
            <ConfinementGuideView
              onBack={handleBack}
              onGoToKit={() => handleSelectTab('preparation')}
            />
          ) : subScreen.type === 'siren-guide' ? (
            <SirenGuideView
              onBack={handleBack}
              onGoToConfinement={() => handleOpenSubScreen({ type: 'confinement-guide' })}
            />
          ) : subScreen.type === 'inventory' ? (
            <InventoryView onBack={handleBack} />
          ) : subScreen.type === 'settings' ? (
            <SettingsView
              onBack={handleBack}
              onOpenWipeModal={() => setIsWipeModalOpen(true)}
              onTriggerOnboarding={() => setShowOnboarding(true)}
              textScale={textScale}
              onChangeTextScale={setTextScale}
              theme={theme}
              onChangeTheme={setTheme}
              onDataReloaded={handleDataReloaded}
            />
          ) : subScreen.type === 'system-settings' ? (
            <SystemSettingsView
              onBack={handleBack}
              onInstallClick={handleInstallApp}
              canInstall={canInstall}
              theme={theme}
              onChangeTheme={setTheme}
            />
          ) : subScreen.type === 'suis-je-pret' ? (
            <SuisJePretView
              onBack={handleBack}
              onNavigateTab={handleSelectTab}
              onOpenSubScreen={handleOpenSubScreen}
              items={kitItems}
              onToggleItem={handleToggleKitItem}
              onOpenInventory={() => handleOpenSubScreen({ type: 'inventory' })}
            />
          ) : null
        ) : (
          <>
            {activeTab === 'accueil' && (
              <HomeView
                key={`home-${dataReloadKey}`}
                onNavigateTab={handleSelectTab}
                onOpenSubScreen={handleOpenSubScreen}
                kitCompletionPercent={kitCompletionPercent}
                canInstall={canInstall}
                onInstallClick={handleInstallApp}
                onOpenWipeModal={() => setIsWipeModalOpen(true)}
              />
            )}

            {activeTab === 'reagir' && (
              <ReagirView
                onOpenSubScreen={handleOpenSubScreen}
                onOpenCallModal={setActiveCallModal}
                onGoToGuides={() => handleSelectTab('guides')}
              />
            )}

            {activeTab === 'guides' && (
              <GuidesCatalogView
                onSelectProtocol={handleOpenProtocol}
                onOpenSubScreen={handleOpenSubScreen}
              />
            )}

            {activeTab === 'preparation' && (
              <PreparationView
                key={`prep-${dataReloadKey}`}
                items={kitItems}
                onToggleItem={handleToggleKitItem}
                onResetItems={handleResetKitItems}
                onAddItem={handleAddKitItem}
                onOpenInventory={() => handleOpenSubScreen({ type: 'inventory' })}
                onNavigateTab={handleSelectTab}
                onOpenSubScreen={handleOpenSubScreen}
              />
            )}

            {activeTab === 'mon-plan' && (
              <MonPlanView
                key={`plan-${dataReloadKey}`}
                onOpenCallModal={setActiveCallModal}
                onOpenWipeModal={() => setIsWipeModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Hamburger Drawer Menu */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onNavigateTab={handleSelectTab}
        onOpenSubScreen={handleOpenSubScreen}
        onInstallClick={handleInstallApp}
        canInstall={canInstall}
        theme={theme}
        onChangeTheme={setTheme}
        onTriggerOnboarding={() => setShowOnboarding(true)}
        onOpenWipeModal={() => setIsWipeModalOpen(true)}
      />

      {/* Modals */}
      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
        onGoDirectToGuides={handleGoDirectToGuides}
      />

      <CallModal
        call={activeCallModal}
        onClose={() => setActiveCallModal(null)}
      />

      <WipeModal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        onConfirmClean={handleResetClean}
        onConfirmDemo={handleResetDemo}
      />

      <InstallGuideModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onNativeInstall={handleInstallApp}
        canNativeInstall={canInstall}
      />
    </div>
  );
}
