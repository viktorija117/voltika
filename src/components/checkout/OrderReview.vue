<script setup>
import { useI18n } from 'vue-i18n'

import { formatPrice } from '@/utils/price'

import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  /** @type {import('vue').PropType<import('@/utils/cart').CartLine[]>} */
  lines: { type: Array, required: true },
  /** @type {import('vue').PropType<import('@/utils/checkout').Address>} */
  address: { type: Object, required: true },
  shippingMethod: { type: String, required: true },
  paymentOption: { type: String, required: true },
})
const emit = defineEmits(['edit', 'back', 'confirm'])

const { t } = useI18n()

const SECTION_CLASS = 'flex flex-col gap-2 border-t border-border-subtle pt-4'
const SECTION_HEADER_CLASS = 'flex items-center justify-between gap-2'
const SECTION_TITLE_CLASS = 'font-heading text-lg font-bold'
</script>

<template>
  <div class="flex flex-col gap-4">
    <h2 tabindex="-1" class="font-heading text-xl font-bold focus:outline-none">
      {{ t('checkout.review.title') }}
    </h2>

    <section :class="SECTION_CLASS" aria-labelledby="review-items">
      <h3 id="review-items" :class="SECTION_TITLE_CLASS">{{ t('checkout.review.items') }}</h3>
      <ul class="flex flex-col gap-2">
        <li v-for="line in lines" :key="line.product.id" class="flex justify-between gap-4 text-sm">
          <span>{{ line.product.name }}</span>
          <span class="shrink-0 text-text-muted">
            {{
              t('checkout.review.quantity', {
                quantity: line.quantity,
                price: formatPrice(line.product.price),
              })
            }}
          </span>
        </li>
      </ul>
    </section>

    <section :class="SECTION_CLASS" aria-labelledby="review-address">
      <div :class="SECTION_HEADER_CLASS">
        <h3 id="review-address" :class="SECTION_TITLE_CLASS">
          {{ t('checkout.review.deliverTo') }}
        </h3>
        <BaseButton variant="ghost" @click="emit('edit', 'address')">
          {{ t('checkout.review.edit') }}
          <span class="sr-only">: {{ t('checkout.review.deliverTo') }}</span>
        </BaseButton>
      </div>
      <address class="text-sm not-italic">
        {{ address.fullName }}<br />
        {{ address.street }}<br />
        {{ address.postalCode }} {{ address.city }}<br />
        {{ address.phone }} · {{ address.email }}
      </address>
    </section>

    <section :class="SECTION_CLASS" aria-labelledby="review-method">
      <div :class="SECTION_HEADER_CLASS">
        <h3 id="review-method" :class="SECTION_TITLE_CLASS">{{ t('checkout.review.method') }}</h3>
        <BaseButton variant="ghost" @click="emit('edit', 'shipping')">
          {{ t('checkout.review.edit') }}
          <span class="sr-only">: {{ t('checkout.review.method') }}</span>
        </BaseButton>
      </div>
      <p class="text-sm">
        {{ t(`checkout.shippingMethods.${shippingMethod}.label`) }} ·
        {{ t(`checkout.paymentOptions.${paymentOption}.label`) }}
      </p>
    </section>

    <div class="flex justify-between gap-3 border-t border-border-subtle pt-4">
      <BaseButton variant="ghost" @click="emit('back')">{{ t('checkout.back') }}</BaseButton>
      <BaseButton variant="accent" @click="emit('confirm')">{{ t('checkout.confirm') }}</BaseButton>
    </div>
  </div>
</template>
