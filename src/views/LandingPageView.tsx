import React, { useState, useEffect } from 'react';
import { LANDING_FR, LANDING_EN } from '../i18n/landingTranslations';
import { LANDING_CONFIG } from '../config/landingConfig';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { LandingHero } from '../components/landing/LandingHero';
import { LandingWhy } from '../components/landing/LandingWhy';
import { LandingRisks } from '../components/landing/LandingRisks';
import { LandingFeatures } from '../components/landing/LandingFeatures';
import { LandingOffline } from '../components/landing/LandingOffline';
import { LandingBilingual } from '../components/landing/LandingBilingual';
import { LandingAudiences } from '../components/landing/LandingAudiences';
import { LandingPrivacy } from '../components/landing/LandingPrivacy';
import { LandingGallery } from '../components/landing/LandingGallery';
import { LandingDisclaimer } from '../components/landing/LandingDisclaimer';
import { LandingCta } from '../components/landing/LandingCta';
import { LandingFooter } from '../components/landing/LandingFooter';

interface LandingPageViewProps {
  onOpenApp?: () => void;
  defaultLang?: 'fr' | 'en';
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({
  onOpenApp,
  defaultLang,
}) => {
  // Détermination initiale de la langue (par défaut 'fr' conformément aux exigences)
  const [language, setLanguage] = useState<'fr' | 'en'>(() => {
    if (defaultLang) return defaultLang;
    try {
      const stored = localStorage.getItem('nrbcor_language');
      if (stored === 'en') return 'en';
    } catch (e) {}
    return 'fr';
  });

  const t = language === 'en' ? LANDING_EN : LANDING_FR;

  // Mise à jour dynamique des métadonnées SEO et de l'attribut <html lang="...">
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t.meta.title;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', t.meta.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', t.meta.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', t.meta.description);
    }

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute('content', t.meta.title);
    }

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) {
      twDesc.setAttribute('content', t.meta.description);
    }
  }, [language, t]);

  const handleToggleLanguage = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    try {
      localStorage.setItem('nrbcor_language', lang);
    } catch (e) {}
  };

  const handleLaunchApp = () => {
    if (onOpenApp) {
      onOpenApp();
    } else {
      window.location.href = LANDING_CONFIG.appUrl;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#001126] font-['Public_Sans'] selection:bg-[#98f6c5]/50 selection:text-[#001126]">
      {/* Données Structurées Schema.org JSON-LD (Web & Civil Protection Application) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'NRBCOR',
            applicationCategory: 'SafetyApplication',
            operatingSystem: 'All',
            browserRequirements: 'Requires modern web browser with HTML5 and IndexedDB support',
            description: t.meta.description,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'EUR',
            },
            author: {
              '@type': 'Person',
              name: LANDING_CONFIG.author,
            },
            url: typeof window !== 'undefined' ? window.location.href : LANDING_CONFIG.githubUrl,
            inLanguage: [language === 'fr' ? 'fr-FR' : 'en-US'],
          }),
        }}
      />

      {/* 1. Barre de navigation principale (Top Bar Contract) */}
      <LandingNavbar
        t={t}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onLaunchApp={handleLaunchApp}
      />

      {/* 2. Section 1 — HERO */}
      <LandingHero t={t} onLaunchApp={handleLaunchApp} />

      {/* 3. Section 2 — POURQUOI NRBCOR */}
      <LandingWhy t={t} />

      {/* 4. Section 3 — LES QUATRE GRANDES FAMILLES DE RISQUES */}
      <LandingRisks t={t} onLaunchApp={handleLaunchApp} />

      {/* 5. Section 4 — LES FONCTIONNALITÉS (10 MODULES RÉELS) */}
      <LandingFeatures t={t} onLaunchApp={handleLaunchApp} />

      {/* 6. Section 5 — FONCTIONNEMENT HORS-LIGNE & PWA */}
      <LandingOffline t={t} onLaunchApp={handleLaunchApp} />

      {/* 7. Section 6 — APPLICATION BILINGUE (FR / EN & DOCTRINES) */}
      <LandingBilingual t={t} />

      {/* 8. Section 7 — POUR QUI ? */}
      <LandingAudiences t={t} />

      {/* 9. Section 8 — CONFIDENTIALITÉ & SOUVERAINETÉ */}
      <LandingPrivacy t={t} />

      {/* 10. Section 9 — APERÇUS DE L'APPLICATION (GALERIE AVEC LIGHTBOX) */}
      <LandingGallery t={t} />

      {/* 11. Section 10 — AVERTISSEMENT & RESPONSABILITÉ */}
      <LandingDisclaimer t={t} />

      {/* 12. Section 11 — APPEL À L'ACTION FINAL */}
      <LandingCta t={t} onLaunchApp={handleLaunchApp} />

      {/* 13. FOOTER */}
      <LandingFooter t={t} onLaunchApp={handleLaunchApp} />
    </div>
  );
};
