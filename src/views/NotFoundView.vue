<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'

const { t } = useI18n()
</script>

<template>
  <section class="flex flex-col items-start gap-4 py-16">
    <h1 class="heading-1">{{ t('pages.notFound.title') }}</h1>
    <p class="text-text-muted">{{ t('pages.notFound.description') }}</p>
    <BaseButton :to="{ name: 'home' }" variant="secondary" :icon="ArrowLeft">
      {{ t('pages.notFound.backHome') }}
    </BaseButton>
  </section>
</template>
