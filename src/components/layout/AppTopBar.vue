<script setup>
import { Clock, Phone } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { SUPPORT_PHONE, SUPPORT_PHONE_HREF } from '@/config/contact'

const { t } = useI18n()
</script>

<template>
  <div class="hidden bg-bg-inverse text-xs text-text-inverse lg:block">
    <div class="page-container flex h-9 items-center justify-between">
      <div class="flex items-center gap-6">
        <a :href="SUPPORT_PHONE_HREF" class="flex items-center gap-1 hover:underline">
          <Phone :size="14" aria-hidden="true" />
          <span class="sr-only">{{ t('header.supportPhoneLabel') }}:</span>
          {{ SUPPORT_PHONE }}
        </a>
        <p class="flex items-center gap-1">
          <Clock :size="14" aria-hidden="true" />
          {{ t('header.supportHours') }}
        </p>
      </div>
      <p>{{ t('app.demoNotice') }}</p>
    </div>
  </div>
</template>
