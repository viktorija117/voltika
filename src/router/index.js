import { createRouter, createWebHistory } from 'vue-router'

// Every view is lazy-loaded, so each page becomes its own JS chunk.
export const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/proizvodi', name: 'products', component: () => import('@/views/ProductListView.vue') },
  { path: '/proizvod/:id', name: 'product', component: () => import('@/views/ProductView.vue') },
  { path: '/korpa', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/placanje', name: 'checkout', component: () => import('@/views/CheckoutView.vue') },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

/**
 * Restores the scroll position on back/forward, jumps to #anchors,
 * and otherwise starts every new page at the top.
 */
export function scrollBehavior(to, _from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash }
  return { top: 0 }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior,
})

export default router
