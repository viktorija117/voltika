<script setup>
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

defineProps({
  /** Id of the heading, for the section's aria-labelledby. */
  id: { type: String, required: true },
  title: { type: String, required: true },
  /** Optional "view all" link. */
  linkLabel: { type: String, default: '' },
  linkTo: { type: [String, Object], default: null },
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <h2 :id="id" class="font-heading text-2xl font-bold lg:text-3xl">{{ title }}</h2>
      <!-- Extra content next to the title, e.g. the deals countdown. -->
      <slot />
    </div>
    <RouterLink
      v-if="linkTo"
      :to="linkTo"
      class="flex items-center gap-1 text-sm font-medium text-text-brand hover:underline"
    >
      {{ linkLabel }}
      <ArrowRight :size="16" aria-hidden="true" />
    </RouterLink>
  </div>
</template>
