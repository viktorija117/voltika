<script setup>
import { useI18n } from 'vue-i18n'

import { PRODUCT_IMAGE_SIZE } from '@/config/catalog'

import BaseDialogPanel from '@/components/ui/BaseDialogPanel.vue'

defineProps({
  open: { type: Boolean, default: false },
  src: { type: String, required: true },
  /** Product name: the dialog title and the image's alt text. */
  name: { type: String, required: true },
})
const emit = defineEmits(['close'])

const { t } = useI18n()
</script>

<template>
  <BaseDialogPanel
    :open="open"
    :title="name"
    :close-label="t('product.closeZoom')"
    position="center"
    @close="emit('close')"
  >
    <img
      :src="src"
      :alt="name"
      :width="PRODUCT_IMAGE_SIZE"
      :height="PRODUCT_IMAGE_SIZE"
      decoding="async"
      class="mx-auto max-h-[70dvh] w-auto object-contain"
    />
  </BaseDialogPanel>
</template>
