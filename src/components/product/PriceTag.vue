<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { formatPrice } from '@/utils/price'

const props = defineProps({
  /** Current price in RSD. */
  price: { type: Number, required: true },
  /** Price before the sale; null when the product is not on sale. */
  oldPrice: { type: Number, default: null },
  savings: { type: Number, default: 0 },
  /** `large` on the product page, `default` on cards. */
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'large'].includes(value),
  },
})

const { t } = useI18n()
const isOnSale = computed(() => props.oldPrice !== null && props.oldPrice > props.price)
</script>

<template>
  <div class="flex flex-col gap-1">
    <p class="flex flex-wrap items-baseline gap-x-2">
      <span v-if="isOnSale" class="sr-only">{{ t('product.salePrice') }}:</span>
      <span
        :class="[
          'font-heading font-bold',
          size === 'large' ? 'text-3xl' : 'text-xl',
          isOnSale ? 'text-text-sale' : 'text-text-default',
        ]"
      >
        {{ formatPrice(price) }}
      </span>
      <del v-if="isOnSale" class="text-sm text-text-muted">
        <span class="sr-only">{{ t('product.oldPrice') }}:</span>
        {{ formatPrice(oldPrice) }}
      </del>
    </p>
    <p v-if="isOnSale" class="text-sm font-medium text-text-sale">
      {{ t('product.savings', { amount: formatPrice(savings) }) }}
    </p>
  </div>
</template>
