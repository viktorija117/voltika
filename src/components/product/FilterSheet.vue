<script setup>
import { useI18n } from 'vue-i18n'

import { useProductFilters } from '@/composables/useProductFilters'

import ProductFilters from '@/components/product/ProductFilters.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDialogPanel from '@/components/ui/BaseDialogPanel.vue'

defineProps({
  open: { type: Boolean, default: false },
  brandOptions: { type: Array, required: true },
  /** Products matching the current filters, shown on the "show" button. */
  resultCount: { type: Number, required: true },
})
const emit = defineEmits(['close'])

const { t } = useI18n()
const { clearAll } = useProductFilters()
</script>

<template>
  <!-- Filters apply right away (the list updates behind the sheet); the button only closes it. -->
  <BaseDialogPanel
    :open="open"
    :title="t('filters.title')"
    :close-label="t('filters.close')"
    position="bottom"
    @close="emit('close')"
  >
    <ProductFilters :brand-options="brandOptions" />
    <template #footer>
      <div class="grid grid-cols-[auto_1fr] gap-3">
        <BaseButton variant="secondary" @click="clearAll()">{{ t('filters.clearAll') }}</BaseButton>
        <BaseButton @click="emit('close')">
          {{ t('filters.showResults', { count: resultCount }) }}
        </BaseButton>
      </div>
    </template>
  </BaseDialogPanel>
</template>
