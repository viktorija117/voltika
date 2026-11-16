<template>
  <!-- Same shape as ProductCard, so nothing jumps when the real cards arrive. -->
  <div
    aria-hidden="true"
    class="flex h-full animate-pulse flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-surface motion-reduce:animate-none"
  >
    <div class="aspect-square bg-bg-subtle" />
    <div class="flex flex-col gap-3 p-4">
      <div class="h-3 w-1/3 rounded-sm bg-bg-subtle" />
      <div class="h-4 w-full rounded-sm bg-bg-subtle" />
      <div class="h-4 w-2/3 rounded-sm bg-bg-subtle" />
      <div class="h-6 w-1/2 rounded-sm bg-bg-subtle" />
    </div>
  </div>
</template>
