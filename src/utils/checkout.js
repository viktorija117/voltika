import { isFilled, isValidEmail, isValidPhone, isValidPostalCode } from '@/utils/validators'

/** @typedef {{ fullName: string, email: string, phone: string, street: string, city: string, postalCode: string }} Address */

/** @returns {Address} */
export function createEmptyAddress() {
  return { fullName: '', email: '', phone: '', street: '', city: '', postalCode: '' }
}

// Field -> [check, translation key of the error]. Order matches the form, so the first
// error found is the first invalid field on screen.
const ADDRESS_RULES = {
  fullName: [isFilled, 'checkout.errors.fullName'],
  email: [isValidEmail, 'checkout.errors.email'],
  phone: [isValidPhone, 'checkout.errors.phone'],
  street: [isFilled, 'checkout.errors.street'],
  city: [isFilled, 'checkout.errors.city'],
  postalCode: [isValidPostalCode, 'checkout.errors.postalCode'],
}

/**
 * Validates the delivery address.
 * @param {Address} address
 * @returns {Partial<Record<keyof Address, string>>} Translation keys of the errors, by field;
 *   an empty object when everything is valid.
 */
export function validateAddress(address) {
  const errors = {}
  for (const [field, [isValid, errorKey]] of Object.entries(ADDRESS_RULES)) {
    if (!isValid(address[field])) errors[field] = errorKey
  }
  return errors
}
