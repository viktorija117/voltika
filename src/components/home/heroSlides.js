import { INSTALLMENT_COUNT } from '@/config/pricing'
import { DEALS_ROUTE, productListRoute } from '@/utils/routes'

/**
 * Hero slides. Texts come from `home.slides.<id>.*`. Each slide shows one real product from
 * the catalog, picked by `featured` (see pickFeaturedProduct), and its price in `priceStyle`:
 * `deal` (price, old price, discount), `from` ("od 129.999 RSD") or `installments`.
 */
export const HERO_SLIDES = [
  { id: 'deals', to: DEALS_ROUTE, featured: { kind: 'deal' }, priceStyle: 'deal' },
  {
    id: 'laptops',
    to: productListRoute({ category: 'laptops' }),
    featured: { kind: 'topRated', category: 'laptops' },
    priceStyle: 'from',
  },
  {
    id: 'phones',
    to: productListRoute({ category: 'smartphones' }),
    featured: { kind: 'topRated', category: 'smartphones' },
    priceStyle: 'installments',
    textParams: { count: INSTALLMENT_COUNT },
  },
]
