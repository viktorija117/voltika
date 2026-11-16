<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ProductReviews from '@/components/product/ProductReviews.vue'
import ProductSpecs from '@/components/product/ProductSpecs.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').ProductDetails>} */
  product: { type: Object, required: true },
})

const { t } = useI18n()

const tabs = computed(() => [
  { id: 'description', label: t('product.tabs.description') },
  { id: 'specs', label: t('product.tabs.specs') },
  { id: 'reviews', label: t('product.tabs.reviews', { count: props.product.reviews.length }) },
])
</script>

<template>
  <BaseTabs :tabs="tabs" :label="t('product.tabs.label')">
    <template #description>
      <p class="max-w-3xl leading-relaxed">{{ product.description }}</p>
    </template>
    <template #specs>
      <ProductSpecs :product="product" />
    </template>
    <template #reviews>
      <ProductReviews :reviews="product.reviews" />
    </template>
  </BaseTabs>
</template>
