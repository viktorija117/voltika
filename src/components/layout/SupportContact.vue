<script setup>
import { Clock, Phone } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { SUPPORT_PHONE, SUPPORT_PHONE_HREF } from '@/config/contact'

defineProps({
  /** Stack the items (drawer) instead of one row (top bar). */
  vertical: { type: Boolean, default: false },
})

const { t } = useI18n()
</script>

<template>
  <ul :class="['flex', vertical ? 'flex-col gap-3' : 'items-center gap-6']">
    <li>
      <a :href="SUPPORT_PHONE_HREF" class="flex items-center gap-2 hover:underline">
        <Phone :size="vertical ? 20 : 14" aria-hidden="true" />
        <span class="sr-only">{{ t('header.supportPhoneLabel') }}:</span>
        {{ SUPPORT_PHONE }}
      </a>
    </li>
    <li class="flex items-center gap-2">
      <Clock :size="vertical ? 20 : 14" aria-hidden="true" />
      {{ t('header.supportHours') }}
    </li>
  </ul>
</template>
