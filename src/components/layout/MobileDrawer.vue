<script setup>
import { Clock, X } from 'lucide-vue-next'
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

import { NAV_CATEGORIES } from '@/config/catalog'
import { DEALS_ROUTE, productListRoute } from '@/utils/routes'

import SupportContact from '@/components/layout/SupportContact.vue'

const props = defineProps({
  open: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const { t } = useI18n()
const dialog = ref(null)

const LINK_CLASS = 'flex h-12 items-center gap-2 border-b border-border-subtle font-medium'

// A modal <dialog> traps focus, closes on Escape and returns focus to the menu button,
// so no focus-trap code is needed. The watcher only syncs the prop with the DOM element.
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && !dialog.value.open) dialog.value.showModal()
    if (!isOpen && dialog.value.open) dialog.value.close()
  },
)

function close() {
  emit('close')
}

// A click on the dialog element itself (not its content) is a click on the backdrop.
function handleClick(event) {
  if (event.target === dialog.value) close()
}
</script>

<template>
  <dialog
    ref="dialog"
    :aria-label="t('header.menuTitle')"
    class="m-0 h-dvh max-h-none w-80 max-w-[85vw] -translate-x-full bg-bg-surface p-0 text-text-default transition-[translate,overlay,display] transition-discrete duration-200 backdrop:bg-bg-inverse/50 open:translate-x-0 motion-reduce:transition-none starting:open:-translate-x-full"
    @close="close"
    @click="handleClick"
  >
    <div class="flex h-full flex-col gap-6 overflow-y-auto p-4">
      <div class="flex items-center justify-between">
        <h2 class="font-heading text-xl font-bold">{{ t('header.menuTitle') }}</h2>
        <button
          type="button"
          :aria-label="t('header.closeMenu')"
          class="flex size-11 items-center justify-center rounded-md hover:bg-bg-subtle"
          @click="close"
        >
          <X :size="24" aria-hidden="true" />
        </button>
      </div>

      <nav :aria-label="t('header.mainNav')">
        <ul>
          <li>
            <RouterLink :to="productListRoute()" :class="LINK_CLASS" @click="close">
              {{ t('header.allProducts') }}
            </RouterLink>
          </li>
          <li v-for="category in NAV_CATEGORIES" :key="category.slug">
            <RouterLink
              :to="productListRoute({ category: category.slug })"
              :class="LINK_CLASS"
              @click="close"
            >
              {{ t(category.labelKey) }}
            </RouterLink>
          </li>
          <li>
            <RouterLink :to="DEALS_ROUTE" :class="[LINK_CLASS, 'text-text-sale']" @click="close">
              <Clock :size="20" aria-hidden="true" />
              {{ t('header.deals') }}
            </RouterLink>
          </li>
        </ul>
      </nav>

      <SupportContact vertical class="mt-auto text-sm text-text-muted" />
    </div>
  </dialog>
</template>
