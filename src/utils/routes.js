import { QUERY_KEYS } from '@/config/catalog'

/** Id of the "deals of the week" section on the home page. */
export const DEALS_SECTION_ID = 'akcije-nedelje'

/** Link to the deals section on the home page. */
export const DEALS_ROUTE = { name: 'home', hash: `#${DEALS_SECTION_ID}` }

/**
 * Builds the route to the product list, with optional filters in the query string.
 * @param {{ category?: string, search?: string }} [filters]
 * @returns {{ name: string, query: Record<string, string> }} Route location for RouterLink or router.push.
 */
export function productListRoute({ category, search } = {}) {
  const query = {}
  if (category) query[QUERY_KEYS.category] = category
  if (search) query[QUERY_KEYS.search] = search
  return { name: 'products', query }
}
