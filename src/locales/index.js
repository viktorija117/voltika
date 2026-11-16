import { createI18n } from 'vue-i18n'

import { DEFAULT_LOCALE } from '@/config/i18n'
import en from '@/locales/en.json'
import sr from '@/locales/sr.json'

/**
 * App-wide i18n instance (Composition API mode).
 * Missing English keys fall back to Serbian, so the UI never shows a raw key.
 */
const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { sr, en },
})

export default i18n
