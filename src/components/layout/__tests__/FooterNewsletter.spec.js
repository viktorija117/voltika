import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import FooterNewsletter from '@/components/layout/FooterNewsletter.vue'

async function submitEmail(value) {
  const { wrapper } = mountWithApp(FooterNewsletter)
  await wrapper.get('input').setValue(value)
  await wrapper.get('form').trigger('submit')
  return wrapper
}

describe('FooterNewsletter', () => {
  it('shows a translated error for an invalid address', async () => {
    const wrapper = await submitEmail('petar@primer')

    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.text()).toContain('Unesite ispravnu email adresu')
  })

  it('confirms a valid sign-up and hides the form', async () => {
    const wrapper = await submitEmail('petar@primer.rs')

    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.get('[role="status"]').text()).toContain('Hvala!')
  })

  it('accepts the address once the error is fixed', async () => {
    const wrapper = await submitEmail('petar@primer')
    await wrapper.get('input').setValue('petar@primer.rs')
    await wrapper.get('form').trigger('submit')

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })
})
