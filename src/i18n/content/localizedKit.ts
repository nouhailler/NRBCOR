import { KIT_CATEGORIES, INITIAL_KIT_ITEMS, KitCategory } from '../../data/kitData';
import { KIT_CATEGORIES_EN, INITIAL_KIT_ITEMS_EN } from './kit.en';
import { KitItem } from '../../types';
import { Language } from '../types';

/**
 * Returns localized kit categories according to active language
 */
export function getLocalizedKitCategories(lang: Language): KitCategory[] {
  if (lang === 'en') {
    return KIT_CATEGORIES_EN;
  }
  return KIT_CATEGORIES;
}

/**
 * Localizes an array of KitItems (preserving persistent state such as completed, expiry, etc.)
 */
export function getLocalizedKitItems(items: KitItem[], lang: Language): KitItem[] {
  if (lang !== 'en') {
    return items;
  }

  const enMap = new Map<string, KitItem>();
  INITIAL_KIT_ITEMS_EN.forEach((it) => enMap.set(it.id, it));

  return items.map((item) => {
    const enItem = enMap.get(item.id);
    if (!enItem) return item;

    return {
      ...item,
      title: enItem.title,
      subtitle: enItem.subtitle,
      tag: enItem.tag,
      // preserve user completion & runtime modifications
      completed: item.completed,
      isEssential: item.isEssential ?? enItem.isEssential,
      category: item.category
    };
  });
}
