import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/__tests__/helpers'
import {
  countBrands,
  filterProducts,
  findDeals,
  findSimilarProducts,
  findTopRated,
  sortProducts,
} from '@/utils/productFilters'

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

describe('findSimilarProducts', () => {
  const current = makeProduct({ id: 1, category: 'laptops' })
  const catalog = [
    current,
    makeProduct({ id: 2, category: 'laptops', rating: 3 }),
    makeProduct({ id: 3, category: 'tablets', rating: 5 }),
    makeProduct({ id: 4, category: 'laptops', rating: 4.8 }),
    makeProduct({ id: 5, category: 'laptops', rating: 4 }),
  ]

  it('returns other products from the same category, best rated first', () => {
    const ids = findSimilarProducts(catalog, current, 4).map((product) => product.id)
    expect(ids).toEqual([4, 5, 2])
  })

  it('stops at the requested count', () => {
    expect(findSimilarProducts(catalog, current, 2)).toHaveLength(2)
  })

  it('returns nothing while the catalog is empty', () => {
    expect(findSimilarProducts([], current, 4)).toEqual([])
  })
})

describe('findDeals', () => {
  it('returns products on sale, biggest discount first', () => {
    const products = [
      makeProduct({ id: 1, discountPercent: 12 }),
      makeProduct({ id: 2, discountPercent: 0 }),
      makeProduct({ id: 3, discountPercent: 19 }),
      makeProduct({ id: 4, discountPercent: 15 }),
    ]

    expect(findDeals(products, 2).map((product) => product.id)).toEqual([3, 4])
  })

  it('leaves out products that are out of stock', () => {
    const products = [
      makeProduct({ id: 1, discountPercent: 30, stockStatus: 'outOfStock' }),
      makeProduct({ id: 2, discountPercent: 10 }),
    ]

    expect(findDeals(products, 4).map((product) => product.id)).toEqual([2])
  })
})

describe('findTopRated', () => {
  it('returns the best rated products', () => {
    const products = [
      makeProduct({ id: 1, rating: 3 }),
      makeProduct({ id: 2, rating: 4.9 }),
      makeProduct({ id: 3, rating: 4.1 }),
    ]

    expect(findTopRated(products, 2).map((product) => product.id)).toEqual([2, 3])
  })
})
