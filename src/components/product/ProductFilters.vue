<script setup>
import { computed, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductFilters } from '@/composables/useProductFilters'
import {
  PRICE_FILTER_DEBOUNCE_MS,
  RATING_FILTER_OPTIONS,
  VISIBLE_BRAND_COUNT,
} from '@/config/catalog'
import { debounce } from '@/utils/debounce'

import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps({
  /** Brands on the current shelf with their product counts. */
  brandOptions: { type: Array, required: true },
})

const { t } = useI18n()
const { filters, update, toggleBrand } = useProductFilters()
const showAllBrands = ref(false)

// Selected brands stay visible even when the list is collapsed.
const visibleBrands = computed(() =>
  showAllBrands.value
    ? props.brandOptions
    : props.brandOptions.filter(
        ({ brand }, index) => index < VISIBLE_BRAND_COUNT || filters.value.brands.includes(brand),
      ),
)
const hiddenBrandCount = computed(() => props.brandOptions.length - visibleBrands.value.length)

function toPrice(value) {
  const number = Number.parseInt(value, 10)
  return number > 0 ? number : null
}

// One debouncer per field, so typing "do" right after "od" does not cancel "od".
const applyMinPrice = debounce(
  (value) => update({ minPrice: toPrice(value) }),
  PRICE_FILTER_DEBOUNCE_MS,
)
const applyMaxPrice = debounce(
  (value) => update({ maxPrice: toPrice(value) }),
  PRICE_FILTER_DEBOUNCE_MS,
)
onUnmounted(() => {
  applyMinPrice.cancel()
  applyMaxPrice.cancel()
})

const FIELDSET_CLASS = 'flex flex-col gap-2 border-b border-border-subtle pb-6'
const LEGEND_CLASS = 'mb-2 font-heading text-lg font-medium'
const OPTION_CLASS = 'flex min-h-11 cursor-pointer items-center gap-3 text-sm'
const CONTROL_CLASS = 'size-5 shrink-0 accent-bg-brand'
</script>

<template>
  <div class="flex flex-col gap-6">
    <fieldset :class="FIELDSET_CLASS">
      <legend :class="LEGEND_CLASS">{{ t('filters.price') }}</legend>
      <div class="grid grid-cols-2 gap-3">
        <BaseInput
          :model-value="filters.minPrice ? String(filters.minPrice) : ''"
          :label="t('filters.priceFrom')"
          type="number"
          inputmode="numeric"
          min="0"
          @update:model-value="applyMinPrice"
        />
        <BaseInput
          :model-value="filters.maxPrice ? String(filters.maxPrice) : ''"
          :label="t('filters.priceTo')"
          type="number"
          inputmode="numeric"
          min="0"
          @update:model-value="applyMaxPrice"
        />
      </div>
    </fieldset>

    <fieldset v-if="brandOptions.length" :class="FIELDSET_CLASS">
      <legend :class="LEGEND_CLASS">{{ t('filters.brand') }}</legend>
      <label v-for="{ brand, count } in visibleBrands" :key="brand" :class="OPTION_CLASS">
        <input
          type="checkbox"
          :checked="filters.brands.includes(brand)"
          :class="CONTROL_CLASS"
          @change="toggleBrand(brand)"
        />
        {{ brand }}
        <span class="text-xs text-text-muted">({{ count }})</span>
      </label>
      <button
        v-if="hiddenBrandCount > 0 || showAllBrands"
        type="button"
        :aria-expanded="showAllBrands"
        class="self-start py-2 text-sm font-medium text-text-brand hover:underline"
        @click="showAllBrands = !showAllBrands"
      >
        {{
          showAllBrands
            ? t('filters.showFewerBrands')
            : t('filters.showMoreBrands', { count: hiddenBrandCount })
        }}
      </button>
    </fieldset>

    <fieldset :class="FIELDSET_CLASS">
      <legend :class="LEGEND_CLASS">{{ t('filters.rating') }}</legend>
      <label :class="OPTION_CLASS">
        <input
          type="radio"
          name="min-rating"
          :checked="filters.minRating === null"
          :class="CONTROL_CLASS"
          @change="update({ minRating: null })"
        />
        {{ t('filters.anyRating') }}
      </label>
      <label v-for="rating in RATING_FILTER_OPTIONS" :key="rating" :class="OPTION_CLASS">
        <input
          type="radio"
          name="min-rating"
          :checked="filters.minRating === rating"
          :class="CONTROL_CLASS"
          @change="update({ minRating: rating })"
        />
        {{ t('filters.ratingAtLeast', { rating }) }}
      </label>
    </fieldset>

    <fieldset :class="FIELDSET_CLASS">
      <legend :class="LEGEND_CLASS">{{ t('filters.availability') }}</legend>
      <label :class="OPTION_CLASS">
        <input
          type="checkbox"
          :checked="filters.inStockOnly"
          :class="CONTROL_CLASS"
          @change="update({ inStockOnly: $event.target.checked })"
        />
        {{ t('filters.inStockOnly') }}
      </label>
    </fieldset>
  </div>
</template>
