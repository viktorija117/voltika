import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'
import { NAV_CATEGORIES } from '@/config/catalog'

import MobileDrawer from '@/components/layout/MobileDrawer.vue'

function mountDrawer() {
  return mountWithApp(MobileDrawer, { props: { open: false }, attachTo: document.body })
}

describe('MobileDrawer', () => {
  it('opens and closes the dialog with the open prop', async () => {
    const { wrapper } = mountDrawer()
    const dialog = wrapper.get('dialog').element

    await wrapper.setProps({ open: true })
    expect(dialog.open).toBe(true)

    await wrapper.setProps({ open: false })
    expect(dialog.open).toBe(false)
    wrapper.unmount()
  })

  it('asks to close from the close button', async () => {
    const { wrapper } = mountDrawer()

    await wrapper.get('button[aria-label="Zatvori meni"]').trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('asks to close when the browser closes the dialog (Escape)', async () => {
    const { wrapper } = mountDrawer()

    await wrapper.get('dialog').trigger('close')

    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('closes after a link is chosen', async () => {
    const { wrapper } = mountDrawer()

    await wrapper.findAll('a')[1].trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    wrapper.unmount()
  })

  it('lists all products, every category and the deals link', () => {
    const { wrapper } = mountDrawer()

    expect(wrapper.findAll('nav a')).toHaveLength(NAV_CATEGORIES.length + 2)
    wrapper.unmount()
  })
})
