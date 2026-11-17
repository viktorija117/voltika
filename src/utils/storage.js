/**
 * Reads JSON from localStorage. Returns null when nothing is saved, the value is not valid
 * JSON, or storage is blocked (private mode, disabled cookies), so callers never crash.
 * The result is untrusted: callers must check its shape.
 * @param {string} key
 * @returns {unknown}
 */
export function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Saves a value as JSON. A full or blocked storage is ignored: the app keeps working,
 * the value just does not survive a reload.
 * @param {string} key
 * @param {unknown} value
 */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Nothing else to do; see the JSDoc above.
  }
}
