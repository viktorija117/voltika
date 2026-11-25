import { createPinia, setActivePinia } from 'pinia'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { makeProduct } from '@/__tests__/helpers'
import { preloadCatalog, routes, scrollBehavior } from '@/router'
import { getCatalog } from '@/services/productService'
import { useCartStore } from '@/stores/cart'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn(() => Promise.resolve([])) }))

const router = createRouter({ history: createMemoryHistory(), routes })

describe('routes', () => {
  it.each([
    ['home', {}, '/'],
    ['products', {}, '/proizvodi'],
    ['product', { id: '42' }, '/proizvod/42'],
    ['cart', {}, '/korpa'],
    ['checkout', {}, '/placanje'],
  ])('resolves "%s" to its URL', (name, params, path) => {
    expect(router.resolve({ name, params }).path).toBe(path)
  })

  it('sends unknown URLs to the not-found page', () => {
    expect(router.resolve('/ne-postoji').name).toBe('not-found')
  })

  it('lazy-loads every view', () => {
    for (const route of routes) expect(typeof route.component).toBe('function')
  })
})

describe('scrollBehavior', () => {
  const location = (path, query = {}, hash = '') => ({ path, query, hash })

  it('restores the saved position on back and forward', () => {
    const saved = { left: 0, top: 480 }
    expect(scrollBehavior(location('/korpa'), location('/'), saved)).toEqual(saved)
  })

  it('scrolls to an anchor', () => {
    expect(scrollBehavior(location('/', {}, '#specs'), location('/korpa'), null)).toEqual({
      el: '#specs',
    })
  })

  it('starts a new page at the top', () => {
    expect(scrollBehavior(location('/korpa'), location('/'), null)).toEqual({ top: 0 })
  })

  it('keeps the position when only a filter changes', () => {
    const from = location('/proizvodi')
    const to = location('/proizvodi', { brend: 'Apple' })
    expect(scrollBehavior(to, from, null)).toBe(false)
  })

  it('scrolls to the top when the result page changes', () => {
    const from = location('/proizvodi')
    const to = location('/proizvodi', { strana: '2' })
    expect(scrollBehavior(to, from, null)).toEqual({ top: 0 })
  })
})

describe('checkout guard', () => {
  async function visitCheckout({ withItems }) {
    setActivePinia(createPinia())
    if (withItems) useCartStore().add(makeProduct({ id: 1, stock: 5 }))
    const testRouter = createRouter({ history: createMemoryHistory(), routes })
    await testRouter.push('/placanje')
    return testRouter.currentRoute.value.name
  }

  it('sends an empty cart back to the cart page', async () => {
    expect(await visitCheckout({ withItems: false })).toBe('cart')
  })

  it('opens the checkout when the cart has items', async () => {
    expect(await visitCheckout({ withItems: true })).toBe('checkout')
  })
})

describe('preloadCatalog', () => {
  function visit(path) {
    setActivePinia(createPinia())
    getCatalog.mockClear()
    preloadCatalog(router.resolve(path))
  }

  it('starts loading the catalog for pages that show products', () => {
    visit('/proizvod/42')
    expect(getCatalog).toHaveBeenCalledOnce()
  })

  it('does not load the catalog for the not-found page', () => {
    visit('/ne-postoji')
    expect(getCatalog).not.toHaveBeenCalled()
  })
})
