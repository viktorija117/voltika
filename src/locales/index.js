import { createI18n } from 'vue-i18n'

import { DEFAULT_LOCALE } from '@/config/i18n'
import en from '@/locales/en.json'
import { serbianPlural } from '@/locales/pluralRules'
import sr from '@/locales/sr.json'

/**
 * App-wide i18n instance (Composition API mode).
 * Missing English keys fall back to Serbian, so the UI never shows a raw key.
 */
const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { [DEFAULT_LOCALE]: sr, en },
  pluralRules: { [DEFAULT_LOCALE]: serbianPlural },
  // n(4.5, 'rating') -> "4,5" in Serbian, "4.5" in English.
  numberFormats: {
    [DEFAULT_LOCALE]: { rating: { minimumFractionDigits: 1, maximumFractionDigits: 1 } },
    en: { rating: { minimumFractionDigits: 1, maximumFractionDigits: 1 } },
  },
  // d(date, 'review') -> "30. april 2025." in Serbian, "April 30, 2025" in English.
  datetimeFormats: {
    [DEFAULT_LOCALE]: { review: { dateStyle: 'long' } },
    en: { review: { dateStyle: 'long' } },
  },
})

export default i18n
