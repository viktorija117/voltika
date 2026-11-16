import { describe, expect, it } from 'vitest'

import { pageNumbers, paginate } from '@/utils/pagination'

const ITEMS = Array.from({ length: 25 }, (_, index) => index + 1)

describe('paginate', () => {
  it('cuts out the requested page', () => {
    expect(paginate(ITEMS, 2, 12)).toEqual({
      items: ITEMS.slice(12, 24),
      page: 2,
      pageCount: 3,
      firstIndex: 12,
    })
  })

  it('shows the last page for a page number past the end', () => {
    const result = paginate(ITEMS, 9, 12)
    expect(result.page).toBe(3)
    expect(result.items).toEqual([25])
  })

  it('has one empty page for an empty list', () => {
    expect(paginate([], 1, 12)).toEqual({ items: [], page: 1, pageCount: 1, firstIndex: 0 })
  })
})

describe('pageNumbers', () => {
  it('lists every page when there are few', () => {
    expect(pageNumbers(2, 4)).toEqual([1, 2, 3, 4])
  })

  it('collapses distant pages into gaps', () => {
    expect(pageNumbers(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10])
  })

  it('has no gap next to the first and last page', () => {
    expect(pageNumbers(1, 10)).toEqual([1, 2, 'gap', 10])
    expect(pageNumbers(10, 10)).toEqual([1, 'gap', 9, 10])
  })
})
