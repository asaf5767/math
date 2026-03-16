import { useCallback, useMemo } from 'react'
import type { Question, SessionState } from '../types/game'

const SESSION_TTL_MS = 30 * 60 * 1000

export interface PersistedSession {
  levelId: number
  session: SessionState
  input: string
  savedAt: number
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const getSessionStorageKey = (levelId: number) => `hp-math-session-${levelId}`

const isQuestion = (value: unknown): value is Question =>
  isObject(value) &&
  Number.isFinite(Number(value.a)) &&
  Number.isFinite(Number(value.b)) &&
  Number.isFinite(Number(value.answer)) &&
  (value.hintDouble === undefined || Number.isFinite(Number(value.hintDouble)))

const isSessionAnswer = (
  value: unknown,
): value is SessionState['answers'][number] =>
  isObject(value) &&
  isQuestion(value.question) &&
  Number.isFinite(Number(value.userAnswer)) &&
  typeof value.correct === 'boolean' &&
  Number.isFinite(Number(value.timeMs))

const isHintLevel = (value: unknown): value is SessionState['hintLevel'] =>
  value === 'full' || value === 'partial' || value === 'none'

const isSessionState = (value: unknown): value is SessionState => {
  if (!isObject(value)) {
    return false
  }

  return (
    Array.isArray(value.questions) &&
    value.questions.every(isQuestion) &&
    Number.isInteger(Number(value.currentQuestion)) &&
    Number.isInteger(Number(value.totalQuestions)) &&
    Number.isInteger(Number(value.correctAnswers)) &&
    Number.isFinite(Number(value.startTime)) &&
    Array.isArray(value.answers) &&
    value.answers.every(isSessionAnswer) &&
    isHintLevel(value.hintLevel)
  )
}

export function useSessionPersistence() {
  const clearSession = useCallback((levelId: number) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      window.localStorage.removeItem(getSessionStorageKey(levelId))
    } catch {
      // Ignore storage errors to keep gameplay resilient.
    }
  }, [])

  const loadSession = useCallback(
    (levelId: number): PersistedSession | null => {
      if (typeof window === 'undefined') {
        return null
      }

      try {
        const rawValue = window.localStorage.getItem(getSessionStorageKey(levelId))

        if (!rawValue) {
          return null
        }

        const parsedValue = JSON.parse(rawValue) as unknown

        if (
          !isObject(parsedValue) ||
          Number(parsedValue.levelId) !== levelId ||
          typeof parsedValue.input !== 'string' ||
          !Number.isFinite(Number(parsedValue.savedAt)) ||
          !isSessionState(parsedValue.session)
        ) {
          clearSession(levelId)
          return null
        }

        const savedAt = Number(parsedValue.savedAt)

        if (
          Date.now() - savedAt > SESSION_TTL_MS ||
          parsedValue.session.currentQuestion >= parsedValue.session.totalQuestions
        ) {
          clearSession(levelId)
          return null
        }

        return {
          levelId,
          session: parsedValue.session,
          input: parsedValue.input,
          savedAt,
        }
      } catch {
        clearSession(levelId)
        return null
      }
    },
    [clearSession],
  )

  const saveSession = useCallback((levelId: number, session: SessionState, input: string) => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      const payload: PersistedSession = {
        levelId,
        session,
        input,
        savedAt: Date.now(),
      }

      window.localStorage.setItem(getSessionStorageKey(levelId), JSON.stringify(payload))
    } catch {
      // Ignore storage errors so the session continues even if storage is unavailable.
    }
  }, [])

  const hasSession = useCallback((levelId: number) => loadSession(levelId) !== null, [loadSession])

  return useMemo(
    () => ({
      saveSession,
      loadSession,
      clearSession,
      hasSession,
    }),
    [clearSession, hasSession, loadSession, saveSession],
  )
}
