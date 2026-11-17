import { computed, ref } from 'vue'

import { ORDER_NUMBER_PREFIX, PAYMENT_OPTIONS, SHIPPING_METHODS } from '@/config/checkout'
import { useCartStore } from '@/stores/cart'
import { shippingPrice } from '@/utils/cart'
import { createEmptyAddress } from '@/utils/checkout'

/** Checkout steps in order. */
export const CHECKOUT_STEPS = ['address', 'shipping', 'review']

/**
 * State of one checkout. It lives only in memory: personal data is never written to the
 * URL or localStorage, and leaving the page starts a fresh checkout next time.
 * @returns {object} Step navigation, form values, totals and placeOrder().
 */
export function useCheckout() {
  const cart = useCartStore()

  const stepIndex = ref(0)
  const address = ref(createEmptyAddress())
  const shippingMethod = ref(SHIPPING_METHODS[0])
  const paymentOption = ref(PAYMENT_OPTIONS[0])
  const orderNumber = ref('')

  const currentStep = computed(() => CHECKOUT_STEPS[stepIndex.value])
  const shipping = computed(() => shippingPrice(cart.subtotal, shippingMethod.value))
  const total = computed(() => cart.subtotal + shipping.value)

  /**
   * Changes one address field in place, so several fields can change at once (autofill).
   * @param {keyof import('@/utils/checkout').Address} field
   * @param {string} value
   */
  function updateAddressField(field, value) {
    address.value[field] = value
  }

  function next() {
    stepIndex.value = Math.min(stepIndex.value + 1, CHECKOUT_STEPS.length - 1)
  }

  function back() {
    stepIndex.value = Math.max(stepIndex.value - 1, 0)
  }

  /** Jumps back to an earlier step ("Izmeni" on the review step). */
  function goTo(step) {
    const index = CHECKOUT_STEPS.indexOf(step)
    if (index >= 0 && index < stepIndex.value) stepIndex.value = index
  }

  /** Demo only: makes an order number and empties the cart; nothing is sent. */
  function placeOrder() {
    orderNumber.value = `${ORDER_NUMBER_PREFIX}-${Date.now().toString(36).toUpperCase()}`
    cart.clear()
  }

  return {
    stepIndex,
    currentStep,
    address,
    shippingMethod,
    paymentOption,
    shipping,
    total,
    orderNumber,
    updateAddressField,
    next,
    back,
    goTo,
    placeOrder,
  }
}
