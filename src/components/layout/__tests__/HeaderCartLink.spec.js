import { describe, expect, it } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { useCartStore } from '@/stores/cart'

import HeaderCartLink from '@/components/layout/HeaderCartLink.vue'

describe('HeaderCartLink', () => {
  it('links to the cart without a count when it is empty', () => {
    const { wrapper } = mountWithApp(HeaderCartLink)

    expect(wrapper.get('a').attributes('href')).toBe('/korpa')
    expect(wrapper.text()).toBe('Korpa')
  })

  it('shows the item count and says it in words', async () => {
    const { wrapper } = mountWithApp(HeaderCartLink)
    useCartStore().add(makeProduct({ id: 1, stock: 20 }), 3)
    await wrapper.vm.$nextTick()

    expect(wrapper.get('[aria-hidden="true"].rounded-full').text()).toBe('3')
    expect(wrapper.text()).toContain(', 3 artikla')
  })
})
