import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { ApiError } from '@/services/apiClient'
import { getCatalog, getProduct } from '@/services/productService'

import ProductView from '@/views/ProductView.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn(), getProduct: vi.fn() }))

const PRODUCT = {
  ...makeProduct({
    id: 1,
    name: 'Bežične slušalice',
    category: 'mobile-accessories',
    price: 24000,
    images: ['https://cdn.example/1.webp'],
  }),
  warranty: { kind: 'period', min: 1, max: 1, unit: 'year' },
  shipping: { kind: 'period', min: 2, max: 2, unit: 'day' },
  returnPolicy: { kind: 'period', min: 30, max: 30, unit: 'day' },
  reviews: [{ rating: 5, comment: 'Odlično!', author: 'Ana', date: '2025-04-30T09:41:02.053Z' }],
}

const CATALOG = [
  PRODUCT,
  makeProduct({ id: 2, name: 'Punjač', category: 'mobile-accessories' }),
  makeProduct({ id: 3, name: 'Laptop', category: 'laptops' }),
]

beforeEach(() => {
  vi.mocked(getProduct).mockReset()
  vi.mocked(getCatalog).mockResolvedValue(CATALOG)
})

async function mountProductPage(id = '1') {
  const { wrapper } = mountWithApp(ProductView, { props: { id } })
  await flushPromises()
  return wrapper
}

describe('ProductView', () => {
  it('shows the product with price, installments and service info', async () => {
    vi.mocked(getProduct).mockResolvedValue(PRODUCT)
    const wrapper = await mountProductPage()

    expect(wrapper.get('h1').text()).toBe('Bežične slušalice')
    expect(wrapper.text()).toContain('24.000')
    expect(wrapper.text()).toContain('ili 24 × 1.000')
    expect(wrapper.text()).toContain('Dostava2 dana')
  })

  it('shows breadcrumbs from home through the category to the product', async () => {
    vi.mocked(getProduct).mockResolvedValue(PRODUCT)
    const wrapper = await mountProductPage()

    const crumbs = wrapper.get('nav[aria-label="Putanja"]')
    expect(crumbs.findAll('li').map((item) => item.text())).toEqual([
      'Početna',
      'Oprema',
      'Bežične slušalice',
    ])
    expect(crumbs.get('span[aria-current="page"]').text()).toBe('Bežične slušalice')
  })

  it('shows similar products from the same category, without the product itself', async () => {
    vi.mocked(getProduct).mockResolvedValue(PRODUCT)
    const wrapper = await mountProductPage()

    const similar = wrapper.get('[aria-labelledby="similar-products-title"]')
    expect(similar.findAll('h3').map((heading) => heading.text())).toEqual(['Punjač'])
  })

  it('shows the reviews tab with the review count', async () => {
    vi.mocked(getProduct).mockResolvedValue(PRODUCT)
    const wrapper = await mountProductPage()

    const reviewsTab = wrapper.findAll('[role="tab"]')[2]
    expect(reviewsTab.text()).toBe('Recenzije (1)')
    expect(wrapper.text()).toContain('Odlično!')
  })

  it('sets the page title and adds Product and BreadcrumbList structured data', async () => {
    vi.mocked(getProduct).mockResolvedValue(PRODUCT)
    const wrapper = await mountProductPage()

    expect(document.title).toBe('Bežične slušalice – Voltika')
    const script = document.head.querySelector('script[type="application/ld+json"]')
    const [productData, breadcrumbData] = JSON.parse(script.textContent)
    expect(productData).toMatchObject({ '@type': 'Product', offers: { price: 24000 } })
    expect(breadcrumbData.itemListElement.map((item) => item.name)).toEqual([
      'Početna',
      'Oprema',
      'Bežične slušalice',
    ])

    wrapper.unmount()
    expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull()
  })

  it('asks for the product from the URL', async () => {
    vi.mocked(getProduct).mockResolvedValue(PRODUCT)
    await mountProductPage('7')

    expect(getProduct).toHaveBeenCalledTimes(1)
    expect(getProduct).toHaveBeenCalledWith('7', { signal: expect.any(AbortSignal) })
  })

  it('says so when the product does not exist', async () => {
    vi.mocked(getProduct).mockRejectedValue(new ApiError('Not found', 404))
    const wrapper = await mountProductPage('999')

    expect(wrapper.text()).toContain('Proizvod nije pronađen')
    expect(wrapper.find('h1').exists()).toBe(false)
  })

  it('shows an error with a retry button that loads the product again', async () => {
    vi.mocked(getProduct).mockRejectedValueOnce(new ApiError('Network', 0))
    vi.mocked(getProduct).mockResolvedValueOnce(PRODUCT)
    const wrapper = await mountProductPage()

    expect(wrapper.get('[role="alert"]').text()).toContain('Proizvod se nije učitao')

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Bežične slušalice')
  })

  it('loads the new product when the id in the URL changes', async () => {
    vi.mocked(getProduct).mockResolvedValueOnce(PRODUCT)
    vi.mocked(getProduct).mockResolvedValueOnce({ ...PRODUCT, id: 2, name: 'Punjač' })
    const wrapper = await mountProductPage()

    await wrapper.setProps({ id: '2' })
    await flushPromises()

    expect(wrapper.get('h1').text()).toBe('Punjač')
  })
})
