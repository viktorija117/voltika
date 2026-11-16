<script setup>
import { PackageSearch, RotateCcw, SlidersHorizontal, WifiOff } from 'lucide-vue-next'
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProductFilters } from '@/composables/useProductFilters'
import { useProductListing } from '@/composables/useProductListing'
import { useCatalogStore } from '@/stores/catalog'
import { categoryLabelKey } from '@/utils/categories'
import { buildFilterQuery } from '@/utils/filterQuery'
import { productListRoute } from '@/utils/routes'

import ActiveFilterChips from '@/components/product/ActiveFilterChips.vue'
import FilterSheet from '@/components/product/FilterSheet.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'
import ProductFilters from '@/components/product/ProductFilters.vue'
import SortSelect from '@/components/product/SortSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BasePagination from '@/components/ui/BasePagination.vue'
import BaseStateMessage from '@/components/ui/BaseStateMessage.vue'

// Enough placeholders to fill the first screen on desktop.
const SKELETON_CARD_COUNT = 6
const GRID_CLASS = 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6'

const { t } = useI18n()
const catalog = useCatalogStore()
catalog.load()

const { filters, activeFilterCount } = useProductFilters()
const { brandOptions, results, currentPage } = useProductListing(
  toRef(catalog, 'products'),
  filters,
)
const isFilterSheetOpen = ref(false)

const isPending = computed(() => catalog.status === 'idle' || catalog.isLoading)

const title = computed(() => {
  const { search, category } = filters.value
  if (search) return t('productList.searchTitle', { term: search })
  const labelKey = categoryLabelKey(category)
  return labelKey ? t(labelKey) : t('pages.products.title')
})

const showingText = computed(() => {
  const { firstIndex, items } = currentPage.value
  return t('productList.showing', {
    from: firstIndex + 1,
    to: firstIndex + items.length,
    total: results.value.length,
  })
})

function pageLink(page) {
  return { query: buildFilterQuery({ ...filters.value, page }) }
}
</script>

<template>
  <section aria-labelledby="product-list-title">
    <header class="mb-6 flex flex-wrap items-baseline justify-between gap-2">
      <h1 id="product-list-title" class="heading-1">{{ title }}</h1>
      <p v-if="catalog.status === 'success'" aria-live="polite" class="text-text-muted">
        {{ t('productList.count', results.length) }}
      </p>
    </header>

    <div class="lg:grid lg:grid-cols-[17.625rem_1fr] lg:gap-8">
      <aside :aria-label="t('filters.title')" class="hidden lg:block">
        <ProductFilters :brand-options="brandOptions" />
      </aside>

      <div class="flex min-w-0 flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <BaseButton
            variant="secondary"
            :icon="SlidersHorizontal"
            aria-haspopup="dialog"
            class="lg:hidden"
            @click="isFilterSheetOpen = true"
          >
            {{
              activeFilterCount
                ? t('filters.openWithCount', { count: activeFilterCount })
                : t('filters.open')
            }}
          </BaseButton>
          <p v-if="results.length" class="hidden text-sm text-text-muted lg:block">
            {{ showingText }}
          </p>
          <SortSelect />
        </div>

        <ActiveFilterChips />

        <div v-if="isPending" aria-busy="true">
          <p role="status" class="sr-only">{{ t('productList.loading') }}</p>
          <ul :class="GRID_CLASS">
            <li v-for="index in SKELETON_CARD_COUNT" :key="index"><ProductCardSkeleton /></li>
          </ul>
        </div>

        <BaseStateMessage
          v-else-if="catalog.hasError"
          role="alert"
          :icon="WifiOff"
          :title="t('productList.errorTitle')"
          :description="t('productList.errorDescription')"
        >
          <BaseButton :icon="RotateCcw" @click="catalog.retry()">
            {{ t('productList.retry') }}
          </BaseButton>
        </BaseStateMessage>

        <BaseStateMessage
          v-else-if="!results.length"
          :icon="PackageSearch"
          :title="t('productList.emptyTitle')"
          :description="t('productList.emptyDescription')"
        >
          <BaseButton :to="productListRoute()" variant="secondary">
            {{ t('productList.showAll') }}
          </BaseButton>
        </BaseStateMessage>

        <template v-else>
          <ul :class="GRID_CLASS">
            <li v-for="product in currentPage.items" :key="product.id">
              <ProductCard :product="product" />
            </li>
          </ul>
          <BasePagination
            :page="currentPage.page"
            :page-count="currentPage.pageCount"
            :page-link="pageLink"
            class="mt-4"
          />
        </template>
      </div>
    </div>

    <FilterSheet
      :open="isFilterSheetOpen"
      :brand-options="brandOptions"
      :result-count="results.length"
      @close="isFilterSheetOpen = false"
    />
  </section>
</template>
