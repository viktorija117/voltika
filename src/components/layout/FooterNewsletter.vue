<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { isValidEmail } from '@/utils/validators'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const { t } = useI18n()
const email = ref('')
const error = ref('')
const isSubscribed = ref(false)

// Demo only: there is no mailing list, so a valid address just shows the confirmation.
function handleSubmit() {
  if (!isValidEmail(email.value)) {
    error.value = t('newsletter.invalidEmail')
    return
  }
  error.value = ''
  isSubscribed.value = true
}
</script>

<template>
  <section aria-labelledby="newsletter-title" class="flex flex-col gap-3">
    <h2 id="newsletter-title" class="font-heading text-lg font-medium">
      {{ t('newsletter.title') }}
    </h2>
    <p class="text-sm text-text-muted">{{ t('newsletter.description') }}</p>

    <p v-if="isSubscribed" role="status" class="text-sm font-medium text-text-success">
      {{ t('newsletter.success') }}
    </p>
    <form v-else novalidate class="flex flex-col gap-3" @submit.prevent="handleSubmit">
      <BaseInput
        v-model="email"
        :label="t('newsletter.emailLabel')"
        :error="error"
        type="email"
        name="email"
        autocomplete="email"
      />
      <BaseButton type="submit" class="self-start">{{ t('newsletter.submit') }}</BaseButton>
    </form>
  </section>
</template>
