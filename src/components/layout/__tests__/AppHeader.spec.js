import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import AppHeader from '@/components/layout/AppHeader.vue'

describe('AppHeader', () => {
  it('opens the mobile menu and reports it with aria-expanded', async () => {
    const { wrapper } = mountWithApp(AppHeader, { attachTo: document.body })
    const menuButton = wrapper.get('button[aria-controls="mobile-menu"]')
    expect(menuButton.attributes('aria-expanded')).toBe('false')

    await menuButton.trigger('click')

    expect(menuButton.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('#mobile-menu').element.open).toBe(true)
    wrapper.unmount()
  })

  it('updates aria-expanded when the menu is closed', async () => {
    const { wrapper } = mountWithApp(AppHeader, { attachTo: document.body })
    const menuButton = wrapper.get('button[aria-controls="mobile-menu"]')

    await menuButton.trigger('click')
    await wrapper.get('button[aria-label="Zatvori meni"]').trigger('click')

    expect(menuButton.attributes('aria-expanded')).toBe('false')
    expect(wrapper.get('#mobile-menu').element.open).toBe(false)
    wrapper.unmount()
  })
})
