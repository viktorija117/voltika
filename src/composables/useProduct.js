import { onUnmounted, ref, shallowRef, watch } from 'vue'

import { isAbortError } from '@/services/apiClient'
import { getProduct } from '@/services/productService'

const NOT_FOUND = 404

/** @typedef {'loading' | 'success' | 'notFound' | 'error'} ProductStatus */

/**
 * Loads the product for the current id. When the id changes before the previous request
 * finishes (fast clicks between products), the old request is aborted, so a slow old
 * response can never replace the new product.
 * @param {import('vue').Ref<string>} id
 * @returns {{
 *   product: import('vue').ShallowRef<import('@/services/productMapper').ProductDetails | null>,
 *   status: import('vue').Ref<ProductStatus>,
 *   retry: () => Promise<void>,
 * }}
 */
export function useProduct(id) {
  const product = shallowRef(null)
  /** @type {import('vue').Ref<ProductStatus>} */
  const status = ref('loading')
  let controller = null

  async function load() {
    controller?.abort()
    controller = new AbortController()
    const { signal } = controller
    status.value = 'loading'
    try {
      const loaded = await getProduct(id.value, { signal })
      // Guards against a response that arrived just as the request was aborted.
      if (signal.aborted) return
      product.value = loaded
      status.value = 'success'
    } catch (error) {
      if (isAbortError(error)) return
      status.value = error.status === NOT_FOUND ? 'notFound' : 'error'
    }
  }

  watch(id, load, { immediate: true })
  onUnmounted(() => controller?.abort())

  return { product, status, retry: load }
}
