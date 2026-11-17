<script setup>
import { CircleCheck } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseStateMessage from '@/components/ui/BaseStateMessage.vue'

defineProps({
  orderNumber: { type: String, required: true },
})

const { t } = useI18n()
const wrapper = ref(null)

// The form the user was on is gone; move focus to the result so it is read out.
onMounted(() => wrapper.value.querySelector('h2').focus())
</script>

<template>
  <div ref="wrapper">
    <BaseStateMessage
      :icon="CircleCheck"
      :title="t('checkout.success.title')"
      :description="t('checkout.success.demoNotice')"
    >
      <p class="mb-4 font-heading text-lg font-bold">
        {{ t('checkout.success.orderNumber', { number: orderNumber }) }}
      </p>
      <BaseButton :to="{ name: 'home' }">{{ t('checkout.success.backHome') }}</BaseButton>
    </BaseStateMessage>
  </div>
</template>
