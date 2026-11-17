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

// Positions of the four glass icon tiles on desktop (only the first two show on mobile).
const TILE_CLASSES = [
  'right-28 bottom-8 -rotate-6 lg:top-16 lg:right-72 lg:bottom-auto',
  'right-6 bottom-20 rotate-6 lg:top-36 lg:right-28 lg:bottom-auto',
  'hidden lg:flex lg:right-80 lg:bottom-10 lg:rotate-3',
  'hidden lg:flex lg:right-40 lg:bottom-6 lg:-rotate-6',
]
</script>

<template>
  <div
    class="relative isolate flex min-h-[27.5rem] overflow-hidden rounded-lg border border-border-subtle bg-spotlight lg:min-h-[26rem] lg:items-center"
  >
    <!-- Decorative layer: holographic glow, glass icon tiles and the discount sticker. -->
    <div aria-hidden="true" class="absolute inset-0 -z-10">
      <span
        class="absolute -right-16 -bottom-24 size-72 rounded-full bg-holo opacity-40 blur-3xl lg:-top-24 lg:right-0 lg:bottom-auto lg:size-[30rem]"
      />
      <span
        v-for="(icon, index) in slide.icons"
        :key="index"
        :class="[
          'absolute flex size-20 items-center justify-center rounded-lg border border-border-strong bg-bg-surface/70 text-text-default shadow-lg backdrop-blur-md lg:size-28',
          TILE_CLASSES[index],
        ]"
      >
        <component :is="icon" class="size-9 lg:size-12" :stroke-width="1.5" />
      </span>
      <span
        v-if="slide.showDiscount && maxDiscount"
        class="absolute bottom-8 left-6 flex size-20 -rotate-12 items-center justify-center rounded-full bg-holo p-2 text-center font-heading text-sm leading-tight font-bold text-text-on-accent shadow-lg lg:top-10 lg:right-12 lg:bottom-auto lg:left-auto lg:size-28 lg:text-xl"
      >
        {{ t('home.discountSticker', { percent: maxDiscount }) }}
      </span>
    </div>

    <div class="flex max-w-xl flex-col items-start gap-4 p-6 lg:gap-5 lg:p-14">
      <p class="text-holo text-xs font-semibold tracking-[0.14em] uppercase">
        {{ t(`home.slides.${slide.id}.eyebrow`) }}
      </p>
      <h2 class="font-heading text-3xl font-semibold tracking-[-0.03em] text-balance lg:text-5xl">
        {{ t(`home.slides.${slide.id}.title`, slide.textParams ?? {}) }}
      </h2>
      <p class="max-w-md text-text-muted">
        {{ t(`home.slides.${slide.id}.text`, slide.textParams ?? {}) }}
      </p>
      <BaseButton :to="slide.to" variant="accent">{{
        t(`home.slides.${slide.id}.cta`)
      }}</BaseButton>
    </div>
  </div>
</template>
