<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <!-- The link's name starts with the visible "Voltika" (WCAG 2.5.3 label in name). -->
  <RouterLink :to="{ name: 'home' }" class="flex items-center gap-2">
    <span
      aria-hidden="true"
      class="flex size-8 items-center justify-center rounded-md bg-bg-accent font-heading text-lg font-bold text-text-on-accent"
    >
      V
    </span>
    <span class="font-heading text-xl font-medium">
      {{ t('app.name') }}<span class="sr-only">{{ t('app.homeLinkSuffix') }}</span>
    </span>
  </RouterLink>
</template>
