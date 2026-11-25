/**
 * Text for a parsed service term in the current language, e.g. "3–5 radnih dana", "2 godine"
 * or "Bez garancije". Ranges take the plural form of their upper bound.
 * @param {import('@/services/serviceTermParser').ServiceTerm | null} term
 * @param {'shipping' | 'warranty' | 'returnPolicy'} field Which term it is, for the texts without a period.
 * @param {Function} t vue-i18n's translate function.
 * @returns {string} Empty string when there is no term.
 */
export function formatServiceTerm(term, field, t) {
  if (!term) return ''
  if (term.kind !== 'period') return t(`product.terms.${field}.${term.kind}`)
  const amount = term.min === term.max ? String(term.min) : `${term.min}–${term.max}`
  return t(`product.terms.units.${term.unit}`, { amount }, term.max)
}
