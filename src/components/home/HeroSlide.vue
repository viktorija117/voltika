<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

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
  /** The featured product; null while the catalog loads. */
  product: { type: Object, default: null },
  /**
   * The first slide's photo is the largest thing on the page and loads first. The others load
   * right after with low priority: a lazy image on a hidden slide would only start when shown.
   */
  isFirst: { type: Boolean, default: false },
})

const { t } = useI18n()

const image = computed(() => mainProductImage(props.product))
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
    <!-- The product stands on soft holographic light, like a studio shot. -->
    <figure class="relative flex h-64 items-center justify-center lg:order-last lg:h-auto lg:p-10">
      <span
        aria-hidden="true"
        class="absolute size-60 rounded-full bg-holo opacity-30 blur-3xl lg:size-96"
      />
      <span
        aria-hidden="true"
        class="absolute bottom-6 h-5 w-2/5 rounded-full bg-bg-inverse/80 blur-lg lg:bottom-12"
      />
      <img
        v-if="image"
        :src="image"
        :alt="product.name"
        :width="PRODUCT_IMAGE_SIZE"
        :height="PRODUCT_IMAGE_SIZE"
        loading="eager"
        :fetchpriority="isFirst ? 'high' : 'low'"
        decoding="async"
        class="relative max-h-56 w-auto object-contain drop-shadow-2xl lg:max-h-80"
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
      <BaseButton :to="slide.to" variant="accent">{{
        t(`home.slides.${slide.id}.cta`)
      }}</BaseButton>
      <p v-if="product" class="text-xs text-text-muted">
        {{ t('home.productCaption', { name: product.name }) }}
      </p>
    </div>
  </div>
</template>
