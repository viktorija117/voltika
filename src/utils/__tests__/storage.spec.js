import { afterEach, describe, expect, it, vi } from 'vitest'

import { readJson, writeJson } from '@/utils/storage'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('storage', () => {
  it('writes and reads back JSON', () => {
    writeJson('key', [{ id: 1 }])
    expect(readJson('key')).toEqual([{ id: 1 }])
  })

  it('returns null when nothing is saved', () => {
    expect(readJson('missing')).toBeNull()
  })

  it('returns null for broken JSON', () => {
    localStorage.setItem('key', '{not json')
    expect(readJson('key')).toBeNull()
  })

  it('does not crash when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    expect(readJson('key')).toBeNull()
    expect(() => writeJson('key', 1)).not.toThrow()
  })
})
