import { FamilyMember, AssemblyPoint, ContactPerson } from '../types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  {
    id: 'm1',
    role: 'Enfant en bas âge (7 ans)',
    details: "École élémentaire Saint-Exupéry sous PPMS (ne pas aller chercher l'enfant en alerte, prise en charge par l'équipe pédagogique).",
    icon: 'school'
  },
  {
    id: 'm2',
    role: 'Personne à mobilité réduite',
    details: "Nécessite assistance au déplacement d'escalier. Fauteuil de transport pliant stocké dans le sas d'entrée.",
    icon: 'accessible'
  },
  {
    id: 'm3',
    role: 'Animaux de compagnie',
    details: '1 chat (caisse de transport hermétique prête + réserve croquettes et eau scellée 72h).',
    icon: 'pets'
  }
];

export const INITIAL_ASSEMBLY_POINTS: AssemblyPoint[] = [
  {
    type: 'POINT PRIMAIRE • IMMÉDIAT',
    radius: 'Rayon: 400m',
    name: 'Parc des Cèdres - Allée Nord (repère kiosque)',
    desc: "À utiliser en cas d'évacuation d'immeuble localisée (incendie, fuite de gaz domestique, dommage structurel).",
    coords: '45.7602° N, 4.8357° E',
    color: 'bg-primary text-on-primary'
  },
  {
    type: 'POINT SECONDAIRE • HORS ZONE RISQUE',
    radius: 'Rayon: 3.2km',
    name: 'Gymnase Municipal Jean Jaurès (Zone hors périmètre PPI)',
    desc: 'Si le secteur du domicile est évacué par les autorités ou sous le panache de vent toxique identifié.',
    coords: 'Avenue des Sports • Suivre balisage civil',
    color: 'bg-secondary text-on-secondary'
  }
];

export const OUT_OF_ZONE_CONTACT: ContactPerson = {
  id: 'c-out',
  name: 'Marc D. (Oncle - Région Bretagne)',
  role: 'Centralise les SMS brefs de chaque membre du foyer si les antennes mobiles locales de la métropole sont indisponibles.',
  phone: '+33 6 12 34 56 78',
  dist: 'Dist. > 100 km',
  icon: 'hub',
  isOutZone: true
};

export const LOCAL_CONTACTS: ContactPerson[] = [
  {
    id: 'c1',
    name: "Sophie M. (Voisine d'immeuble - 2e étage)",
    role: "Détentrice d'un double de clé de secours & accès toiture",
    phone: '+33 6 98 76 54 32',
    dist: 'Palier 2e',
    icon: 'vpn_key'
  },
  {
    id: 'c2',
    name: 'Benoît L. (Proche famille)',
    role: 'Résidence secteur Nord (Point repli alternatif)',
    phone: '+33 6 54 32 10 98',
    dist: 'Secteur Nord',
    icon: 'person_pin_circle'
  }
];

export interface PlanTask {
  id: string;
  label: string;
  done: boolean;
}

export const INITIAL_PLAN_TASKS: PlanTask[] = [
  {
    id: 't1',
    label: 'Partager les fréquences France Bleu et les consignes PPMS école avec chaque parent',
    done: true
  },
  {
    id: 't2',
    label: 'Repérer physiquement les vannes de coupure générale de gaz et le commutateur VMC',
    done: true
  },
  {
    id: 't3',
    label: "Définir le contact relais extérieur avec l'ensemble des proches du foyer",
    done: true
  },
  {
    id: 't4',
    label: "Vérifier la double copie papier des pièces d'identité scellées dans le sac d'évacuation 72h",
    done: true
  },
  {
    id: 't5',
    label: "Exercice annuel d'évacuation et de coupure des aérations (simulation en conditions réelles)",
    done: false
  }
];
