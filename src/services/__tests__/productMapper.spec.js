import { describe, expect, it } from 'vitest'

import { LOW_STOCK_THRESHOLD } from '@/config/catalog'
import { MIN_SALE_DISCOUNT_PERCENT } from '@/config/pricing'
import { toProduct, toProductDetails, toStockStatus } from '@/services/productMapper'
import { usdToRsd } from '@/utils/price'

const RAW = {
  id: 121,
  title: 'iPhone 5s',
  description: 'A classic smartphone.',
  category: 'smartphones',
  price: 199.99,
  discountPercentage: 20,
  rating: 4.5,
  stock: 25,
  brand: 'Apple',
  sku: 'SMA-APP-IPH-121',
  thumbnail: 'https://cdn.example/thumb.webp',
  images: ['https://cdn.example/1.webp'],
  reviews: [{}, {}, {}],
}

describe('toProduct', () => {
  it('maps the API fields to the shop shape', () => {
    const product = toProduct(RAW)

    expect(product).toMatchObject({
      id: 121,
      name: 'iPhone 5s',
      brand: 'Apple',
      category: 'smartphones',
      rating: 4.5,
      reviewCount: 3,
      stockStatus: 'inStock',
      thumbnail: 'https://cdn.example/thumb.webp',
    })
  })

  it('shows a big discount as a sale with old price and savings', () => {
    const product = toProduct(RAW)

    expect(product.oldPrice).toBe(usdToRsd(199.99))
    expect(product.price).toBe(usdToRsd(199.99 * 0.8))
    expect(product.savings).toBe(product.oldPrice - product.price)
    expect(product.discountPercent).toBe(20)
  })

  it('ignores discounts below the sale threshold', () => {
    const product = toProduct({ ...RAW, discountPercentage: MIN_SALE_DISCOUNT_PERCENT - 0.5 })

    expect(product.price).toBe(usdToRsd(199.99))
    expect(product).toMatchObject({ oldPrice: null, savings: 0, discountPercent: 0 })
  })

  it('falls back safely when fields are missing', () => {
    const product = toProduct({ id: 1 })

    expect(product).toMatchObject({
      name: '',
      brand: '',
      price: 0,
      oldPrice: null,
      rating: 0,
      reviewCount: 0,
      stock: 0,
      stockStatus: 'outOfStock',
      thumbnail: null,
      images: [],
    })
  })
})

describe('toStockStatus', () => {
  it.each([
    [0, 'outOfStock'],
    [1, 'lowStock'],
    [LOW_STOCK_THRESHOLD, 'lowStock'],
    [LOW_STOCK_THRESHOLD + 1, 'inStock'],
  ])('stock %d is %s', (stock, status) => {
    expect(toStockStatus(stock)).toBe(status)
  })
})

describe('toProductDetails', () => {
  it('adds service info and maps the reviews', () => {
    const details = toProductDetails({
      id: 1,
      title: 'Slušalice',
      price: 100,
      warrantyInformation: '1 year warranty',
      shippingInformation: 'Ships in 2 days',
      returnPolicy: '30 days return policy',
      reviews: [
        {
          rating: 5,
          comment: 'Odlično!',
          reviewerName: 'Ana',
          reviewerEmail: 'ana@example.com',
          date: '2025-04-30T09:41:02.053Z',
        },
      ],
    })

    expect(details).toMatchObject({
      id: 1,
      name: 'Slušalice',
      warranty: { kind: 'period', min: 1, max: 1, unit: 'year' },
      shipping: { kind: 'period', min: 2, max: 2, unit: 'day' },
      returnPolicy: { kind: 'period', min: 30, max: 30, unit: 'day' },
      reviewCount: 1,
    })
    // The reviewer's email is not needed, so it is not kept.
    expect(details.reviews).toEqual([
      { rating: 5, comment: 'Odlično!', author: 'Ana', date: '2025-04-30T09:41:02.053Z' },
    ])
  })

  it('falls back to empty values when the API leaves fields out', () => {
    expect(toProductDetails({ id: 2 })).toMatchObject({
      warranty: null,
      shipping: null,
      returnPolicy: null,
      reviews: [],
    })
  })
})
