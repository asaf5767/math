import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { checkAnswer, generateLevelSession, isLevelComplete } from '../game/engine'
import { useGameState } from '../hooks/useGameState'
import {
  useSessionPersistence,
  type PersistedSession,
} from '../hooks/useSessionPersistence'
import { useSound } from '../hooks/useSound'
import type { CharacterName, Level, SessionState } from '../types/game'
import Character from './Character'
import FeedbackOverlay from './FeedbackOverlay'
import MagicParticles from './MagicParticles'
import NearDoubleHint from './NearDoubleHint'
import NumberPad from './NumberPad'
import ProgressBar from './ProgressBar'
import QuestionCard from './QuestionCard'

interface PracticeScreenProps {
  level: Level
  onBack: () => void
  onComplete: (session: SessionState) => void
}

interface ReactionState {
  character: CharacterName
  title: string
  line: string
  mood: string
}

const createIdleReaction = (level: Level, hintLevel: SessionState['hintLevel']): ReactionState => {
  if (level.isNearDoubles && hintLevel !== 'none') {
    return {
      character: 'hermione',
      title: 'הרמיוני מסבירה',
      line: 'בואי נחפש את הכפולה הקרובה — היא כבר כמעט פותרת את הכול.',
      mood: 'teaching',
    }
  }

  return {
    character: 'hedwig',
    title: 'הדוויג מעודדת',
    line: 'עוד שאלה נוצצת אחת, ואנחנו ממשיכות במסדרון הקסום.',
    mood: 'idle',
  }
}

const hasSessionProgress = (session: SessionState, input: string) =>
  session.currentQuestion > 0 || session.answers.length > 0 || input.trim().length > 0

const getSessionStreak = (session: SessionState) => {
  let streak = 0

  for (let index = session.answers.length - 1; index >= 0; index -= 1) {
    if (!session.answers[index]?.correct) {
      break
    }

    streak += 1
  }

  return streak
}

function PracticeScreen({ level, onBack, onComplete }: PracticeScreenProps) {
  const { gameState } = useGameState()
  const { saveSession, loadSession, clearSession } = useSessionPersistence()
  const [resumeCandidate, setResumeCandidate] = useState<PersistedSession | null>(() => loadSession(level.id))
  const [showResumePrompt, setShowResumePrompt] = useState(() => resumeCandidate !== null)
  const [session, setSession] = useState<SessionState>(() => generateLevelSession(level))
  const [input, setInput] = useState('')
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [feedbackTrigger, setFeedbackTrigger] = useState(0)
  const [reaction, setReaction] = useState<ReactionState>(() =>
    createIdleReaction(level, level.isNearDoubles ? 'full' : 'none'),
  )
  const [sparkleTrigger, setSparkleTrigger] = useState(0)
  const [isResolving, setIsResolving] = useState(false)
  const [streak, setStreak] = useState(0)
  const { playClick, playCorrect, playHover, playWrong } = useSound()
  const timeoutRef = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    },
    [],
  )

  useEffect(() => {
    if (showResumePrompt || isResolving || isLevelComplete(session) || !hasSessionProgress(session, input)) {
      return
    }

    saveSession(level.id, session, input)
  }, [input, isResolving, level.id, saveSession, session, showResumePrompt])

  const currentQuestion =
    session.questions[session.currentQuestion] ?? session.questions[session.totalQuestions - 1] ?? level.questions[0]
  const questionNumber = Math.min(session.currentQuestion + 1, session.totalQuestions)
  const savedQuestionNumber = resumeCandidate
    ? Math.min(resumeCandidate.session.currentQuestion + 1, resumeCandidate.session.totalQuestions)
    : 1
  const bestScore = gameState.completedLevels[level.id]?.bestScore ?? 0
  const stageBackdrop = level.isNearDoubles ? '/images/backgrounds/classroom.jpg' : '/images/backgrounds/platform.jpg'

  const handleResumeSession = useCallback(() => {
    if (!resumeCandidate) {
      return
    }

    playClick({ volume: 0.18 })
    setSession(resumeCandidate.session)
    setInput(resumeCandidate.input)
    setFeedbackState('idle')
    setFeedbackTrigger(0)
    setReaction(createIdleReaction(level, resumeCandidate.session.hintLevel))
    setSparkleTrigger(0)
    setIsResolving(false)
    setStreak(getSessionStreak(resumeCandidate.session))
    setShowResumePrompt(false)
    setResumeCandidate(null)
  }, [level, playClick, resumeCandidate])

  const handleRestartSession = useCallback(() => {
    playClick({ volume: 0.16 })
    clearSession(level.id)
    setSession(generateLevelSession(level))
    setInput('')
    setFeedbackState('idle')
    setFeedbackTrigger(0)
    setReaction(createIdleReaction(level, level.isNearDoubles ? 'full' : 'none'))
    setSparkleTrigger(0)
    setIsResolving(false)
    setStreak(0)
    setShowResumePrompt(false)
    setResumeCandidate(null)
  }, [clearSession, level, playClick])

  const handleDigit = useCallback(
    (digit: string) => {
      if (showResumePrompt || isResolving || input.length >= 2) {
        return
      }

      playClick({ volume: 0.2 })
      setInput((currentValue) => `${currentValue}${digit}`)
    },
    [input.length, isResolving, playClick, showResumePrompt],
  )

  const handleBackspace = useCallback(() => {
    if (showResumePrompt || isResolving || input.length === 0) {
      return
    }

    playClick({ volume: 0.14 })
    setInput((currentValue) => currentValue.slice(0, -1))
  }, [input.length, isResolving, playClick, showResumePrompt])

  const handleSubmit = useCallback(() => {
    if (showResumePrompt || isResolving || input.length === 0 || !currentQuestion) {
      return
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }

    const { correct, newSession } = checkAnswer(session, Number(input))
    const nextStreak = correct ? streak + 1 : 0

    if (isLevelComplete(newSession)) {
      clearSession(level.id)
    } else {
      saveSession(level.id, newSession, '')
    }

    setIsResolving(true)
    setFeedbackState(correct ? 'correct' : 'wrong')
    setFeedbackTrigger((currentValue) => currentValue + 1)
    setStreak(nextStreak)

    if (correct) {
      playCorrect()
      setSparkleTrigger((currentValue) => currentValue + 1)
      setReaction({
        character: 'harry',
        title: 'הארי חוגג',
        line: 'מושלם! אפילו הנרות קופצים משמחה בגלל התשובה שלך.',
        mood: 'celebrate',
      })
    } else {
      playWrong()
      setReaction({
        character: 'ron',
        title: 'רון מעודד',
        line: 'איזה ניסיון אמיץ! בואי ניקח נשימה ונמשיך יחד, את יכולה.',
        mood: 'encouraging',
      })
    }

    timeoutRef.current = window.setTimeout(() => {
      if (isLevelComplete(newSession)) {
        onComplete(newSession)
        return
      }

      setSession(newSession)
      setInput('')
      setFeedbackState('idle')
      setIsResolving(false)
      setReaction(createIdleReaction(level, newSession.hintLevel))
    }, correct ? 950 : 1200)
  }, [clearSession, currentQuestion, input, isResolving, level, onComplete, playCorrect, playWrong, saveSession, session, showResumePrompt, streak])

  const handleBackToMap = useCallback(() => {
    if (isResolving) {
      return
    }

    playClick({ volume: 0.16 })

    if (!showResumePrompt && hasSessionProgress(session, input) && !isLevelComplete(session)) {
      saveSession(level.id, session, input)
    }

    onBack()
  }, [input, isResolving, level.id, onBack, playClick, saveSession, session, showResumePrompt])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) {
        return
      }

      if (/^\d$/.test(event.key)) {
        event.preventDefault()
        handleDigit(event.key)
        return
      }

      if (event.key === 'Backspace') {
        event.preventDefault()
        handleBackspace()
        return
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        handleSubmit()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleBackspace, handleDigit, handleSubmit])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleBackToMap}
          disabled={isResolving}
          className="rounded-full border border-hp-gold/35 bg-hp-shadow/45 px-4 py-2 text-sm font-black text-hp-parchment backdrop-blur-sm transition hover:border-hp-gold/70 hover:bg-hp-shadow/65 disabled:cursor-not-allowed disabled:opacity-60"
        >
          חזרה למפה
        </button>
        <div className="rounded-full border border-hp-gold/25 bg-hp-shadow/45 px-4 py-2 text-sm font-black text-hp-parchment/90 backdrop-blur-sm">
          {level.emoji} {level.nameHe}
        </div>
      </div>

      {showResumePrompt && resumeCandidate && (
        <motion.div
          initial={{ opacity: 0, y: -18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="parchment-card rounded-[28px] border border-hp-gold/35 px-5 py-5 text-center shadow-[0_18px_50px_rgba(10,6,18,0.28)]"
        >
          <div className="text-sm font-black uppercase tracking-[0.38em] text-hp-gryffindorRed/70">שמירה קסומה נמצאה</div>
          <div className="mt-3 text-2xl font-black text-hp-deepPurple">המשיכי מאיפה שעצרת?</div>
          <p className="mt-3 text-lg text-hp-royalPurple/80">
            חזרי ישר לשאלה {savedQuestionNumber} מתוך {resumeCandidate.session.totalQuestions}, או התחילי את השלב מחדש.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <motion.button
              type="button"
              onClick={handleResumeSession}
              onMouseEnter={() => playHover({ volume: 0.38 })}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="magic-button"
            >
              כן, המשיכי
            </motion.button>
            <motion.button
              type="button"
              onClick={handleRestartSession}
              onMouseEnter={() => playHover({ volume: 0.34 })}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-[18px] border-2 border-hp-gold/45 bg-hp-shadow/55 px-6 py-3 text-lg font-black text-hp-parchment shadow-[0_14px_34px_rgba(10,6,18,0.28)]"
            >
              התחילי מחדש
            </motion.button>
          </div>
        </motion.div>
      )}

      <ProgressBar current={session.currentQuestion} total={session.totalQuestions} />

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[30px] border border-hp-gold/35 shadow-[0_20px_60px_rgba(10,6,18,0.28)]"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${stageBackdrop}')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,6,18,0.92)_0%,rgba(26,10,46,0.76)_56%,rgba(10,6,18,0.38)_100%)]" />
        <div className="relative flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div className="text-start">
            <div className="text-sm font-black uppercase tracking-[0.32em] text-hp-gold/90">
              {level.isNearDoubles ? 'Hermione strategy room' : 'Platform of glowing questions'}
            </div>
            <div className="mt-2 text-2xl font-black text-hp-parchment md:text-[2rem]">
              {level.isNearDoubles ? 'הרמיוני פותחת ספר רמזים קסום ליד המדפים' : 'הארי מכוון את השרביט אל התרגיל הבא במסילה הקסומה'}
            </div>
            <p className="mt-2 max-w-[420px] text-sm leading-7 text-hp-parchment/85 md:text-base">
              {level.isNearDoubles
                ? 'בחדר האבן החמים מחכים ספרים, רמזים ומתמטיקה חכמה. בכל שאלה הרמיוני עוזרת לך לראות את הקסם שבכפולה הקרובה.'
                : 'הרציף הישן מוכן למסע, ואת מוזמנת לעלות על כל שאלה כמו על קרון חדש בדרך לניצחון.'}
            </p>
          </div>
          <Character
            name={level.isNearDoubles ? 'hermione' : 'harry'}
            mood={level.isNearDoubles ? 'teaching' : 'pointing'}
            className="h-[210px] w-[150px] shrink-0 self-center"
          />
        </div>
      </motion.div>

      <div className="text-center">
        <div className="text-sm font-black uppercase tracking-[0.38em] text-hp-gold/80">שיעור קסם פעיל</div>
        <div className="mt-2 text-xl font-black text-hp-parchment md:text-2xl">
          שאלה {questionNumber} מתוך {session.totalQuestions}
        </div>
        {bestScore > 0 && (
          <div className="mt-2 text-sm font-bold text-hp-parchment/75">השיא שלך בשלב הזה: {bestScore}%</div>
        )}

        <AnimatePresence>
          {streak >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.85 }}
              className="mx-auto mt-3 inline-flex items-center gap-2 rounded-full border border-hp-warmGold/60 bg-hp-shadow/60 px-4 py-2 text-sm font-black text-hp-parchment shadow-[0_12px_32px_rgba(10,6,18,0.35)] backdrop-blur-md"
            >
              <span className="text-lg">🔥</span>
              <span>רצף: {streak}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {currentQuestion && level.isNearDoubles && (
        <NearDoubleHint question={currentQuestion} hintLevel={session.hintLevel} />
      )}

      <motion.div
        animate={feedbackState === 'wrong' ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
        transition={{ duration: 0.55 }}
        className="relative"
      >
        <QuestionCard
          question={currentQuestion}
          currentInput={input}
          questionIndex={session.currentQuestion}
          highlight={feedbackState !== 'wrong'}
        />
        <MagicParticles trigger={sparkleTrigger} className="z-10" />
        <FeedbackOverlay state={feedbackState} trigger={feedbackTrigger} />
      </motion.div>

      <motion.div
        initial={false}
        animate={feedbackState === 'correct' ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        className="parchment-card rounded-[28px] px-4 py-4 shadow-[0_16px_50px_rgba(10,6,18,0.22)]"
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.18),transparent_58%),linear-gradient(180deg,rgba(45,27,105,0.12),rgba(26,10,46,0.03))] px-1 py-1">
            <Character name={reaction.character} mood={reaction.mood} className="h-[160px] w-[120px]" />
          </div>
          <div className="text-start">
            <div className="text-sm font-black uppercase tracking-[0.28em] text-hp-gryffindorRed/70">{reaction.title}</div>
            <div className="mt-2 text-lg font-bold leading-8 text-hp-deepPurple">{reaction.line}</div>
          </div>
        </div>
      </motion.div>

      <div className="flex justify-center" onMouseEnter={() => playHover({ volume: 0.42 })}>
        <NumberPad
          value={input}
          onDigit={handleDigit}
          onBackspace={handleBackspace}
          onSubmit={handleSubmit}
          disabled={isResolving || showResumePrompt}
        />
      </div>
    </div>
  )
}

export default PracticeScreen
