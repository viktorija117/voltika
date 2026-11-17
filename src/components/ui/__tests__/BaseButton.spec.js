import { mount } from '@vue/test-utils'
import { ShoppingCart } from 'lucide-vue-next'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import BaseButton from '@/components/ui/BaseButton.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', name: 'home', component: { render: () => h('div') } }],
})

function mountButton(props = {}, label = 'Dodaj u korpu') {
  return mount(BaseButton, { props, slots: { default: label }, global: { plugins: [router] } })
}

describe('BaseButton', () => {
  it('renders a native button with type="button" by default', () => {
    const button = mountButton().get('button')
    expect(button.attributes('type')).toBe('button')
    expect(button.text()).toBe('Dodaj u korpu')
  })

  it('passes the submit type to the native button', () => {
    expect(mountButton({ type: 'submit' }).get('button').attributes('type')).toBe('submit')
  })

  it.each([
    ['primary', 'bg-bg-brand'],
    ['accent', 'bg-holo'],
    ['secondary', 'bg-bg-brand-subtle'],
    ['ghost', 'text-text-brand'],
  ])('applies the %s variant classes', (variant, expectedClass) => {
    expect(mountButton({ variant }).classes()).toContain(expectedClass)
  })

  it('disables the native button', () => {
    expect(mountButton({ disabled: true }).get('button').attributes()).toHaveProperty('disabled')
  })

  it('renders a link when a route is given', async () => {
    const wrapper = mountButton({ to: { name: 'home' } })
    await router.isReady()
    const link = wrapper.get('a')
    expect(link.attributes('href')).toBe('/')
    expect(link.attributes('type')).toBeUndefined()
  })

  it('hides the icon from screen readers', () => {
    const icon = mountButton({ icon: ShoppingCart }).get('svg')
    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  it('stretches to full width when block is set', () => {
    expect(mountButton({ block: true }).classes()).toContain('w-full')
  })
})
