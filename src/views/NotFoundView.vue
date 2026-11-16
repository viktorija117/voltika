<script setup>
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <section class="flex flex-col items-start gap-4 py-16">
    <h1 class="heading-1">{{ t('pages.notFound.title') }}</h1>
    <p class="text-text-muted">{{ t('pages.notFound.description') }}</p>
    <RouterLink :to="{ name: 'home' }" class="font-medium text-text-brand underline">
      {{ t('pages.notFound.backHome') }}
    </RouterLink>
  </section>
</template>
