import { describe, expect, it } from 'vitest'
import { LEVELS } from '../game/levels'
import { decomposeNearDouble } from '../game/nearDoubles'

const getLevel = (levelId: number) => {
  const level = LEVELS.find((candidate) => candidate.id === levelId)

  if (!level) {
    throw new Error(`Missing level ${levelId}`)
  }

  return level
}

describe('near-doubles decomposition', () => {
  it('decomposeNearDouble(8, 9)', () => {
    expect(decomposeNearDouble(8, 9)).toEqual({ base: 8, double: 16, extra: 1 })
  })

  it('decomposeNearDouble(7, 8)', () => {
    expect(decomposeNearDouble(7, 8)).toEqual({ base: 7, double: 14, extra: 1 })
  })

  it('decomposeNearDouble(9, 10)', () => {
    expect(decomposeNearDouble(9, 10)).toEqual({ base: 9, double: 18, extra: 1 })
  })

  it('decomposeNearDouble(5, 6)', () => {
    expect(decomposeNearDouble(5, 6)).toEqual({ base: 5, double: 10, extra: 1 })
  })

  it('is commutative for 9 and 8', () => {
    expect(decomposeNearDouble(9, 8)).toEqual(decomposeNearDouble(8, 9))
  })

  it('all level 4 questions have valid near-double decomposition', () => {
    const level = getLevel(4)

    level.questions.forEach((question) => {
      const decomposition = decomposeNearDouble(question.a, question.b)

      expect(Math.abs(question.a - question.b)).toBe(1)
      expect(decomposition.base).toBe(Math.min(question.a, question.b))
      expect(decomposition.double + decomposition.extra).toBe(question.answer)
      expect(question.hintDouble).toBe(decomposition.base)
    })
  })

  it('all level 5 questions have valid near-double decomposition', () => {
    const level = getLevel(5)

    level.questions.forEach((question) => {
      const decomposition = decomposeNearDouble(question.a, question.b)

      expect(Math.abs(question.a - question.b)).toBe(1)
      expect(decomposition.base).toBe(Math.min(question.a, question.b))
      expect(decomposition.double + decomposition.extra).toBe(question.answer)
      expect(question.hintDouble).toBe(decomposition.base)
    })
  })
})
