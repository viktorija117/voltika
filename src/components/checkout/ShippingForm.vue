<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { PAYMENT_OPTIONS, SHIPPING_METHODS } from '@/config/checkout'
import { shippingPrice } from '@/utils/cart'
import { formatPrice } from '@/utils/price'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseRadioCards from '@/components/ui/BaseRadioCards.vue'

const shippingMethod = defineModel('shippingMethod', { type: String, required: true })
const paymentOption = defineModel('paymentOption', { type: String, required: true })

const props = defineProps({
  /** Cart subtotal, to show each method's real price (courier can be free). */
  subtotal: { type: Number, required: true },
})
const emit = defineEmits(['back', 'submit'])

const { t } = useI18n()

const shippingOptions = computed(() =>
  SHIPPING_METHODS.map((method) => {
    const price = shippingPrice(props.subtotal, method)
    return {
      value: method,
      label: t(`checkout.shippingMethods.${method}.label`),
      description: t(`checkout.shippingMethods.${method}.description`),
      aside: price ? formatPrice(price) : t('checkout.shipping.free'),
    }
  }),
)

const paymentChoices = computed(() =>
  PAYMENT_OPTIONS.map((option) => ({
    value: option,
    label: t(`checkout.paymentOptions.${option}.label`),
    description: t(`checkout.paymentOptions.${option}.description`),
  })),
)
</script>

<template>
  <form class="flex flex-col gap-6" @submit.prevent="emit('submit')">
    <h2 tabindex="-1" class="font-heading text-xl font-bold focus:outline-none">
      {{ t('checkout.shipping.title') }}
    </h2>
    <BaseRadioCards
      v-model="shippingMethod"
      :legend="t('checkout.shipping.method')"
      :options="shippingOptions"
    />
    <BaseRadioCards
      v-model="paymentOption"
      :legend="t('checkout.shipping.payment')"
      :options="paymentChoices"
    />
    <div class="flex justify-between gap-3">
      <BaseButton variant="ghost" @click="emit('back')">{{ t('checkout.back') }}</BaseButton>
      <BaseButton type="submit">{{ t('checkout.next') }}</BaseButton>
    </div>
  </form>
</template>
