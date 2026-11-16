<script setup>
import { ImageOff, ZoomIn } from 'lucide-vue-next'
import { computed, defineAsyncComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { nextIndexForKey } from '@/utils/keyboard'

// The zoom dialog is loaded on the first click only; most visitors never open it.
const ProductImageZoom = defineAsyncComponent(
  () => import('@/components/product/ProductImageZoom.vue'),
)

// Full-size API images are 1000x1000, thumbnails are shown at 64px.
const IMAGE_SIZE = 1000
const THUMBNAIL_SIZE = 64

const props = defineProps({
  /** Image URLs; the first one is the main image. */
  images: { type: Array, required: true },
  /** Product name, used as the alt text. */
  name: { type: String, required: true },
})

const { t } = useI18n()
const selectedIndex = ref(0)
// Stored by index: the order of a plain ref array inside v-for is not guaranteed.
const thumbnailButtons = []
const isZoomOpen = ref(false)
const hasOpenedZoom = ref(false)

const selectedImage = computed(() => props.images[selectedIndex.value] ?? null)
const hasThumbnails = computed(() => props.images.length > 1)

function openZoom() {
  hasOpenedZoom.value = true
  isZoomOpen.value = true
}

// Left/Right (and Home/End) move between thumbnails, like a toolbar.
function handleThumbnailKeydown(event) {
  const next = nextIndexForKey(event.key, selectedIndex.value, props.images.length)
  if (next === null) return
  event.preventDefault()
  selectedIndex.value = next
  thumbnailButtons[next].focus()
}
</script>

<template>
  <section :aria-label="t('product.gallery')" class="flex flex-col gap-3">
    <button
      v-if="selectedImage"
      type="button"
      :aria-label="t('product.zoom')"
      class="group relative aspect-square overflow-hidden rounded-lg bg-bg-subtle"
      @click="openZoom"
    >
      <img
        :src="selectedImage"
        :alt="name"
        :width="IMAGE_SIZE"
        :height="IMAGE_SIZE"
        fetchpriority="high"
        class="size-full object-contain p-6"
      />
      <span
        class="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-full bg-bg-surface text-text-default shadow-md group-hover:text-text-brand"
        aria-hidden="true"
      >
        <ZoomIn :size="20" />
      </span>
    </button>
    <div
      v-else
      class="flex aspect-square items-center justify-center rounded-lg bg-bg-subtle text-text-muted"
    >
      <ImageOff :size="48" aria-hidden="true" />
      <span class="sr-only">{{ t('product.noImage') }}</span>
    </div>

    <ul v-if="hasThumbnails" class="flex gap-2 overflow-x-auto p-1">
      <li v-for="(image, index) in images" :key="image">
        <button
          :ref="(element) => (thumbnailButtons[index] = element)"
          type="button"
          :aria-label="t('product.imageOf', { current: index + 1, total: images.length })"
          :aria-current="index === selectedIndex ? 'true' : undefined"
          :class="[
            'block size-16 overflow-hidden rounded-md border-2 bg-bg-subtle',
            index === selectedIndex ? 'border-border-focus' : 'border-transparent',
          ]"
          @click="selectedIndex = index"
          @keydown="handleThumbnailKeydown"
        >
          <img
            :src="image"
            alt=""
            :width="THUMBNAIL_SIZE"
            :height="THUMBNAIL_SIZE"
            loading="lazy"
            class="size-full object-contain p-1"
          />
        </button>
      </li>
    </ul>

    <ProductImageZoom
      v-if="hasOpenedZoom && selectedImage"
      :open="isZoomOpen"
      :src="selectedImage"
      :name="name"
      @close="isZoomOpen = false"
    />
  </section>
</template>
