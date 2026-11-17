<script setup>
import { Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

defineProps({
  /** Visible step names in order. */
  labels: { type: Array, required: true },
  /** Index of the current step. */
  current: { type: Number, required: true },
})

const { t } = useI18n()
</script>

<template>
  <ol :aria-label="t('checkout.steps.label')" class="flex gap-2 sm:gap-6">
    <li
      v-for="(label, index) in labels"
      :key="label"
      :aria-current="index === current ? 'step' : undefined"
      class="flex flex-1 items-center gap-2 sm:flex-none"
    >
      <span
        :class="[
          'flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
          index <= current ? 'bg-bg-brand text-text-inverse' : 'bg-bg-subtle text-text-muted',
        ]"
        aria-hidden="true"
      >
        <Check v-if="index < current" :size="16" />
        <template v-else>{{ index + 1 }}</template>
      </span>
      <!-- On small screens only the current step's name fits; the others keep their number. -->
      <span
        :class="[
          'text-sm font-medium',
          index === current ? 'text-text-default' : 'sr-only text-text-muted sm:not-sr-only',
        ]"
      >
        <span class="sr-only"
          >{{ t('checkout.steps.stepOf', { current: index + 1, total: labels.length }) }}:
        </span>
        {{ label }}
      </span>
    </li>
  </ol>
</template>
