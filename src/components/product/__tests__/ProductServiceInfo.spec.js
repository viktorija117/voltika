import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import ProductServiceInfo from '@/components/product/ProductServiceInfo.vue'

describe('ProductServiceInfo', () => {
  it('shows the terms in Serbian and leaves out the unknown ones', () => {
    const { wrapper } = mountWithApp(ProductServiceInfo, {
      props: {
        shipping: { kind: 'period', min: 3, max: 5, unit: 'businessDay' },
        warranty: { kind: 'none' },
        returnPolicy: null,
      },
    })
    const rows = wrapper.findAll('dl > div').map((row) => row.text())

    expect(rows).toEqual(['Dostava3–5 radnih dana', 'GarancijaBez garancije'])
  })
})
