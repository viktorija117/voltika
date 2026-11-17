// Cart and shipping rules. All amounts are in RSD.

/** Orders at or above this subtotal ship for free. */
export const FREE_SHIPPING_THRESHOLD = 5000

/** Courier delivery price below the free-shipping threshold. */
export const COURIER_SHIPPING_PRICE = 390

/** Next-day express delivery price; never free. */
export const EXPRESS_SHIPPING_PRICE = 690

/** Highest quantity of a single product in the cart. */
export const CART_MAX_QUANTITY = 10

/** localStorage key of the saved cart. Bump the version if the saved shape changes. */
export const CART_STORAGE_KEY = 'voltika-cart-v1'
