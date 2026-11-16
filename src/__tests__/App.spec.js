import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from '../App.vue'

// Render function instead of a template string: the app uses the runtime-only Vue build.
const HomeStub = { render: () => h('p', 'Home') }

describe('App', () => {
  it('renders the component of the current route', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: HomeStub }],
    })
    router.push('/')
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router] } })

    expect(wrapper.text()).toContain('Home')
  })
})
