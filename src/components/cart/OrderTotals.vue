<script setup>
import { useI18n } from 'vue-i18n'

import { formatPrice } from '@/utils/price'

defineProps({
  subtotal: { type: Number, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
})

const { t } = useI18n()
</script>

<template>
  <dl class="flex flex-col gap-2 text-sm">
    <div class="flex justify-between">
      <dt>{{ t('cart.subtotal') }}</dt>
      <dd>{{ formatPrice(subtotal) }}</dd>
    </div>
    <div class="flex justify-between">
      <dt>{{ t('cart.shipping') }}</dt>
      <dd :class="{ 'font-medium text-text-success': shipping === 0 }">
        {{ shipping ? formatPrice(shipping) : t('cart.freeShipping') }}
      </dd>
    </div>
    <div class="mt-2 flex justify-between border-t border-border-subtle pt-3 text-base font-bold">
      <dt>{{ t('cart.total') }}</dt>
      <dd>{{ formatPrice(total) }}</dd>
    </div>
  </dl>
</template>
