const ARROW_STEPS = { ArrowLeft: -1, ArrowRight: 1 }

/**
 * Index to move to in a horizontal group (tabs, thumbnails): arrows wrap around,
 * Home and End jump to the first and last item.
 * @param {string} key KeyboardEvent.key
 * @param {number} index Current index.
 * @param {number} count Number of items.
 * @returns {number | null} Null when the key does not move the selection.
 */
export function nextIndexForKey(key, index, count) {
  if (key in ARROW_STEPS) return (index + ARROW_STEPS[key] + count) % count
  if (key === 'Home') return 0
  if (key === 'End') return count - 1
  return null
}
