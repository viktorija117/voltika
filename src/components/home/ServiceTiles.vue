<script setup>
import { CreditCard, Headset, Truck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { FREE_SHIPPING_THRESHOLD } from '@/config/cart'
import { SUPPORT_PHONE } from '@/config/contact'
import { INSTALLMENT_COUNT } from '@/config/pricing'
import { formatPrice } from '@/utils/price'

const { t } = useI18n()

const TILES = [
  { key: 'shipping', icon: Truck, params: { amount: formatPrice(FREE_SHIPPING_THRESHOLD) } },
  { key: 'installments', icon: CreditCard, params: { count: INSTALLMENT_COUNT } },
  { key: 'support', icon: Headset, params: { phone: SUPPORT_PHONE } },
]
</script>

<template>
  <ul :aria-label="t('home.services.label')" class="grid gap-3 sm:grid-cols-3 lg:gap-6">
    <li
      v-for="tile in TILES"
      :key="tile.key"
      class="flex items-center gap-4 rounded-lg border border-border-subtle bg-bg-surface p-4"
    >
      <span
        class="flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-brand-subtle text-text-brand"
      >
        <component :is="tile.icon" :size="24" aria-hidden="true" />
      </span>
      <span class="flex flex-col">
        <span class="font-medium">{{ t(`home.services.${tile.key}.title`) }}</span>
        <span class="text-sm text-text-muted">
          {{ t(`home.services.${tile.key}.text`, tile.params) }}
        </span>
      </span>
    </li>
  </ul>
</template>
