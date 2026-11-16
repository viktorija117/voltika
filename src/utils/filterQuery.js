import { QUERY_KEYS, RATING_FILTER_OPTIONS, SORT_OPTIONS } from '@/config/catalog'

/**
 * @typedef {object} ListingFilters
 * @property {string} category
 * @property {string} search
 * @property {string[]} brands
 * @property {number | null} minPrice RSD
 * @property {number | null} maxPrice RSD
 * @property {number | null} minRating
 * @property {boolean} inStockOnly
 * @property {string} sort One of SORT_OPTIONS.
 * @property {number} page 1-based.
 */

export const DEFAULT_SORT = SORT_OPTIONS[0]

/** @type {ListingFilters} */
export const EMPTY_FILTERS = Object.freeze({
  category: '',
  search: '',
  brands: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  inStockOnly: false,
  sort: DEFAULT_SORT,
  page: 1,
})

// Query values can be arrays (?a=1&a=2); the first one wins.
function firstValue(value) {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '')
}

function toPositiveInteger(value) {
  const number = Number.parseInt(firstValue(value), 10)
  return Number.isInteger(number) && number > 0 ? number : null
}

/**
 * Reads the filters from a route query. Invalid or unknown values are ignored,
 * so a hand-edited URL can never break the page.
 * @param {Record<string, string | string[]>} query
 * @returns {ListingFilters}
 */
export function parseFilterQuery(query) {
  const rating = toPositiveInteger(query[QUERY_KEYS.minRating])
  const sort = String(firstValue(query[QUERY_KEYS.sort]))
  return {
    category: String(firstValue(query[QUERY_KEYS.category])),
    search: String(firstValue(query[QUERY_KEYS.search])),
    brands: String(firstValue(query[QUERY_KEYS.brands])).split(',').filter(Boolean),
    minPrice: toPositiveInteger(query[QUERY_KEYS.minPrice]),
    maxPrice: toPositiveInteger(query[QUERY_KEYS.maxPrice]),
    minRating: RATING_FILTER_OPTIONS.includes(rating) ? rating : null,
    inStockOnly: firstValue(query[QUERY_KEYS.inStockOnly]) === '1',
    sort: SORT_OPTIONS.includes(sort) ? sort : DEFAULT_SORT,
    page: toPositiveInteger(query[QUERY_KEYS.page]) ?? 1,
  }
}

/**
 * Writes filters to a route query, leaving out defaults so URLs stay short and shareable.
 * @param {ListingFilters} filters
 * @returns {Record<string, string>}
 */
export function buildFilterQuery(filters) {
  const query = {}
  if (filters.category) query[QUERY_KEYS.category] = filters.category
  if (filters.search) query[QUERY_KEYS.search] = filters.search
  if (filters.brands.length) query[QUERY_KEYS.brands] = filters.brands.join(',')
  if (filters.minPrice) query[QUERY_KEYS.minPrice] = String(filters.minPrice)
  if (filters.maxPrice) query[QUERY_KEYS.maxPrice] = String(filters.maxPrice)
  if (filters.minRating) query[QUERY_KEYS.minRating] = String(filters.minRating)
  if (filters.inStockOnly) query[QUERY_KEYS.inStockOnly] = '1'
  if (filters.sort !== DEFAULT_SORT) query[QUERY_KEYS.sort] = filters.sort
  if (filters.page > 1) query[QUERY_KEYS.page] = String(filters.page)
  return query
}
