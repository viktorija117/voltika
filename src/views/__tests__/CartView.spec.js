import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { CART_STORAGE_KEY } from '@/config/cart'
import { getCatalog } from '@/services/productService'
import { formatPrice } from '@/utils/price'

import CartView from '@/views/CartView.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

const PHONE = makeProduct({ id: 1, name: 'Telefon', price: 3000, stock: 20 })
const CABLE = makeProduct({ id: 2, name: 'Kabl', price: 500, stock: 20 })

beforeEach(() => {
  vi.mocked(getCatalog).mockReset()
  vi.mocked(getCatalog).mockResolvedValue([PHONE, CABLE])
})

async function mountCart(saved = []) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(saved))
  const { wrapper } = mountWithApp(CartView)
  await flushPromises()
  return wrapper
}

const summaryRow = (wrapper, label) =>
  wrapper
    .findAll('dl > div')
    .find((row) => row.get('dt').text() === label)
    .get('dd')
    .text()

describe('CartView', () => {
  it('shows an empty state with a link to the products', async () => {
    const wrapper = await mountCart()

    expect(wrapper.text()).toContain('Korpa je prazna')
    expect(wrapper.get('a[href="/proizvodi"]').text()).toBe('Pogledaj proizvode')
  })

  it('lists the products with current catalog prices and totals', async () => {
    const wrapper = await mountCart([{ id: 2, quantity: 2 }])

    expect(wrapper.get('h3').text()).toBe('Kabl')
    expect(summaryRow(wrapper, 'Međuzbir')).toBe(formatPrice(1000))
    expect(summaryRow(wrapper, 'Dostava')).toBe(formatPrice(390))
    expect(summaryRow(wrapper, 'Ukupno')).toBe(formatPrice(1390))
    expect(wrapper.text()).toContain(`Još ${formatPrice(4000)} do besplatne dostave`)
  })

  it('updates the totals when the quantity changes', async () => {
    const wrapper = await mountCart([{ id: 1, quantity: 1 }])

    await wrapper.get('button[aria-label="Povećaj količinu"]').trigger('click')

    expect(summaryRow(wrapper, 'Međuzbir')).toBe(formatPrice(6000))
    expect(summaryRow(wrapper, 'Dostava')).toBe('Besplatna')
    expect(wrapper.text()).toContain('Dostava je besplatna!')
  })

  it('removes a product and shows the empty state after the last one', async () => {
    const wrapper = await mountCart([{ id: 1, quantity: 1 }])

    await wrapper.get('button[aria-label="Ukloni Telefon iz korpe"]').trigger('click')

    expect(wrapper.text()).toContain('Korpa je prazna')
  })

  it('offers a retry when the catalog fails to load', async () => {
    vi.mocked(getCatalog).mockRejectedValueOnce(new Error('offline'))
    const wrapper = await mountCart([{ id: 1, quantity: 1 }])

    expect(wrapper.get('[role="alert"]').exists()).toBe(true)

    await wrapper.get('[role="alert"] button').trigger('click')
    await flushPromises()

    expect(wrapper.get('h3').text()).toBe('Telefon')
  })
})
