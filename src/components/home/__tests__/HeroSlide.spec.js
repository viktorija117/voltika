import { describe, expect, it } from 'vitest'

import { makeProduct, mountWithApp } from '@/__tests__/helpers'
import { HERO_SLIDES } from '@/components/home/heroSlides'

import HeroSlide from '@/components/home/HeroSlide.vue'

const [DEALS_SLIDE] = HERO_SLIDES

function mountSlide(product, { isPending = false } = {}) {
  return mountWithApp(HeroSlide, {
    props: { slide: DEALS_SLIDE, product, isPending, isFirst: true },
  }).wrapper
}

describe('HeroSlide', () => {
  it('shows the stage and price placeholders while the catalog loads', () => {
    const wrapper = mountSlide(null, { isPending: true })
    const images = wrapper.findAll('img')

    expect(images).toHaveLength(1)
    expect(images[0].attributes('alt')).toBe('')
    expect(wrapper.findAll('.animate-pulse')).toHaveLength(2)
  })

  it('drops the placeholders when the catalog failed to load', () => {
    const wrapper = mountSlide(null, { isPending: false })

    expect(wrapper.find('.animate-pulse').exists()).toBe(false)
  })

  it('fades the product photo in once it has loaded', async () => {
    const wrapper = mountSlide(makeProduct({ name: 'Laptop', images: ['laptop.webp'] }))
    const photo = wrapper.get('img[alt="Laptop"]')

    expect(photo.classes()).toContain('opacity-0')
    await photo.trigger('load')
    expect(photo.classes()).toContain('opacity-100')
  })
})
