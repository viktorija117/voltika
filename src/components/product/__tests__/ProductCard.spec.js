import { describe, expect, it } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'

import ProductCard from '@/components/product/ProductCard.vue'

function mountCard(overrides) {
  return mountWithApp(ProductCard, { props: { product: makeProduct(overrides) } }).wrapper
}

describe('ProductCard', () => {
  it('links the product name to the product page', () => {
    const link = mountCard({ id: 42 }).get('h3 a')

    expect(link.attributes('href')).toBe('/proizvod/42')
    expect(link.text()).toBe('Bežične slušalice')
  })

  it('reserves space for the image and lazy-loads it', () => {
    const image = mountCard().get('img')

    expect(image.attributes('width')).toBe('300')
    expect(image.attributes('height')).toBe('300')
    expect(image.attributes('loading')).toBe('lazy')
    expect(image.attributes('alt')).toBe('Bežične slušalice')
  })

  it('shows a discount badge only for sale products', () => {
    expect(mountCard().text()).not.toContain('%')
    expect(mountCard({ discountPercent: 20, oldPrice: 24999, savings: 5000 }).text()).toContain(
      '-20%',
    )
  })

  it('shows the stock status in words', () => {
    expect(mountCard({ stockStatus: 'outOfStock' }).text()).toContain('Nema na stanju')
    expect(mountCard({ stockStatus: 'lowStock' }).text()).toContain('Poslednji komadi')
  })

  it('falls back to a placeholder when there is no image', () => {
    const card = mountCard({ thumbnail: null })

    expect(card.find('img').exists()).toBe(false)
    expect(card.text()).toContain('Slika nije dostupna')
  })
})
