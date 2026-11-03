import {
  INITIAL_MEMBERS,
  INITIAL_ASSEMBLY_POINTS,
  OUT_OF_ZONE_CONTACT,
  LOCAL_CONTACTS,
  INITIAL_PLAN_TASKS,
  PlanTask
} from '../../data/familyPlanData';
import {
  INITIAL_MEMBERS_EN,
  INITIAL_ASSEMBLY_POINTS_EN,
  OUT_OF_ZONE_CONTACT_EN,
  LOCAL_CONTACTS_EN,
  INITIAL_PLAN_TASKS_EN
} from './familyPlan.en';
import { FamilyMember, AssemblyPoint, ContactPerson } from '../../types';
import { Language } from '../types';

export interface LocalizedFamilyPlanData {
  members: FamilyMember[];
  assemblyPoints: AssemblyPoint[];
  outOfZoneContact: ContactPerson;
  localContacts: ContactPerson[];
  tasks: PlanTask[];
}

export function getLocalizedFamilyPlan(lang: Language): LocalizedFamilyPlanData {
  if (lang === 'en') {
    return {
      members: INITIAL_MEMBERS_EN,
      assemblyPoints: INITIAL_ASSEMBLY_POINTS_EN,
      outOfZoneContact: OUT_OF_ZONE_CONTACT_EN,
      localContacts: LOCAL_CONTACTS_EN,
      tasks: INITIAL_PLAN_TASKS_EN
    };
  }

  return {
    members: INITIAL_MEMBERS,
    assemblyPoints: INITIAL_ASSEMBLY_POINTS,
    outOfZoneContact: OUT_OF_ZONE_CONTACT,
    localContacts: LOCAL_CONTACTS,
    tasks: INITIAL_PLAN_TASKS
  };
}

export function getLocalizedPlanTasks(tasks: PlanTask[], lang: Language): PlanTask[] {
  if (lang !== 'en') return tasks;

  const enMap = new Map<string, PlanTask>();
  INITIAL_PLAN_TASKS_EN.forEach((t) => enMap.set(t.id, t));

  return tasks.map((t) => {
    const enTask = enMap.get(t.id);
    if (!enTask) return t;
    return {
      ...t,
      label: enTask.label,
      done: t.done
    };
  });
}
