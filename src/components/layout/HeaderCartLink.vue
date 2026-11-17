<script setup>
import { ShoppingCart } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { useCartStore } from '@/stores/cart'

const { t } = useI18n()
const { itemCount } = storeToRefs(useCartStore())
</script>

<template>
  <RouterLink
    :to="{ name: 'cart' }"
    class="flex h-11 min-w-11 items-center justify-center gap-3 rounded-md px-2 hover:bg-bg-subtle"
  >
    <span class="relative">
      <ShoppingCart :size="24" aria-hidden="true" />
      <!-- The badge is visual only; the link text below says the count in words. -->
      <span
        v-if="itemCount"
        aria-hidden="true"
        class="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-holo px-1 text-xs font-bold text-text-on-accent"
      >
        {{ itemCount }}
      </span>
    </span>
    <span class="sr-only text-sm font-medium lg:not-sr-only">{{ t('header.cart') }}</span>
    <span v-if="itemCount" class="sr-only">, {{ t('header.cartCount', itemCount) }}</span>
  </RouterLink>
</template>
