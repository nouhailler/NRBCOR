import React, { useState, useEffect } from 'react';
import {
  INITIAL_MEMBERS,
  INITIAL_ASSEMBLY_POINTS,
  OUT_OF_ZONE_CONTACT,
  LOCAL_CONTACTS,
  INITIAL_PLAN_TASKS,
  PlanTask,
} from '../data/familyPlanData';
import { EmergencyCall, FamilyMember, ContactPerson, AssemblyPoint } from '../types';
import { Tooltip } from '../components/Tooltip';

import { storageService } from '../services/storage/IndexedDbStorage';
import { FamilyPlanQrModal } from '../components/FamilyPlanQrModal';
import { ExportPdfModal } from '../components/ExportPdfModal';

interface MonPlanViewProps {
  onOpenCallModal: (call: EmergencyCall) => void;
  onOpenWipeModal: () => void;
}

export const MonPlanView: React.FC<MonPlanViewProps> = ({
  onOpenCallModal,
  onOpenWipeModal,
}) => {
  const [isDiscreet, setIsDiscreet] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showExportPdfModal, setShowExportPdfModal] = useState(false);
  const [tasks, setTasks] = useState<PlanTask[]>(() => {
    try {
      const s = localStorage.getItem('nrbcor_family_plan');
      if (s) {
        const p = JSON.parse(s);
        if (p.tasks) return p.tasks;
      }
      const legacy = localStorage.getItem('nrbcor_plan_tasks');
      if (legacy) return JSON.parse(legacy);
    } catch (e) {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return INITIAL_PLAN_TASKS.map((t) => ({ ...t, done: false }));
    }
    return INITIAL_PLAN_TASKS;
  });

  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const s = localStorage.getItem('nrbcor_family_plan');
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p.members)) return p.members;
      }
      const legacy = localStorage.getItem('nrbcor_family_members');
      if (legacy) return JSON.parse(legacy);
    } catch (e) {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return [];
    }
    return INITIAL_MEMBERS;
  });

  const [outZoneContact, setOutZoneContact] = useState<ContactPerson | null>(() => {
    try {
      const s = localStorage.getItem('nrbcor_family_plan');
      if (s) {
        const p = JSON.parse(s);
        if (p.outZoneContact !== undefined) return p.outZoneContact;
      }
      const legacy = localStorage.getItem('nrbcor_out_contact');
      if (legacy) return JSON.parse(legacy);
    } catch (e) {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return null;
    }
    return OUT_OF_ZONE_CONTACT;
  });

  const [localContacts, setLocalContacts] = useState<ContactPerson[]>(() => {
    try {
      const s = localStorage.getItem('nrbcor_family_plan');
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p.localContacts)) return p.localContacts;
      }
      const legacy = localStorage.getItem('nrbcor_local_contacts');
      if (legacy) return JSON.parse(legacy);
    } catch (e) {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return [];
    }
    return LOCAL_CONTACTS;
  });

  const [assemblyPoints, setAssemblyPoints] = useState<AssemblyPoint[]>(() => {
    try {
      const s = localStorage.getItem('nrbcor_family_plan');
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p.assemblyPoints)) return p.assemblyPoints;
      }
      const sPts = localStorage.getItem('nrbcor_assembly_points');
      if (sPts) return JSON.parse(sPts);
    } catch (e) {}
    if (typeof localStorage !== 'undefined' && localStorage.getItem('nrbc_clean_slate_active') === 'true') {
      return [];
    }
    return INITIAL_ASSEMBLY_POINTS;
  });

  // Recharger depuis IndexedDB au montage
  useEffect(() => {
    storageService.getFamilyPlan().then((plan) => {
      if (plan) {
        if (plan.tasks) setTasks(plan.tasks);
        if (plan.members) setMembers(plan.members);
        setOutZoneContact(plan.outZoneContact || null);
        if (plan.localContacts) setLocalContacts(plan.localContacts);
        if (plan.assemblyPoints !== undefined) setAssemblyPoints(plan.assemblyPoints);
      }
    });
  }, []);

  // Member editing modal
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newRole, setNewRole] = useState('');
  const [newDetails, setNewDetails] = useState('');

  // Contact editing modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactRole, setContactRole] = useState('');

  // Assembly Point modal
  const [showAssemblyModal, setShowAssemblyModal] = useState(false);
  const [pointName, setPointName] = useState('');
  const [pointDesc, setPointDesc] = useState('');
  const [pointCoords, setPointCoords] = useState('');
  const [pointType, setPointType] = useState('POINT PRIMAIRE • IMMÉDIAT');
  const [pointRadius, setPointRadius] = useState('Rayon: 300m');

  // Out Zone Contact modal
  const [showOutZoneModal, setShowOutZoneModal] = useState(false);
  const [outName, setOutName] = useState('');
  const [outPhone, setOutPhone] = useState('');
  const [outRole, setOutRole] = useState('');
  const [outDist, setOutDist] = useState('Dist. > 100 km');

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Synchronisation unifiée vers storageService (IndexedDB + fallback)
  useEffect(() => {
    storageService.saveFamilyPlan({
      tasks,
      members,
      outZoneContact,
      localContacts,
      assemblyPoints
    });
  }, [tasks, members, outZoneContact, localContacts, assemblyPoints]);

  const doneCount = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3200);
  };

  const handleExportPDF = () => {
    setShowExportPdfModal(true);
  };

  const handleImportPlan = async (imported: any) => {
    if (imported.tasks) setTasks(imported.tasks);
    if (imported.members) setMembers(imported.members);
    if (imported.outZoneContact !== undefined) setOutZoneContact(imported.outZoneContact);
    if (imported.localContacts) setLocalContacts(imported.localContacts);
    if (imported.assemblyPoints) setAssemblyPoints(imported.assemblyPoints);
    await storageService.saveFamilyPlan(imported);
    showToast('Plan familial synchronisé avec succès via QR Code');
  };

  const maskText = (text: string) => {
    if (!isDiscreet) return text;
    return '••••••••••••••••';
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim()) return;
    const newM: FamilyMember = {
      id: `m-${Date.now()}`,
      role: newRole.trim(),
      details: newDetails.trim() || 'Membre configuré dans le plan de sûreté.',
      icon: 'person',
    };
    setMembers((prev) => [...prev, newM]);
    setNewRole('');
    setNewDetails('');
    setShowMemberModal(false);
    showToast('Membre ajouté avec succès');
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Membre retiré');
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;
    const newC: ContactPerson = {
      id: `c-${Date.now()}`,
      name: contactName.trim(),
      phone: contactPhone.trim(),
      role: contactRole.trim() || 'Contact de confiance',
      dist: 'Local',
      icon: 'person_pin_circle',
    };
    setLocalContacts((prev) => [...prev, newC]);
    setContactName('');
    setContactPhone('');
    setContactRole('');
    setShowContactModal(false);
    showToast('Contact de confiance ajouté');
  };

  const handleAddAssemblyPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pointName.trim()) return;
    const newPoint: AssemblyPoint = {
      type: pointType,
      radius: pointRadius,
      name: pointName.trim(),
      desc: pointDesc.trim() || 'Lieu de repli désigné pour le foyer.',
      coords: pointCoords.trim() || 'À pied depuis le domicile',
      color: 'bg-[#001126] text-white',
    };
    setAssemblyPoints((prev) => [...prev, newPoint]);
    setPointName('');
    setPointDesc('');
    setPointCoords('');
    setShowAssemblyModal(false);
    showToast('Point de ralliement enregistré');
  };

  const handleSaveOutZoneContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outName.trim() || !outPhone.trim()) return;
    const newOut: ContactPerson = {
      id: 'c-out',
      name: outName.trim(),
      phone: outPhone.trim(),
      role: outRole.trim() || 'Centralise les SMS brefs en cas de saturation locale',
      dist: outDist,
      icon: 'hub',
      isOutZone: true,
    };
    setOutZoneContact(newOut);
    setShowOutZoneModal(false);
    showToast('Contact relais hors zone enregistré');
  };

  return (
    <div className="flex flex-col w-full px-4 pt-24 pb-28 gap-4 max-w-xl mx-auto">
      {/* Top Offline Sync & Strict Local Privacy Banner */}
      <div className="bg-[#001126] text-white p-3 rounded-xl shadow-sm border border-[#12263f]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="material-symbols-outlined text-[#98f6c5] text-[18px] shrink-0"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] tracking-wider uppercase font-bold text-[#98f6c5] truncate">
              CONFIDENTIALITÉ ABSOLUE • DONNÉES LOCALES UNIQUEMENT
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-white/10 px-2 py-0.5 rounded">
            <span className="w-2 h-2 rounded-full bg-[#98f6c5] animate-pulse"></span>
            <span className="font-['Space_Grotesk'] text-[10px] text-[#eef4ff] uppercase">
              INDEXEDDB SÉCURISÉ
            </span>
          </div>
        </div>
      </div>

      {/* Privacy Statement Card with Discreet Mode Toggle */}
      <section className="bg-white p-4 rounded-xl shadow-sm space-y-3 border border-[#c4c6ce]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#e4efff] flex items-center justify-center shrink-0 text-[#001126]">
              <span className="material-symbols-outlined text-[20px]">shield_person</span>
            </div>
            <div className="space-y-0.5">
              <h2 className="text-[17px] text-[#001126] font-bold leading-tight">
                Stockage Zéro-Serveur
              </h2>
              <p className="text-[12px] text-[#44474d] leading-relaxed">
                Ces informations restent exclusivement stockées sur votre appareil (IndexedDB). Aucun compte, aucun cloud, aucun serveur distant. Option de masquage rapide et d'effacement intégral d'urgence.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-1 flex items-center justify-between bg-[#eef4ff] p-2.5 rounded-lg border border-[#d6e4f8]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#44474d] text-[18px]">
              {isDiscreet ? 'visibility_off' : 'visibility'}
            </span>
            <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] font-semibold">
              {isDiscreet ? 'Mode discret ACTIF (données masquées)' : 'Mode d\'affichage standard'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsDiscreet(!isDiscreet)}
            className="min-h-[44px] px-3 py-1 bg-[#dce9fd] hover:bg-[#cedbef] text-[#001126] rounded flex items-center gap-1.5 transition-colors font-['Space_Grotesk'] text-[11px] uppercase font-bold"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDiscreet ? 'visibility' : 'visibility_off'}
            </span>
            <span>{isDiscreet ? 'Afficher données' : 'Masquer sensibles'}</span>
          </button>
        </div>
      </section>

      {/* Header Section */}
      <header className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded bg-[#12263f] text-white uppercase font-bold tracking-wider">
            SECTION 4.9 • RÉSILIENCE DU FOYER
          </span>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            • HORS-RÉSEAU
          </span>
        </div>
        <h1 className="text-[24px] text-[#001126] tracking-tight font-bold">
          Plan Familial de Mise en Sûreté
        </h1>
        <p className="text-[14px] text-[#44474d] leading-relaxed">
          Organisation coordonnée des proches et protocoles de rassemblement hors réseau.
        </p>
      </header>

      {/* Section: Foyer & Vulnérabilités */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-3 border border-[#c4c6ce]">
        <div className="flex items-center justify-between pb-1 border-b border-[#e4efff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">
              family_restroom
            </span>
            <h2 className="text-[17px] text-[#001126] font-bold">Composition du Foyer</h2>
          </div>
          <button
            onClick={() => setShowMemberModal(true)}
            type="button"
            className="min-h-[44px] px-3 bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001126] rounded font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 transition-colors border border-[#d6e4f8]"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            <span>Modifier</span>
          </button>
        </div>

        {/* Member count chip */}
        <div className="bg-[#eef4ff] p-2.5 rounded-lg flex items-center justify-between border border-[#d6e4f8]">
          <div className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#005236] text-[20px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              groups
            </span>
            <span className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold">
              {members.length} membres du foyer configurés
            </span>
          </div>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-medium">
            Fiche à jour
          </span>
        </div>

        {/* Specific Vulnerabilities */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#44474d] text-[18px]">
              health_and_safety
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-bold tracking-wider">
              Besoins particuliers & Vulnérabilités (Sans diagnostic médical)
            </span>
          </div>

          <div className="space-y-2">
            {members.length > 0 ? (
              members.map((mem) => (
                <div
                  key={mem.id}
                  className="bg-[#eef4ff] p-3 rounded-lg flex items-start gap-3 border border-[#d6e4f8] group"
                >
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 mt-0.5 text-[#001126] border border-[#c4c6ce]">
                    <span className="material-symbols-outlined text-[16px]">{mem.icon}</span>
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold">
                        {maskText(mem.role)}
                      </p>
                      <button
                        onClick={() => handleDeleteMember(mem.id)}
                        className="text-[#ba1a1a] opacity-0 group-hover:opacity-100 transition-opacity p-1"
                        title="Supprimer"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                    <p className="text-[12px] text-[#0f1c2b] leading-relaxed">
                      {mem.details}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#f0f4f9] p-3.5 rounded-lg border border-[#c4c6ce] flex flex-col gap-1.5 text-center">
                <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126]">
                  Aucun membre renseigné (Feuille blanche)
                </span>
                <p className="text-[11px] text-[#44474d]">
                  Configurez vos proches pour enregistrer leurs besoins spécifiques d'évacuation ou de confinement.
                </p>
                <button
                  type="button"
                  onClick={() => setShowMemberModal(true)}
                  className="mt-1 min-h-[40px] px-3 bg-[#001126] text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase self-center flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  <span>Ajouter un membre</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section: Lieux de Rassemblement & Ralliement */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-3 border border-[#c4c6ce]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">pin_drop</span>
            <h2 className="text-[17px] text-[#001126] font-bold">
              Lieux de Rassemblement & Ralliement
            </h2>
          </div>
          <button
            onClick={() => setShowAssemblyModal(true)}
            type="button"
            className="min-h-[40px] px-2.5 bg-[#eef4ff] hover:bg-[#dce9fd] text-[#001126] rounded font-['Space_Grotesk'] text-[11px] font-bold uppercase flex items-center gap-1 transition-colors border border-[#d6e4f8]"
          >
            <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
            <span>Ajouter</span>
          </button>
        </div>

        {/* Crucial Safety Rule Alert Banner */}
        <div className="bg-[#ffdad6] text-[#93000a] p-3 rounded-lg flex items-start gap-2.5 border border-[#ffb4ab]">
          <span
            className="material-symbols-outlined text-[#ba1a1a] text-[22px] shrink-0 mt-0.5"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div className="space-y-0.5">
            <p className="font-['Space_Grotesk'] text-[11px] font-bold uppercase tracking-wide text-[#ba1a1a]">
              Règle absolue de sécurité
            </p>
            <p className="text-[12px] text-[#93000a] leading-relaxed">
              Si l'alerte impose un confinement immédiat (toxique chimique ou retombées radiologiques), <strong className="underline font-bold">NE PAS SE DÉPLACER</strong> vers les points de ralliement. Restez calfeutré sur place.
            </p>
          </div>
        </div>

        {/* Assembly Points Cards */}
        <div className="space-y-2.5">
          {assemblyPoints.length > 0 ? (
            assemblyPoints.map((pt, i) => (
              <div
                key={i}
                className="bg-[#eef4ff] p-3.5 rounded-lg space-y-2 border border-[#d6e4f8] group"
              >
                <div className="flex items-center justify-between">
                  <span className={`font-['Space_Grotesk'] text-[11px] px-2 py-0.5 rounded uppercase font-bold tracking-wide ${pt.color || 'bg-[#001126] text-white'}`}>
                    {pt.type}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-bold">
                      {pt.radius}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAssemblyPoints((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-[#ba1a1a] opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                      title="Supprimer ce point"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-[16px] text-[#001126] font-bold">
                    {maskText(pt.name)}
                  </h3>
                  <p className="text-[12px] text-[#44474d] leading-relaxed">{pt.desc}</p>
                </div>
                <div className="pt-1 flex items-center gap-1.5 text-[12px] font-medium text-[#0036ce]">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  <span className="font-['Space_Grotesk']">{maskText(pt.coords)}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#f0f4f9] p-3.5 rounded-lg border border-[#c4c6ce] flex flex-col gap-1.5 text-center">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126]">
                Aucun point de ralliement défini (Feuille blanche)
              </span>
              <p className="text-[11px] text-[#44474d]">
                Définissez un point primaire immédiat (ex. parc ou kiosque du quartier) et un point secondaire de repli.
              </p>
              <button
                type="button"
                onClick={() => setShowAssemblyModal(true)}
                className="mt-1 min-h-[40px] px-3 bg-[#001126] text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase self-center flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
                <span>Ajouter un point de ralliement</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Section: Protocole de Communication */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-3 border border-[#c4c6ce]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#0036ce] text-[22px]">cell_tower</span>
          <h2 className="text-[17px] text-[#001126] font-bold">Protocole Réseau & Crise</h2>
        </div>

        {/* Guidelines */}
        <div className="bg-[#eef4ff] p-3 rounded-lg space-y-2 border border-[#d6e4f8]">
          <p className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold uppercase tracking-wider">
            Règles de communication sous saturation réseau :
          </p>
          <ul className="space-y-1.5 text-[12px] text-[#0f1c2b]">
            <li className="flex items-start gap-2">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#ba1a1a] font-bold">
                1.
              </span>
              <span>
                <strong className="text-[#ba1a1a]">Ne jamais téléphoner :</strong> Préserver les fréquences cellulaires et lignes pour le 15 / 18 / 112.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] font-bold">
                2.
              </span>
              <span>
                <strong>SMS très courts uniquement :</strong> Format standardisé <em>« Suis à l'abri au domicile / Tout va bien / En attente radio »</em>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-['Space_Grotesk'] text-[12px] text-[#001126] font-bold">
                3.
              </span>
              <span>
                <strong>Contact relais hors zone :</strong> Utiliser le point de contact distant éloigné de plus de 100 km pour synchroniser le foyer.
              </span>
            </li>
          </ul>
        </div>

        {/* Out-of-zone Contact Relay */}
        {outZoneContact ? (
          <div className="bg-[#001126] text-white p-4 rounded-xl space-y-2 border border-[#12263f]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-[#98f6c5] text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  hub
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="font-['Space_Grotesk'] text-[11px] uppercase font-bold text-[#98f6c5] tracking-wide">
                    Contact Relais Hors Zone Prioritaire
                  </span>
                  <Tooltip
                    title="Pourquoi un contact à +50 km ?"
                    content="Lors d'un incident majeur (nucléaire, SEVESO, tempête), les antennes cellulaires locales sont saturées ou coupées. Un proche vivant loin peut recevoir vos SMS et servir de standard central pour informer tous les membres du foyer."
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-['Space_Grotesk'] text-[10px] bg-white/20 px-2 py-0.5 rounded text-white font-medium">
                  {outZoneContact.dist}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setOutName(outZoneContact.name);
                    setOutPhone(outZoneContact.phone);
                    setOutRole(outZoneContact.role);
                    setOutDist(outZoneContact.dist);
                    setShowOutZoneModal(true);
                  }}
                  className="text-[#98f6c5] hover:text-white p-0.5"
                  title="Modifier le contact relais"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-[16px] font-bold text-white">
                  {maskText(outZoneContact.name)}
                </p>
                <span className="material-symbols-outlined text-[#98f6c5] text-[18px]">
                  verified
                </span>
              </div>
              <p className="font-['Space_Grotesk'] text-[15px] text-[#98f6c5] tracking-wide font-bold">
                {maskText(outZoneContact.phone)}
              </p>
            </div>

            <p className="text-[12px] text-[#dce9fd] leading-relaxed pt-0.5">
              {outZoneContact.role}
            </p>
          </div>
        ) : (
          <div className="bg-[#f0f4f9] p-4 rounded-xl border border-[#c4c6ce] flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#001126]">
              <span className="material-symbols-outlined text-[20px] text-[#44474d]">hub</span>
              <span className="font-['Space_Grotesk'] text-[13px] font-bold">
                Aucun contact relais hors zone (Feuille blanche)
              </span>
            </div>
            <p className="text-[11px] text-[#44474d] leading-relaxed">
              Désignez un membre de votre famille ou un proche habitant à plus de 50-100 km pour centraliser vos SMS brefs en cas de saturation du réseau local.
            </p>
            <button
              onClick={() => {
                setOutName('');
                setOutPhone('');
                setOutRole('');
                setShowOutZoneModal(true);
              }}
              type="button"
              className="mt-1 min-h-[40px] px-3 bg-[#001126] text-white rounded-lg font-['Space_Grotesk'] text-[11px] font-bold uppercase self-start flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">add_call</span>
              <span>Définir le contact relais hors zone</span>
            </button>
          </div>
        )}

        {/* Local Trusted Contacts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-['Space_Grotesk'] text-[11px] text-[#44474d] font-bold uppercase tracking-wider">
              Contacts de Confiance Locaux
            </p>
            <button
              onClick={() => setShowContactModal(true)}
              type="button"
              className="text-[#0036ce] text-[11px] font-['Space_Grotesk'] font-bold flex items-center gap-0.5 hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Ajouter
            </button>
          </div>

          <div className="space-y-2">
            {localContacts.length > 0 ? (
              localContacts.map((con) => (
                <div
                  key={con.id}
                  className="bg-[#eef4ff] p-3 rounded-lg flex items-center justify-between min-h-[48px] border border-[#d6e4f8] group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-[#001126] text-[20px]">
                      {con.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="font-['Space_Grotesk'] text-[13px] text-[#001126] font-bold truncate">
                        {maskText(con.name)}
                      </p>
                      <p className="text-[12px] text-[#44474d] truncate">{con.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setLocalContacts((prev) => prev.filter((c) => c.id !== con.id))}
                      className="text-[#ba1a1a] opacity-0 group-hover:opacity-100 p-1.5 transition-opacity"
                      title="Supprimer ce contact"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onOpenCallModal({
                          number: con.phone,
                          name: con.name,
                          subtitle: con.role,
                          desc: 'Contact local du Plan Familial de Mise en Sûreté.',
                        })
                      }
                      className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#001126] border border-[#c4c6ce] hover:bg-[#dce9fd] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">sms</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-[#f0f4f9] p-3 rounded-lg border border-[#c4c6ce] text-center">
                <span className="text-[12px] text-[#44474d]">
                  Aucun contact local enregistré. Cliquez sur « Ajouter » (ex. voisin avec double de clé, médecin).
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section: Checklist du Plan Familial */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-3 border border-[#c4c6ce]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0036ce] text-[22px]">checklist</span>
            <h2 className="text-[17px] text-[#001126] font-bold">Checklist du Plan Familial</h2>
          </div>
          <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#002c1b] bg-[#98f6c5] px-2 py-0.5 rounded">
            {progressPercent}% Prêt
          </span>
        </div>

        {/* Progress Meter */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-semibold">
              Jauge de préparation
            </span>
            <span className="font-['Space_Grotesk'] text-[11px] text-[#001126] font-bold">
              {doneCount} sur {totalTasks} tâches opérationnelles
            </span>
          </div>
          <div className="w-full bg-[#e4efff] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-[#0036ce] h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-2 pt-1">
          {tasks.map((task) => (
            <label
              key={task.id}
              className="flex items-center gap-3 p-2.5 bg-[#eef4ff] rounded-lg cursor-pointer min-h-[48px] hover:bg-[#e4efff] transition-colors border border-[#d6e4f8]"
            >
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => toggleTask(task.id)}
                className="w-5 h-5 text-[#001126] rounded accent-[#001126] shrink-0"
              />
              <span
                className={`text-[13px] flex-1 ${
                  task.done ? 'text-[#0f1c2b]' : 'font-semibold text-[#001126]'
                }`}
              >
                {task.label}
              </span>
              {task.done ? (
                <span
                  className="material-symbols-outlined text-[#3f9d73] text-[20px] shrink-0"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              ) : (
                <span className="font-['Space_Grotesk'] text-[11px] text-[#44474d] uppercase font-bold shrink-0">
                  À planifier
                </span>
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Visual Aid Card */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-2 border border-[#c4c6ce]">
        <div className="flex items-center justify-between">
          <h3 className="text-[17px] text-[#001126] font-bold">Mémo Réflexe Visuel</h3>
          <span className="font-['Space_Grotesk'] text-[11px] text-[#002c1b] bg-[#98f6c5] px-2 py-0.5 rounded font-bold">
            DISPONIBLE HORS-LIGNE
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-[#eef4ff] p-2.5 rounded-lg space-y-1 border border-[#d6e4f8]">
            <span className="material-symbols-outlined text-[#001126] text-[22px]">air</span>
            <p className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126]">
              1. Calfeutrer
            </p>
            <p className="font-['Space_Grotesk'] text-[10px] text-[#44474d]">
              Stop VMC & joints
            </p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-lg space-y-1 border border-[#d6e4f8]">
            <span className="material-symbols-outlined text-[#001126] text-[22px]">radio</span>
            <p className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126]">
              2. Écouter
            </p>
            <p className="font-['Space_Grotesk'] text-[10px] text-[#44474d]">
              Radio FM locale
            </p>
          </div>
          <div className="bg-[#eef4ff] p-2.5 rounded-lg space-y-1 border border-[#d6e4f8]">
            <span className="material-symbols-outlined text-[#001126] text-[22px]">sms</span>
            <p className="font-['Space_Grotesk'] text-[12px] font-bold text-[#001126]">
              3. Relais
            </p>
            <p className="font-['Space_Grotesk'] text-[10px] text-[#44474d] truncate">
              {outZoneContact ? `SMS relais ${maskText(outZoneContact.name)}` : 'SMS relais hors zone'}
            </p>
          </div>
        </div>
      </section>

      {/* Section: Actions & Sauvegarde */}
      <section className="bg-white rounded-xl p-4 shadow-sm space-y-3 border border-[#c4c6ce]">
        <div className="space-y-0.5">
          <h2 className="text-[17px] text-[#001126] font-bold">Actions & Sauvegarde</h2>
          <p className="text-[12px] text-[#44474d]">
            Imprimez une copie papier physique et gérez le cycle de vie de vos données privées.
          </p>
        </div>

        {/* Actions de partage et export */}
        <div className="space-y-2.5">
          <button
            onClick={() => setShowQrModal(true)}
            type="button"
            className="w-full min-h-[48px] bg-[#0036ce] hover:bg-[#0028a3] text-white font-['Space_Grotesk'] text-[13px] uppercase font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
            <span>Partager / Transférer via QR Code (sans cloud)</span>
          </button>

          <button
            onClick={handleExportPDF}
            type="button"
            className="w-full min-h-[48px] bg-[#001126] hover:bg-[#12263f] text-white font-['Space_Grotesk'] text-[13px] uppercase font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            <span>Exporter / Imprimer le Plan en PDF (Classeur de Crise)</span>
          </button>
          <p className="text-[11px] text-[#44474d] leading-relaxed px-1">
            <span className="font-bold text-[#001126]">Partage direct appareil à appareil :</span> Le QR code permet de transférer le plan à un proche sans Internet ni serveur distant. Conservez vos impressions dans un classeur accessible.
          </p>
        </div>

        {/* Emergency Wipe Action */}
        <div className="pt-2 border-t border-[#e4efff]">
          <button
            onClick={onOpenWipeModal}
            type="button"
            className="w-full min-h-[48px] bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] font-['Space_Grotesk'] text-[12px] font-bold uppercase rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#ffb4ab]"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>Effacer toutes les données du plan (Suppression Définitive)</span>
          </button>
        </div>
      </section>

      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#001126] text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-[#98f6c5]">
          <span className="material-symbols-outlined text-[#98f6c5] text-[18px]">check_circle</span>
          <span className="font-['Space_Grotesk'] text-[12px] font-bold">{feedbackToast}</span>
        </div>
      )}

      {/* Modal Ajout Membre */}
      {showMemberModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">Ajouter un membre du foyer</h3>
            <form onSubmit={handleAddMember} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Rôle ou Profil :
                </label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="Ex : Enfant (12 ans), Grand-parent..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Besoins / Instructions spécifiques :
                </label>
                <textarea
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Ex : Collège sous PPMS, traitement d'insuline dans le kit..."
                  rows={3}
                  className="w-full p-2.5 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="h-10 px-3.5 rounded bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajout Contact Local */}
      {showContactModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">Nouveau contact de confiance</h3>
            <form onSubmit={handleAddContact} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Nom & Prénom :
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex : Jean D. (Voisin rez-de-chaussée)"
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Numéro de mobile :
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Rôle ou clé de secours :
                </label>
                <input
                  type="text"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="Ex : Détenteur double de clés..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="h-10 px-3.5 rounded bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajout Point de Ralliement */}
      {showAssemblyModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">Nouveau point de ralliement</h3>
            <form onSubmit={handleAddAssemblyPoint} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Type de point :
                </label>
                <select
                  value={pointType}
                  onChange={(e) => setPointType(e.target.value)}
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] bg-white focus:outline-none"
                >
                  <option value="POINT PRIMAIRE • IMMÉDIAT">POINT PRIMAIRE • IMMÉDIAT</option>
                  <option value="POINT SECONDAIRE • HORS COMMUNE">POINT SECONDAIRE • HORS COMMUNE</option>
                  <option value="POINT DE REPLI • VÉHICULE">POINT DE REPLI • VÉHICULE</option>
                </select>
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Nom du lieu :
                </label>
                <input
                  type="text"
                  value={pointName}
                  onChange={(e) => setPointName(e.target.value)}
                  placeholder="Ex : Kiosque du Parc Pasteur, Parking Mairie..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Distance / Rayon indicatif :
                </label>
                <input
                  type="text"
                  value={pointRadius}
                  onChange={(e) => setPointRadius(e.target.value)}
                  placeholder="Ex : Rayon: 300m, 2 km..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Consignes d'accès ou repère :
                </label>
                <textarea
                  value={pointDesc}
                  onChange={(e) => setPointDesc(e.target.value)}
                  placeholder="Ex : Angle nord près de la statue, attendre 30 min..."
                  rows={2}
                  className="w-full p-2.5 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAssemblyModal(false)}
                  className="h-10 px-3.5 rounded bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Contact Relais Hors Zone */}
      {showOutZoneModal && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#001126]/60 backdrop-blur-sm"
        >
          <div className="bg-white max-w-sm w-full rounded-xl p-5 shadow-2xl border border-[#c4c6ce] flex flex-col gap-3">
            <h3 className="text-[18px] font-bold text-[#001126]">Contact Relais Hors Zone</h3>
            <p className="text-[11px] text-[#44474d]">
              Proche habitant loin (&gt; 50-100 km) pour centraliser vos SMS si les réseaux locaux de votre agglomération tombent.
            </p>
            <form onSubmit={handleSaveOutZoneContact} className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Nom & Lien :
                </label>
                <input
                  type="text"
                  value={outName}
                  onChange={(e) => setOutName(e.target.value)}
                  placeholder="Ex : Marc D. (Oncle - Bretagne)"
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Téléphone :
                </label>
                <input
                  type="tel"
                  value={outPhone}
                  onChange={(e) => setOutPhone(e.target.value)}
                  placeholder="+33 6 00 00 00 00"
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div>
                <label className="text-[12px] font-['Space_Grotesk'] text-[#44474d] uppercase font-bold block mb-1">
                  Éloignement indicatif :
                </label>
                <input
                  type="text"
                  value={outDist}
                  onChange={(e) => setOutDist(e.target.value)}
                  placeholder="Ex : Dist. > 150 km, Région Bretagne..."
                  className="w-full h-11 px-3 border border-[#c4c6ce] rounded-lg text-[13px] text-[#001126] focus:outline-none focus:border-[#0036ce]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowOutZoneModal(false)}
                  className="h-10 px-3.5 rounded bg-[#eef4ff] text-[#001126] font-['Space_Grotesk'] text-[11px] font-bold uppercase"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="h-10 px-4 rounded bg-[#001126] text-white font-['Space_Grotesk'] text-[11px] font-bold uppercase shadow-sm"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal QR Code P2P */}
      <FamilyPlanQrModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        currentPlan={{
          tasks,
          members,
          outZoneContact,
          localContacts,
          assemblyPoints,
        }}
        onImportPlan={handleImportPlan}
      />

      {/* Modal Export PDF */}
      <ExportPdfModal
        isOpen={showExportPdfModal}
        onClose={() => setShowExportPdfModal(false)}
        initialGuideKey="plan"
        familyPlan={{
          tasks,
          members,
          outZoneContact,
          localContacts,
          assemblyPoints,
        }}
      />
    </div>
  );
};
