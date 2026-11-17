import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { EXPRESS_SHIPPING_PRICE } from '@/config/cart'
import { getCatalog } from '@/services/productService'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/price'

import CheckoutView from '@/views/CheckoutView.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

const PHONE = makeProduct({ id: 1, name: 'Telefon', price: 3000, stock: 20 })

const ADDRESS = {
  fullName: 'Ana Anić',
  email: 'ana@primer.rs',
  phone: '064 123 4567',
  street: 'Knez Mihailova 1',
  city: 'Beograd',
  postalCode: '11000',
}

beforeEach(() => {
  vi.mocked(getCatalog).mockResolvedValue([PHONE])
})

async function mountCheckout() {
  const { wrapper } = mountWithApp(CheckoutView, { attachTo: document.body })
  const cart = useCartStore()
  cart.add(PHONE)
  await flushPromises()
  return { wrapper, cart }
}

async function fillAddress(wrapper, values = ADDRESS) {
  for (const [name, value] of Object.entries(values)) {
    await wrapper.get(`input[name="${name}"]`).setValue(value)
  }
}

const totalRow = (wrapper) =>
  wrapper
    .findAll('dl > div')
    .find((row) => row.get('dt').text() === 'Ukupno')
    .get('dd')
    .text()

const button = (wrapper, text) => wrapper.findAll('button').find((item) => item.text() === text)

describe('CheckoutView', () => {
  it('starts on the address step', async () => {
    const { wrapper } = await mountCheckout()

    expect(wrapper.get('[aria-current="step"]').text()).toContain('Adresa')
    expect(wrapper.get('h2').text()).toBe('Adresa za dostavu')
    wrapper.unmount()
  })

  it('shows errors after submit and moves focus to the first invalid field', async () => {
    const { wrapper } = await mountCheckout()
    await fillAddress(wrapper, { fullName: 'Ana Anić', email: 'ana@' })

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    const email = wrapper.get('input[name="email"]')
    expect(email.attributes('aria-invalid')).toBe('true')
    expect(document.activeElement).toBe(email.element)
    expect(wrapper.text()).toContain('Poštanski broj ima 5 cifara')
    expect(wrapper.get('h2').text()).toBe('Adresa za dostavu')
    wrapper.unmount()
  })

  it('keeps every field when the browser autofills them all at once', async () => {
    const { wrapper } = await mountCheckout()

    // Autofill sets every field in the same tick, without waiting for a re-render.
    for (const [name, value] of Object.entries(ADDRESS)) {
      const input = wrapper.get(`input[name="${name}"]`).element
      input.value = value
      input.dispatchEvent(new Event('input'))
    }
    await flushPromises()

    for (const [name, value] of Object.entries(ADDRESS)) {
      expect(wrapper.get(`input[name="${name}"]`).element.value).toBe(value)
    }
    wrapper.unmount()
  })

  it('goes through all steps, and express delivery changes the total', async () => {
    const { wrapper } = await mountCheckout()
    await fillAddress(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[aria-current="step"]').text()).toContain('Dostava i plaćanje')
    expect(document.activeElement).toBe(wrapper.get('h2').element)

    await wrapper.get('input[value="express"]').setValue(true)
    expect(totalRow(wrapper)).toBe(formatPrice(3000 + EXPRESS_SHIPPING_PRICE))

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('h2').text()).toBe('Proverite porudžbinu')
    expect(wrapper.get('address').text()).toContain('Knez Mihailova 1')
    expect(wrapper.text()).toContain('Ekspresna dostava · Pouzećem')
    wrapper.unmount()
  })

  it('goes back to the address from the review and keeps what was typed', async () => {
    const { wrapper } = await mountCheckout()
    await fillAddress(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    await wrapper
      .findAll('button')
      .find((item) => item.text().startsWith('Izmeni'))
      .trigger('click')
    await flushPromises()

    expect(wrapper.get('input[name="city"]').element.value).toBe('Beograd')
    wrapper.unmount()
  })

  it('places the order, shows the order number and empties the cart', async () => {
    const { wrapper, cart } = await mountCheckout()
    await fillAddress(wrapper)
    await wrapper.get('form').trigger('submit')
    await flushPromises()
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    await button(wrapper, 'Potvrdi porudžbinu').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Hvala na porudžbini!')
    expect(wrapper.text()).toMatch(/Broj porudžbine: VOL-[0-9A-Z]+/)
    expect(wrapper.text()).toContain('porudžbina nije poslata')
    expect(document.activeElement).toBe(wrapper.get('h2').element)
    expect(cart.items).toEqual([])
    wrapper.unmount()
  })
})
