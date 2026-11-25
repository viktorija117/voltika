<script>
// Module scope, so the defineProps validator below can use it.
const VARIANT_CLASSES = {
  brand: 'border border-border-subtle bg-spotlight text-text-default',
  accent: 'bg-holo text-text-on-accent',
}
</script>

<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import { PRODUCT_IMAGE_SIZE } from '@/config/catalog'
import { mainProductImage } from '@/utils/productImage'

const props = defineProps({
  variant: {
    type: String,
    default: 'brand',
    validator: (value) => Object.keys(VARIANT_CLASSES).includes(value),
  },
  title: { type: String, required: true },
  text: { type: String, required: true },
  linkLabel: { type: String, required: true },
  to: { type: [String, Object], required: true },
  /** Product photographed on the right; null while the catalog loads. */
  product: { type: Object, default: null },
})

const image = computed(() => mainProductImage(props.product))
</script>

<template>
  <!-- The whole banner is one link; the title is its name. -->
  <RouterLink
    :to="to"
    :class="[
      'group relative isolate flex min-h-48 flex-col justify-center gap-3 overflow-hidden rounded-lg p-6 lg:min-h-60 lg:p-8',
      VARIANT_CLASSES[variant],
    ]"
  >
    <h2 class="max-w-[60%] font-heading text-2xl font-semibold lg:text-3xl">{{ title }}</h2>
    <p class="max-w-[60%] text-sm">{{ text }}</p>
    <span class="flex items-center gap-1 text-sm font-medium group-hover:underline">
      {{ linkLabel }}
      <ArrowRight :size="16" aria-hidden="true" />
    </span>
    <!-- Decorative: the banner's link text already names the offer. -->
    <span
      aria-hidden="true"
      class="absolute -right-10 -bottom-16 -z-10 size-56 rounded-full bg-holo opacity-30 blur-3xl lg:size-72"
    />
    <img
      v-if="image"
      :src="image"
      alt=""
      :width="PRODUCT_IMAGE_SIZE"
      :height="PRODUCT_IMAGE_SIZE"
      loading="lazy"
      decoding="async"
      class="absolute -right-4 -bottom-6 -z-10 h-[90%] w-auto max-w-[50%] object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none lg:-right-2 lg:h-[105%]"
    />
  </RouterLink>
</template>
