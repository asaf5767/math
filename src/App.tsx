import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import HomeScreen from './components/HomeScreen'
import Layout, { type LayoutBreadcrumbItem } from './components/Layout'
import LevelComplete from './components/LevelComplete'
import LevelMap from './components/LevelMap'
import PracticeScreen from './components/PracticeScreen'
import SpellBook from './components/SpellBook'
import { getLevelResult } from './game/engine'
import { LEVELS } from './game/levels'
import { GameStateProvider, useGameState } from './hooks/useGameState'
import { useHashRouter } from './hooks/useHashRouter'
import type { Level, SessionState } from './types/game'

interface LevelCompleteSnapshot {
  level: Level
  session: SessionState
  result: ReturnType<typeof getLevelResult>
  newSpellUnlocked: boolean
}

const LEVEL_COMPLETE_STORAGE_KEY = 'harry-potter-math-level-complete'

const screenMotion = {
  initial: { opacity: 0, y: 28, scale: 0.98, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -24, scale: 1.01, filter: 'blur(6px)' },
}

const loadLevelCompleteSnapshot = (): LevelCompleteSnapshot | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const savedSnapshot = window.sessionStorage.getItem(LEVEL_COMPLETE_STORAGE_KEY)

    if (!savedSnapshot) {
      return null
    }

    return JSON.parse(savedSnapshot) as LevelCompleteSnapshot
  } catch {
    return null
  }
}

function AppScreens() {
  const { gameState, completeLevel, unlockSpell, updatePlayerName, resetProgress } = useGameState()
  const { screen, params, navigate, goBack } = useHashRouter(Boolean(gameState.playerName))
  const [levelCompleteSnapshot, setLevelCompleteSnapshot] = useState<LevelCompleteSnapshot | null>(() =>
    loadLevelCompleteSnapshot(),
  )

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    if (!levelCompleteSnapshot) {
      window.sessionStorage.removeItem(LEVEL_COMPLETE_STORAGE_KEY)
      return
    }

    window.sessionStorage.setItem(LEVEL_COMPLETE_STORAGE_KEY, JSON.stringify(levelCompleteSnapshot))
  }, [levelCompleteSnapshot])

  const nextLevelToPlay = useMemo(
    () =>
      LEVELS.find(
        (level) =>
          gameState.unlockedLevels.includes(level.id) && !gameState.completedLevels[level.id]?.completed,
      )?.id ??
      gameState.unlockedLevels.at(-1) ??
      1,
    [gameState.completedLevels, gameState.unlockedLevels],
  )

  const selectedLevel = useMemo(() => {
    const requestedLevelId = params.levelId ?? nextLevelToPlay
    const safeLevelId = LEVELS.some((level) => level.id === requestedLevelId)
      ? requestedLevelId
      : nextLevelToPlay

    return LEVELS.find((level) => level.id === safeLevelId) ?? LEVELS[0]
  }, [nextLevelToPlay, params.levelId])

  const isPracticeRouteValid =
    screen === 'practice' &&
    params.levelId === selectedLevel.id &&
    gameState.unlockedLevels.includes(selectedLevel.id)

  useEffect(() => {
    if (screen !== 'practice') {
      return
    }

    const requestedLevelId = params.levelId
    const isKnownLevel = LEVELS.some((level) => level.id === requestedLevelId)
    const isUnlockedLevel = requestedLevelId ? gameState.unlockedLevels.includes(requestedLevelId) : false

    if (!requestedLevelId || !isKnownLevel || !isUnlockedLevel) {
      navigate('map', {}, { replace: true })
    }
  }, [gameState.unlockedLevels, navigate, params.levelId, screen])

  useEffect(() => {
    if (screen === 'complete' && !levelCompleteSnapshot) {
      navigate('map', {}, { replace: true })
    }
  }, [levelCompleteSnapshot, navigate, screen])

  const openLevelMap = useCallback(() => {
    navigate('map')
  }, [navigate])

  const openHome = useCallback(() => {
    navigate('home')
  }, [navigate])

  const handleContinueJourney = useCallback(() => {
    navigate('map')
  }, [navigate])

  const handleSelectLevel = useCallback(
    (levelId: number) => {
      navigate('practice', { levelId })
    },
    [navigate],
  )

  const handleOpenSpellBook = useCallback(() => {
    navigate('spellbook')
  }, [navigate])

  const handlePracticeComplete = useCallback(
    (session: SessionState) => {
      const level = selectedLevel
      const result = getLevelResult(session, level)
      const newSpellUnlocked = result.passed && !gameState.unlockedSpells.includes(level.spellReward.id)

      if (result.passed) {
        completeLevel(level.id, result.stars, result.score)

        if (newSpellUnlocked) {
          unlockSpell(level.spellReward.id)
        }
      }

      setLevelCompleteSnapshot({
        level,
        session,
        result,
        newSpellUnlocked,
      })
      navigate('complete')
    },
    [completeLevel, gameState.unlockedSpells, navigate, selectedLevel, unlockSpell],
  )

  const handleContinue = useCallback(() => {
    if (!levelCompleteSnapshot) {
      openLevelMap()
      return
    }

    const nextLevel = LEVELS.find((level) => level.id === levelCompleteSnapshot.level.id + 1)

    if (levelCompleteSnapshot.result.passed && nextLevel) {
      navigate('practice', { levelId: nextLevel.id })
      return
    }

    openLevelMap()
  }, [levelCompleteSnapshot, navigate, openLevelMap])

  const handleReplayLevel = useCallback(() => {
    if (!levelCompleteSnapshot) {
      navigate('practice', { levelId: selectedLevel.id })
      return
    }

    navigate('practice', { levelId: levelCompleteSnapshot.level.id })
  }, [levelCompleteSnapshot, navigate, selectedLevel.id])

  const handleResetProgress = useCallback(() => {
    resetProgress()
    setLevelCompleteSnapshot(null)
    navigate('home', {}, { replace: true })
  }, [navigate, resetProgress])

  const breadcrumbs = useMemo<LayoutBreadcrumbItem[] | undefined>(() => {
    if (screen === 'home') {
      return undefined
    }

    const homeCrumb: LayoutBreadcrumbItem = {
      label: '🏠 בית',
      onClick: openHome,
    }

    if (screen === 'map') {
      return [homeCrumb, { label: '🗺️ מפת השנים' }]
    }

    const mapCrumb: LayoutBreadcrumbItem = {
      label: '🗺️ מפת השנים',
      onClick: openLevelMap,
    }

    if (screen === 'spellbook') {
      return [homeCrumb, mapCrumb, { label: '📖 ספר הלחשים' }]
    }

    if (screen === 'practice') {
      return [homeCrumb, mapCrumb, { label: `⚡ ${selectedLevel.nameHe}` }]
    }

    return [
      homeCrumb,
      mapCrumb,
      { label: `🏆 ${levelCompleteSnapshot?.level.nameHe ?? 'סיום השלב'}` },
    ]
  }, [levelCompleteSnapshot?.level.nameHe, openHome, openLevelMap, screen, selectedLevel.nameHe])

  const screenKey = useMemo(() => {
    if (screen === 'practice') {
      return `practice-${selectedLevel.id}`
    }

    if (screen === 'complete' && levelCompleteSnapshot) {
      return `complete-${levelCompleteSnapshot.level.id}-${levelCompleteSnapshot.session.startTime}`
    }

    return screen
  }, [levelCompleteSnapshot, screen, selectedLevel.id])

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <AnimatePresence mode="wait">
        <motion.div
          key={screenKey}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={screenMotion}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {screen === 'home' && (
            <HomeScreen
              playerName={gameState.playerName}
              onSaveName={updatePlayerName}
              onStartAdventure={handleContinueJourney}
              onResetProgress={handleResetProgress}
            />
          )}

          {screen === 'map' && (
            <LevelMap
              levels={LEVELS}
              unlockedLevels={gameState.unlockedLevels}
              completedLevels={gameState.completedLevels}
              unlockedSpells={gameState.unlockedSpells}
              currentLevelId={nextLevelToPlay}
              onSelectLevel={handleSelectLevel}
              onOpenSpellBook={handleOpenSpellBook}
            />
          )}

          {isPracticeRouteValid && (
            <PracticeScreen
              key={selectedLevel.id}
              level={selectedLevel}
              onBack={goBack}
              onComplete={handlePracticeComplete}
            />
          )}

          {screen === 'spellbook' && (
            <SpellBook unlockedSpells={gameState.unlockedSpells} onBack={goBack} />
          )}

          {screen === 'complete' && levelCompleteSnapshot && (
            <LevelComplete
              level={levelCompleteSnapshot.level}
              session={levelCompleteSnapshot.session}
              result={levelCompleteSnapshot.result}
              newSpellUnlocked={levelCompleteSnapshot.newSpellUnlocked}
              onContinue={handleContinue}
              onReplay={handleReplayLevel}
              onBack={goBack}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </Layout>
  )
}

function App() {
  return (
    <GameStateProvider>
      <AppScreens />
    </GameStateProvider>
  )
}

export default App
