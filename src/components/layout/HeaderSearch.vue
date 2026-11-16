<script setup>
import { Search } from 'lucide-vue-next'
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { useSearch } from '@/composables/useSearch'
import { useCatalogStore } from '@/stores/catalog'
import { productListRoute } from '@/utils/routes'

import SearchSuggestions from '@/components/layout/SearchSuggestions.vue'

// ARIA combobox pattern: focus stays in the input, aria-activedescendant points at the
// highlighted option, and arrow keys move the highlight.
const LISTBOX_ID = 'header-search-suggestions'
const optionId = (index) => `${LISTBOX_ID}-option-${index}`

const { t } = useI18n()
const router = useRouter()
const catalog = useCatalogStore()
const { query, activeTerm, suggestions, hasActiveTerm, setQuery, reset } = useSearch(
  toRef(catalog, 'products'),
)

const isOpen = ref(false)
const activeIndex = ref(-1)

const isListVisible = computed(() => isOpen.value && hasActiveTerm.value)
// Suggestions plus the "show all results" option.
const optionCount = computed(() => (suggestions.value.length ? suggestions.value.length + 1 : 0))
const activeDescendant = computed(() =>
  isListVisible.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,
)

// The catalog loads on first focus, so pages that never use search do not fetch it early.
function handleFocus() {
  catalog.load()
}

function handleInput(event) {
  setQuery(event.target.value)
  isOpen.value = true
  activeIndex.value = -1
}

function close() {
  isOpen.value = false
  activeIndex.value = -1
}

function moveHighlight(step) {
  if (!isListVisible.value || !optionCount.value) return
  if (activeIndex.value === -1) {
    activeIndex.value = step > 0 ? 0 : optionCount.value - 1
    return
  }
  activeIndex.value = (activeIndex.value + step + optionCount.value) % optionCount.value
}

function openProduct(product) {
  reset()
  close()
  router.push({ name: 'product', params: { id: product.id } })
}

function openResults(term = query.value.trim()) {
  if (!term) return
  reset()
  close()
  router.push(productListRoute({ search: term }))
}

function handleEnter(event) {
  if (!isListVisible.value || activeIndex.value === -1) return // the form submits on its own
  event.preventDefault()
  const product = suggestions.value[activeIndex.value]
  if (product) openProduct(product)
  else openResults(activeTerm.value)
}

// Focus left the whole search (not just moved inside it).
function handleFocusOut(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) close()
}
</script>

<template>
  <form
    role="search"
    class="relative w-full"
    @submit.prevent="openResults()"
    @focusout="handleFocusOut"
  >
    <label for="header-search" class="sr-only">{{ t('header.searchLabel') }}</label>
    <Search
      :size="20"
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
    />
    <input
      id="header-search"
      :value="query"
      type="search"
      name="q"
      role="combobox"
      autocomplete="off"
      enterkeyhint="search"
      aria-autocomplete="list"
      :aria-controls="LISTBOX_ID"
      :aria-expanded="isListVisible && suggestions.length > 0"
      :aria-activedescendant="activeDescendant"
      :placeholder="t('header.searchPlaceholder')"
      class="h-11 w-full rounded-md bg-bg-subtle pr-3 pl-10 text-ellipsis placeholder:text-text-muted"
      @focus="handleFocus"
      @input="handleInput"
      @keydown.down.prevent="moveHighlight(1)"
      @keydown.up.prevent="moveHighlight(-1)"
      @keydown.enter="handleEnter"
      @keydown.esc="close"
    />
    <button type="submit" class="sr-only">{{ t('header.searchSubmit') }}</button>

    <SearchSuggestions
      v-if="isListVisible"
      :id="LISTBOX_ID"
      :suggestions="suggestions"
      :term="activeTerm"
      :active-index="activeIndex"
      :option-id="optionId"
      @select-product="openProduct"
      @select-all="openResults(activeTerm)"
    />

    <!-- Announces the result count after each pause in typing. -->
    <p aria-live="polite" class="sr-only">
      {{ isListVisible ? t('search.suggestionCount', suggestions.length) : '' }}
    </p>
  </form>
</template>
