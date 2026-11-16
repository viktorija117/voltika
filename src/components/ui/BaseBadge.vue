<script>
// Module scope, so the defineProps validator below can use it.
// Variants match the Figma "Badge" component. The text carries the meaning; color only supports it.
const VARIANT_CLASSES = {
  sale: 'bg-bg-sale text-text-inverse',
  new: 'bg-bg-accent text-text-on-accent',
  lowStock: 'bg-bg-brand-subtle text-text-brand',
}
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'sale',
    validator: (value) => Object.keys(VARIANT_CLASSES).includes(value),
  },
})

const classes = computed(() => [
  'inline-flex items-center rounded-sm px-2 py-1 text-sm font-medium',
  VARIANT_CLASSES[props.variant],
])
</script>

<template>
  <span :class="classes"><slot /></span>
</template>
