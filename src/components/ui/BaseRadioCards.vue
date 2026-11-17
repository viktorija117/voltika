<script setup>
import { useId } from 'vue'

const model = defineModel({ type: String, required: true })

defineProps({
  /** Question the group answers, e.g. "Način dostave". */
  legend: { type: String, required: true },
  /**
   * @type {import('vue').PropType<{ value: string, label: string, description?: string, aside?: string }[]>}
   */
  options: { type: Array, required: true },
})

// Native radios: arrow keys, one Tab stop and the checked state come for free.
const name = useId()
</script>

<template>
  <fieldset class="flex flex-col gap-3">
    <legend class="mb-3 font-heading text-lg font-bold">{{ legend }}</legend>
    <label
      v-for="option in options"
      :key="option.value"
      :class="[
        'flex cursor-pointer items-start gap-3 rounded-lg border-2 bg-bg-surface p-4 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-border-focus',
        option.value === model ? 'border-border-focus' : 'border-border-subtle',
      ]"
    >
      <input
        v-model="model"
        type="radio"
        :name="name"
        :value="option.value"
        class="mt-1 size-4 accent-bg-brand focus-visible:outline-none"
      />
      <span class="flex flex-1 flex-col gap-1">
        <span class="font-medium">{{ option.label }}</span>
        <span v-if="option.description" class="text-sm text-text-muted">
          {{ option.description }}
        </span>
      </span>
      <span v-if="option.aside" class="font-medium">{{ option.aside }}</span>
    </label>
  </fieldset>
</template>
