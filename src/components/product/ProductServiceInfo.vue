<script setup>
import { RotateCcw, ShieldCheck, Truck } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  shipping: { type: String, default: '' },
  warranty: { type: String, default: '' },
  returnPolicy: { type: String, default: '' },
})

const { t } = useI18n()

// Rows without data from the API are left out instead of showing an empty value.
const rows = computed(() =>
  [
    { key: 'shipping', icon: Truck, value: props.shipping },
    { key: 'warranty', icon: ShieldCheck, value: props.warranty },
    { key: 'returns', icon: RotateCcw, value: props.returnPolicy },
  ].filter((row) => row.value),
)
</script>

<template>
  <dl
    v-if="rows.length"
    class="divide-y divide-border-subtle rounded-lg border border-border-subtle"
  >
    <div v-for="row in rows" :key="row.key" class="flex items-center gap-3 p-3 text-sm">
      <component :is="row.icon" :size="20" aria-hidden="true" class="shrink-0 text-text-brand" />
      <dt class="font-medium">{{ t(`product.service.${row.key}`) }}</dt>
      <dd class="ml-auto text-right text-text-muted">{{ row.value }}</dd>
    </div>
  </dl>
</template>
