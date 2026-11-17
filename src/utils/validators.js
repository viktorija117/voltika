// Practical email check: something@domain.tld, no spaces. The server would do the real check.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Checks whether a string looks like an email address.
 * @param {string} value Raw input, surrounding spaces are ignored.
 * @returns {boolean}
 */
export function isValidEmail(value) {
  return EMAIL_PATTERN.test(String(value ?? '').trim())
}

// Counted digits, with or without the +381 prefix: "011 123 456" has 9, "+381 64 123 4567" has 12.
const PHONE_DIGITS = { min: 8, max: 12 }
const PHONE_ALLOWED_CHARACTERS = /^\+?[\d\s/-]+$/
const POSTAL_CODE_PATTERN = /^\d{5}$/

/**
 * Checks whether a value has any text in it.
 * @param {string} value
 * @returns {boolean}
 */
export function isFilled(value) {
  return String(value ?? '').trim().length > 0
}

/**
 * Checks a phone number loosely: digits with optional +, spaces, slashes and dashes,
 * e.g. "064 123 4567", "+381 64 123 4567" or "011/123-45-67".
 * @param {string} value
 * @returns {boolean}
 */
export function isValidPhone(value) {
  const text = String(value ?? '').trim()
  if (!PHONE_ALLOWED_CHARACTERS.test(text)) return false
  const digitCount = text.replace(/\D/g, '').length
  return digitCount >= PHONE_DIGITS.min && digitCount <= PHONE_DIGITS.max
}

/**
 * Serbian postal codes have exactly five digits, e.g. "11000".
 * @param {string} value
 * @returns {boolean}
 */
export function isValidPostalCode(value) {
  return POSTAL_CODE_PATTERN.test(String(value ?? '').trim())
}
