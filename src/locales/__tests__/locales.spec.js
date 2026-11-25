import { describe, expect, it } from 'vitest'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '@/config/i18n'
import i18n from '@/locales'
import en from '@/locales/en.json'
import sr from '@/locales/sr.json'

const messages = { [DEFAULT_LOCALE]: sr, en }

// Turns { pages: { home: { title } } } into ['pages.home.title'].
function flattenKeys(object, prefix = '') {
  return Object.entries(object).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    return typeof value === 'object' ? flattenKeys(value, path) : [path]
  })
}

describe('locale files', () => {
  it('has a message file for every supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) expect(messages[locale]).toBeDefined()
  })

  it('has the same keys in English as in Serbian', () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(sr).sort())
  })

  it('has no empty translations', () => {
    for (const locale of SUPPORTED_LOCALES) {
      for (const key of flattenKeys(messages[locale])) {
        const value = key.split('.').reduce((node, part) => node[part], messages[locale])
        expect(value.trim(), `${locale}: ${key}`).not.toBe('')
      }
    }
  })
})

describe('Serbian formats', () => {
  it('writes dates in Latin script', () => {
    const { d } = i18n.global
    expect(d(new Date('2025-04-30T09:41:02Z'), 'review')).toBe('30. april 2025.')
  })
})
