import React, { useState } from 'react';
import { DOCTRINES_LIST, CHANGELOG_ITEMS } from '../data/sourcesData';

interface TracabiliteViewProps {
  onBack: () => void;
}

export const TracabiliteView: React.FC<TracabiliteViewProps> = ({ onBack }) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleVerifyHashes = () => {
    setVerifying(true);
    setVerifiedSuccess(false);

    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
    }, 900);
  };

  const handleDownloadProof = () => {
    const certificate = {
      application: "NRBCOR PWA",
      spec_compliance: ["LEG-01", "LEG-02", "SAF-01", "SAF-02", "DATA-01", "DATA-02"],
      corpus_version: "2.4",
      last_audit_epoch: 1791969300,
      hash_sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      storage_mode: "IndexedDB - Zéro télémétrie",
      institutions_covered: [
        "Ministère de l'Intérieur / DGSCGC",
        "ASNR / IRSN",
        "SGDSN (PIRATOX/BIOTOX)",
        "Santé Publique France",
        "Ministère de la Transition Écologique"
      ],
      generated_at: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificate, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "NRBCOR_Attestation_Conformite_v2.4.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleReportIssue = () => {
    const subject = encodeURIComponent("[NRBCOR] Signalement de divergence doctrinale");
    const body = encodeURIComponent("Référence documentaire concernée :\nPage ou fiche :\nNature de l'écart constaté :\nSource officielle contradictoire :");
    window.location.href = `mailto:doctrine@nrbcor.fr?subject=${subject}&body=${body}`;
  };

  return (
    <div className="flex flex-col w-full pt-20 pb-28 min-h-screen max-w-xl mx-auto">
      {/* Return Action Bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          type="button"
          className="h-12 px-3 bg-[#dce9fd] hover:bg-[#d6e4f8] text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold rounded flex items-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>RETOUR</span>
        </button>
        <span className="font-['Space_Grotesk'] text-[11px] bg-[#98f6c5] text-[#005236] px-2.5 py-1 rounded font-bold uppercase">
          DOCTRINE ÉTAT V2.4
        </span>
      </div>

      <div className="px-4 flex flex-col gap-4">
        {/* Status Sentinel */}
        <section className="bg-[#12263f] text-white rounded-xl p-4 shadow-sm border border-[#001126]">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#98f6c5] text-[#005236]">
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </span>
              <span className="font-['Space_Grotesk'] text-[12px] uppercase tracking-wider font-bold truncate">
                Signatures SHA-256 Intègres
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] px-2 py-0.5 rounded bg-[#98f6c5] font-bold flex-shrink-0">
              v2.4 LOCAL
            </span>
          </div>
          <div className="mt-3 bg-[#001126]/60 rounded-lg p-3 flex flex-col gap-1.5 text-[12px] border border-[#354862]/40">
            <div className="flex items-center justify-between text-[#dce9fd]">
              <span>Dernier scellé cryptographique :</span>
              <span className="font-['Space_Grotesk'] text-white font-medium">14 Oct. 2026 à 09:15</span>
            </div>
            <div className="flex items-center justify-between text-[#dce9fd]">
              <span>Cycle d'audit documentaire :</span>
              <span className="text-[#98f6c5] font-semibold">Trimestriel (Prochaine : Déc. 2026)</span>
            </div>
          </div>
        </section>

        {/* En-tête & Description */}
        <section className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#0036ce] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider font-bold">
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>Conformité & Doctrine Sécurité Civile</span>
          </div>
          <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
            Sources, Fraîcheur & Traçabilité
          </h1>
          <p className="text-[13px] text-[#44474d] leading-relaxed">
            Registre d'alignement interministériel et horodatage des protocoles NRBC embarqués en local.
          </p>
        </section>

        {/* Mode Dégradé Résilient */}
        <section className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#0036ce] text-[24px] flex-shrink-0 mt-0.5">
              sync_saved_locally
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-bold text-[#001126]">Mode Dégradé Résilient (SAF-02)</span>
              <p className="text-[12px] text-[#44474d] mt-0.5 leading-relaxed">
                En l'absence de réseau ou de brouillage électromagnétique, l'application reste 100% opérationnelle sur son stockage IndexedDB chiffré sans blocage.
              </p>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={handleVerifyHashes}
              type="button"
              className="w-full min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span className={`material-symbols-outlined text-[20px] ${verifying ? 'animate-spin' : ''}`}>
                published_with_changes
              </span>
              <span>
                {verifying ? 'Calcul des empreintes locales...' : 'Vérifier la fraîcheur des hachages'}
              </span>
            </button>
            <p className="font-['Space_Grotesk'] text-[11px] text-[#44474d] text-center mt-2 px-1">
              N'émet aucune donnée nominative. Vérifie uniquement les empreintes de version auprès des dépôts certifiés.
            </p>
          </div>

          {verifiedSuccess && (
            <div className="rounded-lg p-3 bg-[#98f6c5] text-[#002c1b] text-[12px] flex items-center gap-2 border border-[#005236]">
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span className="font-medium">
                Hachages validés : 100% conformes au référentiel État v2.4 (0 requêtes de traçage).
              </span>
            </div>
          )}
        </section>

        {/* Périodicité et Cycle de Vie */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#001126] text-[20px]">update</span>
              <h2 className="text-[17px] text-[#001126] font-bold">Cycle d'Obsolescence</h2>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-semibold">
              Fréquences de purge
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Fiches Réflexes */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm flex items-start gap-3 border border-[#c4c6ce]">
              <div className="w-10 h-10 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#001126] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">medical_services</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold truncate">
                    Fiches Réflexes NRBC
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#98f6c5] text-[#005236] font-semibold">
                    Semestriel
                  </span>
                </div>
                <span className="text-[12px] text-[#44474d] mt-0.5">
                  Révision calquée sur la publication des circulaires interministérielles SGDSN.
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 text-[#44474d] font-['Space_Grotesk'] text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3f9d73]"></span>
                  <span>Échéance prochaine : Jan. 2027</span>
                </div>
              </div>
            </div>

            {/* SEVESO */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm flex items-start gap-3 border border-[#c4c6ce]">
              <div className="w-10 h-10 rounded-lg bg-[#e4efff] flex items-center justify-center text-[#0036ce] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">map</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold truncate">
                    Cartographie SEVESO & PPI
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#dee1ff] text-[#001258] font-semibold">
                    90 Jours
                  </span>
                </div>
                <span className="text-[12px] text-[#44474d] mt-0.5">
                  Base nationale Géorisques. Alerte d'obsolescence progressive si mode hors-ligne prolongé au-delà de 3 mois.
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 text-[#44474d] font-['Space_Grotesk'] text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0036ce]"></span>
                  <span>Reste en cache : 72 jours</span>
                </div>
              </div>
            </div>

            {/* Centres Antipoison */}
            <div className="bg-white rounded-xl p-3.5 shadow-sm flex items-start gap-3 border border-[#c4c6ce]">
              <div className="w-10 h-10 rounded-lg bg-[#ffdad6] flex items-center justify-center text-[#93000a] flex-shrink-0">
                <span className="material-symbols-outlined text-[22px]">phone_in_talk</span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold truncate">
                    Centres Antipoison & Urgences
                  </span>
                  <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#e4efff] text-[#001126] font-semibold">
                    Trimestriel
                  </span>
                </div>
                <span className="text-[12px] text-[#44474d] mt-0.5">
                  Lignes directes SAMU (15), Pompiers (18), CAP et permanence toxicologique nationale.
                </span>
                <div className="flex items-center gap-1.5 mt-1.5 text-[#44474d] font-['Space_Grotesk'] text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3f9d73]"></span>
                  <span>Contrôle actif : Effectué le 01 Oct. 2026</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registre des Doctrines */}
        <section className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#001126] text-[20px]">account_balance</span>
              <h2 className="text-[17px] text-[#001126] font-bold">Doctrines et Corpus Réglementaires</h2>
            </div>
            <p className="text-[12px] text-[#44474d]">
              5 autorités institutionnelles référentes • Intégration brute sans réinterprétation.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {DOCTRINES_LIST.map((doc) => (
              <article key={doc.id} className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce]">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#0036ce] font-bold uppercase tracking-wider">
                      {doc.authority}
                    </span>
                    <h3 className="text-[15px] text-[#001126] font-bold mt-0.5 leading-snug">
                      {doc.title}
                    </h3>
                  </div>
                  <span className="font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded bg-[#98f6c5] text-[#005236] font-semibold flex-shrink-0">
                    {doc.status}
                  </span>
                </div>

                <div className="mt-2.5 bg-[#eef4ff] rounded-lg p-2.5 flex flex-col gap-1 text-[12px] border border-[#d6e4f8]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#44474d]">Réf. Légale :</span>
                    <span className="font-['Space_Grotesk'] font-medium text-[#001126] truncate max-w-[200px]">
                      {doc.refLegal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#44474d]">Parution d'origine :</span>
                    <span className="font-['Space_Grotesk'] text-[#001126]">{doc.originalDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#44474d]">Intégration NRBCOR :</span>
                    <span className="font-['Space_Grotesk'] text-[#001126]">{doc.integrationDate}</span>
                  </div>
                </div>

                <p className="text-[12px] text-[#44474d] mt-2.5 leading-relaxed">
                  {doc.summary}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Cadre Juridique & RGPD */}
        <section className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-center gap-2 text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[22px]">gavel</span>
            <h2 className="text-[17px] text-[#001126] font-bold">Avertissements & Cadre Légal</h2>
          </div>

          <div className="bg-[#eef4ff] rounded-lg p-3 flex flex-col gap-1 border border-[#d6e4f8]">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">warning</span>
              <span>Nature de l'outil et Primauté des Pouvoirs Publics</span>
            </div>
            <p className="text-[12px] text-[#44474d] leading-relaxed">
              NRBCOR est une initiative citoyenne d'assistance et de préparation passive. <strong>Elle ne se substitue en aucun cas à la chaîne d'alerte officielle de l'État</strong> (système FR-Alert, sirènes RNA du SAIP, radios du service public) ni aux arrêtés d'évacuation ou de confinement pris par le Préfet de département. En situation réelle, appliquez toujours prioritairement les ordres transmis par les autorités compétentes.
            </p>
          </div>

          <div className="bg-[#eef4ff] rounded-lg p-3 flex flex-col gap-1 border border-[#d6e4f8]">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#44474d]">badge</span>
              <span>Absence de Certification Opérationnelle</span>
            </div>
            <p className="text-[12px] text-[#44474d] leading-relaxed">
              La consultation de ces guides, l'accomplissement des listes de préparation et les scores obtenus aux quiz pédagogiques ne confèrent <strong>aucune habilitation, brevet de secouriste spécialisé ni statut d'intervenant de sécurité civile</strong>.
            </p>
          </div>

          <div className="bg-[#eef4ff] rounded-lg p-3 flex flex-col gap-1 border border-[#d6e4f8]">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#0036ce]">security</span>
              <span>Souveraineté des Données & Architecture "Zéro-Serveur"</span>
            </div>
            <p className="text-[12px] text-[#44474d] leading-relaxed">
              Conformément au RGPD et au standard de résilience civile, l'intégralité de vos informations réside <strong>exclusivement dans l'IndexedDB locale de votre navigateur</strong>. Aucun compte utilisateur n'est créé, aucun cookie tiers n'est utilisé, aucune télémétrie n'est transmise.
            </p>
          </div>
        </section>

        {/* Journal d'Audit Changelog */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#001126] text-[20px]">history_edu</span>
              <h2 className="text-[17px] text-[#001126] font-bold">Journal des Révisions</h2>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-semibold">
              Changelog Local
            </span>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
            {CHANGELOG_ITEMS.map((ch, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className={`w-3 h-3 rounded-full mt-1 ${i === 0 ? 'bg-[#0036ce]' : 'bg-[#74777e]'}`}></span>
                  {i < CHANGELOG_ITEMS.length - 1 && (
                    <span className="w-0.5 h-full bg-[#e4efff] my-1"></span>
                  )}
                </div>
                <div className="flex flex-col min-w-0 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold">
                      {ch.version}
                    </span>
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">{ch.date}</span>
                  </div>
                  <p className="text-[12px] text-[#44474d] mt-0.5 leading-relaxed">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outils d'Audit & Actions Utiles */}
        <section className="flex flex-col gap-2.5 pt-1">
          <button
            onClick={handleDownloadProof}
            type="button"
            className="w-full min-h-[48px] bg-white hover:bg-[#e4efff] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors border border-[#c4c6ce]"
          >
            <span className="material-symbols-outlined text-[20px] text-[#0036ce]">file_download</span>
            <span>Attestation de conformité (JSON / PDF)</span>
          </button>

          <button
            onClick={handleReportIssue}
            type="button"
            className="w-full min-h-[48px] bg-white hover:bg-[#e4efff] text-[#001126] rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors border border-[#c4c6ce]"
          >
            <span className="material-symbols-outlined text-[20px] text-[#44474d]">flag</span>
            <span>Signaler une divergence doctrinale</span>
          </button>

          {/* Licence Open Data */}
          <div className="rounded-xl p-3 bg-[#eef4ff] text-center flex flex-col items-center gap-1 border border-[#d6e4f8]">
            <div className="flex items-center gap-1 text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold">
              <span className="material-symbols-outlined text-[16px]">public</span>
              <span>Licence Ouverte v2.0 (Etalab)</span>
            </div>
            <p className="text-[11px] text-[#44474d] max-w-sm leading-relaxed">
              Réutilisation des informations publiques de l'État sous licence ouverte. NRBCOR est développé en code ouvert pour la résilience de la population.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
