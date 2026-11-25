/**
 * The product's main photo: the first full-size image, or the thumbnail when there is none.
 * @param {import('@/services/productMapper').Product | null} product
 * @returns {string | null} Null when the product is missing or has no photo.
 */
export function mainProductImage(product) {
  return product?.images[0] ?? product?.thumbnail ?? null
}
