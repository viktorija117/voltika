<script setup>
import { Headphones, Smartphone, Watch } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { HERO_SLIDES } from '@/components/home/heroSlides'
import { useSeo } from '@/composables/useSeo'
import { HOME_SHELF_SIZE } from '@/config/home'
import { useCatalogStore } from '@/stores/catalog'
import { buildFilterQuery, EMPTY_FILTERS } from '@/utils/filterQuery'
import { findDeals, findTopRated } from '@/utils/productFilters'
import { DEALS_SECTION_ID, productListRoute } from '@/utils/routes'

import CategoryTiles from '@/components/home/CategoryTiles.vue'
import DealsCountdown from '@/components/home/DealsCountdown.vue'
import HeroSlider from '@/components/home/HeroSlider.vue'
import HomeSectionHeader from '@/components/home/HomeSectionHeader.vue'
import ProductShelf from '@/components/home/ProductShelf.vue'
import PromoBanner from '@/components/home/PromoBanner.vue'
import ServiceTiles from '@/components/home/ServiceTiles.vue'

const { t } = useI18n()
const catalog = useCatalogStore()
catalog.load()

// The home page title is the site name alone.
useSeo(() => ({ description: t('seo.home') }))

const isPending = computed(() => catalog.status === 'idle' || catalog.isLoading)
const deals = computed(() => findDeals(catalog.products, HOME_SHELF_SIZE))
const topRated = computed(() => findTopRated(catalog.products, HOME_SHELF_SIZE))
// Deals are sorted by discount, so the first one has the biggest.
const maxDiscount = computed(() => deals.value[0]?.discountPercent ?? null)

const allDealsRoute = {
  name: 'products',
  query: buildFilterQuery({ ...EMPTY_FILTERS, sort: 'discount' }),
}
</script>

<template>
  <h1 class="sr-only">{{ t('home.title') }}</h1>

  <div class="flex flex-col gap-10 lg:gap-16">
    <HeroSlider :slides="HERO_SLIDES" :max-discount="maxDiscount" />

    <ServiceTiles />

    <section aria-labelledby="home-categories" class="flex flex-col gap-4 lg:gap-6">
      <HomeSectionHeader
        id="home-categories"
        :title="t('home.categories')"
        :link-label="t('home.allCategories')"
        :link-to="{ name: 'products' }"
      />
      <CategoryTiles />
    </section>

    <section
      :id="DEALS_SECTION_ID"
      aria-labelledby="home-deals"
      class="flex scroll-mt-4 flex-col gap-4 lg:gap-6"
    >
      <HomeSectionHeader
        id="home-deals"
        :title="t('home.deals')"
        :link-label="t('home.allDeals')"
        :link-to="allDealsRoute"
      >
        <DealsCountdown />
      </HomeSectionHeader>
      <ProductShelf
        :products="deals"
        :is-loading="isPending"
        :has-error="catalog.hasError"
        :size="HOME_SHELF_SIZE"
        @retry="catalog.retry()"
      />
    </section>

    <div class="grid gap-4 lg:grid-cols-2 lg:gap-6">
      <PromoBanner
        :title="t('home.promos.accessories.title')"
        :text="t('home.promos.accessories.text')"
        :link-label="t('home.promos.accessories.cta')"
        :to="productListRoute({ category: 'mobile-accessories' })"
        :icons="[Headphones, Smartphone]"
      />
      <PromoBanner
        variant="accent"
        :title="t('home.promos.watches.title')"
        :text="t('home.promos.watches.text')"
        :link-label="t('home.promos.watches.cta')"
        :to="productListRoute({ category: 'mens-watches' })"
        :icons="[Watch, Smartphone]"
      />
    </div>

    <section aria-labelledby="home-top-rated" class="flex flex-col gap-4 lg:gap-6">
      <HomeSectionHeader
        id="home-top-rated"
        :title="t('home.topRated')"
        :link-label="t('home.viewAll')"
        :link-to="{ name: 'products' }"
      />
      <ProductShelf
        :products="topRated"
        :is-loading="isPending"
        :has-error="catalog.hasError"
        :size="HOME_SHELF_SIZE"
        @retry="catalog.retry()"
      />
    </section>
  </div>
</template>
