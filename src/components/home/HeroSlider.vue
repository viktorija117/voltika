<script setup>
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-vue-next'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { usePrefersReducedMotion } from '@/composables/usePrefersReducedMotion'
import { HERO_AUTOPLAY_MS } from '@/config/home'

import HeroSlide from '@/components/home/HeroSlide.vue'

const props = defineProps({
  /** @type {import('vue').PropType<typeof import('@/components/home/heroSlides').HERO_SLIDES>} */
  slides: { type: Array, required: true },
  maxDiscount: { type: Number, default: null },
})

const { t } = useI18n()
const prefersReducedMotion = usePrefersReducedMotion()

const current = ref(0)
// null until the user presses pause/play; until then reduced motion decides (WCAG 2.2.2).
const userWantsPlay = ref(null)
const isHovered = ref(false)
const hasFocusInside = ref(false)

const isPlaying = computed(() => userWantsPlay.value ?? !prefersReducedMotion.value)
// Auto-play also waits while the pointer or keyboard focus is on the slider.
const isRunning = computed(() => isPlaying.value && !isHovered.value && !hasFocusInside.value)

function goTo(index) {
  current.value = (index + props.slides.length) % props.slides.length
}

let timer = null
function stopTimer() {
  clearInterval(timer)
  timer = null
}
watch(
  isRunning,
  (running) => {
    stopTimer()
    if (running) timer = setInterval(() => goTo(current.value + 1), HERO_AUTOPLAY_MS)
  },
  { immediate: true },
)
onUnmounted(stopTimer)

function togglePlay() {
  userWantsPlay.value = !isPlaying.value
}

function handleFocusOut(event) {
  hasFocusInside.value = event.currentTarget.contains(event.relatedTarget)
}

const CONTROL_CLASS =
  'flex size-11 items-center justify-center rounded-md text-text-brand hover:bg-bg-brand-subtle'
</script>

<template>
  <section
    aria-roledescription="carousel"
    :aria-label="t('home.slider.label')"
    class="flex flex-col gap-3 lg:gap-4"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @focusin="hasFocusInside = true"
    @focusout="handleFocusOut"
  >
    <!-- While it plays on its own, slide changes are not announced (APG carousel pattern). -->
    <div class="grid" :aria-live="isRunning ? 'off' : 'polite'">
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        role="group"
        aria-roledescription="slide"
        :aria-label="t('home.slider.slide', { current: index + 1, total: slides.length })"
        :class="[
          'col-start-1 row-start-1 transition-[opacity,visibility] duration-500 motion-reduce:transition-none',
          index === current ? 'visible opacity-100' : 'invisible opacity-0',
        ]"
      >
        <HeroSlide :slide="slide" :max-discount="maxDiscount" />
      </div>
    </div>

    <div class="flex items-center justify-center gap-2">
      <button
        type="button"
        :class="[CONTROL_CLASS, 'w-auto gap-2 px-3 text-sm font-medium']"
        @click="togglePlay"
      >
        <component :is="isPlaying ? Pause : Play" :size="16" aria-hidden="true" />
        {{ isPlaying ? t('home.slider.pause') : t('home.slider.play') }}
      </button>
      <button
        type="button"
        :class="CONTROL_CLASS"
        :aria-label="t('home.slider.previous')"
        @click="goTo(current - 1)"
      >
        <ChevronLeft :size="20" aria-hidden="true" />
      </button>
      <ul class="flex items-center">
        <li v-for="(slide, index) in slides" :key="slide.id">
          <button
            type="button"
            class="flex h-11 min-w-6 items-center justify-center px-1.5"
            :aria-label="t('home.slider.goTo', { n: index + 1 })"
            :aria-current="index === current ? 'true' : undefined"
            @click="goTo(index)"
          >
            <span
              :class="[
                'block h-2 rounded-full transition-[width] motion-reduce:transition-none',
                index === current ? 'w-6 bg-bg-brand' : 'w-2 bg-border-input',
              ]"
            />
          </button>
        </li>
      </ul>
      <button
        type="button"
        :class="CONTROL_CLASS"
        :aria-label="t('home.slider.next')"
        @click="goTo(current + 1)"
      >
        <ChevronRight :size="20" aria-hidden="true" />
      </button>
    </div>
  </section>
</template>
