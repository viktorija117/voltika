<script>
// Module scope, so the defineProps validator below can use it.
const VARIANT_CLASSES = {
  brand: 'border border-border-subtle bg-spotlight text-text-default',
  accent: 'bg-holo text-text-on-accent',
}
</script>

<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps({
  variant: {
    type: String,
    default: 'brand',
    validator: (value) => Object.keys(VARIANT_CLASSES).includes(value),
  },
  title: { type: String, required: true },
  text: { type: String, required: true },
  linkLabel: { type: String, required: true },
  to: { type: [String, Object], required: true },
  /** Decorative lucide icons drawn as tiles on the right. */
  icons: { type: Array, default: () => [] },
})

// On phones only the first icon fits next to the text.
const TILE_CLASSES = ['right-4 bottom-6 rotate-6', 'hidden sm:flex top-6 right-24 -rotate-6']
</script>

<template>
  <!-- The whole banner is one link; the title is its name. -->
  <RouterLink
    :to="to"
    :class="[
      'group relative isolate flex min-h-48 flex-col justify-center gap-3 overflow-hidden rounded-lg p-6 lg:min-h-60 lg:p-8',
      VARIANT_CLASSES[variant],
    ]"
  >
    <h2 class="max-w-[60%] font-heading text-2xl font-semibold lg:text-3xl">{{ title }}</h2>
    <p class="max-w-[60%] text-sm">{{ text }}</p>
    <span class="flex items-center gap-1 text-sm font-medium group-hover:underline">
      {{ linkLabel }}
      <ArrowRight :size="16" aria-hidden="true" />
    </span>
    <span
      v-for="(icon, index) in icons"
      :key="index"
      aria-hidden="true"
      :class="[
        'absolute -z-10 flex size-20 items-center justify-center rounded-lg border border-border-strong bg-bg-surface/80 text-text-default shadow-lg backdrop-blur-md lg:size-24',
        TILE_CLASSES[index],
      ]"
    >
      <component :is="icon" class="size-9 lg:size-11" :stroke-width="1.5" />
    </span>
  </RouterLink>
</template>
