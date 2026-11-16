import { flushPromises } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'
import { QUERY_KEYS } from '@/config/catalog'

import HeaderSearch from '@/components/layout/HeaderSearch.vue'

async function search(term) {
  const { wrapper, router } = mountWithApp(HeaderSearch)
  await router.isReady()
  await wrapper.get('input').setValue(term)
  await wrapper.get('form').trigger('submit')
  await flushPromises()
  return router.currentRoute.value
}

describe('HeaderSearch', () => {
  it('opens the product list with the trimmed search term', async () => {
    const route = await search('  slušalice  ')

    expect(route.name).toBe('products')
    expect(route.query[QUERY_KEYS.search]).toBe('slušalice')
  })

  it('stays on the page when the search term is empty', async () => {
    const route = await search('   ')

    expect(route.name).toBe('home')
  })

  it('labels the search field for screen readers', () => {
    const { wrapper } = mountWithApp(HeaderSearch)

    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))
    expect(wrapper.get('form').attributes('role')).toBe('search')
  })
})
