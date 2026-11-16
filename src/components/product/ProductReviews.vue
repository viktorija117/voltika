<script setup>
import { useI18n } from 'vue-i18n'

import RatingStars from '@/components/product/RatingStars.vue'

defineProps({
  /** @type {import('vue').PropType<import('@/services/productMapper').Review[]>} */
  reviews: { type: Array, required: true },
})

const { t, d } = useI18n()
</script>

<template>
  <p v-if="!reviews.length" class="text-text-muted">{{ t('product.noReviews') }}</p>
  <ul v-else class="flex flex-col divide-y divide-border-subtle">
    <!-- Reviews have no id in the API; author + date is unique per product. -->
    <li
      v-for="review in reviews"
      :key="`${review.author}-${review.date}`"
      class="flex flex-col gap-2 py-4 first:pt-0"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <p class="font-medium">{{ review.author }}</p>
        <time v-if="review.date" :datetime="review.date" class="text-sm text-text-muted">
          {{ d(new Date(review.date), 'review') }}
        </time>
      </div>
      <RatingStars :rating="review.rating" />
      <p v-if="review.comment">{{ review.comment }}</p>
    </li>
  </ul>
</template>
