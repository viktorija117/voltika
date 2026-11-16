// Currency, price formatting and installment rules.

export const CURRENCY = 'RSD'

/** Locale for number and price formatting (e.g. 24.999 RSD). */
export const PRICE_LOCALE = 'sr-RS'

/**
 * DummyJSON prices are in USD. This is a fixed demo rate, not a live exchange rate,
 * so prices stay stable between visits.
 */
export const USD_TO_RSD_RATE = 108

/** Number of interest-free installments shown on the product page. */
export const INSTALLMENT_COUNT = 24

/**
 * DummyJSON gives almost every product a small discount. Only discounts at least
 * this big are shown as a sale, so "-3%" badges do not flood the shop.
 */
export const MIN_SALE_DISCOUNT_PERCENT = 10

/** Prices are rounded to a retail price ending in 9 (e.g. 21.599 RSD). */
export const RETAIL_PRICE_STEP = 10
