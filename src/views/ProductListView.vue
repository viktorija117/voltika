<script setup>
import { PackageSearch, RotateCcw, WifiOff } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

import { NAV_CATEGORIES, QUERY_KEYS } from '@/config/catalog'
import { useCatalogStore } from '@/stores/catalog'
import { filterProducts } from '@/utils/productFilters'
import { productListRoute } from '@/utils/routes'

import ProductCard from '@/components/product/ProductCard.vue'
import ProductCardSkeleton from '@/components/product/ProductCardSkeleton.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseStateMessage from '@/components/ui/BaseStateMessage.vue'

// Enough placeholders to fill the first screen on desktop.
const SKELETON_CARD_COUNT = 8

const { t } = useI18n()
const route = useRoute()
const catalog = useCatalogStore()
catalog.load()

const category = computed(() => String(route.query[QUERY_KEYS.category] ?? ''))
const search = computed(() => String(route.query[QUERY_KEYS.search] ?? ''))

const products = computed(() =>
  filterProducts(catalog.products, { category: category.value, search: search.value }),
)

const isPending = computed(() => catalog.status === 'idle' || catalog.isLoading)

const title = computed(() => {
  if (search.value) return t('productList.searchTitle', { term: search.value })
  const categoryEntry = NAV_CATEGORIES.find(({ slug }) => slug === category.value)
  return categoryEntry ? t(categoryEntry.labelKey) : t('pages.products.title')
})
</script>

<template>
  <section aria-labelledby="product-list-title">
    <header class="mb-6 flex flex-wrap items-baseline justify-between gap-2">
      <h1 id="product-list-title" class="heading-1">{{ title }}</h1>
      <p v-if="catalog.status === 'success'" aria-live="polite" class="text-text-muted">
        {{ t('productList.count', products.length) }}
      </p>
    </header>

    <div v-if="isPending" aria-busy="true">
      <p role="status" class="sr-only">{{ t('productList.loading') }}</p>
      <ul class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
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
      v-else-if="!products.length"
      :icon="PackageSearch"
      :title="t('productList.emptyTitle')"
      :description="t('productList.emptyDescription')"
    >
      <BaseButton :to="productListRoute()" variant="secondary">
        {{ t('productList.showAll') }}
      </BaseButton>
    </BaseStateMessage>

    <ul v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      <li v-for="product in products" :key="product.id">
        <ProductCard :product="product" />
      </li>
    </ul>
  </section>
</template>
