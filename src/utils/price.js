import { CURRENCY, PRICE_LOCALE, RETAIL_PRICE_STEP, USD_TO_RSD_RATE } from '@/config/pricing'

const priceFormatter = new Intl.NumberFormat(PRICE_LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

/**
 * Formats an amount in RSD for display, e.g. 24999 -> "24.999 RSD".
 * The space before "RSD" is non-breaking, so the price never wraps.
 * @param {number} amount Whole dinars.
 * @returns {string}
 */
export function formatPrice(amount) {
  return priceFormatter.format(amount)
}

/**
 * Converts a USD price to a retail RSD price ending in 9 (199.99 USD -> 21.599 RSD).
 * @param {number} usd
 * @returns {number} Whole dinars.
 */
export function usdToRsd(usd) {
  const rsd = usd * USD_TO_RSD_RATE
  return Math.max(Math.round(rsd / RETAIL_PRICE_STEP) * RETAIL_PRICE_STEP - 1, 0)
}
