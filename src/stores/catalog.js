import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'

import { getCatalog } from '@/services/productService'

/** @typedef {'idle' | 'loading' | 'success' | 'error'} LoadStatus */

/**
 * All shop products, loaded once and shared by every page.
 * The list is replaced, never mutated, so a shallowRef is enough and avoids deep reactivity.
 */
export const useCatalogStore = defineStore('catalog', () => {
  const products = shallowRef([])
  /** @type {import('vue').Ref<LoadStatus>} */
  const status = ref('idle')
  let pendingLoad = null

  const isLoading = computed(() => status.value === 'loading')
  const hasError = computed(() => status.value === 'error')

  async function fetchCatalog() {
    status.value = 'loading'
    try {
      products.value = await getCatalog()
      status.value = 'success'
    } catch {
      status.value = 'error'
    } finally {
      pendingLoad = null
    }
  }

  /** Loads the catalog unless it is already loaded or loading. Safe to call from every page. */
  function load() {
    if (status.value === 'success') return Promise.resolve()
    pendingLoad ??= fetchCatalog()
    return pendingLoad
  }

  /** Loads again after an error ("Pokušaj ponovo"). */
  function retry() {
    status.value = 'idle'
    return load()
  }

  return { products, status, isLoading, hasError, load, retry }
})
