<script setup>
import { ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

defineProps({
  /**
   * Path to the current page; the last item is the page itself and has no `to`.
   * @type {import('vue').PropType<{ label: string, to?: import('vue-router').RouteLocationRaw }[]>}
   */
  items: { type: Array, required: true },
})

const { t } = useI18n()
</script>

<template>
  <nav :aria-label="t('breadcrumbs.label')">
    <ol class="flex flex-wrap items-center gap-1 text-sm text-text-muted">
      <li v-for="(item, index) in items" :key="item.label" class="flex min-w-0 items-center gap-1">
        <ChevronRight v-if="index > 0" :size="16" aria-hidden="true" class="shrink-0" />
        <RouterLink v-if="item.to" :to="item.to" class="hover:text-text-brand hover:underline">
          {{ item.label }}
        </RouterLink>
        <span v-else aria-current="page" class="truncate text-text-default">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
