import React, { useState, useEffect } from 'react';
import { FamilyMember, ContactPerson, AssemblyPoint } from '../types';

interface PersonalEmergencyDossierModalProps {
  onClose: () => void;
  members: FamilyMember[];
  outZoneContact: ContactPerson | null;
  localContacts: ContactPerson[];
  assemblyPoints: AssemblyPoint[];
}

interface MedicalEmergencyProfile {
  fullName: string;
  birthDate: string;
  bloodGroup: string;
  allergies: string;
  treatments: string;
  doctorContact: string;
  vitalNotes: string;
}

const STORAGE_KEY_MEDICAL = 'nrbcor_personal_medical_dossier';

export const PersonalEmergencyDossierModal: React.FC<PersonalEmergencyDossierModalProps> = ({
  onClose,
  members,
  outZoneContact,
  localContacts,
  assemblyPoints,
}) => {
  // Opt-ins choisis explicitement par l'utilisateur
  const [includeContacts, setIncludeContacts] = useState(true);
  const [includeAssemblyPoints, setIncludeAssemblyPoints] = useState(true);
  const [includeOfflineProtocols, setIncludeOfflineProtocols] = useState(true);
  const [includeAssistanceNeeds, setIncludeAssistanceNeeds] = useState(true);
  const [includeMedicalInfo, setIncludeMedicalInfo] = useState(false);

  // Données médicales personnelles (100% locales)
  const [medicalProfile, setMedicalProfile] = useState<MedicalEmergencyProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MEDICAL);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fullName: '',
      birthDate: '',
      bloodGroup: '',
      allergies: '',
      treatments: '',
      doctorContact: '',
      vitalNotes: ''
    };
  });

  const [isEditingMedical, setIsEditingMedical] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MEDICAL, JSON.stringify(medicalProfile));
    } catch {}
  }, [medicalProfile]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="bg-white text-black w-full max-w-2xl rounded-2xl shadow-2xl border-2 border-black flex flex-col max-h-[92vh] overflow-hidden">
        {/* En-tête */}
        <div className="p-4 bg-black text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px]">contact_emergency</span>
            <div>
              <h2 className="font-bold text-[16px] font-['Space_Grotesk']">
                Dossier de Secours Personnel & Fiche Imprimable
              </h2>
              <span className="text-[11px] text-gray-300 font-['Space_Grotesk']">
                Sélection granulaire • Confidentialité absolue • Format poche & A4
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Corps avec onglets/paramétrage et aperçu */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-5 text-[12px]">
          {/* Section : Choix explicite des rubriques à inclure */}
          <section className="bg-gray-50 border border-gray-300 rounded-xl p-3.5 flex flex-col gap-2.5">
            <span className="font-['Space_Grotesk'] text-[12px] font-black uppercase text-[#001126] tracking-wider">
              Rubriques à inclure sur la fiche imprimée (au choix de l'utilisateur) :
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeContacts}
                  onChange={(e) => setIncludeContacts(e.target.checked)}
                  className="rounded text-black focus:ring-black w-4 h-4"
                />
                <span className="font-medium text-gray-800">Contacts prioritaires & Relais</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeAssemblyPoints}
                  onChange={(e) => setIncludeAssemblyPoints(e.target.checked)}
                  className="rounded text-black focus:ring-black w-4 h-4"
                />
                <span className="font-medium text-gray-800">Points de rassemblement</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeOfflineProtocols}
                  onChange={(e) => setIncludeOfflineProtocols(e.target.checked)}
                  className="rounded text-black focus:ring-black w-4 h-4"
                />
                <span className="font-medium text-gray-800">Protocoles de crise hors-réseau</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={includeAssistanceNeeds}
                  onChange={(e) => setIncludeAssistanceNeeds(e.target.checked)}
                  className="rounded text-black focus:ring-black w-4 h-4"
                />
                <span className="font-medium text-gray-800">Besoins d'assistance & PMR/Nourrissons</span>
              </label>

              <label className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={includeMedicalInfo}
                  onChange={(e) => setIncludeMedicalInfo(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-600 w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-red-950">
                    Informations médicales d'urgence (Optionnel & Explicite)
                  </span>
                  <span className="text-[10px] text-red-800">
                    Groupe sanguin, allergies graves, traitements quotidiens indispensables
                  </span>
                </div>
              </label>
            </div>
          </section>

          {/* Avertissement de confidentialité médicale renforcée */}
          {includeMedicalInfo && (
            <div className="p-3.5 bg-amber-50 border-2 border-amber-400 rounded-xl flex flex-col gap-2 text-amber-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-700 text-[20px]">lock</span>
                  <strong className="text-[12px] uppercase font-['Space_Grotesk'] font-bold">
                    Garantie de stricte confidentialité des données de santé
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingMedical(!isEditingMedical)}
                  className="text-[11px] font-bold text-black underline hover:no-underline"
                >
                  {isEditingMedical ? 'Masquer formulaire' : 'Renseigner mes données'}
                </button>
              </div>

              <p className="text-[11px] leading-relaxed text-amber-900">
                Vos données de santé restent <strong>100% locales sur votre appareil</strong>. Elles ne sont transmises à <strong>aucun serveur</strong>, et ne sont <strong>jamais incluses par défaut dans un QR Code de partage</strong>. Elles ne sont visibles que sur votre tirage papier physique.
              </p>

              {/* Formulaire d'édition médicale locale */}
              {isEditingMedical && (
                <div className="mt-2 pt-2 border-t border-amber-300 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Nom et Prénom :</label>
                    <input
                      type="text"
                      value={medicalProfile.fullName}
                      onChange={(e) => setMedicalProfile({ ...medicalProfile, fullName: e.target.value })}
                      placeholder="Ex: Jean Dupont"
                      className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Groupe Sanguin :</label>
                    <input
                      type="text"
                      value={medicalProfile.bloodGroup}
                      onChange={(e) => setMedicalProfile({ ...medicalProfile, bloodGroup: e.target.value })}
                      placeholder="Ex: O Rhésus Positif (O+)"
                      className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Allergies sévères & Chocs anaphylactiques :</label>
                    <input
                      type="text"
                      value={medicalProfile.allergies}
                      onChange={(e) => setMedicalProfile({ ...medicalProfile, allergies: e.target.value })}
                      placeholder="Ex: Pénicilline, venin d'abeille (Stylo Anapen disponible)"
                      className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Traitements vitaux quotidiens :</label>
                    <input
                      type="text"
                      value={medicalProfile.treatments}
                      onChange={(e) => setMedicalProfile({ ...medicalProfile, treatments: e.target.value })}
                      placeholder="Ex: Insuline 20 UI/j (frigo), Levothyrox 100µg"
                      className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold uppercase mb-0.5">Médecin traitant & Coordonnées d'urgence :</label>
                    <input
                      type="text"
                      value={medicalProfile.doctorContact}
                      onChange={(e) => setMedicalProfile({ ...medicalProfile, doctorContact: e.target.value })}
                      placeholder="Ex: Dr Martin (Tél: 01 42 00 00 00) - CHU Necker"
                      className="w-full p-1.5 border border-gray-300 rounded text-[12px]"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* APERÇU IMPRIMABLE HAUTE DÉFINITION (NOIR & BLANC OPTIMISÉ POUR IMPRIMANTE) */}
          <div className="flex flex-col gap-1.5">
            <span className="font-['Space_Grotesk'] text-[11px] font-bold uppercase text-gray-500">
              Aperçu du document imprimable (Économie d'encre & Lisibilité N&B) :
            </span>

            <div className="border-2 border-black p-4 rounded-xl bg-white flex flex-col gap-3 font-sans print:border-black print:m-0 print:p-2">
              {/* En-tête du document */}
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <div>
                  <h1 className="text-[15px] font-black uppercase font-['Space_Grotesk'] leading-tight">
                    DOSSIER DE SECOURS CIVILE INDIVIDUEL • NRBCOR
                  </h1>
                  <span className="text-[10px] uppercase font-bold text-gray-700">
                    Plan Familial & Consignes d'Urgence Immédiate
                  </span>
                </div>
                <div className="text-right text-[10px]">
                  <span className="font-bold block">FORMAT PAPIER N&B</span>
                  <span className="text-gray-600">Imprimé le {new Date().toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              {/* SECTION MEDICALE SI ACTIVÉE */}
              {includeMedicalInfo && (
                <div className="p-2.5 border-2 border-black bg-gray-50 rounded flex flex-col gap-1">
                  <div className="flex justify-between items-center border-b border-black pb-1">
                    <span className="font-black text-[11px] uppercase font-['Space_Grotesk']">
                      DONNÉES MÉDICALES D'URGENCE (CONFIDENTIEL SECOURS)
                    </span>
                    <span className="font-bold text-[10px] bg-black text-white px-1.5 py-0.2 rounded">
                      GROUPE : {medicalProfile.bloodGroup || 'NON RENSEIGNÉ'}
                    </span>
                  </div>
                  {medicalProfile.fullName && (
                    <div><strong>Identité :</strong> {medicalProfile.fullName}</div>
                  )}
                  <div>
                    <strong>Allergies sévères :</strong> {medicalProfile.allergies || 'Aucune connue signalée'}
                  </div>
                  <div>
                    <strong>Traitements vitaux réguliers :</strong> {medicalProfile.treatments || 'Aucun traitement continu'}
                  </div>
                  {medicalProfile.doctorContact && (
                    <div>
                      <strong>Médecin de référence :</strong> {medicalProfile.doctorContact}
                    </div>
                  )}
                </div>
              )}

              {/* CARTE PORTEFEUILLE DÉCOUPABLE */}
              <div className="border-2 border-dashed border-black p-3 rounded-lg flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-black pb-1">
                  <span className="text-[10px] font-black uppercase font-['Space_Grotesk']">
                    ✂️ CARTE DE POCHE DÉCOUPABLE (Format 8.5 x 5.5 cm)
                  </span>
                  <span className="text-[9px] uppercase font-bold">À PLACER DANS CHAQUE CARTABLE / PORTEFEUILLE</span>
                </div>

                {includeContacts && (
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <strong className="block text-[10px] uppercase">Contact Relais Hors-Zone :</strong>
                      <span>{outZoneContact ? `${outZoneContact.name} - ${outZoneContact.phone}` : 'À renseigner'}</span>
                    </div>
                    <div>
                      <strong className="block text-[10px] uppercase">Numéros d'Urgence :</strong>
                      <span>15 (SAMU) • 18 (Pompiers) • 112 • 114 (SMS)</span>
                    </div>
                  </div>
                )}

                {includeAssemblyPoints && (
                  <div className="text-[11px] pt-1 border-t border-gray-300">
                    <strong className="block text-[10px] uppercase">Points de Rassemblement :</strong>
                    <div>• Primaire : {assemblyPoints && assemblyPoints[0] ? `${assemblyPoints[0].name} (${assemblyPoints[0].coords})` : 'Entrée immeuble'}</div>
                    <div>• Secondaire : {assemblyPoints && assemblyPoints[1] ? `${assemblyPoints[1].name} (${assemblyPoints[1].coords})` : 'Mairie ou gymnase'}</div>
                  </div>
                )}

                <div className="text-[10px] font-bold border-t border-black pt-1 flex justify-between">
                  <span>Radio FM d'urgence : France Bleu (ou radio locale)</span>
                  <span>Consigne : Confinement immédiat si alerte</span>
                </div>
              </div>

              {/* PROTOCOLES HORS-RÉSEAU */}
              {includeOfflineProtocols && (
                <div className="border border-black p-2.5 rounded text-[11px] flex flex-col gap-1.5">
                  <strong className="font-['Space_Grotesk'] text-[11px] uppercase">
                    Protocoles d'Urgence en Cas de Coupure de Réseau Cellulaire :
                  </strong>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-800">
                    <div className="p-1.5 bg-gray-100 rounded">
                      <strong>1. Séparation :</strong>
                      <p className="text-[10px] mt-0.5">Rejoindre le point primaire. Envoyer 1 SMS court au contact hors-zone.</p>
                    </div>
                    <div className="p-1.5 bg-gray-100 rounded">
                      <strong>2. Rendez-vous fixe :</strong>
                      <p className="text-[10px] mt-0.5">Si réseau coupé : présence au point primaire à H+2, H+6 puis le lendemain à 09h00.</p>
                    </div>
                    <div className="p-1.5 bg-gray-100 rounded">
                      <strong>3. Radio FM :</strong>
                      <p className="text-[10px] mt-0.5">Allumer le poste à piles sur France Bleu. Les ordres du Préfet priment toujours.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* BESOINS D'ASSISTANCE & FOYER */}
              {includeAssistanceNeeds && members.length > 0 && (
                <div className="border border-gray-300 p-2.5 rounded text-[11px]">
                  <strong className="font-['Space_Grotesk'] text-[10px] uppercase block mb-1">
                    Composition du Foyer & Besoins Spécifiques d'Assistance :
                  </strong>
                  <div className="divide-y divide-gray-200">
                    {members.map((m) => (
                      <div key={m.id} className="py-1 flex justify-between">
                        <span className="font-bold">{m.role}</span>
                        <span className="text-gray-700">{m.details}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pied de page modal avec bouton d'impression */}
        <div className="p-4 bg-gray-100 border-t border-black flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-gray-600 hidden sm:block">
            Imprimez 2 exemplaires : 1 pour le classeur familial, 1 découpé en portefeuille.
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="h-10 px-5 bg-black hover:bg-gray-800 active:bg-gray-900 text-white rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Imprimer / Exporter PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 bg-white border border-black hover:bg-gray-50 text-black rounded-xl font-['Space_Grotesk'] text-[12px] font-bold uppercase transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
