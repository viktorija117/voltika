import { onMounted, onUnmounted, ref } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

/**
 * Whether the user asked the system for less motion. Follows changes while the page is open.
 * @returns {import('vue').Ref<boolean>}
 */
export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(false)
  let mediaQuery = null

  function update() {
    prefersReducedMotion.value = mediaQuery.matches
  }

  onMounted(() => {
    mediaQuery = window.matchMedia?.(QUERY) ?? null
    if (!mediaQuery) return
    update()
    mediaQuery.addEventListener('change', update)
  })
  onUnmounted(() => mediaQuery?.removeEventListener('change', update))

  return prefersReducedMotion
}
