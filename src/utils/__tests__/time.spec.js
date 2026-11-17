import { describe, expect, it } from 'vitest'

import { endOfWeek, splitDuration } from '@/utils/time'

describe('endOfWeek', () => {
  it('returns the coming Sunday at the last millisecond', () => {
    // Wednesday 18 November 2026, 10:30 local time.
    const end = endOfWeek(new Date(2026, 10, 18, 10, 30))

    expect(end).toEqual(new Date(2026, 10, 22, 23, 59, 59, 999))
  })

  it('returns the end of the same day on a Sunday', () => {
    const end = endOfWeek(new Date(2026, 10, 22, 8, 0))

    expect(end).toEqual(new Date(2026, 10, 22, 23, 59, 59, 999))
  })

  it('does not change the date it was given', () => {
    const now = new Date(2026, 10, 18, 10, 30)
    endOfWeek(now)

    expect(now).toEqual(new Date(2026, 10, 18, 10, 30))
  })
})

describe('splitDuration', () => {
  it('splits milliseconds into days, hours, minutes and seconds', () => {
    const duration = ((3 * 24 + 14) * 60 * 60 + 22 * 60 + 9) * 1000 + 500

    expect(splitDuration(duration)).toEqual({ days: 3, hours: 14, minutes: 22, seconds: 9 })
  })

  it('treats negative durations as zero', () => {
    expect(splitDuration(-5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  })
})
