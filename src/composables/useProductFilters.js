import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { buildFilterQuery, parseFilterQuery } from '@/utils/filterQuery'

/**
 * Listing filters that live in the URL: shareable links, and Back restores the previous filters.
 * The URL is the single source of truth; there is no local copy to keep in sync.
 * @returns {{
 *   filters: import('vue').ComputedRef<import('@/utils/filterQuery').ListingFilters>,
 *   activeFilterCount: import('vue').ComputedRef<number>,
 *   update: (changes: Partial<import('@/utils/filterQuery').ListingFilters>) => Promise<void>,
 *   toggleBrand: (brand: string) => Promise<void>,
 *   clearAll: () => Promise<void>,
 * }}
 */
export function useProductFilters() {
  const route = useRoute()
  const router = useRouter()

  const filters = computed(() => parseFilterQuery(route.query))

  // Category and search come from navigation, sort is a view choice: none of them count as filters.
  const activeFilterCount = computed(() => {
    const { brands, minPrice, maxPrice, minRating, inStockOnly } = filters.value
    return brands.length + [minPrice, maxPrice, minRating, inStockOnly].filter(Boolean).length
  })

  /**
   * Applies changes. Any change except the page itself starts again from page 1.
   */
  async function update(changes) {
    const next = { ...filters.value, ...changes }
    if (!('page' in changes)) next.page = 1
    await router.push({ query: buildFilterQuery(next) })
  }

  function toggleBrand(brand) {
    const { brands } = filters.value
    return update({
      brands: brands.includes(brand) ? brands.filter((name) => name !== brand) : [...brands, brand],
    })
  }

  function clearAll() {
    return update({
      brands: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStockOnly: false,
    })
  }

  return { filters, activeFilterCount, update, toggleBrand, clearAll }
}
