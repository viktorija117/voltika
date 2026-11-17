<script setup>
import { useI18n } from 'vue-i18n'

import BaseButton from '@/components/ui/BaseButton.vue'

defineProps({
  /** One entry of HERO_SLIDES. */
  slide: { type: Object, required: true },
  /** Biggest discount in the catalog, for the sticker; null while it is unknown. */
  maxDiscount: { type: Number, default: null },
})

const { t } = useI18n()

// Positions of the four icon tiles on desktop (only the first two show on mobile).
const TILE_CLASSES = [
  'top-auto right-24 bottom-6 -rotate-6 lg:top-16 lg:right-72 lg:bottom-auto',
  'top-auto right-4 bottom-16 rotate-6 lg:top-32 lg:right-32 lg:bottom-auto',
  'hidden lg:flex lg:right-80 lg:bottom-10 lg:rotate-3',
  'hidden lg:flex lg:right-36 lg:bottom-4 lg:-rotate-6',
]
</script>

<template>
  <div
    class="relative isolate flex min-h-[27.5rem] overflow-hidden rounded-lg bg-bg-inverse text-text-inverse lg:min-h-[25rem] lg:items-center"
  >
    <!-- Decorative layer: shapes, icon tiles and the discount sticker. -->
    <div aria-hidden="true" class="absolute inset-0 -z-10">
      <span
        class="absolute -right-10 -bottom-16 size-60 rounded-full bg-bg-accent lg:-top-14 lg:right-0 lg:bottom-auto lg:size-[26rem]"
      />
      <span
        class="absolute -bottom-10 -left-10 size-36 rounded-full bg-bg-brand lg:top-60 lg:right-96 lg:bottom-auto lg:left-auto lg:size-64"
      />
      <span
        v-for="(icon, index) in slide.icons"
        :key="index"
        :class="[
          'absolute flex size-20 items-center justify-center rounded-lg bg-bg-surface text-text-brand lg:size-28',
          TILE_CLASSES[index],
        ]"
      >
        <component :is="icon" class="size-9 lg:size-12" />
      </span>
      <span
        v-if="slide.showDiscount && maxDiscount"
        class="absolute top-56 right-4 flex size-20 -rotate-12 items-center justify-center rounded-full bg-bg-sale p-2 text-center font-heading text-sm leading-tight font-bold text-text-inverse lg:top-8 lg:right-10 lg:size-28 lg:text-xl"
      >
        {{ t('home.discountSticker', { percent: maxDiscount }) }}
      </span>
    </div>

    <div class="flex max-w-xl flex-col items-start gap-4 p-6 lg:gap-5 lg:p-14">
      <p
        class="rounded-full bg-bg-accent px-3 py-1 text-xs font-bold tracking-wide text-text-on-accent uppercase"
      >
        {{ t(`home.slides.${slide.id}.eyebrow`) }}
      </p>
      <h2 class="font-heading text-3xl font-bold lg:text-5xl">
        {{ t(`home.slides.${slide.id}.title`, slide.textParams ?? {}) }}
      </h2>
      <p class="max-w-md">{{ t(`home.slides.${slide.id}.text`, slide.textParams ?? {}) }}</p>
      <BaseButton :to="slide.to" variant="accent">{{
        t(`home.slides.${slide.id}.cta`)
      }}</BaseButton>
    </div>
  </div>
</template>
