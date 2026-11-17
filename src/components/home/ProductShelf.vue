<script setup>
import { RotateCcw } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').Product[]>} */
  products: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
  hasError: { type: Boolean, default: false },
  /** Placeholders shown while loading. */
  size: { type: Number, required: true },
})
const emit = defineEmits(['retry'])

const { t } = useI18n()
const GRID_CLASS = 'grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6'
</script>

<template>
  <div v-if="hasError" role="alert" class="flex flex-wrap items-center gap-4">
    <p class="text-text-muted">{{ t('productList.errorTitle') }}</p>
    <BaseButton :icon="RotateCcw" variant="secondary" @click="emit('retry')">
      {{ t('productList.retry') }}
    </BaseButton>
  </div>
  <ul v-else-if="isLoading" :class="GRID_CLASS" aria-busy="true">
    <li v-for="index in size" :key="index"><ProductCardSkeleton /></li>
  </ul>
  <ul v-else :class="GRID_CLASS">
    <li v-for="product in products" :key="product.id"><ProductCard :product="product" /></li>
  </ul>
</template>
