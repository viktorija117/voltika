import { describe, expect, it } from 'vitest'

import i18n from '@/locales'
import { serbianPlural } from '@/locales/pluralRules'

describe('serbianPlural', () => {
  it.each([
    [0, 0],
    [1, 1],
    [21, 1],
    [2, 2],
    [4, 2],
    [24, 2],
    [5, 3],
    [11, 3],
    [12, 3],
    [14, 3],
    [25, 3],
    [111, 3],
  ])('uses form %d -> %d', (count, form) => {
    expect(serbianPlural(count)).toBe(form)
  })

  it('produces correct Serbian product counts', () => {
    const { t } = i18n.global
    expect(t('productList.count', 1)).toBe('1 proizvod')
    expect(t('productList.count', 3)).toBe('3 proizvoda')
    expect(t('productList.count', 21)).toBe('21 proizvod')
    expect(t('productList.count', 0)).toBe('nema proizvoda')
  })
})
