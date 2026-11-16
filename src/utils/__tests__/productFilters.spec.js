import { describe, expect, it } from 'vitest'

import { makeProduct } from '@/__tests__/helpers'
import { filterProducts } from '@/utils/productFilters'

const PRODUCTS = [
  makeProduct({ id: 1, name: 'iPhone 9', brand: 'Apple', category: 'smartphones' }),
  makeProduct({ id: 2, name: 'MacBook Pro', brand: 'Apple', category: 'laptops' }),
  makeProduct({ id: 3, name: 'Slušalice X', brand: 'Brend', category: 'mobile-accessories' }),
]

const ids = (products) => products.map((product) => product.id)

describe('filterProducts', () => {
  it('returns everything without filters', () => {
    expect(ids(filterProducts(PRODUCTS))).toEqual([1, 2, 3])
  })

  it('keeps one category', () => {
    expect(ids(filterProducts(PRODUCTS, { category: 'laptops' }))).toEqual([2])
  })

  it('searches name and brand, ignoring case', () => {
    expect(ids(filterProducts(PRODUCTS, { search: 'apple' }))).toEqual([1, 2])
    expect(ids(filterProducts(PRODUCTS, { search: 'MACBOOK' }))).toEqual([2])
  })

  it('finds words with Serbian letters when typed without them', () => {
    expect(ids(filterProducts(PRODUCTS, { search: 'slusalice' }))).toEqual([3])
  })

  it('combines category and search', () => {
    expect(ids(filterProducts(PRODUCTS, { category: 'smartphones', search: 'apple' }))).toEqual([1])
  })

  it('returns an empty list when nothing matches', () => {
    expect(filterProducts(PRODUCTS, { search: 'frižider' })).toEqual([])
  })
})
