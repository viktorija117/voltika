<script setup>
import { X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductFilters } from '@/composables/useProductFilters'
import { formatPrice } from '@/utils/price'

const { t } = useI18n()
const { filters, update, toggleBrand, clearAll } = useProductFilters()

// Each chip knows its own label and how to remove itself.
const chips = computed(() => {
  const { brands, minPrice, maxPrice, minRating, inStockOnly } = filters.value
  return [
    ...brands.map((brand) => ({
      id: `brand-${brand}`,
      label: brand,
      remove: () => toggleBrand(brand),
    })),
    minPrice && {
      id: 'min-price',
      label: t('filters.chipFrom', { price: formatPrice(minPrice) }),
      remove: () => update({ minPrice: null }),
    },
    maxPrice && {
      id: 'max-price',
      label: t('filters.chipTo', { price: formatPrice(maxPrice) }),
      remove: () => update({ maxPrice: null }),
    },
    minRating && {
      id: 'rating',
      label: t('filters.chipRating', { rating: minRating }),
      remove: () => update({ minRating: null }),
    },
    inStockOnly && {
      id: 'in-stock',
      label: t('filters.inStockOnly'),
      remove: () => update({ inStockOnly: false }),
    },
  ].filter(Boolean)
})
</script>

<template>
  <div v-if="chips.length" class="flex flex-wrap items-center gap-2">
    <h2 class="sr-only">{{ t('filters.active') }}</h2>
    <ul class="flex flex-wrap gap-2">
      <li v-for="chip in chips" :key="chip.id">
        <button
          type="button"
          :aria-label="t('filters.remove', { label: chip.label })"
          class="flex h-9 items-center gap-1 rounded-full border border-border-input bg-bg-surface px-3 text-sm font-medium hover:bg-bg-subtle"
          @click="chip.remove()"
        >
          {{ chip.label }}
          <X :size="16" aria-hidden="true" class="text-text-muted" />
        </button>
      </li>
    </ul>
    <button
      type="button"
      class="h-9 px-2 text-sm font-medium text-text-brand hover:underline"
      @click="clearAll()"
    >
      {{ t('filters.clearAll') }}
    </button>
  </div>
</template>
