import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'
import { NAV_CATEGORIES, QUERY_KEYS } from '@/config/catalog'

import HeaderNav from '@/components/layout/HeaderNav.vue'

describe('HeaderNav', () => {
  it('is a labelled navigation landmark', () => {
    const { wrapper } = mountWithApp(HeaderNav)

    expect(wrapper.get('nav').attributes('aria-label')).toBe('Glavna navigacija')
  })

  it('links every category to the filtered product list', () => {
    const { wrapper } = mountWithApp(HeaderNav)
    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'))

    for (const { slug } of NAV_CATEGORIES) {
      expect(hrefs).toContain(`/proizvodi?${QUERY_KEYS.category}=${slug}`)
    }
  })

  it('shows a translated label for every category', () => {
    const { wrapper } = mountWithApp(HeaderNav)

    expect(wrapper.text()).toContain('Telefoni')
    expect(wrapper.text()).toContain('Satovi')
  })
})
