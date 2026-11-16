<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <RouterLink
    :to="{ name: 'home' }"
    :aria-label="t('app.homeLink')"
    class="flex items-center gap-2"
  >
    <span
      aria-hidden="true"
      class="flex size-8 items-center justify-center rounded-md bg-bg-accent font-heading text-lg font-bold text-text-on-accent"
    >
      V
    </span>
    <span class="font-heading text-xl font-medium">{{ t('app.name') }}</span>
  </RouterLink>
</template>
