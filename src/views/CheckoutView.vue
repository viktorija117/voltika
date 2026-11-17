<script setup>
import { RotateCcw, WifiOff } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { CHECKOUT_STEPS, useCheckout } from '@/composables/useCheckout'
import { useSeo } from '@/composables/useSeo'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'

import OrderTotals from '@/components/cart/OrderTotals.vue'
import AddressForm from '@/components/checkout/AddressForm.vue'
import CheckoutSteps from '@/components/checkout/CheckoutSteps.vue'
import OrderConfirmation from '@/components/checkout/OrderConfirmation.vue'
import OrderReview from '@/components/checkout/OrderReview.vue'
import ShippingForm from '@/components/checkout/ShippingForm.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseStateMessage from '@/components/ui/BaseStateMessage.vue'

const { t } = useI18n()
const cart = useCartStore()
const catalog = useCatalogStore()
// Product names and current prices come from the catalog.
catalog.load()

const {
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
} = useCheckout()

useSeo(() => ({
  title: t('pages.checkout.title'),
  description: t('seo.checkout'),
  noindex: true,
}))

const isPending = computed(() => catalog.status === 'idle' || catalog.isLoading)
const stepLabels = computed(() => CHECKOUT_STEPS.map((step) => t(`checkout.steps.${step}`)))

// Each step replaces the previous form, so focus moves to the new step's heading
// and the page scrolls up to it.
const stepContainer = ref(null)
watch(stepIndex, async () => {
  await nextTick()
  stepContainer.value?.querySelector('h2')?.focus()
  window.scrollTo({ top: 0 })
})
</script>

<template>
  <h1 class="heading-1 mb-6">{{ t('pages.checkout.title') }}</h1>

  <OrderConfirmation v-if="orderNumber" :order-number="orderNumber" />

  <p v-else-if="isPending" role="status" class="text-text-muted">{{ t('checkout.loading') }}</p>

  <BaseStateMessage
    v-else-if="catalog.hasError"
    role="alert"
    :icon="WifiOff"
    :title="t('productList.errorTitle')"
    :description="t('productList.errorDescription')"
  >
    <BaseButton :icon="RotateCcw" @click="catalog.retry()">{{ t('productList.retry') }}</BaseButton>
  </BaseStateMessage>

  <div v-else class="flex flex-col gap-6">
    <CheckoutSteps :labels="stepLabels" :current="stepIndex" />

    <div class="grid items-start gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
      <div
        ref="stepContainer"
        class="rounded-lg border border-border-subtle bg-bg-surface p-4 lg:p-6"
      >
        <AddressForm
          v-if="currentStep === 'address'"
          :address="address"
          @update-field="updateAddressField"
          @submit="next"
        />
        <ShippingForm
          v-else-if="currentStep === 'shipping'"
          v-model:shipping-method="shippingMethod"
          v-model:payment-option="paymentOption"
          :subtotal="cart.subtotal"
          @back="back"
          @submit="next"
        />
        <OrderReview
          v-else
          :lines="cart.lines"
          :address="address"
          :shipping-method="shippingMethod"
          :payment-option="paymentOption"
          @edit="goTo"
          @back="back"
          @confirm="placeOrder"
        />
      </div>

      <section
        aria-labelledby="checkout-totals-title"
        class="rounded-lg border border-border-subtle bg-bg-surface p-4 lg:sticky lg:top-4 lg:p-6"
      >
        <h2 id="checkout-totals-title" class="mb-4 font-heading text-xl font-bold">
          {{ t('cart.summary') }}
        </h2>
        <OrderTotals :subtotal="cart.subtotal" :shipping="shipping" :total="total" />
      </section>
    </div>
  </div>
</template>
