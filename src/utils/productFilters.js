// Lowercase and without diacritics, so "slusalice" also finds "slušalice".
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

/**
 * Filters products by category slug and a free-text search over name, brand and category.
 * Empty filters are ignored.
 * @param {import('@/services/productMapper').Product[]} products
 * @param {{ category?: string, search?: string }} filters
 * @returns {import('@/services/productMapper').Product[]}
 */
export function filterProducts(products, { category = '', search = '' } = {}) {
  const term = normalize(search)
  return products.filter((product) => {
    if (category && product.category !== category) return false
    if (!term) return true
    return normalize(`${product.name} ${product.brand} ${product.category}`).includes(term)
  })
}
