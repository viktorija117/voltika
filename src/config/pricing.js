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
