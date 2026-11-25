/**
 * DummyJSON describes shipping, warranty and returns in English sentences, such as
 * "Ships in 3-5 business days" or "1 year warranty". These parsers turn them into data, so the
 * UI can show them in any language. A sentence they do not recognise gives null and is not shown.
 */

/** @typedef {'day' | 'businessDay' | 'week' | 'month' | 'year'} TermUnit */

/**
 * @typedef {{ kind: 'period', min: number, max: number, unit: TermUnit }
 *   | { kind: 'none' }
 *   | { kind: 'lifetime' }
 *   | { kind: 'overnight' }} ServiceTerm
 */

const UNITS = {
  day: 'day',
  'business day': 'businessDay',
  week: 'week',
  month: 'month',
  year: 'year',
}

// "3-5 business days", "2 weeks", "1 year". "business day" comes before "day" on purpose.
const PERIOD_PATTERN = /(\d+)(?:\s*-\s*(\d+))?\s+(business day|day|week|month|year)s?\b/i

function parsePeriod(text) {
  const match = PERIOD_PATTERN.exec(text)
  if (!match) return null
  const [, min, max = min, unit] = match
  return { kind: 'period', min: Number(min), max: Number(max), unit: UNITS[unit.toLowerCase()] }
}

/**
 * @param {unknown} text
 * @param {Array<[RegExp, ServiceTerm['kind']]>} specialCases Sentences without a period.
 * @returns {ServiceTerm | null}
 */
function parseTerm(text, specialCases) {
  if (typeof text !== 'string' || !text.trim()) return null
  const special = specialCases.find(([pattern]) => pattern.test(text))
  return special ? { kind: special[1] } : parsePeriod(text)
}

/**
 * @param {unknown} text e.g. "Ships overnight", "Ships in 1-2 business days".
 * @returns {ServiceTerm | null}
 */
export function parseShipping(text) {
  return parseTerm(text, [[/overnight/i, 'overnight']])
}

/**
 * @param {unknown} text e.g. "2 year warranty", "Lifetime warranty", "No warranty".
 * @returns {ServiceTerm | null}
 */
export function parseWarranty(text) {
  return parseTerm(text, [
    [/^no warranty/i, 'none'],
    [/lifetime/i, 'lifetime'],
  ])
}

/**
 * @param {unknown} text e.g. "30 days return policy", "No return policy".
 * @returns {ServiceTerm | null}
 */
export function parseReturnPolicy(text) {
  return parseTerm(text, [[/^no return/i, 'none']])
}
