import { describe, expect, it } from 'vitest'

import { parseReturnPolicy, parseShipping, parseWarranty } from '@/services/serviceTermParser'

const period = (min, max, unit) => ({ kind: 'period', min, max, unit })

describe('parseShipping', () => {
  it.each([
    ['Ships overnight', { kind: 'overnight' }],
    ['Ships in 1-2 business days', period(1, 2, 'businessDay')],
    ['Ships in 3-5 business days', period(3, 5, 'businessDay')],
    ['Ships in 1 week', period(1, 1, 'week')],
    ['Ships in 2 weeks', period(2, 2, 'week')],
    ['Ships in 1 month', period(1, 1, 'month')],
  ])('reads "%s"', (text, expected) => {
    expect(parseShipping(text)).toEqual(expected)
  })
})

describe('parseWarranty', () => {
  it.each([
    ['No warranty', { kind: 'none' }],
    ['Lifetime warranty', { kind: 'lifetime' }],
    ['1 month warranty', period(1, 1, 'month')],
    ['6 months warranty', period(6, 6, 'month')],
    ['2 year warranty', period(2, 2, 'year')],
  ])('reads "%s"', (text, expected) => {
    expect(parseWarranty(text)).toEqual(expected)
  })
})

describe('parseReturnPolicy', () => {
  it.each([
    ['No return policy', { kind: 'none' }],
    ['7 days return policy', period(7, 7, 'day')],
    ['90 days return policy', period(90, 90, 'day')],
  ])('reads "%s"', (text, expected) => {
    expect(parseReturnPolicy(text)).toEqual(expected)
  })
})

describe('unknown or missing text', () => {
  it.each([undefined, null, '', '   ', 'Contact the seller'])('gives null for %j', (text) => {
    expect(parseShipping(text)).toBeNull()
    expect(parseWarranty(text)).toBeNull()
    expect(parseReturnPolicy(text)).toBeNull()
  })
})
