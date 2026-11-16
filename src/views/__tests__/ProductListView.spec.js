import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { getCatalog } from '@/services/productService'

import ProductListView from '@/views/ProductListView.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

const PRODUCTS = [
  makeProduct({ id: 1, name: 'iPhone 9', category: 'smartphones' }),
  makeProduct({ id: 2, name: 'MacBook Pro', category: 'laptops' }),
]

async function mountList(path = '/proizvodi') {
  const { wrapper, router } = mountWithApp(ProductListView)
  await router.push(path)
  await flushPromises()
  return wrapper
}

beforeEach(() => {
  vi.mocked(getCatalog).mockReset()
})

describe('ProductListView', () => {
  it('shows skeleton cards while loading', async () => {
    vi.mocked(getCatalog).mockReturnValue(new Promise(() => {}))
    const wrapper = await mountList()

    expect(wrapper.get('[aria-busy="true"]').exists()).toBe(true)
    expect(wrapper.get('[role="status"]').text()).toBe('Učitavanje proizvoda…')
  })

  it('lists every product with a count', async () => {
    vi.mocked(getCatalog).mockResolvedValue(PRODUCTS)
    const wrapper = await mountList()

    expect(wrapper.findAll('article')).toHaveLength(2)
    expect(wrapper.text()).toContain('2 proizvoda')
  })

  it('filters by the category in the URL and uses it as the title', async () => {
    vi.mocked(getCatalog).mockResolvedValue(PRODUCTS)
    const wrapper = await mountList('/proizvodi?kategorija=laptops')

    expect(wrapper.get('h1').text()).toBe('Laptopovi')
    expect(wrapper.findAll('article')).toHaveLength(1)
  })

  it('explains when a search finds nothing', async () => {
    vi.mocked(getCatalog).mockResolvedValue(PRODUCTS)
    const wrapper = await mountList('/proizvodi?pretraga=frizider')

    expect(wrapper.get('h1').text()).toBe('Rezultati za „frizider“')
    expect(wrapper.text()).toContain('Nema proizvoda')
    expect(wrapper.get('a[href="/proizvodi"]').text()).toBe('Pogledaj sve proizvode')
  })

  it('shows an error with a working retry button', async () => {
    vi.mocked(getCatalog).mockRejectedValueOnce(new Error('offline'))
    vi.mocked(getCatalog).mockResolvedValueOnce(PRODUCTS)
    const wrapper = await mountList()

    expect(wrapper.get('[role="alert"]').text()).toContain('Proizvodi se nisu učitali')

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.findAll('article')).toHaveLength(2)
  })
})
