import { describe, expect, it } from 'vitest'

import { categoryLabelKey } from '@/utils/categories'

describe('categoryLabelKey', () => {
  it('returns the translation key of a shop category', () => {
    expect(categoryLabelKey('mobile-accessories')).toBe('categories.accessories')
  })

  it('returns null for categories the shop does not show', () => {
    expect(categoryLabelKey('groceries')).toBeNull()
    expect(categoryLabelKey('')).toBeNull()
  })
})
