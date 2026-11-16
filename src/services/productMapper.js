import { LOW_STOCK_THRESHOLD } from '@/config/catalog'
import { MIN_SALE_DISCOUNT_PERCENT } from '@/config/pricing'
import { usdToRsd } from '@/utils/price'

/** @typedef {'inStock' | 'lowStock' | 'outOfStock'} StockStatus */

/**
 * @typedef {object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} description
 * @property {string} brand Empty string when the API has no brand.
 * @property {string} category DummyJSON category slug.
 * @property {string} sku
 * @property {number} price Current price in RSD.
 * @property {number | null} oldPrice Price before the sale, or null when not on sale.
 * @property {number} savings Amount saved in RSD (0 when not on sale).
 * @property {number} discountPercent Whole percent (0 when not on sale).
 * @property {number} rating 0–5.
 * @property {number} reviewCount
 * @property {number} stock
 * @property {StockStatus} stockStatus
 * @property {string | null} thumbnail
 * @property {string[]} images
 */

/**
 * @param {number} stock
 * @returns {StockStatus}
 */
export function toStockStatus(stock) {
  if (stock <= 0) return 'outOfStock'
  if (stock <= LOW_STOCK_THRESHOLD) return 'lowStock'
  return 'inStock'
}

function toPricing(usdPrice, discountPercentage) {
  const discount = Number(discountPercentage) || 0
  if (discount < MIN_SALE_DISCOUNT_PERCENT) {
    return { price: usdToRsd(usdPrice), oldPrice: null, savings: 0, discountPercent: 0 }
  }
  const oldPrice = usdToRsd(usdPrice)
  const price = usdToRsd(usdPrice * (1 - discount / 100))
  return { price, oldPrice, savings: oldPrice - price, discountPercent: Math.round(discount) }
}

/**
 * Turns a DummyJSON product into the shop's Product shape, with safe fallbacks
 * for missing fields so the UI never breaks on incomplete data.
 * @param {object} raw Product as returned by DummyJSON.
 * @returns {Product}
 */
export function toProduct(raw) {
  const stock = Number(raw.stock) || 0
  return {
    id: raw.id,
    name: raw.title ?? '',
    description: raw.description ?? '',
    brand: raw.brand ?? '',
    category: raw.category ?? '',
    sku: raw.sku ?? '',
    ...toPricing(Number(raw.price) || 0, raw.discountPercentage),
    rating: Number(raw.rating) || 0,
    reviewCount: Array.isArray(raw.reviews) ? raw.reviews.length : 0,
    stock,
    stockStatus: toStockStatus(stock),
    thumbnail: raw.thumbnail || null,
    images: Array.isArray(raw.images) ? raw.images : [],
  }
}

/**
 * @typedef {object} Review
 * @property {number} rating 1–5.
 * @property {string} comment
 * @property {string} author
 * @property {string} date ISO date.
 */

/**
 * @typedef {Product & {
 *   warranty: string,
 *   shipping: string,
 *   returnPolicy: string,
 *   reviews: Review[],
 * }} ProductDetails
 */

function toReview(raw) {
  return {
    rating: Number(raw.rating) || 0,
    comment: raw.comment ?? '',
    author: raw.reviewerName ?? '',
    date: raw.date ?? '',
  }
}

/**
 * The product page needs more than a card: service info and the reviews themselves.
 * @param {object} raw Product as returned by DummyJSON.
 * @returns {ProductDetails}
 */
export function toProductDetails(raw) {
  return {
    ...toProduct(raw),
    warranty: raw.warrantyInformation ?? '',
    shipping: raw.shippingInformation ?? '',
    returnPolicy: raw.returnPolicy ?? '',
    reviews: Array.isArray(raw.reviews) ? raw.reviews.map(toReview) : [],
  }
}
