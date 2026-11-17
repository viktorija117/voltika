import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { getCatalog } from '@/services/productService'

import HomeView from '@/views/HomeView.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

const CATALOG = [
  makeProduct({ id: 1, name: 'Telefon', discountPercent: 12, rating: 4.2 }),
  makeProduct({ id: 2, name: 'Laptop', discountPercent: 19, rating: 3.1 }),
  makeProduct({ id: 3, name: 'Sat', discountPercent: 0, rating: 4.9 }),
]

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(getCatalog).mockReset()
  vi.mocked(getCatalog).mockResolvedValue(CATALOG)
})

afterEach(() => {
  vi.useRealTimers()
})

async function mountHome() {
  const { wrapper } = mountWithApp(HomeView)
  await flushPromises()
  return wrapper
}

const shelfNames = (wrapper, headingId) =>
  wrapper
    .get(`[aria-labelledby="${headingId}"]`)
    .findAll('h3')
    .map((heading) => heading.text())

describe('HomeView', () => {
  it('has one h1 for the page', async () => {
    const wrapper = await mountHome()

    expect(wrapper.findAll('h1')).toHaveLength(1)
  })

  it('shows the products on sale, biggest discount first', async () => {
    const wrapper = await mountHome()

    expect(shelfNames(wrapper, 'home-deals')).toEqual(['Laptop', 'Telefon'])
    expect(wrapper.get('#akcije-nedelje').exists()).toBe(true)
  })

  it('shows the best rated products', async () => {
    const wrapper = await mountHome()

    expect(shelfNames(wrapper, 'home-top-rated')).toEqual(['Sat', 'Telefon', 'Laptop'])
  })

  it('puts the biggest real discount on the hero sticker', async () => {
    const wrapper = await mountHome()

    expect(wrapper.text()).toContain('do −19%')
  })

  it('links every category to the product list', async () => {
    const wrapper = await mountHome()

    expect(wrapper.find('a[href="/proizvodi?kategorija=laptops"]').exists()).toBe(true)
    expect(wrapper.find('a[href="/proizvodi?sort=discount"]').text()).toContain('Sve akcije')
  })

  it('offers a retry when the products fail to load', async () => {
    vi.mocked(getCatalog).mockRejectedValueOnce(new Error('offline'))
    const wrapper = await mountHome()

    const alerts = wrapper.findAll('[role="alert"]')
    expect(alerts).toHaveLength(2)

    await alerts[0].get('button').trigger('click')
    await flushPromises()

    expect(shelfNames(wrapper, 'home-deals')).toEqual(['Laptop', 'Telefon'])
  })
})
