import { computed } from 'vue'

import { PRODUCTS_PAGE_SIZE } from '@/config/catalog'
import { paginate } from '@/utils/pagination'
import { countBrands, filterProducts, sortProducts } from '@/utils/productFilters'

/**
 * Derives everything the listing page shows from the catalog and the current filters.
 * All values are computed, so they update on their own when the URL changes.
 * @param {import('vue').Ref<import('@/services/productMapper').Product[]>} products
 * @param {import('vue').Ref<import('@/utils/filterQuery').ListingFilters>} filters
 */
export function useProductListing(products, filters) {
  // Category and search define the "shelf"; the sidebar filters narrow it down.
  const shelf = computed(() =>
    filterProducts(products.value, {
      category: filters.value.category,
      search: filters.value.search,
    }),
  )

  // Brand counts come from the whole shelf, so picking one brand does not hide the others.
  const brandOptions = computed(() => countBrands(shelf.value))

  const results = computed(() =>
    sortProducts(filterProducts(shelf.value, filters.value), filters.value.sort),
  )

  const currentPage = computed(() =>
    paginate(results.value, filters.value.page, PRODUCTS_PAGE_SIZE),
  )

  return { brandOptions, results, currentPage }
}
