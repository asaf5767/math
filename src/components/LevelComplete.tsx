import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { useSound } from '../hooks/useSound'
import type { Level, SessionState } from '../types/game'
import Character from './Character'
import { SpellIllustration } from './MagicIcons'
import MagicParticles from './MagicParticles'

interface LevelCompleteProps {
  level: Level
  session: SessionState
  result: {
    passed: boolean
    score: number
    stars: number
    spellUnlocked: boolean
  }
  newSpellUnlocked: boolean
  onContinue: () => void
  onReplay: () => void
  onBack: () => void
}

interface ConfettiPiece {
  id: number
  left: number
  size: number
  delay: number
  duration: number
  drift: number
  rotate: number
  color: string
  rounded: boolean
}

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function CelebrationConfetti() {
  const pieces = useMemo<ConfettiPiece[]>(() => {
    const palette = ['#f5c542', '#d4a843', '#7b2d3f', '#ae0001']

    return Array.from({ length: 26 }, (_, index) => ({
      id: index,
      left: 6 + pseudoRandom(index + 1) * 88,
      size: 8 + pseudoRandom(index + 3) * 10,
      delay: pseudoRandom(index + 5) * 1.6,
      duration: 3.8 + pseudoRandom(index + 7) * 2.2,
      drift: -36 + pseudoRandom(index + 9) * 72,
      rotate: -160 + pseudoRandom(index + 11) * 320,
      color: palette[index % palette.length],
      rounded: index % 3 === 0,
    }))
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute top-[-12%]"
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.rounded ? piece.size : piece.size * 1.6,
            borderRadius: piece.rounded ? 999 : 4,
            background: piece.color,
            boxShadow: '0 0 14px rgba(245, 197, 66, 0.2)',
          }}
          animate={{
            y: ['0%', '125%'],
            x: [0, piece.drift, piece.drift * -0.35],
            rotate: [0, piece.rotate],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            repeat: Number.POSITIVE_INFINITY,
            repeatDelay: 0.4 + pseudoRandom(piece.id + 13) * 0.8,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

function LevelComplete({ level, session, result, newSpellUnlocked, onContinue, onReplay, onBack }: LevelCompleteProps) {
  const { playClick, playHover, playLevelComplete, playSpellUnlock } = useSound()
  const [revealedStars, setRevealedStars] = useState(result.passed ? 0 : result.stars)

  useEffect(() => {
    if (!result.passed) {
      return
    }

    playLevelComplete()

    const timeoutIds = Array.from({ length: result.stars }, (_, index) =>
      window.setTimeout(() => {
        setRevealedStars(index + 1)
        playClick({ volume: 0.22 + index * 0.05 })
      }, 460 + index * 240),
    )

    if (newSpellUnlocked) {
      timeoutIds.push(
        window.setTimeout(() => {
          playSpellUnlock()
        }, 1080),
      )
    }

    return () => {
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId))
    }
  }, [newSpellUnlocked, playClick, playLevelComplete, playSpellUnlock, result.passed, result.stars])

  const incorrectAnswers = session.totalQuestions - session.correctAnswers

  const handleContinueClick = () => {
    playClick({ volume: 0.24 })
    onContinue()
  }

  const handleReplayClick = () => {
    playClick({ volume: 0.18 })
    onReplay()
  }

  const handleBackClick = () => {
    playClick({ volume: 0.16 })
    onBack()
  }

  return (
    <div className="relative space-y-6 overflow-hidden text-center">
      {result.passed && <CelebrationConfetti />}
      <MagicParticles trigger={result.passed ? 1 : 0} count={28} />

      <motion.div
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-3"
      >
        <div className="text-sm font-black uppercase tracking-[0.45em] text-hp-gold/80">Great Hall Celebration</div>
        <h2 className="magic-title text-[clamp(3rem,10vw,5.7rem)]">{result.passed ? '!כל הכבוד' : 'עוד קצת קסם'}</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[34px] border border-hp-gold/35 shadow-[0_24px_80px_rgba(10,6,18,0.34)]"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/backgrounds/great-hall.jpg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,6,18,0.9)_4%,rgba(26,10,46,0.68)_54%,rgba(10,6,18,0.34)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(245,197,66,0.24),transparent_24%),radial-gradient(circle_at_86%_16%,rgba(126,184,255,0.16),transparent_20%)]" />

        <div className="relative grid gap-5 px-6 py-6 md:grid-cols-[1.05fr_0.95fr] md:items-center md:px-8">
          <div className="text-start">
            <div className="text-sm font-black uppercase tracking-[0.38em] text-hp-gold/90">{level.nameHe}</div>
            <div className="mt-3 text-3xl font-black leading-tight text-hp-parchment md:text-4xl">
              {result.passed
                ? 'דמבלדור פורש ידיים באולם הגדול וחוגג איתך כל תשובה מדויקת.'
                : 'דמבלדור מניח יד על הלב בחיוך חם — עוד ניסיון קטן והאולם יתמלא שוב בניצוצות.'}
            </div>
            <p className="mt-3 max-w-[430px] text-base leading-8 text-hp-parchment/88 md:text-lg">
              {result.passed
                ? 'הנרות מרחפים מעל השולחנות, הווילונות הזהובים מנצנצים, ואת כבר נשמעת כמו קוסמת שיודעת בדיוק איפה להניף את השרביט.'
                : 'הדרך הקסומה שלך ממשיכה. כל שאלה שכבר פתרת בנתה ביטחון, וכל ניסיון חדש מקרב אותך עוד קצת לחגיגה הגדולה.'}
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <Character name="dumbledore" mood={result.passed ? 'celebrate' : 'proud'} className="h-[310px] w-[220px]" />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.12, duration: 0.6 }}
        className="parchment-card relative rounded-[32px] px-6 py-7 shadow-[0_24px_70px_rgba(10,6,18,0.32)]"
      >
        <div className="mt-4 text-sm font-black uppercase tracking-[0.35em] text-hp-gryffindorRed/70">{level.nameHe}</div>

        <div className="mt-5 flex items-center justify-center gap-3" aria-label={`${result.stars} מתוך 3 כוכבים`}>
          {Array.from({ length: 3 }, (_, index) => {
            const earned = index < result.stars
            const revealed = index < revealedStars

            return (
              <motion.span
                key={index}
                initial={false}
                animate={
                  earned && revealed
                    ? {
                        opacity: [0.3, 1, 1],
                        scale: [0.45, 1.35, 1],
                        rotate: [-18, 10, 0],
                        y: [18, -10, 0],
                      }
                    : earned
                      ? { opacity: 0.22, scale: 0.72, y: 10 }
                      : { opacity: 0.34, scale: 1, y: 0 }
                }
                transition={{ duration: 0.56, ease: [0.22, 1, 0.36, 1] }}
                className={`text-5xl md:text-6xl ${
                  earned && revealed
                    ? 'text-hp-warmGold drop-shadow-[0_0_18px_rgba(245,197,66,0.65)]'
                    : 'text-hp-stone/60'
                }`}
              >
                ⭐
              </motion.span>
            )
          })}
        </div>

        <div className="mt-5 text-2xl font-black text-hp-deepPurple">
          ענית נכון על {session.correctAnswers} מתוך {session.totalQuestions} שאלות
        </div>
        <div className="mt-2 text-lg font-bold text-hp-royalPurple/80">
          ציון קסום: {result.score}% • טעויות עדינות: {incorrectAnswers}
        </div>
      </motion.div>

      {newSpellUnlocked && result.passed && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.28, type: 'spring', stiffness: 160, damping: 14 }}
          className="parchment-card spell-glow relative overflow-hidden rounded-[32px] px-6 py-7 shadow-[0_24px_80px_rgba(126,184,255,0.24)]"
        >
          <MagicParticles trigger={2} count={30} />
          <div className="text-sm font-black uppercase tracking-[0.45em] text-hp-gold/80">New Spell Revealed</div>
          <div className="mt-5 flex justify-center">
            <div className="rounded-[30px] bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.18),transparent_58%),linear-gradient(180deg,rgba(45,27,105,0.08),rgba(26,10,46,0.03))] p-4 shadow-[0_16px_38px_rgba(10,6,18,0.12)]">
              <SpellIllustration spellId={level.spellReward.id} size={86} />
            </div>
          </div>
          <div className="mt-4 text-[clamp(2.2rem,7vw,3.3rem)] font-black text-hp-gold drop-shadow-[0_0_18px_rgba(245,197,66,0.45)]">
            {level.spellReward.nameHe}
          </div>
          <p className="mx-auto mt-3 max-w-[540px] text-lg font-bold text-hp-deepPurple">{level.spellReward.description}</p>
        </motion.div>
      )}

      <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
        <motion.button
          type="button"
          onClick={handleContinueClick}
          onMouseEnter={() => playHover({ volume: 0.4 })}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="magic-button text-xl"
        >
          {result.passed ? 'המשיכי' : 'חזרה למפת השנים'}
        </motion.button>
        <motion.button
          type="button"
          onClick={handleReplayClick}
          onMouseEnter={() => playHover({ volume: 0.4 })}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className={`rounded-[18px] border-2 px-8 py-4 text-xl font-black shadow-[0_14px_34px_rgba(10,6,18,0.28)] transition ${
            result.passed
              ? 'border-hp-gold/45 bg-hp-shadow/55 text-hp-parchment'
              : 'border-hp-warmGold/70 bg-hp-warmGold text-hp-deepPurple'
          }`}
        >
          שחקי שוב
        </motion.button>
        <motion.button
          type="button"
          onClick={handleBackClick}
          onMouseEnter={() => playHover({ volume: 0.32 })}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-[18px] border border-hp-gold/30 bg-hp-shadow/45 px-6 py-4 text-base font-black text-hp-parchment shadow-[0_14px_34px_rgba(10,6,18,0.22)] transition hover:border-hp-gold/60 hover:bg-hp-shadow/65"
        >
          ↩ חזרה אחורה
        </motion.button>
      </div>
    </div>
  )
}

export default LevelComplete
