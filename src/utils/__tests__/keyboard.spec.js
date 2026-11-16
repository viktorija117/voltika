import { describe, expect, it } from 'vitest'

import { nextIndexForKey } from '@/utils/keyboard'

describe('nextIndexForKey', () => {
  it('moves with the arrow keys', () => {
    expect(nextIndexForKey('ArrowRight', 1, 4)).toBe(2)
    expect(nextIndexForKey('ArrowLeft', 1, 4)).toBe(0)
  })

  it('wraps around at both ends', () => {
    expect(nextIndexForKey('ArrowRight', 3, 4)).toBe(0)
    expect(nextIndexForKey('ArrowLeft', 0, 4)).toBe(3)
  })

  it('jumps to the first and last item with Home and End', () => {
    expect(nextIndexForKey('Home', 2, 4)).toBe(0)
    expect(nextIndexForKey('End', 0, 4)).toBe(3)
  })

  it('ignores other keys', () => {
    expect(nextIndexForKey('Enter', 1, 4)).toBeNull()
  })
})
