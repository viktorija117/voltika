<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useCountdown } from '@/composables/useCountdown'
import { endOfWeek } from '@/utils/time'

const { t } = useI18n()
// The weekly deals end on Sunday at midnight.
const { parts, isOver } = useCountdown(endOfWeek(new Date()))

const UNITS = ['days', 'hours', 'minutes', 'seconds']
const pad = (value) => String(value).padStart(2, '0')

// Screen readers get one calm sentence (minutes, not seconds) instead of a ticking clock.
const accessibleLabel = computed(() => t('home.countdown.label', parts.value))
</script>

<template>
  <p v-if="isOver" class="text-sm text-text-muted">{{ t('home.dealsOver') }}</p>
  <div v-else class="flex items-center gap-2">
    <span class="text-sm font-medium">{{ t('home.endsIn') }}</span>
    <span class="sr-only">{{ accessibleLabel }}</span>
    <span aria-hidden="true" class="flex gap-1.5">
      <span
        v-for="unit in UNITS"
        :key="unit"
        class="flex w-12 flex-col items-center rounded-sm bg-bg-inverse py-1 text-text-inverse"
      >
        <span class="font-heading text-lg leading-tight font-bold tabular-nums">
          {{ pad(parts[unit]) }}
        </span>
        <span class="text-[0.625rem] uppercase">{{ t(`home.countdown.${unit}`) }}</span>
      </span>
    </span>
  </div>
</template>
