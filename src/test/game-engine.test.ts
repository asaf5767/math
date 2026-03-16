import { createElement, Fragment } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import {
  calculateStars,
  checkAnswer,
  generateLevelSession,
  getHintLevel,
  isLevelComplete,
} from '../game/engine'
import { SPELLS } from '../game/spells'
import { GameStateProvider, useGameState } from '../hooks/useGameState'
import type { Level, Question, SessionState } from '../types/game'

afterEach(() => {
  cleanup()
  window.localStorage.clear()
})

const question: Question = { a: 4, b: 4, answer: 8 }

const makeLevel = (): Level => ({
  id: 99,
  nameHe: 'שלב בדיקה',
  emoji: '🪄',
  questions: Array.from({ length: 10 }, () => question),
  passingScore: 80,
  spellReward: SPELLS.lumos,
  isNearDoubles: false,
})

const makeCompletedSession = (correctAnswers: number, averageTimeMs: number): SessionState => ({
  questions: Array.from({ length: 10 }, () => question),
  currentQuestion: 10,
  totalQuestions: 10,
  correctAnswers,
  startTime: 0,
  answers: Array.from({ length: 10 }, (_, index) => ({
    question,
    userAnswer: index < correctAnswers ? 8 : 7,
    correct: index < correctAnswers,
    timeMs: averageTimeMs,
  })),
  hintLevel: 'none',
})

function UnlockProbe() {
  const { completeLevel, gameState } = useGameState()

  return createElement(
    Fragment,
    null,
    createElement(
      'button',
      { type: 'button', onClick: () => completeLevel(1, 1) },
      'complete level 1',
    ),
    createElement('output', { 'data-testid': 'unlocked-levels' }, gameState.unlockedLevels.join(',')),
  )
}

describe('game engine', () => {
  it('generateLevelSession creates the correct number of questions', () => {
    const session = generateLevelSession(makeLevel())

    expect(session.questions).toHaveLength(10)
    expect(session.totalQuestions).toBe(10)
  })

  it('checkAnswer correctly identifies right answers', () => {
    const session = generateLevelSession(makeLevel())
    const result = checkAnswer(session, 8)

    expect(result.correct).toBe(true)
    expect(result.newSession.correctAnswers).toBe(1)
    expect(result.newSession.currentQuestion).toBe(1)
  })

  it('checkAnswer correctly identifies wrong answers', () => {
    const session = generateLevelSession(makeLevel())
    const result = checkAnswer(session, 7)

    expect(result.correct).toBe(false)
    expect(result.newSession.correctAnswers).toBe(0)
    expect(result.newSession.currentQuestion).toBe(1)
  })

  it('calculateStars returns 1 for 80%', () => {
    expect(calculateStars(makeCompletedSession(8, 6500))).toBe(1)
  })

  it('calculateStars returns 3 for a perfect score', () => {
    expect(calculateStars(makeCompletedSession(10, 5000))).toBe(3)
  })

  it('isLevelComplete returns true when all questions were answered', () => {
    expect(isLevelComplete(makeCompletedSession(8, 6500))).toBe(true)
  })

  it('passing level N unlocks level N+1', () => {
    render(createElement(GameStateProvider, null, createElement(UnlockProbe)))

    fireEvent.click(screen.getByRole('button', { name: 'complete level 1' }))

    expect(screen.getByTestId('unlocked-levels')).toHaveTextContent('1,2')
  })

  it('near-doubles hint fading works across 10 questions', () => {
    expect(Array.from({ length: 10 }, (_, index) => getHintLevel(index))).toEqual([
      'full',
      'full',
      'full',
      'partial',
      'partial',
      'partial',
      'none',
      'none',
      'none',
      'none',
    ])
  })
})
