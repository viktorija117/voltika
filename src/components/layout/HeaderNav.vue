<script setup>
import { Clock, Menu } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { NAV_CATEGORIES, QUERY_KEYS } from '@/config/catalog'

const { t } = useI18n()

function categoryRoute(slug) {
  return { name: 'products', query: { [QUERY_KEYS.category]: slug } }
}
</script>

<template>
  <nav :aria-label="t('header.mainNav')" class="hidden border-t border-border-subtle lg:block">
    <div class="page-container flex h-14 items-center justify-between">
      <ul class="flex items-center gap-6">
        <li>
          <RouterLink
            :to="{ name: 'products' }"
            class="flex h-10 items-center gap-2 rounded-md bg-bg-brand px-4 text-sm font-medium text-text-inverse hover:bg-bg-brand-hover"
          >
            <Menu :size="20" aria-hidden="true" />
            {{ t('header.allProducts') }}
          </RouterLink>
        </li>
        <li v-for="category in NAV_CATEGORIES" :key="category.slug">
          <RouterLink
            :to="categoryRoute(category.slug)"
            class="text-sm font-medium hover:text-text-brand"
          >
            {{ t(category.labelKey) }}
          </RouterLink>
        </li>
      </ul>
      <RouterLink
        :to="{ name: 'home', hash: '#akcije-nedelje' }"
        class="flex items-center gap-1 text-sm font-medium text-text-sale hover:underline"
      >
        <Clock :size="16" aria-hidden="true" />
        {{ t('header.deals') }}
      </RouterLink>
    </div>
  </nav>
</template>
