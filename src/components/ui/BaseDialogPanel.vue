<script>
// Module scope, so the defineProps validator below can use it.
const POSITION_CLASSES = {
  left: 'm-0 h-dvh max-h-none w-80 max-w-[85vw] -translate-x-full open:translate-x-0 starting:open:-translate-x-full',
  bottom:
    'mx-0 mt-auto mb-0 max-h-[85dvh] w-full max-w-none translate-y-full rounded-t-lg open:translate-y-0 starting:open:translate-y-full',
}
</script>

<script setup>
import { X } from 'lucide-vue-next'
import { ref, useId, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  /** Heading shown at the top; also names the dialog for screen readers. */
  title: { type: String, required: true },
  /** Accessible name of the close button, e.g. "Zatvori meni". */
  closeLabel: { type: String, required: true },
  /** Slides in from the left (menu) or up from the bottom (mobile filters). */
  position: {
    type: String,
    default: 'left',
    validator: (value) => Object.keys(POSITION_CLASSES).includes(value),
  },
})
const emit = defineEmits(['close'])

const dialog = ref(null)
const titleId = useId()

// A modal <dialog> traps focus, closes on Escape and returns focus to the button that
// opened it, so no focus-trap code is needed. The watcher only syncs the prop with the DOM.
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
    :aria-labelledby="titleId"
    :class="[
      'bg-bg-surface p-0 text-text-default backdrop:bg-bg-inverse/50',
      'transition-[translate,overlay,display] transition-discrete duration-200 motion-reduce:transition-none',
      POSITION_CLASSES[position],
    ]"
    @close="close"
    @click="handleClick"
  >
    <div class="flex h-full max-h-[inherit] flex-col">
      <div class="flex items-center justify-between border-b border-border-subtle p-4">
        <h2 :id="titleId" class="font-heading text-xl font-bold">{{ title }}</h2>
        <button
          type="button"
          :aria-label="closeLabel"
          class="flex size-11 items-center justify-center rounded-md hover:bg-bg-subtle"
          @click="close"
        >
          <X :size="24" aria-hidden="true" />
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4"><slot /></div>
      <div v-if="$slots.footer" class="border-t border-border-subtle p-4">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>
