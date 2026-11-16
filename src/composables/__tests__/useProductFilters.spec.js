import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import { mountWithApp } from '@/__tests__/helpers'
import { useProductFilters } from '@/composables/useProductFilters'

// Tiny host component, because composables that use the router need a component context.
async function setup(path) {
  let api
  const Host = defineComponent({
    setup() {
      api = useProductFilters()
      return () => h('div')
    },
  })
  const { router } = mountWithApp(Host)
  await router.push(path)
  return { api, router }
}

describe('useProductFilters', () => {
  it('reads the filters from the URL', async () => {
    const { api } = await setup('/proizvodi?kategorija=laptops&brend=Apple&naStanju=1')

    expect(api.filters.value).toMatchObject({
      category: 'laptops',
      brands: ['Apple'],
      inStockOnly: true,
    })
    expect(api.activeFilterCount.value).toBe(2)
  })

  it('writes a change to the URL and goes back to page 1', async () => {
    const { api, router } = await setup('/proizvodi?kategorija=laptops&strana=3')

    await api.update({ maxPrice: 50000 })

    expect(router.currentRoute.value.query).toEqual({ kategorija: 'laptops', cenaDo: '50000' })
  })

  it('keeps the filters when only the page changes', async () => {
    const { api, router } = await setup('/proizvodi?brend=Apple')

    await api.update({ page: 2 })

    expect(router.currentRoute.value.query).toEqual({ brend: 'Apple', strana: '2' })
  })

  it('adds and removes a brand', async () => {
    const { api, router } = await setup('/proizvodi?brend=Apple')

    await api.toggleBrand('Beats')
    expect(router.currentRoute.value.query.brend).toBe('Apple,Beats')

    await api.toggleBrand('Apple')
    expect(router.currentRoute.value.query.brend).toBe('Beats')
  })

  it('clears the filters but keeps the category, search and sort', async () => {
    const { api, router } = await setup(
      '/proizvodi?kategorija=laptops&pretraga=pro&sort=priceAsc&brend=Apple&ocena=4',
    )

    await api.clearAll()

    expect(router.currentRoute.value.query).toEqual({
      kategorija: 'laptops',
      pretraga: 'pro',
      sort: 'priceAsc',
    })
  })
})
