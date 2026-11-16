import { mount } from '@vue/test-utils'
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
 * Mounts a component with the app's i18n and a test router.
 * @param {object} component Vue component to mount.
 * @param {object} [options] Extra mount options (props, slots...).
 * @returns {{ wrapper: import('@vue/test-utils').VueWrapper, router: import('vue-router').Router }}
 */
export function mountWithApp(component, options = {}) {
  const router = createTestRouter()
  const wrapper = mount(component, { ...options, global: { plugins: [i18n, router] } })
  return { wrapper, router }
}
