import { flushPromises } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import ProductGallery from '@/components/product/ProductGallery.vue'

const IMAGES = [
  'https://cdn.example/1.webp',
  'https://cdn.example/2.webp',
  'https://cdn.example/3.webp',
]

function mountGallery(images = IMAGES) {
  const { wrapper } = mountWithApp(ProductGallery, {
    props: { images, name: 'Telefon' },
    attachTo: document.body,
  })
  return wrapper
}

const mainImage = (wrapper) => wrapper.get('button[aria-label="Uvećaj sliku"] img')

describe('ProductGallery', () => {
  it('shows the first image with the product name as alt text', () => {
    const wrapper = mountGallery()

    expect(mainImage(wrapper).attributes('src')).toBe(IMAGES[0])
    expect(mainImage(wrapper).attributes('alt')).toBe('Telefon')
    wrapper.unmount()
  })

  it('switches the main image when a thumbnail is clicked', async () => {
    const wrapper = mountGallery()
    const thumbnails = wrapper.findAll('[aria-label^="Slika"]')

    await thumbnails[1].trigger('click')

    expect(mainImage(wrapper).attributes('src')).toBe(IMAGES[1])
    expect(thumbnails[1].attributes('aria-current')).toBe('true')
    expect(thumbnails[1].attributes('aria-label')).toBe('Slika 2 od 3')
    wrapper.unmount()
  })

  it('moves between thumbnails with the arrow keys', async () => {
    const wrapper = mountGallery()
    const thumbnails = wrapper.findAll('[aria-label^="Slika"]')

    await thumbnails[0].trigger('keydown', { key: 'ArrowLeft' })

    expect(mainImage(wrapper).attributes('src')).toBe(IMAGES[2])
    expect(document.activeElement).toBe(thumbnails[2].element)
    wrapper.unmount()
  })

  it('hides the thumbnails when there is only one image', () => {
    const wrapper = mountGallery([IMAGES[0]])

    expect(wrapper.find('[aria-label^="Slika"]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows a placeholder when the product has no images', () => {
    const wrapper = mountGallery([])

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.text()).toContain('Slika nije dostupna')
    wrapper.unmount()
  })

  it('opens the zoomed image in a dialog', async () => {
    const wrapper = mountGallery()

    await wrapper.get('button[aria-label="Uvećaj sliku"]').trigger('click')
    // The zoom dialog is a lazy-loaded chunk.
    await vi.dynamicImportSettled()
    await flushPromises()

    const dialog = wrapper.get('dialog')
    expect(dialog.element.open).toBe(true)
    expect(dialog.get('img').attributes('src')).toBe(IMAGES[0])
    wrapper.unmount()
  })
})
