<script setup>
import { Minus, Plus } from 'lucide-vue-next'
import { useId } from 'vue'
import { useI18n } from 'vue-i18n'

const model = defineModel({ type: Number, required: true })

const props = defineProps({
  min: { type: Number, default: 1 },
  max: { type: Number, required: true },
  /** Accessible name, e.g. "Količina" or "Količina: iPhone 5s" when there are several. */
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const { t } = useI18n()
const id = useId()

// An empty or invalid field keeps the current quantity (Number('') is 0, not NaN).
function clamp(value) {
  const whole = Math.floor(Number(value))
  if (value === '' || Number.isNaN(whole)) return model.value
  return Math.min(Math.max(whole, props.min), props.max)
}

function step(change) {
  model.value = clamp(model.value + change)
}

// Typed values are applied on change (blur or Enter), so the field can be empty mid-typing.
function handleChange(event) {
  const next = clamp(event.target.value)
  event.target.value = next
  model.value = next
}

const BUTTON_CLASS =
  'flex size-11 items-center justify-center text-text-default not-disabled:hover:bg-bg-subtle disabled:cursor-not-allowed disabled:text-text-disabled'
</script>

<template>
  <div class="inline-flex items-center rounded-md border border-border-input bg-bg-surface">
    <button
      type="button"
      :class="[BUTTON_CLASS, 'rounded-l-md']"
      :aria-label="t('quantity.decrease')"
      :aria-controls="id"
      :disabled="disabled || model <= min"
      @click="step(-1)"
    >
      <Minus :size="16" aria-hidden="true" />
    </button>
    <label :for="id" class="sr-only">{{ label || t('quantity.label') }}</label>
    <input
      :id="id"
      :value="model"
      type="number"
      inputmode="numeric"
      :min="min"
      :max="max"
      :disabled="disabled"
      class="h-11 w-12 appearance-none border-x border-border-input text-center [-moz-appearance:textfield] disabled:text-text-disabled [&::-webkit-inner-spin-button]:appearance-none"
      @change="handleChange"
    />
    <button
      type="button"
      :class="[BUTTON_CLASS, 'rounded-r-md']"
      :aria-label="t('quantity.increase')"
      :aria-controls="id"
      :disabled="disabled || model >= max"
      @click="step(1)"
    >
      <Plus :size="16" aria-hidden="true" />
    </button>
  </div>
</template>
