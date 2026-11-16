<script setup>
import { CircleAlert, CircleCheck, ImageOff } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import PriceTag from '@/components/product/PriceTag.vue'
import RatingStars from '@/components/product/RatingStars.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

// Thumbnails from the API are 300x300; fixed size avoids layout shift while they load.
const IMAGE_SIZE = 300

const STOCK_STYLES = {
  inStock: { icon: CircleCheck, class: 'text-text-success' },
  lowStock: { icon: CircleAlert, class: 'text-text-sale' },
  outOfStock: { icon: null, class: 'text-text-muted' },
}

const props = defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').Product>} */
  product: { type: Object, required: true },
})

const { t } = useI18n()
const stockStyle = computed(() => STOCK_STYLES[props.product.stockStatus])
const productRoute = computed(() => ({ name: 'product', params: { id: props.product.id } }))
</script>

<template>
  <!-- The name link stretches over the whole card (after:inset-0): one link, one tab stop. -->
  <article
    class="relative flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface transition-shadow hover:shadow-lg has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-border-focus motion-reduce:transition-none"
  >
    <div class="relative aspect-square bg-bg-subtle">
      <img
        v-if="product.thumbnail"
        :src="product.thumbnail"
        :alt="product.name"
        :width="IMAGE_SIZE"
        :height="IMAGE_SIZE"
        loading="lazy"
        decoding="async"
        class="size-full object-contain p-4"
      />
      <div v-else class="flex size-full items-center justify-center text-text-muted">
        <ImageOff :size="40" aria-hidden="true" />
        <span class="sr-only">{{ t('product.noImage') }}</span>
      </div>
      <BaseBadge v-if="product.discountPercent" variant="sale" class="absolute top-3 left-3">
        {{ t('product.discount', { percent: product.discountPercent }) }}
      </BaseBadge>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-4">
      <p v-if="product.brand" class="text-xs font-medium tracking-wide text-text-muted uppercase">
        {{ product.brand }}
      </p>
      <h3 class="line-clamp-2 min-h-12">
        <RouterLink
          :to="productRoute"
          class="after:absolute after:inset-0 hover:text-text-brand focus-visible:outline-none"
        >
          {{ product.name }}
        </RouterLink>
      </h3>
      <RatingStars v-if="product.rating" :rating="product.rating" :count="product.reviewCount" />
      <PriceTag
        :price="product.price"
        :old-price="product.oldPrice"
        :savings="product.savings"
        class="mt-1"
      />
      <p :class="['mt-auto flex items-center gap-1 pt-2 text-xs font-medium', stockStyle.class]">
        <component :is="stockStyle.icon" v-if="stockStyle.icon" :size="16" aria-hidden="true" />
        {{ t(`product.stock.${product.stockStatus}`) }}
      </p>
    </div>
  </article>
</template>
