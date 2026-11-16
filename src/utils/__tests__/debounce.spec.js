import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { debounce } from '@/utils/debounce'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('debounce', () => {
  it('calls once, with the last arguments, after the pause', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('1')
    debounced('10')
    debounced('100')
    vi.advanceTimersByTime(299)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledExactlyOnceWith('100')
  })

  it('never calls after cancel', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced('x')
    debounced.cancel()
    vi.advanceTimersByTime(1000)

    expect(fn).not.toHaveBeenCalled()
  })
})
