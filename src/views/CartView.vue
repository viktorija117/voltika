<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <h1 class="heading-1">{{ t('pages.cart.title') }}</h1>
</template>
