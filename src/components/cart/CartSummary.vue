<script setup>
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import { useCartStore } from '@/stores/cart'

import FreeShippingBar from '@/components/cart/FreeShippingBar.vue'
import OrderTotals from '@/components/cart/OrderTotals.vue'
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
    <OrderTotals :subtotal="subtotal" :shipping="shipping" :total="total" />
    <BaseButton :to="{ name: 'checkout' }" block>{{ t('cart.checkout') }}</BaseButton>
    <BaseButton :to="{ name: 'products' }" variant="ghost" block>
      {{ t('cart.continueShopping') }}
    </BaseButton>
  </section>
</template>
