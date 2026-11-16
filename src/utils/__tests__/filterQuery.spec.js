import { describe, expect, it } from 'vitest'

import { buildFilterQuery, EMPTY_FILTERS, parseFilterQuery } from '@/utils/filterQuery'

describe('parseFilterQuery', () => {
  it('returns the defaults for an empty query', () => {
    expect(parseFilterQuery({})).toEqual(EMPTY_FILTERS)
  })

  it('reads every filter from the URL', () => {
    const filters = parseFilterQuery({
      kategorija: 'laptops',
      pretraga: 'pro',
      brend: 'Apple,Asus',
      cenaOd: '10000',
      cenaDo: '90000',
      ocena: '4',
      naStanju: '1',
      sort: 'priceAsc',
      strana: '2',
    })

    expect(filters).toEqual({
      category: 'laptops',
      search: 'pro',
      brands: ['Apple', 'Asus'],
      minPrice: 10000,
      maxPrice: 90000,
      minRating: 4,
      inStockOnly: true,
      sort: 'priceAsc',
      page: 2,
    })
  })

  it('ignores values that a hand-edited URL could break', () => {
    const filters = parseFilterQuery({
      cenaOd: '-5',
      cenaDo: 'abc',
      ocena: '7',
      naStanju: 'yes',
      sort: 'random',
      strana: '0',
      brend: ',,',
    })

    expect(filters).toEqual(EMPTY_FILTERS)
  })

  it('uses the first value when a key repeats', () => {
    expect(parseFilterQuery({ strana: ['3', '5'] }).page).toBe(3)
  })
})

describe('buildFilterQuery', () => {
  it('leaves defaults out so URLs stay short', () => {
    expect(buildFilterQuery(EMPTY_FILTERS)).toEqual({})
  })

  it('round-trips through the URL', () => {
    const filters = {
      ...EMPTY_FILTERS,
      category: 'smartphones',
      brands: ['Apple', 'Samsung'],
      maxPrice: 50000,
      inStockOnly: true,
      sort: 'discount',
      page: 3,
    }

    expect(parseFilterQuery(buildFilterQuery(filters))).toEqual(filters)
  })
})
