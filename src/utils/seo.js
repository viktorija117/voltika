import { CURRENCY } from '@/config/pricing'
import { META_DESCRIPTION_MAX_LENGTH, SITE_NAME, SITE_URL } from '@/config/project'

const SCHEMA_CONTEXT = 'https://schema.org'

// stockStatus -> schema.org availability.
const AVAILABILITY = {
  inStock: 'https://schema.org/InStock',
  lowStock: 'https://schema.org/LimitedAvailability',
  outOfStock: 'https://schema.org/OutOfStock',
}

/**
 * Browser tab title, e.g. "iPhone 5s – Voltika". Without a page title it is the site name.
 * @param {string} [title]
 * @returns {string}
 */
export function pageTitle(title) {
  return title ? `${title} – ${SITE_NAME}` : SITE_NAME
}

/**
 * Shortens text for a meta description at a word boundary and adds "…".
 * @param {string} text
 * @param {number} [maxLength]
 * @returns {string}
 */
export function truncateText(text, maxLength = META_DESCRIPTION_MAX_LENGTH) {
  const clean = String(text ?? '')
    .replace(/\s+/g, ' ')
    .trim()
  if (clean.length <= maxLength) return clean
  const cut = clean.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:]+$/, '')}…`
}

/**
 * Absolute URL on the deployed site.
 * @param {string} path Starts with "/".
 * @returns {string}
 */
export function absoluteUrl(path) {
  return `${SITE_URL}${path}`
}

/**
 * schema.org Product for the product page, so search results can show price and rating.
 * @param {import('@/services/productMapper').ProductDetails} product
 * @param {string} url Absolute URL of the product page.
 * @returns {object}
 */
export function productJsonLd(product, url) {
  const data = {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.sku || undefined,
    image: product.images.length ? product.images : undefined,
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    offers: {
      '@type': 'Offer',
      url,
      price: product.price,
      priceCurrency: CURRENCY,
      availability: AVAILABILITY[product.stockStatus],
    },
  }
  if (product.rating && product.reviewCount) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    }
  }
  // JSON.stringify drops the undefined fields.
  return data
}

/**
 * schema.org BreadcrumbList. The last item (the current page) has no link of its own.
 * @param {{ label: string, url?: string }[]} items
 * @returns {object}
 */
export function breadcrumbJsonLd(items) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url,
    })),
  }
}
