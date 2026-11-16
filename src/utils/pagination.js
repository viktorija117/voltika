/**
 * Cuts one page out of a list. A page number past the end shows the last page.
 * @template T
 * @param {T[]} items
 * @param {number} page 1-based.
 * @param {number} pageSize
 * @returns {{ items: T[], page: number, pageCount: number, firstIndex: number }}
 */
export function paginate(items, page, pageSize) {
  const pageCount = Math.max(Math.ceil(items.length / pageSize), 1)
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const firstIndex = (currentPage - 1) * pageSize
  return {
    items: items.slice(firstIndex, firstIndex + pageSize),
    page: currentPage,
    pageCount,
    firstIndex,
  }
}

/**
 * Page numbers to show, with 'gap' for skipped ranges: 1 … 4 5 6 … 10.
 * Shows the first, the last and the current page with one neighbour on each side.
 * @param {number} page Current page.
 * @param {number} pageCount
 * @returns {(number | 'gap')[]}
 */
export function pageNumbers(page, pageCount) {
  const visible = new Set([1, pageCount, page - 1, page, page + 1])
  const pages = [...visible].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b)
  return pages.flatMap((n, index) => (index > 0 && n - pages[index - 1] > 1 ? ['gap', n] : [n]))
}
