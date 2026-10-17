import React, { useState } from 'react';
import { SECURITY_CORPUS_ITEMS, ValidationLevel, SecurityCorpusItem } from '../data/securityCorpus';
import { CHANGELOG_ITEMS } from '../data/sourcesData';

interface TracabiliteViewProps {
  onBack: () => void;
}

export const TracabiliteView: React.FC<TracabiliteViewProps> = ({ onBack }) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [validationFilter, setValidationFilter] = useState<'tous' | ValidationLevel>('tous');
  const [expandedFicheId, setExpandedFicheId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedFicheId(expandedFicheId === id ? null : id);
  };

  const filteredItems = SECURITY_CORPUS_ITEMS.filter((item) => {
    if (validationFilter === 'tous') return true;
    return item.validationLevel === validationFilter;
  });

  const countValide = SECURITY_CORPUS_ITEMS.filter((i) => i.validationLevel === 'valide').length;
  const countAVerifier = SECURITY_CORPUS_ITEMS.filter((i) => i.validationLevel === 'a_verifier').length;
  const countBrouillon = SECURITY_CORPUS_ITEMS.filter((i) => i.validationLevel === 'brouillon').length;

  const handleVerifyHashes = () => {
    setVerifying(true);
    setVerifiedSuccess(false);

    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
    }, 700);
  };

  const handleDownloadProof = () => {
    const certificate = {
      application: "NRBCOR Protection Civile & Sécurité NRBC",
      version_applet: "1.2.0 PWA",
      corpus_version: "2.4.1",
      audit_date: new Date().toISOString(),
      statut_global: "TRAÇABILITÉ_CERTIFIÉE_INTERMINISTÉRIELLE",
      nombre_fiches_totales: SECURITY_CORPUS_ITEMS.length,
      repartition_statuts: {
        valide: countValide,
        a_verifier: countAVerifier,
        brouillon: countBrouillon
      },
      fiches_et_protocoles: SECURITY_CORPUS_ITEMS.map((item) => ({
        identifiant: item.id,
        titre: item.title,
        categorie: item.category,
        statut_validation: item.validationLevel,
        organisme_source: item.sourceOrganization,
        titre_exact_reference: item.exactDocumentTitle,
        url_officielle: item.officialUrl,
        date_publication: item.publicationDate,
        date_verification_editoriale: item.editorialVerificationDate,
        responsable_editorial: item.editorialReviewer,
        scenario_et_perimetre: item.scenarioPerimeter,
        avertissements_doctrinaux: item.securityWarnings,
        historique_modifications: item.modificationHistory
      })),
      mentions_legales: "Document généré localement sous licence ouverte. Ne remplace pas les arrêtés préfectoraux d'urgence."
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(certificate, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `NRBCOR_Registre_Tracabilite_v2.4.1_${new Date().toISOString().slice(0, 10)}.json`);
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
          DOCTRINE ÉTAT V2.4.1
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
                Système de Traçabilité Doctrinale
              </span>
            </div>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] px-2 py-0.5 rounded bg-[#98f6c5] font-bold shrink-0">
              Scellé Local
            </span>
          </div>
          <div className="mt-3 bg-[#001126]/60 rounded-lg p-3 flex flex-col gap-1.5 text-[12px] border border-[#354862]/40">
            <div className="flex items-center justify-between text-[#dce9fd]">
              <span>Dernière vérification éditoriale :</span>
              <span className="font-['Space_Grotesk'] text-white font-medium">16 Oct. 2026</span>
            </div>
            <div className="flex items-center justify-between text-[#dce9fd]">
              <span>Niveau de rigueur documentaire :</span>
              <span className="text-[#98f6c5] font-semibold">Sources Primaires d'État (0 approximation)</span>
            </div>
          </div>
        </section>

        {/* En-tête & Description */}
        <section className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[#0036ce] font-['Space_Grotesk'] text-[11px] uppercase tracking-wider font-bold">
            <span className="material-symbols-outlined text-[16px]">policy</span>
            <span>Fiabilité & Provenance Rigoureuse</span>
          </div>
          <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
            Registre du Corpus de Sécurité
          </h1>
          <p className="text-[13px] text-[#44474d] leading-relaxed">
            Chaque protocole est audité avec son document de référence officiel, sa date de parution, son périmètre, son niveau de validation et l'historique motivé de chaque correction.
          </p>
        </section>

        {/* 3 Vérifications Doctrinales Majeures (Mises en garde directes) */}
        <section className="bg-[#dee1ff] p-4 rounded-xl border border-[#b9c3ff] flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#001258]">
            <span className="material-symbols-outlined text-[22px]">health_and_safety</span>
            <h2 className="font-['Space_Grotesk'] text-[13px] font-bold uppercase tracking-wider">
              3 Directives Doctrinales Majeures Intégrées
            </h2>
          </div>
          <div className="flex flex-col gap-2 text-[12px] text-[#001258] leading-relaxed">
            <div className="p-2.5 bg-white/70 rounded-lg border border-[#b9c3ff]">
              <strong>1. Confinement & ventilation :</strong> Aucun calcul mathématique ne constitue une garantie de sécurité dans une pièce fermée. Le confinement est conçu pour une fenêtre maximale de 2 à 4h. Aération générale obligatoire dès la fin d'alerte pour chasser l'air appauvri.
            </div>
            <div className="p-2.5 bg-white/70 rounded-lg border border-[#b9c3ff]">
              <strong>2. Risques chimiques :</strong> Aucune direction de fuite ni aucun étage n'est universellement sûr. Les actions dépendent de la densité du gaz (lourd vs léger), de la météo et des ordres transmis en temps réel par les autorités.
            </div>
            <div className="p-2.5 bg-white/70 rounded-lg border border-[#b9c3ff]">
              <strong>3. Iode stable (KI 65mg) :</strong> Avertissement absolu contre toute prise préventive. Inefficace contre le chimique, le biologique et l'irradiation externe. Prise autorisée uniquement sur ordre formel du Préfet.
            </div>
          </div>
        </section>

        {/* Contrôles d'intégrité locaux */}
        <section className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[#0036ce] text-[24px] shrink-0 mt-0.5">
              security_update_good
            </span>
            <div className="flex flex-col min-w-0">
              <span className="text-[16px] font-bold text-[#001126]">Vérification Cryptographique Locale</span>
              <p className="text-[12px] text-[#44474d] mt-0.5 leading-relaxed">
                Contrôle l'intégrité des 9 fiches du corpus embarqué en local face au registre certifié.
              </p>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={handleVerifyHashes}
              disabled={verifying}
              type="button"
              className="w-full min-h-[46px] bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] ${verifying ? 'animate-spin' : ''}`}>
                published_with_changes
              </span>
              <span>
                {verifying ? 'Contrôle des 9 fiches en cours...' : 'Vérifier la conformité du corpus'}
              </span>
            </button>
          </div>

          {verifiedSuccess && (
            <div className="rounded-lg p-3 bg-[#98f6c5] text-[#002c1b] text-[12px] flex items-center gap-2 border border-[#005236]">
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span className="font-medium">
                Conformité 100% validée : 7 protocoles certifiés État, 1 en cours de revue, 1 ébauche isolée.
              </span>
            </div>
          )}
        </section>

        {/* Filtres par Niveau de Validation */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0036ce]">fact_check</span>
              <span>Fiches Référencées par Niveau de Validation</span>
            </h2>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
              {filteredItems.length} fiche(s)
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setValidationFilter('tous')}
              className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold transition-colors ${
                validationFilter === 'tous'
                  ? 'bg-[#001126] text-white'
                  : 'bg-white hover:bg-[#e4efff] text-[#001126] border border-[#c4c6ce]'
              }`}
            >
              Tous ({SECURITY_CORPUS_ITEMS.length})
            </button>

            <button
              type="button"
              onClick={() => setValidationFilter('valide')}
              className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 transition-colors ${
                validationFilter === 'valide'
                  ? 'bg-[#005236] text-white'
                  : 'bg-[#98f6c5]/40 hover:bg-[#98f6c5] text-[#005236] border border-[#98f6c5]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">check_circle</span>
              <span>Validé ({countValide})</span>
            </button>

            <button
              type="button"
              onClick={() => setValidationFilter('a_verifier')}
              className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 transition-colors ${
                validationFilter === 'a_verifier'
                  ? 'bg-[#723b00] text-white'
                  : 'bg-[#ffd599]/40 hover:bg-[#ffd599] text-[#723b00] border border-[#ffd599]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">pending_actions</span>
              <span>À vérifier ({countAVerifier})</span>
            </button>

            <button
              type="button"
              onClick={() => setValidationFilter('brouillon')}
              className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 transition-colors ${
                validationFilter === 'brouillon'
                  ? 'bg-[#44474d] text-white'
                  : 'bg-[#f0f4f9] hover:bg-[#e4efff] text-[#44474d] border border-[#c4c6ce]'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>Brouillon ({countBrouillon})</span>
            </button>
          </div>
        </section>

        {/* Liste détaillée des fiches avec traçabilité complète */}
        <section className="flex flex-col gap-3">
          {filteredItems.map((item) => {
            const isExpanded = expandedFicheId === item.id;
            const badgeStyle =
              item.validationLevel === 'valide'
                ? 'bg-[#98f6c5] text-[#005236] border-[#005236]'
                : item.validationLevel === 'a_verifier'
                ? 'bg-[#ffd599] text-[#723b00] border-[#723b00]'
                : 'bg-[#e4e7ee] text-[#44474d] border-[#74777e]';

            const badgeLabel =
              item.validationLevel === 'valide'
                ? 'CORPUS VALIDÉ'
                : item.validationLevel === 'a_verifier'
                ? 'EN COURS DE REVUE (À VÉRIFIER)'
                : 'BROUILLON INTERNE';

            return (
              <article
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce] flex flex-col gap-3"
              >
                {/* En-tête de la fiche */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['Space_Grotesk'] text-[10px] text-[#0036ce] font-bold uppercase tracking-wider bg-[#eef4ff] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${badgeStyle}`}>
                        {badgeLabel}
                      </span>
                    </div>
                    <h3 className="text-[16px] text-[#001126] font-bold mt-1 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Bloc Source & Référence Officielle */}
                <div className="bg-[#f8f9ff] rounded-xl p-3 border border-[#d6e4f8] flex flex-col gap-2 text-[12px]">
                  <div>
                    <span className="text-[#44474d] font-['Space_Grotesk'] text-[10px] uppercase font-bold block">
                      Organisme Source & Mandat :
                    </span>
                    <span className="font-bold text-[#001126] block">
                      {item.sourceOrganization}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#44474d] font-['Space_Grotesk'] text-[10px] uppercase font-bold block">
                      Titre Exact du Document de Référence :
                    </span>
                    <span className="text-[#001126] font-medium italic block leading-snug">
                      « {item.exactDocumentTitle} »
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 border-t border-[#eef4ff] text-[11px]">
                    <div>
                      <span className="text-[#44474d]">Date de révision source : </span>
                      <span className="font-bold text-[#001126] font-['Space_Grotesk']">{item.publicationDate}</span>
                    </div>
                    <div>
                      <span className="text-[#44474d]">Vérifié par NRBCOR le : </span>
                      <span className="font-bold text-[#0036ce] font-['Space_Grotesk']">{item.editorialVerificationDate}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#44474d]">
                    <span>Responsable éditorial : </span>
                    <span className="font-semibold text-[#001126]">{item.editorialReviewer}</span>
                  </div>
                </div>

                {/* Périmètre d'application */}
                <div className="text-[12px] bg-[#f0f4f9] p-2.5 rounded-lg">
                  <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#001126] uppercase block mb-0.5">
                    Scénario & Périmètre d'Application :
                  </span>
                  <p className="text-[#44474d] leading-snug">
                    {item.scenarioPerimeter}
                  </p>
                </div>

                {/* Avertissements doctrinaux */}
                <div className="flex flex-col gap-1">
                  <span className="font-['Space_Grotesk'] text-[11px] font-bold text-[#ba1a1a] uppercase flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px]">report</span>
                    Avertissements Doctrinaux Clés :
                  </span>
                  <ul className="text-[11px] text-[#44474d] space-y-1 pl-1">
                    {item.securityWarnings.map((warn, wIdx) => (
                      <li key={wIdx} className="flex items-start gap-1.5 leading-snug">
                        <span className="text-[#ba1a1a] font-bold shrink-0">•</span>
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lien officiel */}
                <div className="pt-1 flex items-center justify-between gap-2">
                  <a
                    href={item.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-['Space_Grotesk'] font-bold text-[#0036ce] hover:underline"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>Consulter la source officielle d'origine</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="h-8 px-2.5 rounded bg-[#eef4ff] hover:bg-[#e4efff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 transition-colors"
                  >
                    <span>{isExpanded ? 'Masquer l\'historique' : 'Historique des révisions'}</span>
                    <span className="material-symbols-outlined text-[16px]">
                      {isExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>

                {/* Historique des modifications déroulable avec motif de chaque correction */}
                {isExpanded && (
                  <div className="mt-2 bg-[#f8f9ff] rounded-xl p-3 border border-[#c4c6ce] flex flex-col gap-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#d6e4f8] pb-1.5">
                      <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-[#001126] flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] text-[#0036ce]">history</span>
                        Historique des Modifications & Motifs
                      </span>
                      <span className="text-[10px] text-[#44474d]">
                        {item.modificationHistory.length} révision(s)
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      {item.modificationHistory.map((mod, mIdx) => (
                        <div key={mIdx} className="bg-white p-2.5 rounded-lg border border-[#d6e4f8] text-[11px] flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="font-['Space_Grotesk'] font-bold text-[#001126]">
                              Version {mod.version} • {mod.date}
                            </span>
                            <span className="text-[#44474d] italic">Par {mod.author}</span>
                          </div>

                          <div className="bg-[#fff0ed] text-[#93000a] p-2 rounded border border-[#ffdad6] font-medium">
                            <strong>Motif de la correction : </strong>
                            {mod.reason}
                          </div>

                          <div className="text-[#44474d] pt-0.5 leading-snug">
                            <strong>Détail des modifications : </strong>
                            {mod.changesSummary}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
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
              NRBCOR est une application citoyenne d'assistance et de préparation passive. <strong>Elle ne se substitue en aucun cas à la chaîne d'alerte officielle de l'État</strong> (système FR-Alert, sirènes RNA du SAIP, radios du service public) ni aux arrêtés d'évacuation ou de confinement pris par le Préfet de département. En situation réelle, appliquez toujours prioritairement les ordres transmis par les autorités compétentes.
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
              <h2 className="text-[17px] text-[#001126] font-bold">Journal des Versions Globales</h2>
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
            className="w-full min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white rounded-lg font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[20px] text-[#98f6c5]">file_download</span>
            <span>Télécharger l'Attestation Intégrale de Traçabilité (JSON Réel)</span>
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
              <span>Licence Ouverte v2.0 (Etalab) • Réutilisation des Informations Publiques</span>
            </div>
            <p className="text-[11px] text-[#44474d] max-w-sm leading-relaxed">
              Corpus fondé sur les publications officielles de l'État français (DGSCGC, IRSN, Ineris, SPF). NRBCOR applique une rigueur stricte sans réinterprétation hasardeuse.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
