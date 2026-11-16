import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { QUERY_KEYS, SEARCH_DEBOUNCE_MS, SEARCH_SUGGESTION_LIMIT } from '@/config/catalog'
import { getCatalog } from '@/services/productService'

import HeaderSearch from '@/components/layout/HeaderSearch.vue'

vi.mock('@/services/productService', () => ({ getCatalog: vi.fn() }))

const PRODUCTS = [
  makeProduct({ id: 1, name: 'iPhone 9', brand: 'Apple' }),
  makeProduct({ id: 2, name: 'iPhone X', brand: 'Apple' }),
  makeProduct({ id: 3, name: 'Beats Solo', brand: 'Beats' }),
]

beforeEach(() => {
  vi.useFakeTimers()
  vi.mocked(getCatalog).mockResolvedValue(PRODUCTS)
})

afterEach(() => {
  vi.useRealTimers()
})

async function mountSearch() {
  const { wrapper, router } = mountWithApp(HeaderSearch, { attachTo: document.body })
  await router.isReady()
  return { wrapper, router, input: wrapper.get('input') }
}

// Focus loads the catalog; typing waits for the debounce, like a real pause in typing.
async function type(input, value) {
  await input.trigger('focus')
  await flushPromises()
  await input.setValue(value)
  vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS)
  await flushPromises()
}

describe('HeaderSearch', () => {
  it('opens the product list with the trimmed term on submit', async () => {
    const { wrapper, router, input } = await mountSearch()

    await input.setValue('  slušalice  ')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('products')
    expect(router.currentRoute.value.query[QUERY_KEYS.search]).toBe('slušalice')
    wrapper.unmount()
  })

  it('stays on the page when the term is empty', async () => {
    const { wrapper, router, input } = await mountSearch()

    await input.setValue('   ')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('home')
    wrapper.unmount()
  })

  it('shows suggestions only after a pause and two letters', async () => {
    const { wrapper, input } = await mountSearch()

    await input.trigger('focus')
    await input.setValue('ip')
    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)

    vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS)
    await flushPromises()

    expect(wrapper.findAll('[role="option"]')).toHaveLength(3) // 2 products + "show all"
    expect(input.attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('2 predloga')
    wrapper.unmount()
  })

  it('ignores a single letter', async () => {
    const { wrapper, input } = await mountSearch()

    await type(input, 'i')

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it(`shows at most ${SEARCH_SUGGESTION_LIMIT} products`, async () => {
    const many = Array.from({ length: 10 }, (_, index) =>
      makeProduct({ id: index + 1, name: `Punjač ${index + 1}` }),
    )
    vi.mocked(getCatalog).mockResolvedValue(many)
    const { wrapper, input } = await mountSearch()

    await type(input, 'punjač')

    expect(wrapper.findAll('[role="option"]')).toHaveLength(SEARCH_SUGGESTION_LIMIT + 1)
    wrapper.unmount()
  })

  it('moves the highlight with the arrow keys and opens the product with Enter', async () => {
    const { wrapper, router, input } = await mountSearch()
    await type(input, 'iphone')

    await input.trigger('keydown', { key: 'ArrowDown' })
    const firstOption = wrapper.findAll('[role="option"]')[0]
    expect(input.attributes('aria-activedescendant')).toBe(firstOption.attributes('id'))
    expect(firstOption.attributes('aria-selected')).toBe('true')

    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/proizvod/1')
    expect(input.element.value).toBe('')
    wrapper.unmount()
  })

  it('wraps from the first option up to "show all results"', async () => {
    const { wrapper, router, input } = await mountSearch()
    await type(input, 'iphone')

    await input.trigger('keydown', { key: 'ArrowUp' })
    await input.trigger('keydown', { key: 'Enter' })
    await flushPromises()

    expect(router.currentRoute.value.query[QUERY_KEYS.search]).toBe('iphone')
    wrapper.unmount()
  })

  it('closes the list with Escape', async () => {
    const { wrapper, input } = await mountSearch()
    await type(input, 'iphone')

    await input.trigger('keydown', { key: 'Escape' })

    expect(wrapper.find('[role="listbox"]').exists()).toBe(false)
    expect(input.attributes('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('says so when nothing matches', async () => {
    const { wrapper, input } = await mountSearch()

    await type(input, 'frižider')

    expect(wrapper.text()).toContain('Nema proizvoda za „frižider“')
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('nema predloga')
    wrapper.unmount()
  })

  it('opens a product on click', async () => {
    const { wrapper, router, input } = await mountSearch()
    await type(input, 'beats')

    await wrapper.get('[role="option"]').trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/proizvod/3')
    wrapper.unmount()
  })
})
