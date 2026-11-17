<script setup>
import { computed, nextTick, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { validateAddress } from '@/utils/checkout'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const props = defineProps({
  /** @type {import('vue').PropType<import('@/utils/checkout').Address>} */
  address: { type: Object, required: true },
})
// One event per field instead of a new address object: browser autofill changes several
// fields at once, and copies made from the same old object would overwrite each other.
const emit = defineEmits(['update-field', 'submit'])

// Order matches the validation rules; autocomplete lets the browser fill the form.
const FIELDS = [
  { name: 'fullName', autocomplete: 'name' },
  { name: 'email', type: 'email', autocomplete: 'email' },
  { name: 'phone', type: 'tel', autocomplete: 'tel', hintKey: 'checkout.address.phoneHint' },
  { name: 'street', autocomplete: 'street-address' },
  { name: 'city', autocomplete: 'address-level2' },
  { name: 'postalCode', autocomplete: 'postal-code', inputmode: 'numeric' },
]

const { t } = useI18n()
const form = ref(null)
// Errors appear only after the first submit, not while the user is still typing.
const wasSubmitted = ref(false)
const errors = computed(() => validateAddress(props.address))

function errorFor(field) {
  const key = errors.value[field]
  return wasSubmitted.value && key ? t(key) : ''
}

async function handleSubmit() {
  wasSubmitted.value = true
  if (!Object.keys(errors.value).length) {
    emit('submit')
    return
  }
  // Keyboard and screen reader users land on the first field to fix.
  await nextTick()
  form.value.querySelector('[aria-invalid="true"]')?.focus()
}
</script>

<template>
  <form ref="form" novalidate class="flex flex-col gap-4" @submit.prevent="handleSubmit">
    <h2 tabindex="-1" class="font-heading text-xl font-bold focus:outline-none">
      {{ t('checkout.address.title') }}
    </h2>
    <div class="grid gap-x-4 sm:grid-cols-2">
      <div
        v-for="field in FIELDS"
        :key="field.name"
        :class="{ 'sm:col-span-2': field.name === 'street' }"
      >
        <BaseInput
          :model-value="address[field.name]"
          :label="t(`checkout.address.${field.name}`)"
          :type="field.type ?? 'text'"
          :name="field.name"
          :autocomplete="field.autocomplete"
          :inputmode="field.inputmode"
          :hint="field.hintKey ? t(field.hintKey) : ''"
          :error="errorFor(field.name)"
          @update:model-value="emit('update-field', field.name, $event)"
        />
      </div>
    </div>
    <BaseButton type="submit" class="self-end">{{ t('checkout.next') }}</BaseButton>
  </form>
</template>
