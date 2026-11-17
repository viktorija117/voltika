import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { makeProduct } from '@/__tests__/helpers'
import { CART_MAX_QUANTITY, CART_STORAGE_KEY, COURIER_SHIPPING_PRICE } from '@/config/cart'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'

const PHONE = makeProduct({ id: 1, price: 3000, stock: 20 })
const CABLE = makeProduct({ id: 2, price: 500, stock: 3 })

function createCart(products = [PHONE, CABLE]) {
  setActivePinia(createPinia())
  useCatalogStore().products = products
  return useCartStore()
}

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('cart store', () => {
  it('adds a product and counts the items', () => {
    const cart = createCart()

    cart.add(PHONE)
    cart.add(CABLE, 2)

    expect(cart.items).toEqual([
      { id: 1, quantity: 1 },
      { id: 2, quantity: 2 },
    ])
    expect(cart.itemCount).toBe(3)
  })

  it('adds to the quantity when the product is already in the cart', () => {
    const cart = createCart()

    cart.add(PHONE, 2)
    cart.add(PHONE, 3)

    expect(cart.quantityOf(PHONE.id)).toBe(5)
  })

  it('never goes over the stock or the cart limit', () => {
    const cart = createCart()

    cart.add(CABLE, 10)
    cart.add(PHONE, 50)

    expect(cart.quantityOf(CABLE.id)).toBe(3)
    expect(cart.quantityOf(PHONE.id)).toBe(CART_MAX_QUANTITY)
    expect(cart.remainingQuantity(PHONE)).toBe(0)
  })

  it('does not add a product that is out of stock', () => {
    const cart = createCart()

    cart.add(makeProduct({ id: 9, stock: 0 }))

    expect(cart.items).toEqual([])
  })

  it('changes the quantity and removes products', () => {
    const cart = createCart()
    cart.add(PHONE)
    cart.add(CABLE)

    cart.setQuantity(PHONE, 4)
    cart.remove(CABLE.id)

    expect(cart.items).toEqual([{ id: 1, quantity: 4 }])
  })

  it('empties the cart', () => {
    const cart = createCart()
    cart.add(PHONE)

    cart.clear()

    expect(cart.items).toEqual([])
    expect(cart.itemCount).toBe(0)
  })

  it('computes subtotal, shipping and total from catalog prices', () => {
    const cart = createCart()
    cart.add(CABLE, 2)

    expect(cart.subtotal).toBe(1000)
    expect(cart.shipping).toBe(COURIER_SHIPPING_PRICE)
    expect(cart.total).toBe(1000 + COURIER_SHIPPING_PRICE)

    cart.add(PHONE, 2)
    expect(cart.shipping).toBe(0)
  })

  it('leaves out products that are no longer in the catalog', () => {
    const cart = createCart([PHONE])
    cart.items = [
      { id: 1, quantity: 1 },
      { id: 77, quantity: 1 },
    ]

    expect(cart.lines.map((line) => line.product.id)).toEqual([1])
  })

  it('saves the cart and restores it after a reload', async () => {
    const cart = createCart()
    cart.add(PHONE, 2)
    await nextTick()

    expect(JSON.parse(localStorage.getItem(CART_STORAGE_KEY))).toEqual([{ id: 1, quantity: 2 }])
    expect(createCart().items).toEqual([{ id: 1, quantity: 2 }])
  })

  it('ignores a tampered saved cart', () => {
    localStorage.setItem(CART_STORAGE_KEY, '[{"id":"<script>","quantity":-1}]')

    expect(createCart().items).toEqual([])
  })
})
