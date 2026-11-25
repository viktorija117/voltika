import { describe, expect, it } from 'vitest'

import i18n from '@/locales'
import { formatServiceTerm } from '@/utils/serviceTerms'

const { t } = i18n.global
const period = (min, max, unit) => ({ kind: 'period', min, max, unit })

describe('formatServiceTerm', () => {
  it.each([
    [period(1, 1, 'year'), 'warranty', '1 godina'],
    [period(2, 2, 'year'), 'warranty', '2 godine'],
    [period(1, 1, 'month'), 'warranty', '1 mesec'],
    [period(6, 6, 'month'), 'warranty', '6 meseci'],
    [period(3, 5, 'businessDay'), 'shipping', '3–5 radnih dana'],
    [period(1, 2, 'businessDay'), 'shipping', '1–2 radna dana'],
    [period(2, 2, 'week'), 'shipping', '2 nedelje'],
    [period(30, 30, 'day'), 'returnPolicy', '30 dana'],
    [period(21, 21, 'day'), 'returnPolicy', '21 dan'],
    [{ kind: 'overnight' }, 'shipping', 'Sledećeg dana'],
    [{ kind: 'lifetime' }, 'warranty', 'Doživotna'],
    [{ kind: 'none' }, 'warranty', 'Bez garancije'],
    [{ kind: 'none' }, 'returnPolicy', 'Bez povraćaja'],
  ])('shows %j as "%s" in Serbian', (term, field, expected) => {
    expect(formatServiceTerm(term, field, t)).toBe(expected)
  })

  it('gives an empty string without a term', () => {
    expect(formatServiceTerm(null, 'warranty', t)).toBe('')
  })
})
