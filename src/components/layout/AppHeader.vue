<script setup>
import { Menu } from 'lucide-vue-next'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import AppLogo from '@/components/layout/AppLogo.vue'
import AppTopBar from '@/components/layout/AppTopBar.vue'
import HeaderCartLink from '@/components/layout/HeaderCartLink.vue'
import HeaderNav from '@/components/layout/HeaderNav.vue'
import HeaderSearch from '@/components/layout/HeaderSearch.vue'
import MobileDrawer from '@/components/layout/MobileDrawer.vue'

const { t } = useI18n()
const isMenuOpen = ref(false)
</script>

<template>
  <header class="border-b border-border-subtle bg-bg-surface">
    <a
      href="#main-content"
      class="sr-only rounded-md bg-bg-surface px-4 py-2 focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10"
    >
      {{ t('header.skipToContent') }}
    </a>

    <AppTopBar />

    <!-- Mobile: menu, logo and cart in one row, search below. Desktop: one row, no menu button. -->
    <div
      class="page-container flex flex-wrap items-center gap-x-2 gap-y-2 py-3 lg:flex-nowrap lg:gap-8 lg:py-4"
    >
      <button
        type="button"
        :aria-label="t('header.openMenu')"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        class="-ml-2 flex size-11 items-center justify-center rounded-md hover:bg-bg-subtle lg:hidden"
        @click="isMenuOpen = true"
      >
        <Menu :size="24" aria-hidden="true" />
      </button>
      <AppLogo />
      <div class="order-last w-full lg:order-none lg:flex-1">
        <HeaderSearch />
      </div>
      <HeaderCartLink class="ml-auto lg:ml-0" />
    </div>

    <HeaderNav />
    <MobileDrawer id="mobile-menu" :open="isMenuOpen" @close="isMenuOpen = false" />
  </header>
</template>
