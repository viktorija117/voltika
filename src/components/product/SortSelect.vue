<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { useProductFilters } from '@/composables/useProductFilters'
import { SORT_OPTIONS } from '@/config/catalog'

const { t } = useI18n()
const { filters, update } = useProductFilters()
</script>

<template>
  <!-- Native <select>: keyboard, screen readers and mobile pickers work out of the box. -->
  <div class="flex items-center gap-2">
    <label for="product-sort" class="text-sm font-medium whitespace-nowrap">
      {{ t('sort.label') }}
    </label>
    <div class="relative">
      <select
        id="product-sort"
        :value="filters.sort"
        class="h-11 appearance-none rounded-md border border-border-input bg-bg-surface pr-10 pl-3 text-sm"
        @change="update({ sort: $event.target.value })"
      >
        <option v-for="option in SORT_OPTIONS" :key="option" :value="option">
          {{ t(`sort.${option}`) }}
        </option>
      </select>
      <ChevronDown
        :size="20"
        aria-hidden="true"
        class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2"
      />
    </div>
  </div>
</template>
