<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

// `?inline` turns the 4 KB image into a data URL, so it needs no request of its own.
import heroStageUrl from '@/assets/banners/hero-stage.webp?inline'
import { PRODUCT_IMAGE_SIZE } from '@/config/catalog'
import { INSTALLMENT_COUNT } from '@/config/pricing'
import { formatPrice, installmentAmount } from '@/utils/price'
import { mainProductImage } from '@/utils/productImage'

import PriceTag from '@/components/product/PriceTag.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps({
  /** One entry of HERO_SLIDES. */
  slide: { type: Object, required: true },
  /** The featured product; null while the catalog loads or when it failed to load. */
  product: { type: Object, default: null },
  /** True while the catalog loads: price and caption show placeholders of the same size. */
  isPending: { type: Boolean, default: false },
  /**
   * The first slide's photo is the largest thing on the page and loads first. The others load
   * right after with low priority: a lazy image on a hidden slide would only start when shown.
   */
  isFirst: { type: Boolean, default: false },
})

const { t } = useI18n()

// Natural size of the stage image; blurred light scales to any column size without visible loss.
const STAGE_WIDTH = 800
const STAGE_HEIGHT = 555
const SKELETON_CLASS = 'animate-pulse motion-reduce:animate-none'

const image = computed(() => mainProductImage(props.product))
// The photo stays hidden until it has loaded, then fades in instead of popping in half-drawn.
const loadedImage = ref(null)
const isPhotoLoaded = computed(() => loadedImage.value === image.value)
const isDealPrice = computed(() => props.slide.priceStyle === 'deal')
const hasDiscountBadge = computed(() => isDealPrice.value && props.product?.discountPercent > 0)

// One-line price for the `from` and `installments` styles; `deal` uses PriceTag instead.
const priceLine = computed(() => {
  if (!props.product || isDealPrice.value) return ''
  const { price } = props.product
  if (props.slide.priceStyle === 'from') return t('home.priceFrom', { price: formatPrice(price) })
  return t('home.priceInstallments', {
    count: INSTALLMENT_COUNT,
    amount: formatPrice(installmentAmount(price, INSTALLMENT_COUNT)),
  })
})
</script>

<template>
  <div
    class="relative isolate grid overflow-hidden rounded-lg border border-border-subtle bg-spotlight lg:min-h-[26rem] lg:grid-cols-2"
  >
    <!--
      The product stands on soft holographic light, like a studio shot. The light is a tiny
      image inlined in the page code, so the banner looks complete at once; the product photo
      needs the catalog first and fades in on top of it when it arrives.
      The image is light on black: `screen` blending drops the black and keeps only the light.
    -->
    <figure class="relative flex h-64 items-center justify-center lg:order-last lg:h-auto lg:p-10">
      <img
        :src="heroStageUrl"
        alt=""
        :width="STAGE_WIDTH"
        :height="STAGE_HEIGHT"
        class="absolute inset-0 size-full object-cover mix-blend-screen"
      />
      <span
        aria-hidden="true"
        class="absolute bottom-6 h-5 w-2/5 rounded-full bg-bg-inverse/80 blur-lg lg:bottom-12"
      />
      <img
        v-if="image"
        :key="image"
        :src="image"
        :alt="product.name"
        :width="PRODUCT_IMAGE_SIZE"
        :height="PRODUCT_IMAGE_SIZE"
        loading="eager"
        :fetchpriority="isFirst ? 'high' : 'low'"
        decoding="async"
        :class="[
          'relative max-h-56 w-auto object-contain drop-shadow-2xl transition duration-500 ease-out motion-reduce:transition-none lg:max-h-80',
          isPhotoLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
        ]"
        @load="loadedImage = image"
      />
      <BaseBadge
        v-if="hasDiscountBadge"
        variant="sale"
        class="absolute top-5 right-5 px-3 py-1.5 text-base lg:top-10 lg:right-10"
      >
        {{ t('product.discount', { percent: product.discountPercent }) }}
      </BaseBadge>
    </figure>

    <div class="flex flex-col items-start gap-4 p-6 pt-0 lg:justify-center lg:gap-5 lg:p-14">
      <p class="text-holo text-xs font-semibold tracking-[0.14em] uppercase">
        {{ t(`home.slides.${slide.id}.eyebrow`) }}
      </p>
      <h2 class="font-heading text-3xl font-semibold tracking-[-0.03em] text-balance lg:text-5xl">
        {{ t(`home.slides.${slide.id}.title`, slide.textParams ?? {}) }}
      </h2>
      <p class="max-w-md text-text-muted">
        {{ t(`home.slides.${slide.id}.text`, slide.textParams ?? {}) }}
      </p>
      <template v-if="product">
        <PriceTag
          v-if="isDealPrice"
          :price="product.price"
          :old-price="product.oldPrice"
          :savings="product.savings"
        />
        <p v-else class="font-heading text-xl font-semibold">{{ priceLine }}</p>
      </template>
      <!-- Same height as the price, so the button does not jump when the product arrives. -->
      <div
        v-else-if="isPending"
        aria-hidden="true"
        :class="['flex flex-col gap-1', SKELETON_CLASS]"
      >
        <div class="h-7 w-40 rounded-sm bg-bg-subtle" />
        <div v-if="isDealPrice" class="h-5 w-32 rounded-sm bg-bg-subtle" />
      </div>
      <BaseButton :to="slide.to" variant="accent">{{
        t(`home.slides.${slide.id}.cta`)
      }}</BaseButton>
      <p v-if="product" class="text-xs text-text-muted">
        {{ t('home.productCaption', { name: product.name }) }}
      </p>
      <div
        v-else-if="isPending"
        aria-hidden="true"
        :class="['h-4 w-28 rounded-sm bg-bg-subtle', SKELETON_CLASS]"
      />
    </div>
  </div>
</template>
