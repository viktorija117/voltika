import { onUnmounted, watchEffect } from 'vue'

import { pageTitle, truncateText } from '@/utils/seo'

// Meta tags this composable owns: [attribute, name, content from the options].
const META_TAGS = [
  ['name', 'description', (seo) => seo.description],
  ['property', 'og:title', (seo) => pageTitle(seo.title)],
  ['property', 'og:description', (seo) => seo.description],
  ['name', 'robots', (seo) => (seo.noindex ? 'noindex' : null)],
]

function setMeta(attribute, name, content) {
  let tag = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (content === null || content === undefined || content === '') {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attribute, name)
    document.head.append(tag)
  }
  tag.setAttribute('content', content)
}

/**
 * Sets the tab title, meta description, Open Graph tags and robots rule for a page,
 * and keeps them updated when the data behind them changes (e.g. the product loads).
 * @param {() => { title?: string, description?: string, noindex?: boolean }} getSeo
 */
export function useSeo(getSeo) {
  watchEffect(() => {
    const seo = getSeo()
    const normalized = { ...seo, description: truncateText(seo.description) }
    document.title = pageTitle(seo.title)
    for (const [attribute, name, read] of META_TAGS) setMeta(attribute, name, read(normalized))
  })
  // The next page sets its own tags; a leftover noindex must never stick to it.
  onUnmounted(() => setMeta('name', 'robots', null))
}

/**
 * Adds a JSON-LD <script> to the page head and removes it when the page is left.
 * textContent is used, so the data is never parsed as HTML.
 * @param {() => object[] | null} getData Structured data objects, or null while loading.
 */
export function useJsonLd(getData) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'

  watchEffect(() => {
    const data = getData()
    if (!data) {
      script.remove()
      return
    }
    script.textContent = JSON.stringify(data)
    if (!script.isConnected) document.head.append(script)
  })
  onUnmounted(() => script.remove())
}
