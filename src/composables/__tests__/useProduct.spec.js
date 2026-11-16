import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'

import { useProduct } from '@/composables/useProduct'
import { ApiError } from '@/services/apiClient'
import { getProduct } from '@/services/productService'

vi.mock('@/services/productService', () => ({ getProduct: vi.fn() }))

// Composables with lifecycle hooks need a component around them.
function mountUseProduct(initialId) {
  const id = ref(initialId)
  let result
  const Host = defineComponent({
    setup() {
      result = useProduct(id)
      return () => null
    },
  })
  const wrapper = mount(Host)
  return { id, result, wrapper }
}

// A request that stays pending until the test resolves it, and rejects when aborted.
function deferredRequest() {
  let resolve
  const promise = new Promise((resolvePromise) => (resolve = resolvePromise))
  return { promise, resolve }
}

beforeEach(() => {
  vi.mocked(getProduct).mockReset()
})

describe('useProduct', () => {
  it('loads the product for the id', async () => {
    vi.mocked(getProduct).mockResolvedValue({ id: 1, name: 'Telefon' })
    const { result } = mountUseProduct('1')

    expect(result.status.value).toBe('loading')
    await flushPromises()

    expect(getProduct).toHaveBeenCalledWith('1', { signal: expect.any(AbortSignal) })
    expect(result.status.value).toBe('success')
    expect(result.product.value.name).toBe('Telefon')
  })

  it('reports a missing product as notFound', async () => {
    vi.mocked(getProduct).mockRejectedValue(new ApiError('Not found', 404))
    const { result } = mountUseProduct('999')
    await flushPromises()

    expect(result.status.value).toBe('notFound')
  })

  it('reports other failures as error and loads again on retry', async () => {
    vi.mocked(getProduct).mockRejectedValueOnce(new ApiError('Server error', 500))
    vi.mocked(getProduct).mockResolvedValueOnce({ id: 1, name: 'Telefon' })
    const { result } = mountUseProduct('1')
    await flushPromises()
    expect(result.status.value).toBe('error')

    await result.retry()

    expect(result.status.value).toBe('success')
  })

  it('aborts the old request when the id changes, so it cannot overwrite the new product', async () => {
    const slowOld = deferredRequest()
    const signals = []
    vi.mocked(getProduct).mockImplementation((id, { signal }) => {
      signals.push(signal)
      return id === '1' ? slowOld.promise : Promise.resolve({ id: 2, name: 'Novi' })
    })
    const { id, result } = mountUseProduct('1')

    id.value = '2'
    await flushPromises()
    slowOld.resolve({ id: 1, name: 'Stari' })
    await flushPromises()

    expect(signals[0].aborted).toBe(true)
    expect(result.product.value.name).toBe('Novi')
  })

  it('aborts the request when the page is left', () => {
    let signal
    vi.mocked(getProduct).mockImplementation((_, options) => {
      signal = options.signal
      return deferredRequest().promise
    })
    const { wrapper } = mountUseProduct('1')

    wrapper.unmount()

    expect(signal.aborted).toBe(true)
  })
})
