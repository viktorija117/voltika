import { createRouter, createWebHistory } from 'vue-router'

import { QUERY_KEYS } from '@/config/catalog'

// Every view is lazy-loaded, so each page becomes its own JS chunk.
export const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/proizvodi', name: 'products', component: () => import('@/views/ProductListView.vue') },
  // props: true passes :id as a prop, so the view does not depend on the router.
  {
    path: '/proizvod/:id',
    name: 'product',
    component: () => import('@/views/ProductView.vue'),
    props: true,
  },
  { path: '/korpa', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/placanje', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

/**
 * Restores the scroll position on back/forward and jumps to #anchors.
 * On the same page, a filter change keeps the position (no jump while ticking checkboxes)
 * and only a new result page scrolls to the top. A new page always starts at the top.
 */
export function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash }
  if (to.path === from.path) {
    const pageChanged = to.query[QUERY_KEYS.page] !== from.query[QUERY_KEYS.page]
    return pageChanged ? { top: 0 } : false
  }
  return { top: 0 }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
})

export default router
