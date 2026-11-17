import {
  CART_MAX_QUANTITY,
  COURIER_SHIPPING_PRICE,
  EXPRESS_SHIPPING_PRICE,
  FREE_SHIPPING_THRESHOLD,
} from '@/config/cart'

/** @typedef {{ id: number, quantity: number }} CartItem */
/** @typedef {{ product: import('@/services/productMapper').Product, quantity: number }} CartLine */

/**
 * Most units of one product the cart can hold: the cart limit or the stock, whichever is lower.
 * @param {number} stock
 * @returns {number}
 */
export function maxCartQuantity(stock) {
  return Math.max(Math.min(CART_MAX_QUANTITY, stock), 0)
}

/**
 * Keeps a quantity a whole number between 1 and the maximum for the product.
 * @param {number} quantity
 * @param {number} stock
 * @returns {number} 0 only when the product cannot be bought at all.
 */
export function clampQuantity(quantity, stock) {
  const max = maxCartQuantity(stock)
  if (max === 0) return 0
  const whole = Math.floor(Number(quantity)) || 1
  return Math.min(Math.max(whole, 1), max)
}

/**
 * @param {CartLine[]} lines
 * @returns {number} Whole dinars.
 */
export function cartSubtotal(lines) {
  return lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0)
}

/**
 * Delivery price. Courier is free from the threshold up; express always costs the same.
 * An empty cart has nothing to deliver.
 * @param {number} subtotal
 * @param {'courier' | 'express'} [method]
 * @returns {number}
 */
export function shippingPrice(subtotal, method = 'courier') {
  if (subtotal === 0) return 0
  if (method === 'express') return EXPRESS_SHIPPING_PRICE
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : COURIER_SHIPPING_PRICE
}

/**
 * @param {number} subtotal
 * @returns {number} How much more to spend for free shipping; 0 once it is reached.
 */
export function amountToFreeShipping(subtotal) {
  return Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0)
}

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0

/**
 * Turns whatever was saved in localStorage into valid cart items. Anything with the wrong
 * shape is dropped, too large quantities are capped and duplicate ids are merged.
 * @param {unknown} saved
 * @returns {CartItem[]}
 */
export function parseSavedCart(saved) {
  if (!Array.isArray(saved)) return []
  const quantities = new Map()
  for (const entry of saved) {
    if (!isPositiveInteger(entry?.id) || !isPositiveInteger(entry?.quantity)) continue
    const total = (quantities.get(entry.id) ?? 0) + entry.quantity
    quantities.set(entry.id, Math.min(total, CART_MAX_QUANTITY))
  }
  return [...quantities].map(([id, quantity]) => ({ id, quantity }))
}
