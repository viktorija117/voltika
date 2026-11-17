<script setup>
import { ShoppingCart } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { useCartStore } from '@/stores/cart'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseQuantityInput from '@/components/ui/BaseQuantityInput.vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').Product>} */
  product: { type: Object, required: true },
})

const { t } = useI18n()
const cart = useCartStore()
const quantity = ref(1)
const wasAdded = ref(false)

// Units that still fit: the cart limit and the stock minus what is already in the cart.
const remaining = computed(() => cart.remainingQuantity(props.product))
const canAdd = computed(() => remaining.value > 0)
// The input still needs a valid range while it is disabled.
const inputMax = computed(() => Math.max(remaining.value, 1))
const isLimitReached = computed(() => !canAdd.value && cart.quantityOf(props.product.id) > 0)

function handleAddToCart() {
  cart.add(props.product, quantity.value)
  quantity.value = 1
  wasAdded.value = true
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap gap-3">
      <BaseQuantityInput v-model="quantity" :max="inputMax" :disabled="!canAdd" />
      <BaseButton
        :icon="ShoppingCart"
        :disabled="!canAdd"
        variant="accent"
        class="flex-1"
        @click="handleAddToCart"
      >
        {{ t('cart.add') }}
      </BaseButton>
    </div>
    <!-- Always rendered, so screen readers announce the confirmation when it appears. -->
    <p role="status" class="text-sm">
      <template v-if="wasAdded">
        {{ t('cart.added', { name: product.name }) }} ·
        <RouterLink :to="{ name: 'cart' }" class="font-medium text-text-brand underline">
          {{ t('cart.viewCart') }}
        </RouterLink>
      </template>
    </p>
    <p v-if="isLimitReached" class="text-sm text-text-muted">{{ t('cart.maxReached') }}</p>
  </div>
</template>
