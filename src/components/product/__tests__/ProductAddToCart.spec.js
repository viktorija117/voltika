import { describe, expect, it } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { useCartStore } from '@/stores/cart'

import ProductAddToCart from '@/components/product/ProductAddToCart.vue'

function mountAddToCart(product) {
  const { wrapper } = mountWithApp(ProductAddToCart, { props: { product } })
  return { wrapper, cart: useCartStore() }
}

const addButton = (wrapper) =>
  wrapper.findAll('button').find((button) => button.text() === 'Dodaj u korpu')

describe('ProductAddToCart', () => {
  it('adds the chosen quantity and confirms it', async () => {
    const product = makeProduct({ id: 1, name: 'Punjač', stock: 20 })
    const { wrapper, cart } = mountAddToCart(product)

    await wrapper.get('button[aria-label="Povećaj količinu"]').trigger('click')
    await addButton(wrapper).trigger('click')

    expect(cart.quantityOf(1)).toBe(2)
    expect(wrapper.get('[role="status"]').text()).toContain('Dodato u korpu: Punjač')
    expect(wrapper.get('[role="status"] a').attributes('href')).toBe('/korpa')
    expect(wrapper.get('input').element.value).toBe('1')
  })

  it('stops at the limit and says why', async () => {
    const product = makeProduct({ id: 1, stock: 2 })
    const { wrapper } = mountAddToCart(product)

    await addButton(wrapper).trigger('click')
    await addButton(wrapper).trigger('click')

    expect(addButton(wrapper).attributes('disabled')).toBeDefined()
    expect(wrapper.text()).toContain('U korpi je već najveća dozvoljena količina.')
  })

  it('cannot add a product that is out of stock', () => {
    const { wrapper } = mountAddToCart(makeProduct({ stock: 0, stockStatus: 'outOfStock' }))

    expect(addButton(wrapper).attributes('disabled')).toBeDefined()
    expect(wrapper.get('[role="status"]').text()).toBe('')
  })
})
