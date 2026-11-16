<script setup>
import { Star } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  /** Average rating, 0–5. */
  rating: { type: Number, required: true },
  /** Number of reviews. */
  count: { type: Number, default: 0 },
})

const { t, n } = useI18n()

// Stars are drawn in half steps: 4.3 -> 4.5 -> four full stars and one half star.
const stars = computed(() => {
  const rounded = Math.round(props.rating * 2) / 2
  return [1, 2, 3, 4, 5].map((position) => {
    if (rounded >= position) return 'full'
    if (rounded >= position - 0.5) return 'half'
    return 'empty'
  })
})

const formattedRating = computed(() => n(props.rating, 'rating'))
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Visual stars and numbers are hidden from screen readers; the sentence below says it all. -->
    <span class="flex" aria-hidden="true">
      <span v-for="(state, index) in stars" :key="index" class="relative size-4">
        <Star :size="16" class="text-border-input" />
        <span
          v-if="state !== 'empty'"
          :class="[
            'absolute inset-0 overflow-hidden text-text-brand',
            state === 'half' ? 'w-1/2' : 'w-full',
          ]"
        >
          <Star :size="16" fill="currentColor" />
        </span>
      </span>
    </span>
    <span class="text-sm font-medium" aria-hidden="true">{{ formattedRating }}</span>
    <span class="text-xs text-text-muted" aria-hidden="true">({{ count }})</span>
    <span class="sr-only">
      {{ t('product.rating', { rating: formattedRating }) }}, {{ t('product.reviews', count) }}
    </span>
  </div>
</template>
