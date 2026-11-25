import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import { mountWithApp } from '@/__tests__/helpers'
import { HERO_SLIDES } from '@/components/home/heroSlides'
import { HERO_AUTOPLAY_MS } from '@/config/home'

import HeroSlider from '@/components/home/HeroSlider.vue'

function stubReducedMotion(matches) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  )
}

async function mountSlider() {
  const { wrapper } = mountWithApp(HeroSlider, {
    props: { slides: HERO_SLIDES.map((slide) => ({ ...slide, product: null })) },
    attachTo: document.body,
  })
  await nextTick()
  return wrapper
}

// The visible slide is the one that is not hidden with `invisible`.
const currentSlideLabel = (wrapper) =>
  wrapper
    .findAll('[aria-roledescription="slide"]')
    .find((slide) => !slide.classes().includes('invisible'))
    .attributes('aria-label')

const button = (wrapper, label) =>
  wrapper.findAll('button').find((item) => (item.attributes('aria-label') ?? item.text()) === label)

beforeEach(() => {
  vi.useFakeTimers()
  stubReducedMotion(false)
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllGlobals()
})

describe('HeroSlider', () => {
  it('shows the first slide and moves on by itself', async () => {
    const wrapper = await mountSlider()
    expect(currentSlideLabel(wrapper)).toBe('Slajd 1 od 3')

    vi.advanceTimersByTime(HERO_AUTOPLAY_MS)
    await nextTick()

    expect(currentSlideLabel(wrapper)).toBe('Slajd 2 od 3')
    wrapper.unmount()
  })

  it('stops when "Pauziraj" is pressed and starts again with "Pokreni"', async () => {
    const wrapper = await mountSlider()

    await button(wrapper, 'Pauziraj').trigger('click')
    vi.advanceTimersByTime(HERO_AUTOPLAY_MS * 2)
    await nextTick()
    expect(currentSlideLabel(wrapper)).toBe('Slajd 1 od 3')

    await button(wrapper, 'Pokreni').trigger('click')
    vi.advanceTimersByTime(HERO_AUTOPLAY_MS)
    await nextTick()
    expect(currentSlideLabel(wrapper)).toBe('Slajd 2 od 3')
    wrapper.unmount()
  })

  it('waits while the pointer is over it', async () => {
    const wrapper = await mountSlider()

    await wrapper.get('section').trigger('mouseenter')
    vi.advanceTimersByTime(HERO_AUTOPLAY_MS * 2)
    await nextTick()

    expect(currentSlideLabel(wrapper)).toBe('Slajd 1 od 3')
    wrapper.unmount()
  })

  it('does not move by itself when the user prefers reduced motion', async () => {
    stubReducedMotion(true)
    const wrapper = await mountSlider()

    vi.advanceTimersByTime(HERO_AUTOPLAY_MS * 2)
    await nextTick()

    expect(currentSlideLabel(wrapper)).toBe('Slajd 1 od 3')
    expect(button(wrapper, 'Pokreni')).toBeDefined()
    wrapper.unmount()
  })

  it('moves with the arrows and dots, wrapping around', async () => {
    const wrapper = await mountSlider()
    await button(wrapper, 'Pauziraj').trigger('click')

    await button(wrapper, 'Prethodni slajd').trigger('click')
    expect(currentSlideLabel(wrapper)).toBe('Slajd 3 od 3')

    await button(wrapper, 'Prikaži slajd 2').trigger('click')
    expect(currentSlideLabel(wrapper)).toBe('Slajd 2 od 3')
    expect(button(wrapper, 'Prikaži slajd 2').attributes('aria-current')).toBe('true')
    wrapper.unmount()
  })

  it('announces slide changes only while it is not playing', async () => {
    const wrapper = await mountSlider()
    const liveRegion = wrapper.get('[aria-live]')
    expect(liveRegion.attributes('aria-live')).toBe('off')

    await button(wrapper, 'Pauziraj').trigger('click')

    expect(liveRegion.attributes('aria-live')).toBe('polite')
    wrapper.unmount()
  })

  it('stops its timer when removed', async () => {
    const wrapper = await mountSlider()

    wrapper.unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
