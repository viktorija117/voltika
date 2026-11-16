import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

import i18n from '@/locales'
import { routes } from '@/router'

/**
 * Router with the app's real route names and paths, but light stub pages,
 * so tests do not load the lazy views.
 * @returns {import('vue-router').Router}
 */
export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: routes.map((route) => ({ ...route, component: { render: () => h('p', route.name) } })),
  })
}

/**
 * Mounts a component with the app's i18n, a test router and a fresh Pinia,
 * so stores never leak state between tests.
 * @param {object} component Vue component to mount.
 * @param {object} [options] Extra mount options (props, slots...).
 * @returns {{ wrapper: import('@vue/test-utils').VueWrapper, router: import('vue-router').Router, pinia: import('pinia').Pinia }}
 */
export function mountWithApp(component, options = {}) {
  const router = createTestRouter()
  const pinia = createPinia()
  setActivePinia(pinia)
  const wrapper = mount(component, { ...options, global: { plugins: [i18n, router, pinia] } })
  return { wrapper, router, pinia }
}

/**
 * A Product with sensible defaults, for component tests.
 * @param {Partial<import('@/services/productMapper').Product>} [overrides]
 * @returns {import('@/services/productMapper').Product}
 */
export function makeProduct(overrides = {}) {
  return {
    id: 1,
    name: 'Bežične slušalice',
    description: '',
    brand: 'Brend',
    category: 'mobile-accessories',
    sku: 'SKU-1',
    price: 19999,
    oldPrice: null,
    savings: 0,
    discountPercent: 0,
    rating: 4.5,
    reviewCount: 3,
    stock: 20,
    stockStatus: 'inStock',
    thumbnail: 'https://cdn.example/thumb.webp',
    images: [],
    ...overrides,
  }
}
