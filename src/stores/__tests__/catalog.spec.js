import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct } from '@/__tests__/helpers'
import { getCatalog } from '@/services/productService'
import { useCatalogStore } from '@/stores/catalog'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

beforeEach(() => {
  setActivePinia(createPinia())
  vi.mocked(getCatalog).mockReset()
})

describe('catalog store', () => {
  it('loads the products and reports success', async () => {
    vi.mocked(getCatalog).mockResolvedValue([makeProduct()])
    const catalog = useCatalogStore()

    const loading = catalog.load()
    expect(catalog.isLoading).toBe(true)
    await loading

    expect(catalog.status).toBe('success')
    expect(catalog.products).toHaveLength(1)
  })

  it('sends only one request when several pages ask at once', async () => {
    vi.mocked(getCatalog).mockResolvedValue([])
    const catalog = useCatalogStore()

    await Promise.all([catalog.load(), catalog.load()])

    expect(getCatalog).toHaveBeenCalledTimes(1)
  })

  it('does not load again once loaded', async () => {
    vi.mocked(getCatalog).mockResolvedValue([])
    const catalog = useCatalogStore()

    await catalog.load()
    await catalog.load()

    expect(getCatalog).toHaveBeenCalledTimes(1)
  })

  it('reports an error and recovers with retry', async () => {
    vi.mocked(getCatalog).mockRejectedValueOnce(new Error('offline'))
    vi.mocked(getCatalog).mockResolvedValueOnce([makeProduct()])
    const catalog = useCatalogStore()

    await catalog.load()
    expect(catalog.hasError).toBe(true)

    await catalog.retry()
    expect(catalog.status).toBe('success')
    expect(catalog.products).toHaveLength(1)
  })
})
