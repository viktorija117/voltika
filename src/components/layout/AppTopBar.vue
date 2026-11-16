<script setup>
import { useI18n } from 'vue-i18n'

import SupportContact from '@/components/layout/SupportContact.vue'

const { t } = useI18n()
</script>

<template>
  <div class="hidden bg-bg-inverse text-xs text-text-inverse lg:block">
    <div class="page-container flex h-9 items-center justify-between">
      <SupportContact />
      <p>{{ t('app.demoNotice') }}</p>
    </div>
  </div>
</template>
