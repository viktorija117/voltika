import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/__tests__/helpers'
import { countBrands, filterProducts, sortProducts } from '@/utils/productFilters'

const PRODUCTS = [
  makeProduct({
    id: 1,
    name: 'iPhone 9',
    brand: 'Apple',
    category: 'smartphones',
    price: 60000,
    rating: 4.6,
    discountPercent: 10,
  }),
  makeProduct({
    id: 2,
    name: 'MacBook Pro',
    brand: 'Apple',
    category: 'laptops',
    price: 150000,
    rating: 3.2,
    discountPercent: 0,
    stockStatus: 'outOfStock',
  }),
  makeProduct({
    id: 3,
    name: 'Slušalice X',
    brand: 'Beats',
    category: 'mobile-accessories',
    price: 9000,
    rating: 4.1,
    discountPercent: 25,
  }),
]

const ids = (products) => products.map((product) => product.id)

describe('filterProducts', () => {
  it('returns everything without filters', () => {
    expect(ids(filterProducts(PRODUCTS))).toEqual([1, 2, 3])
  })

  it('keeps one category', () => {
    expect(ids(filterProducts(PRODUCTS, { category: 'laptops' }))).toEqual([2])
  })

  it('searches name and brand, ignoring case and Serbian letters', () => {
    expect(ids(filterProducts(PRODUCTS, { search: 'APPLE' }))).toEqual([1, 2])
    expect(ids(filterProducts(PRODUCTS, { search: 'slusalice' }))).toEqual([3])
  })

  it('keeps any of the chosen brands', () => {
    expect(ids(filterProducts(PRODUCTS, { brands: ['Beats', 'Apple'] }))).toEqual([1, 2, 3])
    expect(ids(filterProducts(PRODUCTS, { brands: ['Beats'] }))).toEqual([3])
  })

  it('keeps prices inside the range, including the limits', () => {
    expect(ids(filterProducts(PRODUCTS, { minPrice: 9000, maxPrice: 60000 }))).toEqual([1, 3])
  })

  it('keeps products rated at least the minimum', () => {
    expect(ids(filterProducts(PRODUCTS, { minRating: 4 }))).toEqual([1, 3])
  })

  it('hides out-of-stock products on request', () => {
    expect(ids(filterProducts(PRODUCTS, { inStockOnly: true }))).toEqual([1, 3])
  })

  it('combines filters', () => {
    expect(ids(filterProducts(PRODUCTS, { brands: ['Apple'], inStockOnly: true }))).toEqual([1])
  })
})

describe('sortProducts', () => {
  it.each([
    ['popular', [1, 3, 2]],
    ['priceAsc', [3, 1, 2]],
    ['priceDesc', [2, 1, 3]],
    ['discount', [3, 1, 2]],
  ])('sorts by %s', (sort, expected) => {
    expect(ids(sortProducts(PRODUCTS, sort))).toEqual(expected)
  })

  it('does not change the original list', () => {
    sortProducts(PRODUCTS, 'priceAsc')
    expect(ids(PRODUCTS)).toEqual([1, 2, 3])
  })
})

describe('countBrands', () => {
  it('counts products per brand, alphabetically, without empty brands', () => {
    const products = [...PRODUCTS, makeProduct({ id: 4, brand: '' })]

    expect(countBrands(products)).toEqual([
      { brand: 'Apple', count: 2 },
      { brand: 'Beats', count: 1 },
    ])
  })
})
