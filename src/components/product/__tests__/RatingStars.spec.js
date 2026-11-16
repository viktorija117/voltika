import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import RatingStars from '@/components/product/RatingStars.vue'

describe('RatingStars', () => {
  it('describes the rating in one sentence for screen readers', () => {
    const { wrapper } = mountWithApp(RatingStars, { props: { rating: 4.5, count: 3 } })

    expect(wrapper.get('.sr-only').text()).toBe('Ocena 4,5 od 5, 3 recenzije')
  })

  it('rounds to half stars', () => {
    const { wrapper } = mountWithApp(RatingStars, { props: { rating: 3.3, count: 1 } })

    expect(wrapper.findAll('.w-full')).toHaveLength(3)
    expect(wrapper.findAll('.w-1\\/2')).toHaveLength(1)
  })
})
