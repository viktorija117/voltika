import { describe, expect, it } from 'vitest'

import { createEmptyAddress, validateAddress } from '@/utils/checkout'

const VALID_ADDRESS = {
  fullName: 'Ana Anić',
  email: 'ana@primer.rs',
  phone: '064 123 4567',
  street: 'Knez Mihailova 1',
  city: 'Beograd',
  postalCode: '11000',
}

describe('validateAddress', () => {
  it('returns no errors for a valid address', () => {
    expect(validateAddress(VALID_ADDRESS)).toEqual({})
  })

  it('reports every empty field of a new form', () => {
    expect(Object.keys(validateAddress(createEmptyAddress()))).toEqual([
      'fullName',
      'email',
      'phone',
      'street',
      'city',
      'postalCode',
    ])
  })

  it('returns translation keys for invalid values', () => {
    const errors = validateAddress({ ...VALID_ADDRESS, email: 'ana@', postalCode: '110' })

    expect(errors).toEqual({
      email: 'checkout.errors.email',
      postalCode: 'checkout.errors.postalCode',
    })
  })
})
