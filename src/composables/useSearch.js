import { computed, onUnmounted, ref } from 'vue'

import {
  SEARCH_DEBOUNCE_MS,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_SUGGESTION_LIMIT,
} from '@/config/catalog'
import { debounce } from '@/utils/debounce'
import { filterProducts } from '@/utils/productFilters'

/**
 * Search-as-you-type over the loaded catalog. The input value updates on every key,
 * but suggestions only follow after a short pause, so the list does not flicker.
 * @param {import('vue').Ref<import('@/services/productMapper').Product[]>} products
 * @returns {{
 *   query: import('vue').Ref<string>,
 *   activeTerm: import('vue').Ref<string>,
 *   suggestions: import('vue').ComputedRef<import('@/services/productMapper').Product[]>,
 *   hasActiveTerm: import('vue').ComputedRef<boolean>,
 *   setQuery: (value: string) => void,
 *   reset: () => void,
 * }}
 */
export function useSearch(products) {
  const query = ref('')
  const activeTerm = ref('')

  const applyTerm = debounce((value) => {
    activeTerm.value = value.trim()
  }, SEARCH_DEBOUNCE_MS)
  onUnmounted(applyTerm.cancel)

  const hasActiveTerm = computed(() => activeTerm.value.length >= SEARCH_MIN_QUERY_LENGTH)

  const suggestions = computed(() =>
    hasActiveTerm.value
      ? filterProducts(products.value, { search: activeTerm.value }).slice(
          0,
          SEARCH_SUGGESTION_LIMIT,
        )
      : [],
  )

  function setQuery(value) {
    query.value = value
    applyTerm(value)
  }

  function reset() {
    applyTerm.cancel()
    query.value = ''
    activeTerm.value = ''
  }

  return { query, activeTerm, suggestions, hasActiveTerm, setQuery, reset }
}
