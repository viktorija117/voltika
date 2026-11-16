import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseTabs from '@/components/ui/BaseTabs.vue'

const TABS = [
  { id: 'one', label: 'Prvi' },
  { id: 'two', label: 'Drugi' },
  { id: 'three', label: 'Treći' },
]

function mountTabs() {
  return mount(BaseTabs, {
    props: { tabs: TABS, label: 'Detalji' },
    slots: { one: 'Sadržaj 1', two: 'Sadržaj 2', three: 'Sadržaj 3' },
    attachTo: document.body,
  })
}

const isVisible = (panel) => panel.element.style.display !== 'none'

describe('BaseTabs', () => {
  it('links every tab to its panel', () => {
    const wrapper = mountTabs()
    const tab = wrapper.findAll('[role="tab"]')[1]
    const panel = wrapper.findAll('[role="tabpanel"]')[1]

    expect(tab.attributes('aria-controls')).toBe(panel.attributes('id'))
    expect(panel.attributes('aria-labelledby')).toBe(tab.attributes('id'))
    expect(wrapper.get('[role="tablist"]').attributes('aria-label')).toBe('Detalji')
    wrapper.unmount()
  })

  it('shows the first tab and keeps only it in the Tab order', () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')
    const panels = wrapper.findAll('[role="tabpanel"]')

    expect(tabs.map((tab) => tab.attributes('tabindex'))).toEqual(['0', '-1', '-1'])
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    expect(panels.map(isVisible)).toEqual([true, false, false])
    wrapper.unmount()
  })

  it('selects a tab on click', async () => {
    const wrapper = mountTabs()

    await wrapper.findAll('[role="tab"]')[2].trigger('click')

    expect(wrapper.findAll('[role="tabpanel"]').map(isVisible)).toEqual([false, false, true])
    wrapper.unmount()
  })

  it('moves and selects with the arrow keys, wrapping around', async () => {
    const wrapper = mountTabs()
    const tabs = wrapper.findAll('[role="tab"]')

    await tabs[0].trigger('keydown', { key: 'ArrowLeft' })

    expect(tabs[2].attributes('aria-selected')).toBe('true')
    expect(document.activeElement).toBe(tabs[2].element)

    await tabs[2].trigger('keydown', { key: 'Home' })
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    wrapper.unmount()
  })
})
