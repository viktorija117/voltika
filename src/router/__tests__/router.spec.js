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
  it('restores the saved position on back and forward', () => {
    expect(scrollBehavior({ hash: '' }, {}, { left: 0, top: 480 })).toEqual({ left: 0, top: 480 })
  })

  it('scrolls to an anchor', () => {
    expect(scrollBehavior({ hash: '#specs' }, {}, null)).toEqual({ el: '#specs' })
  })

  it('starts a new page at the top', () => {
    expect(scrollBehavior({ hash: '' }, {}, null)).toEqual({ top: 0 })
  })
})
