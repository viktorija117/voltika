<script setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/utils/price'

import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
const { subtotal, shipping, total } = storeToRefs(useCartStore())
</script>

<template>
  <section
    aria-labelledby="cart-summary-title"
    class="flex flex-col gap-4 rounded-lg border border-border-subtle bg-bg-surface p-4 lg:p-6"
  >
    <h2 id="cart-summary-title" class="font-heading text-xl font-bold">
      {{ t('cart.summary') }}
    </h2>
    <FreeShippingBar :subtotal="subtotal" />
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
    <BaseButton :to="{ name: 'checkout' }" block>{{ t('cart.checkout') }}</BaseButton>
    <BaseButton :to="{ name: 'products' }" variant="ghost" block>
      {{ t('cart.continueShopping') }}
    </BaseButton>
  </section>
</template>
