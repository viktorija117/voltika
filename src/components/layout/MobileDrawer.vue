<script setup>
import { Clock } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

import { NAV_CATEGORIES } from '@/config/catalog'
import { DEALS_ROUTE, productListRoute } from '@/utils/routes'

import SupportContact from '@/components/layout/SupportContact.vue'
import BaseDialogPanel from '@/components/ui/BaseDialogPanel.vue'
import BaseLink from '@/components/ui/BaseLink.vue'

defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const { t } = useI18n()

const LINK_CLASS = 'flex h-12 items-center gap-2 border-b border-border-subtle font-medium'

function close() {
  emit('close')
}
</script>

<template>
  <BaseDialogPanel
    :open="open"
    :title="t('header.menuTitle')"
    :close-label="t('header.closeMenu')"
    position="left"
    @close="close"
  >
    <div class="flex min-h-full flex-col gap-6">
      <nav :aria-label="t('header.mainNav')">
        <ul>
          <li>
            <BaseLink :to="productListRoute()" :class="LINK_CLASS" @click="close">
              {{ t('header.allProducts') }}
            </BaseLink>
          </li>
          <li v-for="category in NAV_CATEGORIES" :key="category.slug">
            <BaseLink
              :to="productListRoute({ category: category.slug })"
              :class="LINK_CLASS"
              @click="close"
            >
              {{ t(category.labelKey) }}
            </BaseLink>
          </li>
          <li>
            <BaseLink :to="DEALS_ROUTE" :class="[LINK_CLASS, 'text-text-sale']" @click="close">
              <Clock :size="20" aria-hidden="true" />
              {{ t('header.deals') }}
            </BaseLink>
          </li>
        </ul>
      </nav>

      <SupportContact vertical class="mt-auto text-sm text-text-muted" />
    </div>
  </BaseDialogPanel>
</template>
