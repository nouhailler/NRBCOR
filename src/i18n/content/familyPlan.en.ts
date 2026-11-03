import { FamilyMember, AssemblyPoint, ContactPerson } from '../../types';
import { PlanTask } from '../../data/familyPlanData';

export const INITIAL_MEMBERS_EN: FamilyMember[] = [
  {
    id: 'm1',
    role: 'Young child (7 years old)',
    details: 'Elementary school under Safe Haven Plan (PPMS). Non-negotiable: do not travel to pick up child during alert; supervised by teaching staff.',
    icon: 'school'
  },
  {
    id: 'm2',
    role: 'Person with reduced mobility',
    details: 'Requires physical assistance for stair descent. Folding emergency transport chair positioned in the entrance airlock.',
    icon: 'accessible'
  },
  {
    id: 'm3',
    role: 'Domestic pets',
    details: '1 cat (air-permeable secure travel crate ready + 72h sealed kibble ration and bottled water).',
    icon: 'pets'
  }
];

export const INITIAL_ASSEMBLY_POINTS_EN: AssemblyPoint[] = [
  {
    type: 'PRIMARY POINT • IMMEDIATE',
    radius: 'Radius: 400m',
    name: 'Cedar Park - North Alley (Gazebo landmark)',
    desc: 'For immediate building evacuations (fire, domestic gas leak, localized structural damage).',
    coords: '45.7602° N, 4.8357° E',
    color: 'bg-primary text-on-primary'
  },
  {
    type: 'SECONDARY POINT • OUTSIDE HAZARD ZONE',
    radius: 'Radius: 3.2km',
    name: 'Municipal Sports Gymnasium (Outside PPI perimeter)',
    desc: 'If the home sector is evacuated by authorities or located downwind under an active toxic plume.',
    coords: 'Sports Avenue • Follow civil evacuation signage',
    color: 'bg-secondary text-on-secondary'
  }
];

export const OUT_OF_ZONE_CONTACT_EN: ContactPerson = {
  id: 'c-out',
  name: 'Mark D. (Uncle - Out of Area / Brittany)',
  role: 'Central relay point for brief SMS messages from each family member if local cellular towers fail in the city.',
  phone: '+33 6 12 34 56 78',
  dist: 'Dist. > 100 km',
  icon: 'hub',
  isOutZone: true
};

export const LOCAL_CONTACTS_EN: ContactPerson[] = [
  {
    id: 'c1',
    name: 'Sophie M. (Building neighbor - 2nd floor)',
    role: 'Holds duplicate emergency apartment key & roof access key',
    phone: '+33 6 98 76 54 32',
    dist: '2nd Floor Landing',
    icon: 'vpn_key'
  },
  {
    id: 'c2',
    name: 'Benoit L. (Close relative)',
    role: 'North sector residence (Alternative evacuation fallback point)',
    phone: '+33 6 54 32 10 98',
    dist: 'North Sector',
    icon: 'person_pin_circle'
  }
];

export const INITIAL_PLAN_TASKS_EN: PlanTask[] = [
  {
    id: 't1',
    label: 'Share public FM radio frequencies and school safe haven (PPMS) rules with every parent',
    done: true
  },
  {
    id: 't2',
    label: 'Physically locate gas/water master shutoff valves and emergency HVAC switches',
    done: true
  },
  {
    id: 't3',
    label: 'Agree on the designated out-of-area emergency contact with all household members',
    done: true
  },
  {
    id: 't4',
    label: 'Verify duplicate paper copies of IDs and prescriptions sealed inside 72h go-bag',
    done: true
  },
  {
    id: 't5',
    label: 'Conduct timed 15-minute home sheltering and duct-tape sealing drill twice a year',
    done: false
  }
];
