<script setup>
import { ref, useId } from 'vue'

import { nextIndexForKey } from '@/utils/keyboard'

const props = defineProps({
  /**
   * Tabs in order; each tab's content goes in the slot with the same name as its id.
   * @type {import('vue').PropType<{ id: string, label: string }[]>}
   */
  tabs: { type: Array, required: true },
  /** Accessible name of the tab list, e.g. "Detalji proizvoda". */
  label: { type: String, required: true },
})

// ARIA tabs pattern: only the selected tab is in the Tab order (roving tabindex);
// arrow keys, Home and End move between tabs and select them right away.
const activeId = ref(props.tabs[0]?.id)
const baseId = useId()
const tabButtons = []

const tabId = (id) => `${baseId}-tab-${id}`
const panelId = (id) => `${baseId}-panel-${id}`

function handleKeydown(event, index) {
  const next = nextIndexForKey(event.key, index, props.tabs.length)
  if (next === null) return
  event.preventDefault()
  activeId.value = props.tabs[next].id
  tabButtons[next].focus()
}
</script>

<template>
  <div>
    <div
      role="tablist"
      :aria-label="label"
      class="flex gap-1 overflow-x-auto border-b border-border-subtle"
    >
      <button
        v-for="(tab, index) in tabs"
        :id="tabId(tab.id)"
        :key="tab.id"
        :ref="(element) => (tabButtons[index] = element)"
        type="button"
        role="tab"
        :aria-selected="tab.id === activeId"
        :aria-controls="panelId(tab.id)"
        :tabindex="tab.id === activeId ? 0 : -1"
        :class="[
          '-mb-px shrink-0 border-b-2 px-4 py-3 font-medium whitespace-nowrap',
          tab.id === activeId
            ? 'border-border-focus text-text-brand'
            : 'border-transparent text-text-muted hover:text-text-default',
        ]"
        @click="activeId = tab.id"
        @keydown="handleKeydown($event, index)"
      >
        {{ tab.label }}
      </button>
    </div>
    <!-- v-show keeps every panel in the HTML, so the description is there for search engines. -->
    <div
      v-for="tab in tabs"
      v-show="tab.id === activeId"
      :id="panelId(tab.id)"
      :key="tab.id"
      role="tabpanel"
      :aria-labelledby="tabId(tab.id)"
      tabindex="0"
      class="py-6"
    >
      <slot :name="tab.id" />
    </div>
  </div>
</template>
