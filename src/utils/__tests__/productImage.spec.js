import { describe, expect, it } from 'vitest'

import { mainProductImage } from '@/utils/productImage'

describe('mainProductImage', () => {
  it('prefers the first full-size image', () => {
    expect(mainProductImage({ images: ['big.webp', 'side.webp'], thumbnail: 'thumb.webp' })).toBe(
      'big.webp',
    )
  })

  it('falls back to the thumbnail', () => {
    expect(mainProductImage({ images: [], thumbnail: 'thumb.webp' })).toBe('thumb.webp')
  })

  it('returns null without a product or a photo', () => {
    expect(mainProductImage(null)).toBeNull()
    expect(mainProductImage({ images: [], thumbnail: null })).toBeNull()
  })
})
