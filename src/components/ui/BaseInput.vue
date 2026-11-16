<script setup>
import { CircleAlert } from 'lucide-vue-next'
import { computed, useId } from 'vue'

// Extra attributes (name, autocomplete, inputmode...) belong on the <input>, not the wrapper.
defineOptions({ inheritAttrs: false })

const model = defineModel({ type: String, default: '' })

const props = defineProps({
  /** Visible label; a field never relies on its placeholder alone. */
  label: { type: String, required: true },
  type: { type: String, default: 'text' },
  /** Error message; when set, the field is marked invalid and the message is announced. */
  error: { type: String, default: '' },
  /** Helper text shown when there is no error. */
  hint: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const id = useId()
const messageId = `${id}-message`
const message = computed(() => props.error || props.hint)

const inputClasses = computed(() => [
  'h-11 w-full rounded-md bg-bg-surface px-3 text-base',
  'disabled:cursor-not-allowed disabled:bg-bg-subtle disabled:text-text-disabled',
  props.error ? 'border-2 border-border-error' : 'border border-border-input',
])
</script>

<template>
  <div class="flex flex-col gap-2">
    <label :for="id" class="text-sm font-medium">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :type="type"
      :disabled="disabled"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="message ? messageId : undefined"
      :class="inputClasses"
    />
    <!-- Always rendered, so screen readers announce an error the moment it appears. -->
    <p
      :id="messageId"
      aria-live="polite"
      :class="['flex items-center gap-1 text-xs', error ? 'text-text-error' : 'text-text-muted']"
    >
      <CircleAlert v-if="error" :size="16" aria-hidden="true" />
      {{ message }}
    </p>
  </div>
</template>
