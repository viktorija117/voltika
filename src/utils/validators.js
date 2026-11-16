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
