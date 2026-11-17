<script setup>
import { Headphones, Laptop, Smartphone, Tablet, Watch } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { NAV_CATEGORIES } from '@/config/catalog'
import { productListRoute } from '@/utils/routes'

const { t } = useI18n()

const CATEGORY_ICONS = {
  smartphones: Smartphone,
  laptops: Laptop,
  tablets: Tablet,
  'mobile-accessories': Headphones,
  'mens-watches': Watch,
}
</script>

<template>
  <ul class="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:gap-6">
    <li v-for="category in NAV_CATEGORIES" :key="category.slug">
      <RouterLink
        :to="productListRoute({ category: category.slug })"
        class="flex h-full flex-col items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface p-4 text-center text-sm font-medium transition-shadow hover:shadow-lg motion-reduce:transition-none lg:p-6"
      >
        <span
          class="flex size-14 items-center justify-center rounded-full bg-bg-brand-subtle text-text-brand"
        >
          <component :is="CATEGORY_ICONS[category.slug]" :size="28" aria-hidden="true" />
        </span>
        {{ t(category.labelKey) }}
      </RouterLink>
    </li>
  </ul>
</template>
