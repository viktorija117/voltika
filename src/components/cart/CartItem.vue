<script setup>
import { ImageOff, Trash2 } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { maxCartQuantity } from '@/utils/cart'
import { formatPrice } from '@/utils/price'

import BaseQuantityInput from '@/components/ui/BaseQuantityInput.vue'

// Thumbnails from the API are 300x300, shown at 80px.
const THUMBNAIL_SIZE = 80

const props = defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').Product>} */
  product: { type: Object, required: true },
  quantity: { type: Number, required: true },
})
const emit = defineEmits(['update:quantity', 'remove'])

const { t } = useI18n()

const productRoute = computed(() => ({ name: 'product', params: { id: props.product.id } }))
const lineTotal = computed(() => props.product.price * props.quantity)
const maxQuantity = computed(() => maxCartQuantity(props.product.stock))
const quantityLabel = computed(() => `${t('quantity.label')}: ${props.product.name}`)
</script>

<template>
  <article class="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-3 py-4 sm:grid-cols-[5rem_1fr_auto]">
    <img
      v-if="product.thumbnail"
      :src="product.thumbnail"
      alt=""
      :width="THUMBNAIL_SIZE"
      :height="THUMBNAIL_SIZE"
      loading="lazy"
      class="size-20 rounded-md bg-bg-subtle object-contain p-1"
    />
    <div v-else class="flex size-20 items-center justify-center rounded-md bg-bg-subtle">
      <ImageOff :size="24" aria-hidden="true" class="text-text-muted" />
    </div>

    <div class="flex min-w-0 flex-col gap-1">
      <h3 class="font-medium">
        <RouterLink :to="productRoute" class="hover:text-text-brand hover:underline">
          {{ product.name }}
        </RouterLink>
      </h3>
      <p class="text-sm text-text-muted">
        {{ t('cart.unitPrice', { price: formatPrice(product.price) }) }}
      </p>
    </div>

    <div
      class="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:flex-col sm:items-end"
    >
      <p class="font-heading text-lg font-bold">{{ formatPrice(lineTotal) }}</p>
      <div class="flex items-center gap-2">
        <BaseQuantityInput
          :model-value="quantity"
          :max="maxQuantity"
          :label="quantityLabel"
          @update:model-value="emit('update:quantity', $event)"
        />
        <button
          type="button"
          :aria-label="t('cart.remove', { name: product.name })"
          class="flex size-11 items-center justify-center rounded-md text-text-muted hover:bg-bg-subtle hover:text-text-error"
          @click="emit('remove')"
        >
          <Trash2 :size="20" aria-hidden="true" />
        </button>
      </div>
    </div>
  </article>
</template>
