import { afterEach, describe, expect, it, vi } from 'vitest'

import { NAV_CATEGORIES } from '@/config/catalog'
import { ApiError, isAbortError } from '@/services/apiClient'
import { getCatalog, getProduct } from '@/services/productService'

function jsonResponse(body, status = 200) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getCatalog', () => {
  it('loads every shop category in full and maps the products', async () => {
    const fetchMock = vi.fn(async (url) => {
      const slug = url.match(/category\/([^?]+)/)[1]
      return jsonResponse({ products: [{ id: slug.length, title: slug, price: 1 }] })
    })
    vi.stubGlobal('fetch', fetchMock)

    const products = await getCatalog()

    expect(fetchMock).toHaveBeenCalledTimes(NAV_CATEGORIES.length)
    for (const [url] of fetchMock.mock.calls) {
      expect(url).toContain('limit=0')
      expect(url).toContain('select=')
    }
    expect(products.map((product) => product.name)).toEqual(NAV_CATEGORIES.map(({ slug }) => slug))
  })

  it('passes the abort signal to every request', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ products: [] }))
    vi.stubGlobal('fetch', fetchMock)
    const controller = new AbortController()

    await getCatalog({ signal: controller.signal })

    for (const [, options] of fetchMock.mock.calls) expect(options.signal).toBe(controller.signal)
  })
})

describe('getProduct', () => {
  it('returns the mapped product', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ id: 7, title: 'Laptop', price: 10 })),
    )

    await expect(getProduct(7)).resolves.toMatchObject({ id: 7, name: 'Laptop' })
  })

  it('asks for the service info the product page shows', async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ id: 7, title: 'Laptop', price: 10 }))
    vi.stubGlobal('fetch', fetchMock)

    await getProduct(7)

    const url = fetchMock.mock.calls[0][0]
    expect(url).toContain('warrantyInformation')
    expect(url).toContain('shippingInformation')
    expect(url).toContain('returnPolicy')
  })

  it('throws an ApiError with status 404 for an unknown product', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => jsonResponse({ message: 'not found' }, 404)),
    )

    await expect(getProduct(999)).rejects.toMatchObject({ name: 'ApiError', status: 404 })
  })

  it('turns a network failure into an ApiError with status 0', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))),
    )

    const error = await getProduct(1).catch((caught) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(0)
  })

  it('lets a cancelled request through unchanged, so it is not shown as an error', async () => {
    const abort = new DOMException('The operation was aborted.', 'AbortError')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(abort)),
    )

    const error = await getProduct(1).catch((caught) => caught)

    expect(isAbortError(error)).toBe(true)
  })
})
