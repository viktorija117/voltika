// Product listing and search rules.

/** Products per page on the listing page (4 rows of 3 on desktop, 6 rows of 2 on mobile). */
export const PRODUCTS_PAGE_SIZE = 12

/** Delay before a search request is sent while the user is typing. */
export const SEARCH_DEBOUNCE_MS = 300

/** Delay before a typed price filter is applied, so the list does not jump on every digit. */
export const PRICE_FILTER_DEBOUNCE_MS = 500

/** Shortest query that triggers search suggestions. */
export const SEARCH_MIN_QUERY_LENGTH = 2

/** At or below this stock a product shows "Poslednji komadi" (last items). */
export const LOW_STOCK_THRESHOLD = 5

/** Brands shown before "Prikaži još" in the brand filter. */
export const VISIBLE_BRAND_COUNT = 6

/** Minimum ratings offered in the rating filter ("4 i više", "3 i više"). */
export const RATING_FILTER_OPTIONS = [4, 3]

/** Sort orders on the listing page; the first one is the default. */
export const SORT_OPTIONS = ['popular', 'priceAsc', 'priceDesc', 'discount']

/** URL query keys on the listing page, so links and filters share one name. */
export const QUERY_KEYS = {
  search: 'pretraga',
  category: 'kategorija',
  brands: 'brend',
  minPrice: 'cenaOd',
  maxPrice: 'cenaDo',
  minRating: 'ocena',
  inStockOnly: 'naStanju',
  sort: 'sort',
  page: 'strana',
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
