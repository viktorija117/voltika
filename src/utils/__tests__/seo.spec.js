import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/__tests__/helpers'
import { SITE_URL } from '@/config/project'
import { absoluteUrl, breadcrumbJsonLd, pageTitle, productJsonLd, truncateText } from '@/utils/seo'

describe('pageTitle', () => {
  it('adds the site name to a page title', () => {
    expect(pageTitle('Korpa')).toBe('Korpa – Voltika')
  })

  it('is the site name alone without a page title', () => {
    expect(pageTitle()).toBe('Voltika')
  })
})

describe('truncateText', () => {
  it('keeps short text and squeezes whitespace', () => {
    expect(truncateText('  Kratak\n  opis ')).toBe('Kratak opis')
  })

  it('cuts long text at a word boundary and adds an ellipsis', () => {
    expect(truncateText('Jedan dva tri četiri', 12)).toBe('Jedan dva…')
  })

  it('handles missing text', () => {
    expect(truncateText(undefined)).toBe('')
  })
})

describe('absoluteUrl', () => {
  it('prefixes the site address', () => {
    expect(absoluteUrl('/korpa')).toBe(`${SITE_URL}/korpa`)
  })
})

describe('productJsonLd', () => {
  const product = makeProduct({
    name: 'Telefon',
    description: 'Opis',
    sku: 'SKU-9',
    brand: 'Brend',
    price: 24999,
    rating: 4.5,
    reviewCount: 3,
    stockStatus: 'lowStock',
    images: ['https://cdn.example/1.webp'],
  })

  it('describes the product with its offer and rating', () => {
    const data = productJsonLd(product, 'https://shop/proizvod/1')

    expect(data).toMatchObject({
      '@type': 'Product',
      name: 'Telefon',
      sku: 'SKU-9',
      brand: { '@type': 'Brand', name: 'Brend' },
      offers: {
        price: 24999,
        priceCurrency: 'RSD',
        availability: 'https://schema.org/LimitedAvailability',
        url: 'https://shop/proizvod/1',
      },
      aggregateRating: { ratingValue: 4.5, reviewCount: 3 },
    })
  })

  it('leaves out what the product does not have', () => {
    const bare = makeProduct({ brand: '', images: [], rating: 0, reviewCount: 0 })
    const json = JSON.parse(JSON.stringify(productJsonLd(bare, 'https://shop/proizvod/1')))

    expect(json).not.toHaveProperty('brand')
    expect(json).not.toHaveProperty('image')
    expect(json).not.toHaveProperty('aggregateRating')
  })
})

describe('breadcrumbJsonLd', () => {
  it('numbers the items from 1', () => {
    const data = breadcrumbJsonLd([
      { label: 'Početna', url: 'https://shop/' },
      { label: 'Telefon' },
    ])

    expect(data.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Početna', item: 'https://shop/' },
      { '@type': 'ListItem', position: 2, name: 'Telefon', item: undefined },
    ])
  })
})
