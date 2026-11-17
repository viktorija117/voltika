import { Headphones, Laptop, Smartphone, Tablet, Watch } from 'lucide-vue-next'

import { INSTALLMENT_COUNT } from '@/config/pricing'
import { DEALS_ROUTE, productListRoute } from '@/utils/routes'

/**
 * Hero slides. Texts come from `home.slides.<id>.*`; icons are decorative illustrations
 * drawn from the design system instead of product photos.
 */
export const HERO_SLIDES = [
  {
    id: 'deals',
    to: DEALS_ROUTE,
    icons: [Headphones, Smartphone, Laptop, Watch],
    showDiscount: true,
  },
  {
    id: 'laptops',
    to: productListRoute({ category: 'laptops' }),
    icons: [Laptop, Tablet, Headphones, Smartphone],
  },
  {
    id: 'phones',
    to: productListRoute({ category: 'smartphones' }),
    icons: [Smartphone, Headphones, Watch, Tablet],
    textParams: { count: INSTALLMENT_COUNT },
  },
]
