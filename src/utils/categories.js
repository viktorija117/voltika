import { NAV_CATEGORIES } from '@/config/catalog'

/**
 * Translation key of a shop category's name.
 * @param {string} slug DummyJSON category, e.g. "mobile-accessories".
 * @returns {string | null} Null for categories the shop does not show.
 */
export function categoryLabelKey(slug) {
  return NAV_CATEGORIES.find((category) => category.slug === slug)?.labelKey ?? null
}
