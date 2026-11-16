<script setup>
import { PackageX, RotateCcw, WifiOff } from 'lucide-vue-next'
import { computed, toRef } from 'vue'
import { useI18n } from 'vue-i18n'

import { useProduct } from '@/composables/useProduct'
import { SIMILAR_PRODUCTS_COUNT } from '@/config/catalog'
import { useCatalogStore } from '@/stores/catalog'
import { categoryLabelKey } from '@/utils/categories'
import { findSimilarProducts } from '@/utils/productFilters'
import { productListRoute } from '@/utils/routes'

import ProductBuyBox from '@/components/product/ProductBuyBox.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import ProductDetailsTabs from '@/components/product/ProductDetailsTabs.vue'
import ProductGallery from '@/components/product/ProductGallery.vue'
import ProductPageSkeleton from '@/components/product/ProductPageSkeleton.vue'
import BaseBreadcrumbs from '@/components/ui/BaseBreadcrumbs.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseStateMessage from '@/components/ui/BaseStateMessage.vue'

const props = defineProps({
  /** Product id from the URL (/proizvod/:id). */
  id: { type: String, required: true },
})

const { t } = useI18n()
const catalog = useCatalogStore()
// The catalog is only needed for "Slični proizvodi"; the product itself loads on its own.
catalog.load()

const { product, status, retry } = useProduct(toRef(props, 'id'))

const breadcrumbs = computed(() => {
  const items = [{ label: t('breadcrumbs.home'), to: { name: 'home' } }]
  const labelKey = categoryLabelKey(product.value.category)
  if (labelKey) {
    items.push({ label: t(labelKey), to: productListRoute({ category: product.value.category }) })
  }
  items.push({ label: product.value.name })
  return items
})

const similarProducts = computed(() =>
  findSimilarProducts(catalog.products, product.value, SIMILAR_PRODUCTS_COUNT),
)
</script>

<template>
  <ProductPageSkeleton v-if="status === 'loading'" />

  <BaseStateMessage
    v-else-if="status === 'notFound'"
    :icon="PackageX"
    :title="t('product.notFoundTitle')"
    :description="t('product.notFoundDescription')"
  >
    <BaseButton :to="{ name: 'products' }">{{ t('productList.showAll') }}</BaseButton>
  </BaseStateMessage>

  <BaseStateMessage
    v-else-if="status === 'error'"
    role="alert"
    :icon="WifiOff"
    :title="t('product.errorTitle')"
    :description="t('productList.errorDescription')"
  >
    <BaseButton :icon="RotateCcw" @click="retry">{{ t('productList.retry') }}</BaseButton>
  </BaseStateMessage>

  <article v-else class="flex flex-col gap-8">
    <BaseBreadcrumbs :items="breadcrumbs" />

    <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <!-- Keyed by id, so the gallery starts at the first image of every product. -->
      <ProductGallery :key="product.id" :images="product.images" :name="product.name" />
      <ProductBuyBox :product="product" />
    </div>

    <ProductDetailsTabs :key="product.id" :product="product" />

    <section v-if="similarProducts.length" aria-labelledby="similar-products-title">
      <h2 id="similar-products-title" class="mb-4 font-heading text-2xl font-bold">
        {{ t('product.similar') }}
      </h2>
      <ul class="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        <li v-for="similar in similarProducts" :key="similar.id">
          <ProductCard :product="similar" />
        </li>
      </ul>
    </section>
  </article>
</template>
