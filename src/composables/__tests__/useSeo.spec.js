import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import { useJsonLd, useSeo } from '@/composables/useSeo'

function mountWith(setup) {
  return mount(defineComponent({ setup: () => (setup(), () => null) }))
}

const meta = (selector) => document.head.querySelector(selector)?.getAttribute('content')

afterEach(() => {
  document.head.innerHTML = ''
  document.title = ''
})

describe('useSeo', () => {
  it('sets the title, description and Open Graph tags', () => {
    mountWith(() => useSeo(() => ({ title: 'Korpa', description: 'Opis korpe' })))

    expect(document.title).toBe('Korpa – Voltika')
    expect(meta('meta[name="description"]')).toBe('Opis korpe')
    expect(meta('meta[property="og:title"]')).toBe('Korpa – Voltika')
    expect(meta('meta[property="og:description"]')).toBe('Opis korpe')
  })

  it('follows the data when it changes', async () => {
    const name = ref('Učitavanje')
    mountWith(() => useSeo(() => ({ title: name.value })))

    name.value = 'iPhone 5s'
    await nextTick()

    expect(document.title).toBe('iPhone 5s – Voltika')
  })

  it('adds noindex and removes it when the page is left', () => {
    const wrapper = mountWith(() => useSeo(() => ({ title: 'Plaćanje', noindex: true })))
    expect(meta('meta[name="robots"]')).toBe('noindex')

    wrapper.unmount()

    expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
  })

  it('shortens a long description', () => {
    mountWith(() => useSeo(() => ({ description: 'reč '.repeat(100) })))

    expect(meta('meta[name="description"]').length).toBeLessThanOrEqual(160)
  })
})

describe('useJsonLd', () => {
  const scripts = () => document.head.querySelectorAll('script[type="application/ld+json"]')

  it('adds the data once it is there and removes it on unmount', async () => {
    const data = ref(null)
    const wrapper = mountWith(() => useJsonLd(() => data.value))
    expect(scripts()).toHaveLength(0)

    data.value = [{ '@type': 'Product', name: '</script><b>' }]
    await nextTick()

    expect(JSON.parse(scripts()[0].textContent)).toEqual([
      { '@type': 'Product', name: '</script><b>' },
    ])

    wrapper.unmount()
    expect(scripts()).toHaveLength(0)
  })
})
