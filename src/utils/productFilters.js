// Lowercase and without diacritics, so "slusalice" also finds "slušalice".
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

function matchesSearch(product, term) {
  return normalize(`${product.name} ${product.brand} ${product.category}`).includes(term)
}

/**
 * Keeps the products that match every given filter. Missing or empty filters are ignored.
 * @param {import('@/services/productMapper').Product[]} products
 * @param {Partial<import('@/utils/filterQuery').ListingFilters>} [filters]
 * @returns {import('@/services/productMapper').Product[]}
 */
export function filterProducts(products, filters = {}) {
  const {
    category = '',
    search = '',
    brands = [],
    minPrice = null,
    maxPrice = null,
    minRating = null,
    inStockOnly = false,
  } = filters
  const term = normalize(search)
  return products.filter(
    (product) =>
      (!category || product.category === category) &&
      (!term || matchesSearch(product, term)) &&
      (!brands.length || brands.includes(product.brand)) &&
      (minPrice === null || product.price >= minPrice) &&
      (maxPrice === null || product.price <= maxPrice) &&
      (minRating === null || product.rating >= minRating) &&
      (!inStockOnly || product.stockStatus !== 'outOfStock'),
  )
}

const COMPARATORS = {
  popular: (a, b) => b.rating - a.rating,
  priceAsc: (a, b) => a.price - b.price,
  priceDesc: (a, b) => b.price - a.price,
  discount: (a, b) => b.discountPercent - a.discountPercent,
}

/**
 * Returns a sorted copy; the original list is not changed.
 * @param {import('@/services/productMapper').Product[]} products
 * @param {string} sort One of SORT_OPTIONS.
 * @returns {import('@/services/productMapper').Product[]}
 */
export function sortProducts(products, sort) {
  const compare = COMPARATORS[sort] ?? COMPARATORS.popular
  return products.toSorted(compare)
}

/**
 * Brands present in the products, with how many products each has, alphabetically.
 * @param {import('@/services/productMapper').Product[]} products
 * @returns {{ brand: string, count: number }[]}
 */
export function countBrands(products) {
  const counts = new Map()
  for (const { brand } of products) {
    if (brand) counts.set(brand, (counts.get(brand) ?? 0) + 1)
  }
  return [...counts]
    .map(([brand, count]) => ({ brand, count }))
    .sort((a, b) => a.brand.localeCompare(b.brand))
}

/**
 * Other products from the same category, best rated first, for "Slični proizvodi".
 * @param {import('@/services/productMapper').Product[]} products The whole catalog.
 * @param {{ id: number, category: string }} product The product being viewed.
 * @param {number} count
 * @returns {import('@/services/productMapper').Product[]}
 */
export function findSimilarProducts(products, product, count) {
  const sameCategory = products.filter(
    (candidate) => candidate.category === product.category && candidate.id !== product.id,
  )
  return findTopRated(sameCategory, count)
}

/**
 * Products on sale that can be bought, biggest discount first, for "Akcije nedelje".
 * @param {import('@/services/productMapper').Product[]} products
 * @param {number} count
 * @returns {import('@/services/productMapper').Product[]}
 */
export function findDeals(products, count) {
  const onSale = products.filter(
    (product) => product.discountPercent > 0 && product.stockStatus !== 'outOfStock',
  )
  return sortProducts(onSale, 'discount').slice(0, count)
}

/**
 * Best rated products, for "Najbolje ocenjeni".
 * @param {import('@/services/productMapper').Product[]} products
 * @param {number} count
 * @returns {import('@/services/productMapper').Product[]}
 */
export function findTopRated(products, count) {
  return sortProducts(products, 'popular').slice(0, count)
}

/**
 * The product a banner shows: the biggest deal or the best rated product, optionally
 * from one category, and never one that is out of stock.
 * @param {import('@/services/productMapper').Product[]} products
 * @param {{ kind: 'deal' | 'topRated', category?: string }} rule
 * @returns {import('@/services/productMapper').Product | null} Null while the catalog is empty.
 */
export function pickFeaturedProduct(products, { kind, category }) {
  const pool = products.filter(
    (product) =>
      product.stockStatus !== 'outOfStock' && (!category || product.category === category),
  )
  const [featured] = kind === 'deal' ? findDeals(pool, 1) : findTopRated(pool, 1)
  return featured ?? null
}
