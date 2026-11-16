import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'
import { formatPrice } from '@/utils/price'

import PriceTag from '@/components/product/PriceTag.vue'

describe('PriceTag', () => {
  it('shows only the price when there is no sale', () => {
    const { wrapper } = mountWithApp(PriceTag, { props: { price: 24999 } })

    expect(wrapper.text()).toContain(formatPrice(24999))
    expect(wrapper.find('del').exists()).toBe(false)
  })

  it('shows the old price struck through, labelled for screen readers, and the savings', () => {
    const { wrapper } = mountWithApp(PriceTag, {
      props: { price: 19999, oldPrice: 24999, savings: 5000 },
    })

    expect(wrapper.get('del').text()).toContain('Stara cena')
    expect(wrapper.get('del').text()).toContain(formatPrice(24999))
    expect(wrapper.text()).toContain(`Ušteda ${formatPrice(5000)}`)
  })
})
