import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import App from '@/App.vue'

describe('App', () => {
  it('renders the header and the page of the current route', async () => {
    const { wrapper, router } = mountWithApp(App)
    await router.push('/korpa')

    expect(wrapper.find('header').exists()).toBe(true)
    expect(wrapper.get('main').text()).toBe('cart')
  })

  it('has a skip link that targets the main content', () => {
    const { wrapper } = mountWithApp(App)

    expect(wrapper.get('a[href="#main-content"]').text()).toBe('Preskoči na sadržaj')
    expect(wrapper.get('main').attributes('id')).toBe('main-content')
  })
})
