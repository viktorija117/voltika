<script setup>
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

// Screen readers pick their pronunciation from <html lang>, so it follows the app language.
const { locale } = useI18n()
watchEffect(() => {
  document.documentElement.lang = locale.value
})
</script>

<template>
  <AppHeader />
  <!-- tabindex="-1" lets the skip link move focus here; no ring around the whole page.
       min-h-dvh keeps the footer below the fold while a lazy page loads (no layout shift). -->
  <main id="main-content" tabindex="-1" class="page-container min-h-dvh py-8 focus:outline-none">
    <RouterView />
  </main>
  <AppFooter />
</template>
