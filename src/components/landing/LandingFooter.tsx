import React from 'react';
import { LandingTranslations } from '../../i18n/landingTranslations';
import { LANDING_CONFIG } from '../../config/landingConfig';

interface LandingFooterProps {
  t: LandingTranslations;
  onLaunchApp: () => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ t, onLaunchApp }) => {
  return (
    <footer className="bg-[#000a17] text-[#94a3b8] py-16 border-t border-[#12263f]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Colonne 1 & 2 : Marque & Philosophie */}
          <div className="lg:col-span-2 flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="NRBCOR Logo" className="w-8 h-8 object-contain shrink-0" />
              <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight text-white">
                NRBCOR
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed max-w-sm mb-6">
              {t.footer.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-[#64748b] font-['Space_Grotesk']">
              <span>{LANDING_CONFIG.version}</span>
              <span>·</span>
              <span>{LANDING_CONFIG.license}</span>
              <span>·</span>
              <span>100% PWA Offline</span>
            </div>
          </div>

          {/* Colonne 3 : Navigation Site */}
          <div className="flex flex-col">
            <h4 className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.navigationHeader}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94a3b8]">
              <li>
                <a href="#why" className="hover:text-white transition-colors">
                  {t.nav.why}
                </a>
              </li>
              <li>
                <a href="#risks" className="hover:text-white transition-colors">
                  {t.nav.risks}
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  {t.nav.features}
                </a>
              </li>
              <li>
                <a href="#offline" className="hover:text-white transition-colors">
                  {t.nav.offline}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  {t.nav.gallery}
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Références Doctrinales & Officielles */}
          <div className="flex flex-col">
            <h4 className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.resourcesHeader}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94a3b8]">
              <li>
                <a
                  href="https://www.irsn.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  IRSN (Radioprotection)
                </a>
              </li>
              <li>
                <a
                  href="https://www.asn.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  ASN (Sûreté Nucléaire)
                </a>
              </li>
              <li>
                <a
                  href="https://www.interieur.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  DGSCGC Sécurité Civile
                </a>
              </li>
              <li>
                <a
                  href="https://www.georisques.gouv.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Portail Géorisques
                </a>
              </li>
              <li>
                <a
                  href="https://www.alertswiss.ch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Alertswiss / CENAL (Suisse)
                </a>
              </li>
            </ul>
          </div>

          {/* Colonne 5 : Accès App & Projet */}
          <div className="flex flex-col">
            <h4 className="text-xs font-['Space_Grotesk'] font-bold uppercase tracking-wider text-white mb-4">
              {t.footer.legalHeader}
            </h4>
            <ul className="space-y-2.5 text-xs text-[#94a3b8] mb-4">
              <li>
                <button
                  type="button"
                  onClick={onLaunchApp}
                  className="text-[#98f6c5] hover:underline font-['Space_Grotesk'] font-bold cursor-pointer text-left"
                >
                  Ouvrir l'application PWA
                </button>
              </li>
              <li>
                <a
                  href={LANDING_CONFIG.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Dépôt GitHub public
                </a>
              </li>
              <li>
                <a
                  href={LANDING_CONFIG.releasesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Notes de versions & Changelog
                </a>
              </li>
            </ul>
            <p className="text-[11px] text-[#64748b] leading-tight">
              {t.footer.openSourceNote}
            </p>
          </div>
        </div>

        {/* Ligne inférieure de copyright & retour haut */}
        <div className="pt-8 border-t border-[#12263f] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748b]">
          <span>© {new Date().getFullYear()} {t.footer.rights}</span>
          <a
            href="#top"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Haut de page</span>
            <span className="material-symbols-outlined text-[15px]">arrow_upward</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
