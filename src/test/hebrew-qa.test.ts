import { describe, expect, it } from 'vitest'
import { LEVELS } from '../game/levels'
import { SPELL_LIST } from '../game/spells'
import he from '../i18n/he'

const hebrewRegex = /[\u0590-\u05FF]/
const englishUiWordsRegex = /\b(?:start|button|spell|book|level|locked|unlocked|great|hall|collection|math|magic|harry|potter|rtl)\b/i

type StringEntry = {
  path: string
  value: string
}

const collectStringEntries = (value: unknown, currentPath: string[] = []): StringEntry[] => {
  if (typeof value === 'string') {
    return [{ path: currentPath.join('.'), value }]
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectStringEntries(item, [...currentPath, String(index)]))
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, nestedValue]) =>
      collectStringEntries(nestedValue, [...currentPath, key]),
    )
  }

  return []
}

const i18nEntries = collectStringEntries(he)
const userFacingHebrewEntries = i18nEntries.filter(
  ({ path }) => path !== 'meta.locale' && path !== 'meta.direction',
)

describe('Hebrew text QA', () => {
  it('all i18n strings are non-empty', () => {
    expect(i18nEntries.length).toBeGreaterThan(0)
    expect(i18nEntries.every(({ value }) => value.trim().length > 0)).toBe(true)
  })

  it('level names are Hebrew', () => {
    expect(LEVELS.every((level) => hebrewRegex.test(level.nameHe))).toBe(true)
  })

  it('spell names are Hebrew', () => {
    expect(SPELL_LIST.every((spell) => hebrewRegex.test(spell.nameHe))).toBe(true)
  })

  it('has no stray English text in Hebrew strings', () => {
    expect(userFacingHebrewEntries.every(({ value }) => !englishUiWordsRegex.test(value))).toBe(true)
  })

  it('question prompt uses simple Hebrew', () => {
    expect(he.practice.prompt).toContain('כמה זה')
    expect(he.practice.prompt).not.toMatch(/חשבו?ן|משוואה|אקדמי/)
  })
})
