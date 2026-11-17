<script setup>
import { Truck } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { FREE_SHIPPING_THRESHOLD } from '@/config/cart'
import { amountToFreeShipping } from '@/utils/cart'
import { formatPrice } from '@/utils/price'

const props = defineProps({
  /** Cart subtotal in RSD. */
  subtotal: { type: Number, required: true },
})

const { t } = useI18n()

const remaining = computed(() => amountToFreeShipping(props.subtotal))
const progressPercent = computed(() =>
  Math.min((props.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100),
)
const message = computed(() =>
  remaining.value
    ? t('cart.freeShippingRemaining', { amount: formatPrice(remaining.value) })
    : t('cart.freeShippingReached'),
)
</script>

<template>
  <div class="flex flex-col gap-2 rounded-md bg-bg-brand-subtle p-3">
    <!-- The sentence says everything; the bar only shows it. aria-live announces quantity changes. -->
    <p class="flex items-center gap-2 text-sm font-medium" aria-live="polite">
      <Truck :size="20" aria-hidden="true" class="shrink-0 text-text-brand" />
      {{ message }}
    </p>
    <div class="h-2 overflow-hidden rounded-full bg-bg-surface" aria-hidden="true">
      <div
        class="h-full rounded-full bg-bg-brand transition-[width] duration-300 motion-reduce:transition-none"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
  </div>
</template>
