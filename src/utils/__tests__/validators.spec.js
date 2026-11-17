import { describe, expect, it } from 'vitest'

import { isFilled, isValidEmail, isValidPhone, isValidPostalCode } from '@/utils/validators'

describe('isValidEmail', () => {
  it.each(['ime@primer.rs', 'petar.petrovic@mail.co.rs', '  razmak@oko.com  '])(
    'accepts %s',
    (value) => {
      expect(isValidEmail(value)).toBe(true)
    },
  )

  it.each(['', 'petar@primer', 'petar.primer.rs', 'pe tar@primer.rs', '@primer.rs', 'a@b.c'])(
    'rejects "%s"',
    (value) => {
      expect(isValidEmail(value)).toBe(false)
    },
  )

  it('handles missing values without throwing', () => {
    expect(isValidEmail(undefined)).toBe(false)
    expect(isValidEmail(null)).toBe(false)
  })
})

describe('isFilled', () => {
  it('needs some text, not just spaces', () => {
    expect(isFilled('Ana')).toBe(true)
    expect(isFilled('   ')).toBe(false)
    expect(isFilled(undefined)).toBe(false)
  })
})

describe('isValidPhone', () => {
  it.each(['064 123 4567', '+381 64 123 4567', '011/123-45-67', '0641234567'])(
    'accepts %s',
    (value) => {
      expect(isValidPhone(value)).toBe(true)
    },
  )

  it.each(['', '123', '064 abc 4567', '+381 64 123 4567 999', '064+1234567'])(
    'rejects "%s"',
    (value) => {
      expect(isValidPhone(value)).toBe(false)
    },
  )
})

describe('isValidPostalCode', () => {
  it('accepts exactly five digits', () => {
    expect(isValidPostalCode('11000')).toBe(true)
    expect(isValidPostalCode(' 21000 ')).toBe(true)
  })

  it.each(['1100', '110000', '11 000', 'abcde'])('rejects "%s"', (value) => {
    expect(isValidPostalCode(value)).toBe(false)
  })
})
