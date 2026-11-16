import { describe, expect, it } from 'vitest'

import { formatPrice, usdToRsd } from '@/utils/price'

const NBSP = ' '

describe('formatPrice', () => {
  it.each([
    [24999, `24.999${NBSP}RSD`],
    [834, `834${NBSP}RSD`],
    [189999, `189.999${NBSP}RSD`],
  ])('formats %d as Serbian dinars', (amount, expected) => {
    expect(formatPrice(amount)).toBe(expected)
  })

  it('keeps the amount and the currency together with a non-breaking space', () => {
    expect(formatPrice(24999)).not.toContain(' ')
  })
})

describe('usdToRsd', () => {
  it('converts and rounds to a retail price ending in 9', () => {
    expect(usdToRsd(199.99)).toBe(21599)
    expect(usdToRsd(9.99)).toBe(1079)
  })

  it('never returns a negative price', () => {
    expect(usdToRsd(0)).toBe(0)
  })
})
