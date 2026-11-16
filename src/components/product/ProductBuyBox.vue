<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { INSTALLMENT_COUNT } from '@/config/pricing'
import { formatPrice, installmentAmount } from '@/utils/price'

import PriceTag from '@/components/product/PriceTag.vue'
import ProductServiceInfo from '@/components/product/ProductServiceInfo.vue'
import RatingStars from '@/components/product/RatingStars.vue'
import StockStatus from '@/components/product/StockStatus.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').ProductDetails>} */
  product: { type: Object, required: true },
})

const { t } = useI18n()

const installmentText = computed(() =>
  t('product.installments', {
    count: INSTALLMENT_COUNT,
    amount: formatPrice(installmentAmount(props.product.price, INSTALLMENT_COUNT)),
  }),
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <p v-if="product.brand" class="text-sm font-medium tracking-wide text-text-muted uppercase">
        {{ product.brand }}
      </p>
      <h1 class="font-heading text-2xl font-bold lg:text-3xl">{{ product.name }}</h1>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-1">
        <RatingStars v-if="product.rating" :rating="product.rating" :count="product.reviewCount" />
        <p v-if="product.sku" class="text-sm text-text-muted">
          {{ t('product.sku', { sku: product.sku }) }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-2 border-y border-border-subtle py-4">
      <BaseBadge v-if="product.discountPercent" variant="sale" class="self-start">
        {{ t('product.discount', { percent: product.discountPercent }) }}
      </BaseBadge>
      <PriceTag
        :price="product.price"
        :old-price="product.oldPrice"
        :savings="product.savings"
        size="large"
      />
      <p class="text-sm text-text-muted">{{ installmentText }}</p>
    </div>

    <StockStatus :status="product.stockStatus" class="text-sm" />

    <ProductServiceInfo
      :shipping="product.shipping"
      :warranty="product.warranty"
      :return-policy="product.returnPolicy"
    />
  </div>
</template>
