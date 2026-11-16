import { NAV_CATEGORIES } from '@/config/catalog'
import { fetchJson } from '@/services/apiClient'
import { toProduct, toProductDetails } from '@/services/productMapper'

// Only the fields the shop uses, to keep responses small.
const PRODUCT_FIELDS = [
  'title',
  'description',
  'category',
  'price',
  'discountPercentage',
  'rating',
  'stock',
  'brand',
  'sku',
  'thumbnail',
  'images',
  'reviews',
].join(',')

// The product page also shows delivery, warranty and returns.
const DETAIL_FIELDS = [
  PRODUCT_FIELDS,
  'warrantyInformation',
  'shippingInformation',
  'returnPolicy',
].join(',')

/**
 * Loads every product in the shop's categories. DummyJSON cannot combine category,
 * search and price filters, so the small catalog (~45 products) is filtered on the client.
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<import('@/services/productMapper').Product[]>}
 */
export async function getCatalog({ signal } = {}) {
  const responses = await Promise.all(
    NAV_CATEGORIES.map(({ slug }) =>
      fetchJson(`/products/category/${slug}?limit=0&select=${PRODUCT_FIELDS}`, { signal }),
    ),
  )
  return responses.flatMap((response) => response.products.map(toProduct))
}

/**
 * Loads one product with everything the product page shows.
 * @param {number | string} id
 * @param {{ signal?: AbortSignal }} [options]
 * @returns {Promise<import('@/services/productMapper').ProductDetails>}
 * @throws {import('@/services/apiClient').ApiError} With status 404 when the product does not exist.
 */
export async function getProduct(id, { signal } = {}) {
  const raw = await fetchJson(`/products/${encodeURIComponent(id)}?select=${DETAIL_FIELDS}`, {
    signal,
  })
  return toProductDetails(raw)
}
