<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const BLOCK_CLASS = 'rounded-md bg-bg-subtle'
</script>

<template>
  <!-- Same layout as the loaded page, so nothing jumps when the product arrives. -->
  <div class="grid animate-pulse gap-8 motion-reduce:animate-none lg:grid-cols-2" aria-busy="true">
    <span class="sr-only" role="status">{{ t('product.loading') }}</span>
    <div :class="[BLOCK_CLASS, 'aspect-square rounded-lg']" />
    <div class="flex flex-col gap-4" aria-hidden="true">
      <div :class="[BLOCK_CLASS, 'h-4 w-24']" />
      <div :class="[BLOCK_CLASS, 'h-9 w-3/4']" />
      <div :class="[BLOCK_CLASS, 'h-5 w-40']" />
      <div :class="[BLOCK_CLASS, 'mt-4 h-10 w-48']" />
      <div :class="[BLOCK_CLASS, 'h-4 w-64']" />
      <div :class="[BLOCK_CLASS, 'mt-4 h-36 w-full rounded-lg']" />
    </div>
  </div>
</template>
