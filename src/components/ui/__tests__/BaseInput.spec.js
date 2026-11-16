import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import BaseInput from '@/components/ui/BaseInput.vue'

function mountInput(props = {}, attrs = {}) {
  return mount(BaseInput, { props: { label: 'Email adresa', ...props }, attrs })
}

describe('BaseInput', () => {
  it('connects the visible label to the input', () => {
    const wrapper = mountInput()

    expect(wrapper.get('label').attributes('for')).toBe(wrapper.get('input').attributes('id'))
    expect(wrapper.get('label').text()).toBe('Email adresa')
  })

  it('updates v-model while typing', async () => {
    const wrapper = mountInput({
      modelValue: '',
      'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
    })

    await wrapper.get('input').setValue('ime@primer.rs')

    expect(wrapper.props('modelValue')).toBe('ime@primer.rs')
  })

  it('marks the field invalid and links the error message', () => {
    const wrapper = mountInput({ error: 'Unesite ispravnu email adresu' })
    const input = wrapper.get('input')
    const message = wrapper.get(`#${input.attributes('aria-describedby')}`)

    expect(input.attributes('aria-invalid')).toBe('true')
    expect(message.text()).toBe('Unesite ispravnu email adresu')
    expect(message.attributes('aria-live')).toBe('polite')
  })

  it('links the hint when there is no error', () => {
    const wrapper = mountInput({ hint: 'Kao u ličnoj karti' })
    const input = wrapper.get('input')

    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(wrapper.get(`#${input.attributes('aria-describedby')}`).text()).toBe(
      'Kao u ličnoj karti',
    )
  })

  it('passes extra attributes to the input, not the wrapper', () => {
    const wrapper = mountInput({}, { name: 'email', autocomplete: 'email' })

    expect(wrapper.get('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.attributes('name')).toBeUndefined()
  })
})
