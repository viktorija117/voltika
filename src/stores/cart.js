import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { CART_STORAGE_KEY } from '@/config/cart'
import { useCatalogStore } from '@/stores/catalog'
import {
  cartSubtotal,
  clampQuantity,
  maxCartQuantity,
  parseSavedCart,
  shippingPrice,
} from '@/utils/cart'
import { readJson, writeJson } from '@/utils/storage'

/**
 * The cart keeps only product ids and quantities. Names, prices and stock come from the
 * catalog, so the cart always shows today's prices, never ones saved in the browser.
 */
export const useCartStore = defineStore('cart', () => {
  const catalog = useCatalogStore()
  /** @type {import('vue').Ref<import('@/utils/cart').CartItem[]>} */
  const items = ref(parseSavedCart(readJson(CART_STORAGE_KEY)))

  // Items are always replaced, never mutated, so a shallow watch sees every change.
  watch(items, (value) => writeJson(CART_STORAGE_KEY, value))

  /** Items joined with their products; items whose product is gone are left out. */
  const lines = computed(() => {
    const productsById = new Map(catalog.products.map((product) => [product.id, product]))
    return items.value
      .map((item) => ({ product: productsById.get(item.id), quantity: item.quantity }))
      .filter((line) => line.product)
  })

  const itemCount = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))
  const subtotal = computed(() => cartSubtotal(lines.value))
  const shipping = computed(() => shippingPrice(subtotal.value))
  const total = computed(() => subtotal.value + shipping.value)

  function quantityOf(id) {
    return items.value.find((item) => item.id === id)?.quantity ?? 0
  }

  /**
   * How many more units of the product can still be added.
   * @param {import('@/services/productMapper').Product} product
   */
  function remainingQuantity(product) {
    return Math.max(maxCartQuantity(product.stock) - quantityOf(product.id), 0)
  }

  /**
   * Sets the quantity of a product, adding it when it is not in the cart yet.
   * @param {import('@/services/productMapper').Product} product
   * @param {number} quantity Clamped to 1…the product's maximum.
   */
  function setQuantity(product, quantity) {
    const clamped = clampQuantity(quantity, product.stock)
    if (clamped === 0) return
    const isInCart = items.value.some((item) => item.id === product.id)
    items.value = isInCart
      ? items.value.map((item) => (item.id === product.id ? { ...item, quantity: clamped } : item))
      : [...items.value, { id: product.id, quantity: clamped }]
  }

  /**
   * @param {import('@/services/productMapper').Product} product
   * @param {number} [quantity]
   */
  function add(product, quantity = 1) {
    setQuantity(product, quantityOf(product.id) + quantity)
  }

  function remove(id) {
    items.value = items.value.filter((item) => item.id !== id)
  }

  /** Empties the cart after an order is placed. */
  function clear() {
    items.value = []
  }

  return {
    items,
    lines,
    itemCount,
    subtotal,
    shipping,
    total,
    quantityOf,
    remainingQuantity,
    setQuantity,
    add,
    remove,
    clear,
  }
})
