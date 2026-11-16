import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import BaseLink from '@/components/ui/BaseLink.vue'

async function mountLink(currentPath, to, options = {}) {
  const { wrapper, router } = mountWithApp(BaseLink, {
    props: { to },
    slots: { default: 'Laptopovi' },
    ...options,
  })
  await router.push(currentPath)
  await flushPromises()
  return { wrapper, router }
}

const laptops = { name: 'products', query: { kategorija: 'laptops' } }

describe('BaseLink', () => {
  it('renders a normal link with the resolved href', async () => {
    const { wrapper } = await mountLink('/', laptops)

    expect(wrapper.get('a').attributes('href')).toBe('/proizvodi?kategorija=laptops')
  })

  it('marks the link as the current page when path and query match', async () => {
    const { wrapper } = await mountLink('/proizvodi?kategorija=laptops', laptops)

    expect(wrapper.get('a').attributes('aria-current')).toBe('page')
  })

  it('does not mark a link that only shares the path (unlike RouterLink)', async () => {
    const { wrapper } = await mountLink('/proizvodi?kategorija=tablets', laptops)

    expect(wrapper.get('a').attributes('aria-current')).toBeUndefined()
  })

  it('passes classes and click handlers to the anchor and still navigates', async () => {
    const onClick = vi.fn()
    const { wrapper, router } = await mountLink('/', laptops, {
      attrs: { class: 'nav-link', onClick },
    })

    await wrapper.get('a').trigger('click')
    await flushPromises()

    expect(wrapper.get('a').classes()).toContain('nav-link')
    expect(onClick).toHaveBeenCalledOnce()
    expect(router.currentRoute.value.fullPath).toBe('/proizvodi?kategorija=laptops')
  })
})
