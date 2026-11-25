// Language settings.

/**
 * Serbian in Latin script is the default language of the shop. Plain "sr" would mean Cyrillic
 * to Intl (dates such as "30. април 2025.") and to screen readers.
 */
export const DEFAULT_LOCALE = 'sr-Latn'

/** Languages with a complete translation file in src/locales. */
export const SUPPORTED_LOCALES = [DEFAULT_LOCALE, 'en']
