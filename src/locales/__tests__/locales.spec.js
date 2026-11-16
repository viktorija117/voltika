import { describe, expect, it } from 'vitest'

import { SUPPORTED_LOCALES } from '@/config/i18n'
import en from '@/locales/en.json'
import sr from '@/locales/sr.json'

const messages = { sr, en }

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
