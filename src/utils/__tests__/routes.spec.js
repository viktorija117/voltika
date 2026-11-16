import { describe, expect, it } from 'vitest'

import { QUERY_KEYS } from '@/config/catalog'
import { DEALS_ROUTE, DEALS_SECTION_ID, productListRoute } from '@/utils/routes'

describe('productListRoute', () => {
  it('links to the unfiltered list without arguments', () => {
    expect(productListRoute()).toEqual({ name: 'products', query: {} })
  })

  it('adds the category to the query', () => {
    expect(productListRoute({ category: 'laptops' }).query).toEqual({
      [QUERY_KEYS.category]: 'laptops',
    })
  })

  it('adds the search term to the query', () => {
    expect(productListRoute({ search: 'punjač' }).query).toEqual({
      [QUERY_KEYS.search]: 'punjač',
    })
  })

  it('leaves out empty filters', () => {
    expect(productListRoute({ category: '', search: '' }).query).toEqual({})
  })
})

describe('DEALS_ROUTE', () => {
  it('points to the deals section on the home page', () => {
    expect(DEALS_ROUTE).toEqual({ name: 'home', hash: `#${DEALS_SECTION_ID}` })
  })
})
