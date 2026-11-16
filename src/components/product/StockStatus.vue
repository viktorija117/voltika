<script>
// Module scope, so the defineProps validator below can use it.
import { CircleAlert, CircleCheck } from 'lucide-vue-next'

const STOCK_STYLES = {
  inStock: { icon: CircleCheck, class: 'text-text-success' },
  lowStock: { icon: CircleAlert, class: 'text-text-sale' },
  outOfStock: { icon: null, class: 'text-text-muted' },
}
</script>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => Object.keys(STOCK_STYLES).includes(value),
  },
})

const { t } = useI18n()
const style = computed(() => STOCK_STYLES[props.status])
</script>

<template>
  <!-- The status is said in words; color and icon only support it. -->
  <p :class="['flex items-center gap-1 font-medium', style.class]">
    <component :is="style.icon" v-if="style.icon" :size="16" aria-hidden="true" />
    {{ t(`product.stock.${status}`) }}
  </p>
</template>
