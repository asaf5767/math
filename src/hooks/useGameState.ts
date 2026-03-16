import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import type { GameState, LevelProgress } from '../types/game'

export type { GameState, LevelProgress } from '../types/game'

const GAME_STATE_STORAGE_KEY = 'harry-potter-math-game-state'
const CURRENT_SCHEMA_VERSION = 1

interface GameStateContextValue {
  gameState: GameState
  updatePlayerName: (name: string) => void
  completeLevel: (level: number, stars: number, bestScore?: number) => void
  unlockSpell: (spellId: string) => void
  resetProgress: () => void
}

type PartialGameState = Partial<Omit<GameState, 'completedLevels' | 'totalStars' | 'version'>> & {
  version?: unknown
  totalStars?: unknown
  completedLevels?: unknown
  levelStars?: unknown
  levelScores?: unknown
  currentLevel?: unknown
}

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const toPositiveInteger = (value: unknown): number | null => {
  const parsedValue = Number(value)
  return Number.isInteger(parsedValue) && parsedValue >= 1 ? parsedValue : null
}

const clampStars = (value: number) => Math.max(0, Math.min(3, Math.round(value)))
const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)))

const createDefaultGameState = (): GameState => ({
  version: CURRENT_SCHEMA_VERSION,
  playerName: '',
  unlockedLevels: [1],
  completedLevels: {},
  unlockedSpells: [],
  totalStars: 0,
})

const toClampedNumberMap = (
  value: unknown,
  clampValue: (value: number) => number,
): Record<number, number> => {
  if (!isObject(value)) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value).flatMap(([level, entryValue]) => {
      const safeLevel = toPositiveInteger(level)
      const numericValue = Number(entryValue)

      if (safeLevel === null || !Number.isFinite(numericValue)) {
        return []
      }

      return [[safeLevel, clampValue(numericValue)] as const]
    }),
  ) as Record<number, number>
}

const normalizeCompletedLevels = (
  value: unknown,
  legacyLevelStars: Record<number, number> = {},
  legacyLevelScores: Record<number, number> = {},
): Record<number, LevelProgress> => {
  const completedLevels = new Map<number, LevelProgress>()

  if (isObject(value)) {
    for (const [level, progressValue] of Object.entries(value)) {
      const safeLevel = toPositiveInteger(level)

      if (safeLevel === null) {
        continue
      }

      const progress = isObject(progressValue) ? progressValue : {}
      const stars = clampStars(Number(progress.stars ?? legacyLevelStars[safeLevel] ?? 0))
      const bestScore = clampScore(Number(progress.bestScore ?? legacyLevelScores[safeLevel] ?? 0))
      const completed =
        typeof progress.completed === 'boolean' ? progress.completed : stars > 0 || bestScore > 0

      completedLevels.set(safeLevel, {
        completed,
        stars,
        bestScore,
      })
    }
  }

  for (const level of new Set([...Object.keys(legacyLevelStars), ...Object.keys(legacyLevelScores)])) {
    const safeLevel = toPositiveInteger(level)

    if (safeLevel === null || completedLevels.has(safeLevel)) {
      continue
    }

    const stars = legacyLevelStars[safeLevel] ?? 0
    const bestScore = legacyLevelScores[safeLevel] ?? 0

    completedLevels.set(safeLevel, {
      completed: stars > 0 || bestScore > 0,
      stars,
      bestScore,
    })
  }

  return Object.fromEntries(completedLevels.entries()) as Record<number, LevelProgress>
}

const normalizeGameState = (value: PartialGameState = {}): GameState => {
  const completedLevels = normalizeCompletedLevels(value.completedLevels)
  const completedLevelIds = Object.keys(completedLevels)
    .map((level) => toPositiveInteger(level))
    .filter((level): level is number => level !== null)

  const unlockedLevels = Array.from(
    new Set([
      1,
      ...(Array.isArray(value.unlockedLevels) ? value.unlockedLevels : []),
      ...completedLevelIds,
      ...completedLevelIds.map((level) => level + 1),
    ]),
  )
    .map((level) => toPositiveInteger(level))
    .filter((level): level is number => level !== null)
    .sort((first, second) => first - second)

  const unlockedSpells = Array.from(
    new Set(
      (Array.isArray(value.unlockedSpells) ? value.unlockedSpells : []).flatMap((spell) => {
        if (typeof spell !== 'string') {
          return []
        }

        const trimmedSpell = spell.trim()
        return trimmedSpell ? [trimmedSpell] : []
      }),
    ),
  )

  const totalStars = Object.values(completedLevels).reduce((sum, progress) => sum + progress.stars, 0)

  return {
    version: CURRENT_SCHEMA_VERSION,
    playerName: typeof value.playerName === 'string' ? value.playerName : '',
    unlockedLevels,
    completedLevels,
    unlockedSpells,
    totalStars,
  }
}

function migrateGameState(raw: unknown): GameState {
  if (!isObject(raw)) {
    return createDefaultGameState()
  }

  const version = raw.version

  if (version === CURRENT_SCHEMA_VERSION) {
    return normalizeGameState(raw as PartialGameState)
  }

  if (version !== undefined && version !== 0) {
    return createDefaultGameState()
  }

  try {
    const legacyLevelStars = toClampedNumberMap(raw.levelStars, clampStars)
    const legacyLevelScores = toClampedNumberMap(raw.levelScores, clampScore)
    const currentLevel = toPositiveInteger(raw.currentLevel)
    const unlockedLevels = Array.isArray(raw.unlockedLevels)
      ? raw.unlockedLevels
      : currentLevel
        ? Array.from({ length: currentLevel }, (_, index) => index + 1)
        : []

    return normalizeGameState({
      playerName: typeof raw.playerName === 'string' ? raw.playerName : '',
      unlockedLevels: currentLevel ? [...unlockedLevels, currentLevel] : unlockedLevels,
      completedLevels: normalizeCompletedLevels(raw.completedLevels, legacyLevelStars, legacyLevelScores),
      unlockedSpells: Array.isArray(raw.unlockedSpells) ? raw.unlockedSpells : [],
    })
  } catch {
    return createDefaultGameState()
  }
}

const loadGameState = (): GameState => {
  if (typeof window === 'undefined') {
    return createDefaultGameState()
  }

  try {
    const savedState = window.localStorage.getItem(GAME_STATE_STORAGE_KEY)

    if (!savedState) {
      return createDefaultGameState()
    }

    return migrateGameState(JSON.parse(savedState) as unknown)
  } catch {
    return createDefaultGameState()
  }
}

const GameStateContext = createContext<GameStateContextValue | undefined>(undefined)

export function GameStateProvider({ children }: PropsWithChildren) {
  const [gameState, setGameState] = useState<GameState>(() => loadGameState())

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(gameState))
  }, [gameState])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== GAME_STATE_STORAGE_KEY) {
        return
      }

      try {
        setGameState(event.newValue ? migrateGameState(JSON.parse(event.newValue) as unknown) : createDefaultGameState())
      } catch {
        setGameState(createDefaultGameState())
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const updatePlayerName = useCallback((name: string) => {
    setGameState((currentState) =>
      normalizeGameState({
        ...currentState,
        playerName: name.trim(),
      }),
    )
  }, [])

  const completeLevel = useCallback((level: number, stars: number, bestScore = 0) => {
    setGameState((currentState) => {
      const safeLevel = Math.max(1, Math.floor(level))
      const currentProgress = currentState.completedLevels[safeLevel]

      return normalizeGameState({
        ...currentState,
        completedLevels: {
          ...currentState.completedLevels,
          [safeLevel]: {
            completed: true,
            stars: Math.max(currentProgress?.stars ?? 0, clampStars(stars)),
            bestScore: Math.max(currentProgress?.bestScore ?? 0, clampScore(bestScore)),
          },
        },
        unlockedLevels: [...currentState.unlockedLevels, safeLevel, safeLevel + 1],
      })
    })
  }, [])

  const unlockSpell = useCallback((spellId: string) => {
    if (!spellId.trim()) {
      return
    }

    setGameState((currentState) =>
      normalizeGameState({
        ...currentState,
        unlockedSpells: [...currentState.unlockedSpells, spellId],
      }),
    )
  }, [])

  const resetProgress = useCallback(() => {
    setGameState(createDefaultGameState())
  }, [])

  const contextValue = useMemo<GameStateContextValue>(
    () => ({
      gameState,
      updatePlayerName,
      completeLevel,
      unlockSpell,
      resetProgress,
    }),
    [completeLevel, gameState, resetProgress, unlockSpell, updatePlayerName],
  )

  return createElement(GameStateContext.Provider, { value: contextValue }, children)
}

export function useGameState() {
  const context = useContext(GameStateContext)

  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider')
  }

  return context
}
