<script setup>
import { RouterView } from 'vue-router'

import AppFooter from '@/components/layout/AppFooter.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <AppHeader />
  <!-- tabindex="-1" lets the skip link move focus here; no ring around the whole page. -->
  <main id="main-content" tabindex="-1" class="page-container py-8 focus:outline-none">
    <RouterView />
  </main>
  <AppFooter />
</template>
