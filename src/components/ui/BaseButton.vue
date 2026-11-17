<script>
// Module scope, so the defineProps validator below can use it.
// Variants match the Figma "Button" component. `not-disabled:` keeps hover off disabled buttons
// and still works on links, where the `enabled:` variant would never match.
const VARIANT_CLASSES = {
  primary:
    'bg-bg-brand text-text-on-brand not-disabled:hover:bg-bg-brand-hover disabled:bg-bg-subtle disabled:text-text-disabled',
  accent:
    'bg-holo text-text-on-accent not-disabled:hover:brightness-110 disabled:bg-bg-subtle disabled:bg-none disabled:text-text-disabled',
  secondary:
    'bg-bg-brand-subtle text-text-brand not-disabled:hover:bg-bg-brand-subtle-hover disabled:bg-bg-subtle disabled:text-text-disabled',
  ghost: 'text-text-brand not-disabled:hover:bg-bg-brand-subtle disabled:text-text-disabled',
}
</script>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  /** Visual style from the design system. */
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => Object.keys(VARIANT_CLASSES).includes(value),
  },
  /** Route location. When set, the button renders as a link (disabled does not apply). */
  to: { type: [String, Object], default: null },
  /** Native button type; `submit` inside forms. */
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  /** Lucide icon component shown before the label. Decorative, hidden from screen readers. */
  icon: { type: [Object, Function], default: null },
  /** Stretch to the full width of the parent. */
  block: { type: Boolean, default: false },
})

const isLink = computed(() => props.to !== null)

const classes = computed(() => [
  'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium',
  'transition-colors motion-reduce:transition-none disabled:cursor-not-allowed',
  VARIANT_CLASSES[props.variant],
  { 'w-full': props.block },
])

// Attributes that only make sense on one of the two elements.
const elementAttrs = computed(() =>
  isLink.value ? { to: props.to } : { type: props.type, disabled: props.disabled },
)
</script>

<template>
  <component :is="isLink ? RouterLink : 'button'" :class="classes" v-bind="elementAttrs">
    <component :is="icon" v-if="icon" :size="20" aria-hidden="true" />
    <slot />
  </component>
</template>
