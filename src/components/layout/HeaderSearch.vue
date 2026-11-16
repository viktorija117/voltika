<script setup>
import { Search } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { productListRoute } from '@/utils/routes'

const { t } = useI18n()
const router = useRouter()
const query = ref('')

// Suggestions while typing come later (useSearch); for now Enter opens the results page.
function handleSubmit() {
  const term = query.value.trim()
  if (!term) return
  router.push(productListRoute({ search: term }))
}
</script>

<template>
  <form role="search" class="relative w-full" @submit.prevent="handleSubmit">
    <label for="header-search" class="sr-only">{{ t('header.searchLabel') }}</label>
    <Search
      :size="20"
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-muted"
    />
    <input
      id="header-search"
      v-model="query"
      type="search"
      name="q"
      autocomplete="off"
      enterkeyhint="search"
      :placeholder="t('header.searchPlaceholder')"
      class="h-11 w-full rounded-md bg-bg-subtle pr-3 pl-10 text-ellipsis placeholder:text-text-muted"
    />
    <button type="submit" class="sr-only">{{ t('header.searchSubmit') }}</button>
  </form>
</template>
