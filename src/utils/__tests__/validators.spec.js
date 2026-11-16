import { describe, expect, it } from 'vitest'

import { isValidEmail } from '@/utils/validators'

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
