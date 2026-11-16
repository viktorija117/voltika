/**
 * Serbian plural forms for vue-i18n messages written as "zero | one | few | many":
 * 0 proizvoda | 1, 21, 31 proizvod | 2–4, 22–24 proizvoda | 5–20, 25 proizvoda.
 * @param {number} count
 * @returns {number} Index of the message form to use.
 */
export function serbianPlural(count) {
  if (count === 0) return 0
  const lastDigit = count % 10
  const lastTwoDigits = count % 100
  if (lastDigit === 1 && lastTwoDigits !== 11) return 1
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) return 2
  return 3
}
