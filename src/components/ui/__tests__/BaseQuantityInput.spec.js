import { describe, expect, it } from 'vitest'

import { mountWithApp } from '@/__tests__/helpers'

import BaseQuantityInput from '@/components/ui/BaseQuantityInput.vue'

function mountInput(props) {
  const { wrapper } = mountWithApp(BaseQuantityInput, {
    props: {
      max: 5,
      'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
      ...props,
    },
  })
  return wrapper
}

const decrease = (wrapper) => wrapper.get('button[aria-label="Smanji količinu"]')
const increase = (wrapper) => wrapper.get('button[aria-label="Povećaj količinu"]')

describe('BaseQuantityInput', () => {
  it('steps the quantity with the buttons', async () => {
    const wrapper = mountInput({ modelValue: 2 })

    await increase(wrapper).trigger('click')
    expect(wrapper.props('modelValue')).toBe(3)

    await decrease(wrapper).trigger('click')
    expect(wrapper.props('modelValue')).toBe(2)
  })

  it('disables the buttons at the limits', () => {
    expect(decrease(mountInput({ modelValue: 1 })).attributes('disabled')).toBeDefined()
    expect(increase(mountInput({ modelValue: 5 })).attributes('disabled')).toBeDefined()
  })

  it('keeps a typed value within the limits', async () => {
    const wrapper = mountInput({ modelValue: 2 })
    const input = wrapper.get('input')

    await input.setValue('99')
    expect(wrapper.props('modelValue')).toBe(5)
    expect(input.element.value).toBe('5')

    await input.setValue('0')
    expect(wrapper.props('modelValue')).toBe(1)
  })

  it('keeps the old value when the field is cleared', async () => {
    const wrapper = mountInput({ modelValue: 3 })
    const input = wrapper.get('input')

    await input.setValue('')

    expect(wrapper.props('modelValue')).toBe(3)
    expect(input.element.value).toBe('3')
  })

  it('has a label for screen readers', () => {
    const wrapper = mountInput({ modelValue: 1, label: 'Količina: Punjač' })
    const input = wrapper.get('input')

    expect(wrapper.get(`label[for="${input.attributes('id')}"]`).text()).toBe('Količina: Punjač')
  })
})
