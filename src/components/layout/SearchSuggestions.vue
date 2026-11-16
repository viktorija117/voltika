<script setup>
import { ArrowRight, ImageOff } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { formatPrice } from '@/utils/price'

defineProps({
  /** Must match the input's aria-controls. */
  id: { type: String, required: true },
  suggestions: { type: Array, required: true },
  term: { type: String, required: true },
  /** Highlighted option: suggestion index, suggestions.length for "show all", -1 for none. */
  activeIndex: { type: Number, required: true },
  /** Builds each option's id, so the input can point at it with aria-activedescendant. */
  optionId: { type: Function, required: true },
})
const emit = defineEmits(['select-product', 'select-all'])

const { t } = useI18n()

// 40px thumbnails from the 300px API images; fixed size avoids layout shift.
const THUMBNAIL_SIZE = 40

const OPTION_CLASS = 'flex cursor-pointer items-center gap-3 px-3 py-2'
const ACTIVE_CLASS = 'bg-bg-brand-subtle'
</script>

<template>
  <!-- mousedown.prevent keeps focus in the input, so a click does not close the list first. -->
  <div
    class="absolute top-full right-0 left-0 z-20 mt-2 overflow-hidden rounded-md border border-border-subtle bg-bg-surface shadow-lg"
    @mousedown.prevent
  >
    <p v-if="!suggestions.length" class="px-3 py-4 text-sm text-text-muted">
      {{ t('search.noResults', { term }) }}
    </p>
    <ul v-else :id="id" role="listbox" :aria-label="t('search.suggestionsLabel')">
      <li
        v-for="(product, index) in suggestions"
        :id="optionId(index)"
        :key="product.id"
        role="option"
        :aria-selected="index === activeIndex"
        :class="[OPTION_CLASS, { [ACTIVE_CLASS]: index === activeIndex }]"
        @click="emit('select-product', product)"
      >
        <img
          v-if="product.thumbnail"
          :src="product.thumbnail"
          alt=""
          :width="THUMBNAIL_SIZE"
          :height="THUMBNAIL_SIZE"
          class="size-10 shrink-0 rounded-sm bg-bg-subtle object-contain"
        />
        <ImageOff v-else :size="20" aria-hidden="true" class="m-2.5 shrink-0 text-text-muted" />
        <span class="min-w-0 flex-1 truncate text-sm">{{ product.name }}</span>
        <span class="shrink-0 text-sm font-medium">{{ formatPrice(product.price) }}</span>
      </li>
      <li
        :id="optionId(suggestions.length)"
        role="option"
        :aria-selected="activeIndex === suggestions.length"
        :class="[
          OPTION_CLASS,
          'border-t border-border-subtle text-sm font-medium text-text-brand',
          { [ACTIVE_CLASS]: activeIndex === suggestions.length },
        ]"
        @click="emit('select-all')"
      >
        {{ t('search.showAll', { term }) }}
        <ArrowRight :size="16" aria-hidden="true" />
      </li>
    </ul>
  </div>
</template>
