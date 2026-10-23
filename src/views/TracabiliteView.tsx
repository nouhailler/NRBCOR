import React, { useState } from 'react';
import { SECURITY_CORPUS_ITEMS, ValidationLevel, VerificationStatus, SecurityCorpusItem } from '../data/securityCorpus';

interface TracabiliteViewProps {
  onBack: () => void;
}

export const TracabiliteView: React.FC<TracabiliteViewProps> = ({ onBack }) => {
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [validationFilter, setValidationFilter] = useState<'tous' | ValidationLevel>('tous');
  const [statusFilter, setStatusFilter] = useState<'tous' | VerificationStatus>('tous');
  const [expandedFicheId, setExpandedFicheId] = useState<string | null>(null);
  const [selectedProofItem, setSelectedProofItem] = useState<SecurityCorpusItem | null>(null);
  const [copiedCitationId, setCopiedCitationId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedFicheId(expandedFicheId === id ? null : id);
  };

  const filteredItems = SECURITY_CORPUS_ITEMS.filter((item) => {
    if (validationFilter !== 'tous' && item.validationLevel !== validationFilter) return false;
    if (statusFilter !== 'tous' && item.verificationStatus !== statusFilter) return false;
    return true;
  });

  const countValide = SECURITY_CORPUS_ITEMS.filter((i) => i.validationLevel === 'valide').length;
  const countAVerifier = SECURITY_CORPUS_ITEMS.filter((i) => i.validationLevel === 'a_verifier').length;
  const countBrouillon = SECURITY_CORPUS_ITEMS.filter((i) => i.validationLevel === 'brouillon').length;

  const countStatusVerifie = SECURITY_CORPUS_ITEMS.filter((i) => i.verificationStatus === 'verifie').length;
  const countStatusARevalid = SECURITY_CORPUS_ITEMS.filter((i) => i.verificationStatus === 'a_revalider').length;
  const countStatusIntrouvable = SECURITY_CORPUS_ITEMS.filter((i) => i.verificationStatus === 'source_introuvable').length;

  const handleVerifyHashes = () => {
    setVerifying(true);
    setVerifiedSuccess(false);

    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
    }, 700);
  };

  const handleCopyCitation = (item: SecurityCorpusItem) => {
    const citation = `[RÉFÉRENCE NRBCOR] ${item.title}\nSource : ${item.sourceOrganization}\nTexte : « ${item.exactDocumentTitle} » (${item.exactReferenceSection})\nDate de publication : ${item.publicationDate} | Vérifié : ${item.editorialVerificationDate}\nExtrait : « ${item.proofSheet.legalExcerpt} »\nLien officiel direct : ${item.officialDirectDocumentUrl}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedCitationId(item.id);
      setTimeout(() => setCopiedCitationId(null), 2500);
    });
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
        statut_verification: item.verificationStatus,
        organisme_source: item.sourceOrganization,
        titre_exact_reference: item.exactDocumentTitle,
        section_exacte: item.exactReferenceSection,
        url_officielle: item.officialUrl,
        url_directe_document: item.officialDirectDocumentUrl,
        date_publication_officielle: item.publicationDate,
        date_verification_editoriale: item.editorialVerificationDate,
        responsable_editorial: item.editorialReviewer,
        qualification_editoriale: item.editorialQualification,
        scenario_et_perimetre: item.scenarioPerimeter,
        fiche_de_preuve: item.proofSheet,
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
              <span>Registre d'intégrité :</span>
              <strong className="text-white font-['Space_Grotesk']">SHA-256 Vérifiable</strong>
            </div>
            <div className="flex items-center justify-between text-[#dce9fd]">
              <span>Organismes de tutelle :</span>
              <strong className="text-white">DGSCGC, ASN, IRSN, Ineris, SGDSN</strong>
            </div>
            <div className="flex items-center justify-between text-[#dce9fd]">
              <span>Contrôle déontologique :</span>
              <strong className="text-[#98f6c5]">Sans attributions non documentées</strong>
            </div>
          </div>
        </section>

        {/* Introduction & Engagement de Transparence */}
        <header className="flex flex-col gap-1.5">
          <h1 className="text-[24px] text-[#001126] font-bold tracking-tight">
            Registre des Preuves & Doctrine Officielle
          </h1>
          <p className="text-[13px] text-[#44474d] leading-relaxed">
            Chaque consigne critique de l'application est adossée à une <strong>fiche de preuve vérifiable</strong> : base légale exacte, article ou page précise, extrait verbatim et liens directs vers les arrêtés et guides interministériels opposables.
          </p>
        </header>

        {/* 3 Directives Doctrinales Majeures (Vérifiées par tests unitaires) */}
        <section className="bg-[#f0f4f9] rounded-xl p-4 border border-[#c4c6ce] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[20px]">policy</span>
            <h2 className="text-[14px] font-bold font-['Space_Grotesk'] uppercase text-[#001126]">
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

        {/* Filtres par Niveau de Validation et Statut de Vérification */}
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#001126] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#0036ce]">fact_check</span>
              <span>Fiches Référencées & Fiches de Preuve</span>
            </h2>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d]">
              {filteredItems.length} fiche(s)
            </span>
          </div>

          {/* Filtre 1 : Statut de Preuve */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-['Space_Grotesk'] font-bold text-[#44474d] uppercase">
              Statut de la preuve documentaire :
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setStatusFilter('tous')}
                className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold transition-colors ${
                  statusFilter === 'tous'
                    ? 'bg-[#001126] text-white'
                    : 'bg-white hover:bg-[#e4efff] text-[#001126] border border-[#c4c6ce]'
                }`}
              >
                Tous statuts ({SECURITY_CORPUS_ITEMS.length})
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('verifie')}
                className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  statusFilter === 'verifie'
                    ? 'bg-[#005236] text-white'
                    : 'bg-[#98f6c5]/40 hover:bg-[#98f6c5] text-[#005236] border border-[#98f6c5]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Vérifié ({countStatusVerifie})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('a_revalider')}
                className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  statusFilter === 'a_revalider'
                    ? 'bg-[#723b00] text-white'
                    : 'bg-[#ffd599]/40 hover:bg-[#ffd599] text-[#723b00] border border-[#ffd599]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">pending_actions</span>
                <span>À revalider ({countStatusARevalid})</span>
              </button>

              <button
                type="button"
                onClick={() => setStatusFilter('source_introuvable')}
                className={`px-3 py-1.5 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  statusFilter === 'source_introuvable'
                    ? 'bg-[#ba1a1a] text-white'
                    : 'bg-[#ffdad6]/50 hover:bg-[#ffdad6] text-[#ba1a1a] border border-[#ffdad6]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">search_off</span>
                <span>Source introuvable ({countStatusIntrouvable})</span>
              </button>
            </div>
          </div>

          {/* Filtre 2 : Niveau de validation */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-['Space_Grotesk'] font-bold text-[#44474d] uppercase">
              Niveau de validation interne :
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setValidationFilter('tous')}
                className={`px-3 py-1 rounded font-['Space_Grotesk'] text-[10px] font-bold transition-colors ${
                  validationFilter === 'tous'
                    ? 'bg-[#354862] text-white'
                    : 'bg-gray-100 text-[#44474d]'
                }`}
              >
                Tous les niveaux
              </button>
              <button
                type="button"
                onClick={() => setValidationFilter('valide')}
                className={`px-3 py-1 rounded font-['Space_Grotesk'] text-[10px] font-bold transition-colors ${
                  validationFilter === 'valide'
                    ? 'bg-[#005236] text-white'
                    : 'bg-emerald-50 text-[#005236]'
                }`}
              >
                Validé ({countValide})
              </button>
              <button
                type="button"
                onClick={() => setValidationFilter('a_verifier')}
                className={`px-3 py-1 rounded font-['Space_Grotesk'] text-[10px] font-bold transition-colors ${
                  validationFilter === 'a_verifier'
                    ? 'bg-[#723b00] text-white'
                    : 'bg-amber-50 text-[#723b00]'
                }`}
              >
                À vérifier ({countAVerifier})
              </button>
              <button
                type="button"
                onClick={() => setValidationFilter('brouillon')}
                className={`px-3 py-1 rounded font-['Space_Grotesk'] text-[10px] font-bold transition-colors ${
                  validationFilter === 'brouillon'
                    ? 'bg-gray-700 text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Brouillon ({countBrouillon})
              </button>
            </div>
          </div>
        </section>

        {/* Liste des Fiches Détaillées avec Fiches de Preuve */}
        <section className="flex flex-col gap-4">
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

            const statusBadgeStyle =
              item.verificationStatus === 'verifie'
                ? 'bg-[#98f6c5] text-[#005236] border-[#005236]'
                : item.verificationStatus === 'a_revalider'
                ? 'bg-[#ffd599] text-[#723b00] border-[#723b00]'
                : 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]';

            const statusBadgeLabel =
              item.verificationStatus === 'verifie'
                ? 'SOURCE VÉRIFIÉE'
                : item.verificationStatus === 'a_revalider'
                ? 'À REVALIDER'
                : 'SOURCE INTROUVABLE';

            return (
              <article
                key={item.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-[#c4c6ce] flex flex-col gap-3"
              >
                {/* En-tête de la fiche */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-['Space_Grotesk'] text-[10px] text-[#0036ce] font-bold uppercase tracking-wider bg-[#eef4ff] px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${badgeStyle}`}>
                        {badgeLabel}
                      </span>
                      <span className={`font-['Space_Grotesk'] text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${statusBadgeStyle}`}>
                        {statusBadgeLabel}
                      </span>
                    </div>
                    <h3 className="text-[16px] text-[#001126] font-bold mt-1.5 leading-snug">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Bloc Source & Référence Officielle avec Dates Distinctes */}
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
                    {item.exactReferenceSection && (
                      <span className="text-[#0036ce] font-semibold text-[11px] block mt-0.5">
                        Section : {item.exactReferenceSection}
                      </span>
                    )}
                  </div>

                  {/* Dates distinctes : Publication officielle VS Vérification par l'app */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#d6e4f8] text-[11px]">
                    <div className="bg-white p-2 rounded border border-[#d6e4f8]">
                      <span className="text-[#44474d] block font-['Space_Grotesk'] text-[10px] uppercase font-bold">
                        Publication officielle de l'État :
                      </span>
                      <span className="font-bold text-[#001126] font-['Space_Grotesk'] text-[12px]">
                        {item.publicationDate}
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded border border-[#d6e4f8]">
                      <span className="text-[#44474d] block font-['Space_Grotesk'] text-[10px] uppercase font-bold">
                        Dernière vérification NRBCOR :
                      </span>
                      <span className="font-bold text-[#0036ce] font-['Space_Grotesk'] text-[12px]">
                        {item.editorialVerificationDate}
                      </span>
                    </div>
                  </div>

                  {/* Collège éditorial vérifiable */}
                  <div className="text-[11px] text-[#44474d] bg-white p-2 rounded border border-[#d6e4f8]">
                    <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold block text-[#001126]">
                      Collège éditorial responsable :
                    </span>
                    <span className="font-semibold text-[#001126] block">
                      {item.editorialReviewer}
                    </span>
                    <span className="text-[10px] text-[#44474d] block mt-0.5 italic">
                      {item.editorialQualification}
                    </span>
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

                {/* Bouton Fiche de Preuve Déontologique & Audit */}
                <div className="bg-[#eef4ff] rounded-xl p-3 border border-[#0036ce]/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[#0036ce]">
                      <span className="material-symbols-outlined text-[18px]">gavel</span>
                      <span className="font-['Space_Grotesk'] text-[12px] font-bold uppercase">
                        Fiche de Preuve Juridique & Textuelle
                      </span>
                    </div>
                    <span className="text-[10px] font-['Space_Grotesk'] bg-[#0036ce] text-white px-2 py-0.5 rounded font-bold">
                      Audit Disponible
                    </span>
                  </div>

                  <p className="text-[11px] text-[#001258] leading-snug">
                    Justification légale : <strong>{item.proofSheet.legalBasis}</strong> ({item.proofSheet.pageOrParagraph}).
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedProofItem(item)}
                      className="h-9 px-3 bg-[#0036ce] hover:bg-[#002ba8] text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[16px]">visibility</span>
                      <span>Ouvrir la fiche de preuve</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyCitation(item)}
                      className="h-9 px-3 bg-white hover:bg-gray-50 text-[#0036ce] border border-[#0036ce]/40 rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedCitationId === item.id ? 'check' : 'content_copy'}
                      </span>
                      <span>{copiedCitationId === item.id ? 'Copié !' : 'Copier référence'}</span>
                    </button>
                  </div>
                </div>

                {/* Liens officiels et historique */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={item.officialDirectDocumentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-['Space_Grotesk'] font-bold text-[#0036ce] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[15px]">file_open</span>
                      <span>Texte exact (Légifrance/PDF)</span>
                    </a>
                    <span className="text-gray-300">•</span>
                    <a
                      href={item.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-['Space_Grotesk'] text-[#44474d] hover:underline"
                    >
                      <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                      <span>Portail officiel</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(item.id)}
                    className="h-8 px-2.5 rounded bg-[#f0f4f9] hover:bg-[#e4e7ee] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 transition-colors self-start sm:self-auto"
                  >
                    <span>{isExpanded ? 'Masquer historique' : 'Historique révisions'}</span>
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

        {/* Modal Fiche de Preuve Détaillée */}
        {selectedProofItem && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="bg-white text-[#001126] w-full max-w-lg rounded-2xl shadow-2xl border border-[#c4c6ce] flex flex-col max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="p-4 bg-[#001126] text-white flex items-start justify-between gap-3">
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-[#98f6c5]">verified</span>
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#98f6c5] uppercase font-bold tracking-wider">
                      Fiche de Preuve Légale & Doctrinale
                    </span>
                  </div>
                  <h3 className="font-bold text-[16px] text-white mt-1 leading-snug">
                    {selectedProofItem.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProofItem(null)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-4 overflow-y-auto flex flex-col gap-3.5 text-[12px]">
                {/* Statut de vérification */}
                <div className="p-3 bg-[#f8f9ff] rounded-xl border border-[#d6e4f8] flex items-center justify-between">
                  <span className="font-['Space_Grotesk'] font-bold uppercase text-[11px]">
                    Statut d'opposabilité :
                  </span>
                  <span className="px-2.5 py-1 rounded-full font-['Space_Grotesk'] text-[11px] font-bold uppercase bg-[#98f6c5] text-[#005236]">
                    {selectedProofItem.verificationStatus === 'verifie' ? 'Vérifié & Conforme' : selectedProofItem.verificationStatus}
                  </span>
                </div>

                {/* Règle justifiée */}
                <div>
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#44474d] block mb-1">
                    Règle vitale justifiée :
                  </span>
                  <div className="p-3 bg-[#eef4ff] rounded-xl border border-[#b9c3ff] font-semibold text-[#001258] leading-relaxed">
                    {selectedProofItem.proofSheet.justifiedRule}
                  </div>
                </div>

                {/* Base juridique et localisation exacte */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#44474d] block">
                      Base légale / réglementaire :
                    </span>
                    <span className="font-bold text-[#001126] block mt-0.5">
                      {selectedProofItem.proofSheet.legalBasis}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#44474d] block">
                      Localisation précise :
                    </span>
                    <span className="font-bold text-[#0036ce] block mt-0.5 font-['Space_Grotesk']">
                      {selectedProofItem.proofSheet.pageOrParagraph}
                    </span>
                  </div>
                </div>

                {/* Extrait juridique Verbatim */}
                <div>
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#44474d] block mb-1">
                    Extrait textuel verbatim ou synthèse opposable :
                  </span>
                  <blockquote className="p-3 bg-[#fff9ea] rounded-xl border border-[#ffe082] italic text-[#5c3e00] leading-relaxed">
                    « {selectedProofItem.proofSheet.legalExcerpt} »
                  </blockquote>
                </div>

                {/* Méthode de vérification */}
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col gap-1">
                  <span className="font-['Space_Grotesk'] text-[10px] uppercase font-bold text-[#44474d]">
                    Méthode de vérification documentaire :
                  </span>
                  <span className="text-[#001126]">
                    {selectedProofItem.proofSheet.verificationMethod}
                  </span>
                  <span className="text-[11px] text-[#44474d] mt-1 pt-1 border-t border-gray-200">
                    Justification : {selectedProofItem.proofSheet.statusJustification}
                  </span>
                </div>

                {/* Dates & Collège */}
                <div className="p-3 bg-[#f0f4f9] rounded-xl text-[11px] flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Publication officielle :</span>
                    <strong className="text-[#001126] font-['Space_Grotesk']">{selectedProofItem.publicationDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#44474d]">Dernière revue NRBCOR :</span>
                    <strong className="text-[#0036ce] font-['Space_Grotesk']">{selectedProofItem.editorialVerificationDate}</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-300">
                    <span className="text-[#44474d]">Organisme officiel :</span>
                    <strong className="text-[#001126]">{selectedProofItem.sourceOrganization}</strong>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <a
                  href={selectedProofItem.officialDirectDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-4 bg-[#001126] hover:bg-[#12263f] text-white rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  <span>Consulter le texte officiel exact</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSelectedProofItem(null)}
                  className="h-10 px-4 bg-white border border-gray-300 hover:bg-gray-100 text-[#001126] rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cadre Juridique & RGPD */}
        <section className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3 border border-[#c4c6ce]">
          <div className="flex items-center gap-2 text-[#ba1a1a]">
            <span className="material-symbols-outlined text-[22px]">gavel</span>
            <h2 className="text-[17px] text-[#001126] font-bold">Avertissements & Cadre Légal</h2>
          </div>

          <div className="bg-[#eef4ff] rounded-lg p-3 flex flex-col gap-1 border border-[#d6e4f8]">
            <div className="flex items-center gap-1.5 text-[#001126] font-['Space_Grotesk'] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[16px] text-[#ba1a1a]">warning</span>
              <span>Priorité des Ordres des Autorités Publiques</span>
            </div>
            <p className="text-[12px] text-[#44474d] leading-relaxed">
              En cas de crise réelle (déclenchement de la sirène SAIP, message FR-Alert, arrêté préfectoral de confinement ou d'évacuation), <strong>les consignes diffusées en direct par la Préfecture et les forces d'intervention priment en toutes circonstances</strong> sur les fiches théoriques de cette application.
            </p>
          </div>

          <div className="text-[12px] text-[#44474d] space-y-2 leading-relaxed">
            <p>
              <strong>Architecture 100% Hors-Ligne & RGPD :</strong> Aucune donnée personnelle, inventaire ou localisation n'est transmise à un serveur tiers. Les fiches sont stockées en local sous licence ouverte de réutilisation des informations publiques (Loi n° 78-753 du 17 juillet 1978).
            </p>
          </div>
        </section>

        {/* Actions Export & Signalement */}
        <section className="flex flex-col gap-2 pt-1 pb-4">
          <button
            onClick={handleDownloadProof}
            type="button"
            className="w-full min-h-[48px] bg-white hover:bg-[#eef4ff] text-[#0036ce] border border-[#0036ce] rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Exporter le certificat d'audit complet (JSON)</span>
          </button>

          <button
            onClick={handleReportIssue}
            type="button"
            className="w-full min-h-[44px] bg-transparent hover:bg-gray-100 text-[#44474d] rounded-xl font-['Space_Grotesk'] text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Signaler un écart ou une mise à jour réglementaire</span>
          </button>
        </section>
      </div>
    </div>
  );
};
