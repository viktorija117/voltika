<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  /** Lucide icon component shown above the title. */
  icon: { type: [Object, Function], default: null },
})
</script>

<template>
  <!-- Empty and error states. The caller adds role="alert" for errors. -->
  <section
    class="flex flex-col items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface px-6 py-12 text-center"
  >
    <span
      v-if="icon"
      class="flex size-16 items-center justify-center rounded-full bg-bg-brand-subtle text-text-brand"
    >
      <component :is="icon" :size="32" aria-hidden="true" />
    </span>
    <!-- tabindex="-1": a page can move focus here after a change (e.g. an order is placed). -->
    <h2 tabindex="-1" class="font-heading text-xl font-medium focus:outline-none">{{ title }}</h2>
    <p v-if="description" class="max-w-md text-text-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-2"><slot /></div>
  </section>
</template>
