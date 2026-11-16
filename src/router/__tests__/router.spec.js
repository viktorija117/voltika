import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import { routes, scrollBehavior } from '@/router'

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
