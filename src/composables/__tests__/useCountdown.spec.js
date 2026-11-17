import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { useCountdown } from '@/composables/useCountdown'

function mountCountdown(target) {
  let result
  const Host = defineComponent({
    setup() {
      result = useCountdown(target)
      return () => null
    },
  })
  const wrapper = mount(Host)
  return { result, wrapper }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 10, 18, 12, 0, 0))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useCountdown', () => {
  it('shows the time left and counts down every second', async () => {
    const { result } = mountCountdown(new Date(2026, 10, 19, 13, 1, 5))

    expect(result.parts.value).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 5 })

    vi.advanceTimersByTime(2000)
    await nextTick()

    expect(result.parts.value.seconds).toBe(3)
  })

  it('stops at zero and clears its timer', async () => {
    const { result } = mountCountdown(new Date(2026, 10, 18, 12, 0, 2))

    vi.advanceTimersByTime(5000)
    await nextTick()

    expect(result.isOver.value).toBe(true)
    expect(result.parts.value.seconds).toBe(0)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('clears its timer when the component is removed', () => {
    const { wrapper } = mountCountdown(new Date(2026, 10, 25))
    expect(vi.getTimerCount()).toBe(1)

    wrapper.unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
