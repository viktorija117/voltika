<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { pageNumbers } from '@/utils/pagination'

import BaseLink from '@/components/ui/BaseLink.vue'

const props = defineProps({
  page: { type: Number, required: true },
  pageCount: { type: Number, required: true },
  /** Builds the route for a page number, so every page is a real, shareable link. */
  pageLink: { type: Function, required: true },
})

const { t } = useI18n()
const items = computed(() => pageNumbers(props.page, props.pageCount))

const ITEM_CLASS = 'flex size-11 items-center justify-center rounded-md text-sm font-medium'
const ARROW_CLASS = `${ITEM_CLASS} border border-border-input`
</script>

<template>
  <nav v-if="pageCount > 1" :aria-label="t('pagination.label')">
    <ul class="flex items-center justify-center gap-1">
      <li>
        <BaseLink
          v-if="page > 1"
          :to="pageLink(page - 1)"
          :aria-label="t('pagination.previous')"
          :class="[ARROW_CLASS, 'hover:bg-bg-subtle']"
        >
          <ChevronLeft :size="20" aria-hidden="true" />
        </BaseLink>
        <span
          v-else
          :class="[ARROW_CLASS, 'border-border-subtle text-text-disabled']"
          aria-hidden="true"
        >
          <ChevronLeft :size="20" />
        </span>
      </li>

      <li v-for="(item, index) in items" :key="item === 'gap' ? `gap-${index}` : item">
        <span v-if="item === 'gap'" class="px-2 text-text-muted" aria-hidden="true">…</span>
        <BaseLink
          v-else
          :to="pageLink(item)"
          :aria-label="t('pagination.page', { page: item })"
          :class="[
            ITEM_CLASS,
            item === page ? 'bg-bg-brand text-text-inverse' : 'hover:bg-bg-subtle',
          ]"
        >
          {{ item }}
        </BaseLink>
      </li>

      <li>
        <BaseLink
          v-if="page < pageCount"
          :to="pageLink(page + 1)"
          :aria-label="t('pagination.next')"
          :class="[ARROW_CLASS, 'hover:bg-bg-subtle']"
        >
          <ChevronRight :size="20" aria-hidden="true" />
        </BaseLink>
        <span
          v-else
          :class="[ARROW_CLASS, 'border-border-subtle text-text-disabled']"
          aria-hidden="true"
        >
          <ChevronRight :size="20" />
        </span>
      </li>
    </ul>
  </nav>
</template>
