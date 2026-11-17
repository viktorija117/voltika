<script setup>
import { RotateCcw, ShoppingCart, WifiOff } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useSeo } from '@/composables/useSeo'
import { useCartStore } from '@/stores/cart'
import { useCatalogStore } from '@/stores/catalog'

import CartItem from '@/components/cart/CartItem.vue'
import CartSummary from '@/components/cart/CartSummary.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseStateMessage from '@/components/ui/BaseStateMessage.vue'

const { t } = useI18n()
const cart = useCartStore()
const catalog = useCatalogStore()
// Names and current prices come from the catalog.
catalog.load()

useSeo(() => ({ title: t('pages.cart.title'), description: t('seo.cart'), noindex: true }))

const isPending = computed(() => catalog.status === 'idle' || catalog.isLoading)
</script>

<template>
  <h1 class="heading-1 mb-6">{{ t('pages.cart.title') }}</h1>

  <BaseStateMessage
    v-if="!cart.items.length"
    :icon="ShoppingCart"
    :title="t('cart.emptyTitle')"
    :description="t('cart.emptyDescription')"
  >
    <BaseButton :to="{ name: 'products' }">{{ t('cart.browse') }}</BaseButton>
  </BaseStateMessage>

  <p v-else-if="isPending" role="status" class="text-text-muted">{{ t('cart.loading') }}</p>

  <BaseStateMessage
    v-else-if="catalog.hasError"
    role="alert"
    :icon="WifiOff"
    :title="t('productList.errorTitle')"
    :description="t('productList.errorDescription')"
  >
    <BaseButton :icon="RotateCcw" @click="catalog.retry()">{{ t('productList.retry') }}</BaseButton>
  </BaseStateMessage>

  <div v-else class="grid items-start gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
    <section
      :aria-label="t('cart.items')"
      class="rounded-lg border border-border-subtle bg-bg-surface px-4 lg:px-6"
    >
      <ul class="divide-y divide-border-subtle">
        <li v-for="line in cart.lines" :key="line.product.id">
          <CartItem
            :product="line.product"
            :quantity="line.quantity"
            @update:quantity="cart.setQuantity(line.product, $event)"
            @remove="cart.remove(line.product.id)"
          />
        </li>
      </ul>
    </section>
    <CartSummary class="lg:sticky lg:top-4" />
  </div>
</template>
