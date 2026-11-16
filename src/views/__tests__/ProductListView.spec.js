import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { PRODUCTS_PAGE_SIZE } from '@/config/catalog'
import { getCatalog } from '@/services/productService'

import ProductListView from '@/views/ProductListView.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

const PRODUCTS = [
  makeProduct({ id: 1, name: 'iPhone 9', brand: 'Apple', category: 'smartphones' }),
  makeProduct({ id: 2, name: 'MacBook Pro', brand: 'Apple', category: 'laptops' }),
  makeProduct({ id: 3, name: 'Beats Solo', brand: 'Beats', category: 'mobile-accessories' }),
]

async function mountList(path = '/proizvodi', products = PRODUCTS) {
  vi.mocked(getCatalog).mockResolvedValue(products)
  const { wrapper, router } = mountWithApp(ProductListView, { attachTo: document.body })
  await router.push(path)
  await flushPromises()
  return { wrapper, router }
}

const cardNames = (wrapper) => wrapper.findAll('article h3').map((heading) => heading.text())

beforeEach(() => {
  vi.mocked(getCatalog).mockReset()
  document.body.innerHTML = ''
})

describe('ProductListView', () => {
  it('shows skeleton cards while loading', async () => {
    vi.mocked(getCatalog).mockReturnValue(new Promise(() => {}))
    const { wrapper, router } = mountWithApp(ProductListView)
    await router.push('/proizvodi')

    expect(wrapper.find('[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toBe('Učitavanje proizvoda…')
  })

  it('lists the products with a count', async () => {
    const { wrapper } = await mountList()

    expect(wrapper.findAll('article')).toHaveLength(3)
    expect(wrapper.get('header').text()).toContain('3 proizvoda')
  })

  it('filters by the category in the URL and uses it as the title', async () => {
    const { wrapper } = await mountList('/proizvodi?kategorija=laptops')

    expect(wrapper.get('h1').text()).toBe('Laptopovi')
    expect(cardNames(wrapper)).toEqual(['MacBook Pro'])
  })

  it('applies a brand from the URL and shows it as a removable chip', async () => {
    const { wrapper, router } = await mountList('/proizvodi?brend=Beats')

    expect(cardNames(wrapper)).toEqual(['Beats Solo'])

    await wrapper.get('button[aria-label="Ukloni filter: Beats"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({})
    expect(wrapper.findAll('article')).toHaveLength(3)
  })

  it('updates the URL when a brand checkbox is ticked', async () => {
    const { wrapper, router } = await mountList()

    const appleCheckbox = wrapper
      .findAll('aside label')
      .find((label) => label.text().startsWith('Apple'))
      .get('input')
    await appleCheckbox.trigger('change')
    await flushPromises()

    expect(router.currentRoute.value.query).toEqual({ brend: 'Apple' })
    expect(cardNames(wrapper)).toHaveLength(2)
  })

  it('sorts from the select', async () => {
    const products = [
      makeProduct({ id: 1, name: 'Skup', price: 90000 }),
      makeProduct({ id: 2, name: 'Jeftin', price: 1000 }),
    ]
    const { wrapper } = await mountList('/proizvodi', products)

    await wrapper.get('#product-sort').setValue('priceAsc')
    await flushPromises()

    expect(cardNames(wrapper)).toEqual(['Jeftin', 'Skup'])
  })

  it('splits long lists into pages with real links', async () => {
    const products = Array.from({ length: PRODUCTS_PAGE_SIZE + 2 }, (_, index) =>
      makeProduct({ id: index + 1, name: `Proizvod ${index + 1}`, rating: 5 }),
    )
    const { wrapper } = await mountList('/proizvodi?strana=2', products)

    expect(wrapper.findAll('article')).toHaveLength(2)
    expect(wrapper.get('[aria-current="page"]').text()).toBe('2')
    expect(wrapper.get('a[aria-label="Prethodna strana"]').attributes('href')).toBe('/proizvodi')
  })

  it('explains when nothing matches', async () => {
    const { wrapper } = await mountList('/proizvodi?pretraga=frizider')

    expect(wrapper.get('h1').text()).toBe('Rezultati za „frizider“')
    expect(wrapper.text()).toContain('Nema proizvoda')
  })

  it('shows an error with a working retry button', async () => {
    vi.mocked(getCatalog).mockRejectedValueOnce(new Error('offline'))
    vi.mocked(getCatalog).mockResolvedValueOnce(PRODUCTS)
    const { wrapper, router } = mountWithApp(ProductListView)
    await router.push('/proizvodi')
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Proizvodi se nisu učitali')

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('article')).toHaveLength(3)
  })
})
