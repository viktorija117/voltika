/**
 * Delays calls to `fn` until `delay` ms have passed without another call.
 * Call `.cancel()` when the component unmounts so no timer outlives it.
 * @template {(...args: any[]) => void} F
 * @param {F} fn
 * @param {number} delay Milliseconds.
 * @returns {F & { cancel: () => void }}
 */
export function debounce(fn, delay) {
  let timer = null
  function debounced(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}
