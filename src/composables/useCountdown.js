import { computed, onMounted, onUnmounted, ref } from 'vue'

import { splitDuration } from '@/utils/time'

const TICK_MS = 1000

/**
 * Time left until a moment, updated every second. The timer starts on mount and is
 * cleared on unmount and once the time is up, so it never runs in the background.
 * @param {Date} target
 * @returns {{ parts: import('vue').ComputedRef<{ days: number, hours: number, minutes: number, seconds: number }>, isOver: import('vue').ComputedRef<boolean> }}
 */
export function useCountdown(target) {
  const now = ref(Date.now())
  let timer = null

  const remaining = computed(() => Math.max(target.getTime() - now.value, 0))
  const parts = computed(() => splitDuration(remaining.value))
  const isOver = computed(() => remaining.value === 0)

  function stop() {
    clearInterval(timer)
    timer = null
  }

  function tick() {
    now.value = Date.now()
    if (isOver.value) stop()
  }

  onMounted(() => {
    tick()
    if (!isOver.value) timer = setInterval(tick, TICK_MS)
  })
  onUnmounted(stop)

  return { parts, isOver }
}
