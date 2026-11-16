import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'
import { NAV_CATEGORIES, QUERY_KEYS } from '@/config/catalog'
import { PAYMENT_METHODS, REPOSITORY_URL } from '@/config/project'

import AppFooter from '@/components/layout/AppFooter.vue'

describe('AppFooter', () => {
  it('links every category to the product list', () => {
    const { wrapper } = mountWithApp(AppFooter)
    const hrefs = wrapper.findAll('a').map((link) => link.attributes('href'))

    for (const { slug } of NAV_CATEGORIES) {
      expect(hrefs).toContain(`/proizvodi?${QUERY_KEYS.category}=${slug}`)
    }
  })

  it('opens the repository safely in a new tab and says so', () => {
    const { wrapper } = mountWithApp(AppFooter)
    const link = wrapper.get(`a[href="${REPOSITORY_URL}"]`)

    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toContain('noopener')
    expect(link.text()).toContain('otvara se u novom tabu')
  })

  it('shows the current year and every payment method', () => {
    const { wrapper } = mountWithApp(AppFooter)

    expect(wrapper.text()).toContain(`© ${new Date().getFullYear()} Voltika`)
    expect(wrapper.findAll('[aria-label="Načini plaćanja"] li')).toHaveLength(
      PAYMENT_METHODS.length,
    )
  })
})
