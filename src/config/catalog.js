// Product listing and search rules.

/** Products per page on the listing page. */
export const PRODUCTS_PAGE_SIZE = 24

/** Delay before a search request is sent while the user is typing. */
export const SEARCH_DEBOUNCE_MS = 300

/** Shortest query that triggers search suggestions. */
export const SEARCH_MIN_QUERY_LENGTH = 2

/** URL query keys on the listing page, so links and filters share one name. */
export const QUERY_KEYS = {
  search: 'pretraga',
  category: 'kategorija',
}

/**
 * Categories shown in the main navigation. `slug` is the DummyJSON category,
 * `labelKey` the translation key. DummyJSON has no TV, audio or gaming categories.
 */
export const NAV_CATEGORIES = [
  { slug: 'smartphones', labelKey: 'categories.smartphones' },
  { slug: 'laptops', labelKey: 'categories.laptops' },
  { slug: 'tablets', labelKey: 'categories.tablets' },
  { slug: 'mobile-accessories', labelKey: 'categories.accessories' },
  { slug: 'mens-watches', labelKey: 'categories.watches' },
]
