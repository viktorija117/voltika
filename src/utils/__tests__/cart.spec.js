import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/__tests__/helpers'
import { CART_MAX_QUANTITY, COURIER_SHIPPING_PRICE, FREE_SHIPPING_THRESHOLD } from '@/config/cart'
import {
  amountToFreeShipping,
  cartSubtotal,
  clampQuantity,
  maxCartQuantity,
  parseSavedCart,
  shippingPrice,
} from '@/utils/cart'

describe('maxCartQuantity', () => {
  it('is the cart limit when there is enough stock', () => {
    expect(maxCartQuantity(100)).toBe(CART_MAX_QUANTITY)
  })

  it('is the stock when there is less', () => {
    expect(maxCartQuantity(3)).toBe(3)
    expect(maxCartQuantity(0)).toBe(0)
  })
})

describe('clampQuantity', () => {
  it('keeps the quantity between 1 and the maximum', () => {
    expect(clampQuantity(0, 20)).toBe(1)
    expect(clampQuantity(-4, 20)).toBe(1)
    expect(clampQuantity(50, 20)).toBe(CART_MAX_QUANTITY)
    expect(clampQuantity(5, 3)).toBe(3)
  })

  it('turns odd input into a whole number', () => {
    expect(clampQuantity(2.7, 20)).toBe(2)
    expect(clampQuantity('abc', 20)).toBe(1)
  })

  it('returns 0 when the product is out of stock', () => {
    expect(clampQuantity(1, 0)).toBe(0)
  })
})

describe('cartSubtotal', () => {
  it('adds up price × quantity of every line', () => {
    const lines = [
      { product: makeProduct({ price: 1000 }), quantity: 2 },
      { product: makeProduct({ price: 499 }), quantity: 1 },
    ]
    expect(cartSubtotal(lines)).toBe(2499)
  })

  it('is 0 for an empty cart', () => {
    expect(cartSubtotal([])).toBe(0)
  })
})

describe('shippingPrice', () => {
  it('charges courier delivery below the threshold', () => {
    expect(shippingPrice(FREE_SHIPPING_THRESHOLD - 1)).toBe(COURIER_SHIPPING_PRICE)
  })

  it('is free from the threshold up', () => {
    expect(shippingPrice(FREE_SHIPPING_THRESHOLD)).toBe(0)
  })

  it('charges nothing for an empty cart', () => {
    expect(shippingPrice(0)).toBe(0)
  })
})

describe('amountToFreeShipping', () => {
  it('returns what is missing, and 0 once the threshold is reached', () => {
    expect(amountToFreeShipping(FREE_SHIPPING_THRESHOLD - 1200)).toBe(1200)
    expect(amountToFreeShipping(FREE_SHIPPING_THRESHOLD + 1)).toBe(0)
  })
})

describe('parseSavedCart', () => {
  it('keeps valid items', () => {
    expect(parseSavedCart([{ id: 1, quantity: 2 }])).toEqual([{ id: 1, quantity: 2 }])
  })

  it('returns an empty cart for anything that is not a list', () => {
    expect(parseSavedCart(null)).toEqual([])
    expect(parseSavedCart({ id: 1 })).toEqual([])
    expect(parseSavedCart('[]')).toEqual([])
  })

  it('drops items with a wrong shape', () => {
    const saved = [
      { id: 1, quantity: 1 },
      { id: '2', quantity: 1 },
      { id: 3, quantity: 0 },
      { id: 4, quantity: 1.5 },
      null,
      { id: 5 },
    ]
    expect(parseSavedCart(saved)).toEqual([{ id: 1, quantity: 1 }])
  })

  it('merges duplicates and caps the quantity', () => {
    const saved = [
      { id: 1, quantity: 6 },
      { id: 1, quantity: 6 },
      { id: 2, quantity: 999 },
    ]
    expect(parseSavedCart(saved)).toEqual([
      { id: 1, quantity: CART_MAX_QUANTITY },
      { id: 2, quantity: CART_MAX_QUANTITY },
    ])
  })
})
