import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseBadge from '@/components/ui/BaseBadge.vue'

describe('BaseBadge', () => {
  it.each([
    ['sale', '-20%', 'bg-bg-sale'],
    ['new', 'Novo', 'bg-holo'],
    ['lowStock', 'Poslednji komadi', 'bg-bg-brand-subtle'],
  ])('renders the %s variant with its text', (variant, text, expectedClass) => {
    const badge = mount(BaseBadge, { props: { variant }, slots: { default: text } })
    expect(badge.text()).toBe(text)
    expect(badge.classes()).toContain(expectedClass)
  })
})
