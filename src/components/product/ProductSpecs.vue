<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { categoryLabelKey } from '@/utils/categories'
import { formatServiceTerm } from '@/utils/serviceTerms'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').ProductDetails>} */
  product: { type: Object, required: true },
})

const { t } = useI18n()

// Rows without data from the API are left out instead of showing an empty value.
const rows = computed(() => {
  const labelKey = categoryLabelKey(props.product.category)
  return [
    { key: 'brand', value: props.product.brand },
    { key: 'category', value: labelKey ? t(labelKey) : props.product.category },
    { key: 'sku', value: props.product.sku },
    { key: 'warranty', value: formatServiceTerm(props.product.warranty, 'warranty', t) },
    { key: 'shipping', value: formatServiceTerm(props.product.shipping, 'shipping', t) },
    {
      key: 'returnPolicy',
      value: formatServiceTerm(props.product.returnPolicy, 'returnPolicy', t),
    },
  ].filter((row) => row.value)
})
</script>

<template>
  <dl class="max-w-2xl divide-y divide-border-subtle">
    <div v-for="row in rows" :key="row.key" class="grid grid-cols-2 gap-4 py-3 text-sm">
      <dt class="text-text-muted">{{ t(`product.specs.${row.key}`) }}</dt>
      <dd class="font-medium">{{ row.value }}</dd>
    </div>
  </dl>
</template>
