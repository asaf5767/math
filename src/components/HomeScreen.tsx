import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useSound } from '../hooks/useSound'
import Character from './Character'
import { StarIcon, WandIcon } from './MagicIcons'

interface HomeScreenProps {
  playerName: string
  onSaveName: (name: string) => void
  onStartAdventure: () => void
  onResetProgress: () => void
}

const skyStars = [
  { left: '8%', top: 14, size: 8, delay: 0.1, duration: 3.4 },
  { left: '19%', top: 46, size: 5, delay: 0.5, duration: 4.2 },
  { left: '30%', top: 22, size: 6, delay: 0.2, duration: 3.8 },
  { left: '42%', top: 58, size: 10, delay: 0.9, duration: 4.6 },
  { left: '52%', top: 18, size: 7, delay: 0.35, duration: 3.2 },
  { left: '66%', top: 40, size: 6, delay: 1.1, duration: 4.4 },
  { left: '78%', top: 20, size: 9, delay: 0.7, duration: 3.6 },
  { left: '90%', top: 48, size: 5, delay: 1.3, duration: 4.1 },
]

function SkyTwinkles() {
  return (
    <div className="pointer-events-none absolute inset-x-0 -top-12 mx-auto h-36 max-w-[640px] overflow-hidden">
      {skyStars.map((star, index) => (
        <motion.span
          key={index}
          className="absolute rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            background:
              index % 2 === 0
                ? 'radial-gradient(circle, rgba(245,197,66,0.95) 0%, rgba(245,197,66,0.3) 55%, transparent 75%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(126,184,255,0.35) 50%, transparent 78%)',
            boxShadow:
              index % 2 === 0
                ? '0 0 16px rgba(245,197,66,0.7), 0 0 28px rgba(245,197,66,0.25)'
                : '0 0 14px rgba(255,255,255,0.58), 0 0 28px rgba(126,184,255,0.22)',
          }}
          animate={{ opacity: [0.2, 1, 0.35], scale: [0.7, 1.2, 0.82], y: [0, -6, 0] }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="absolute inset-x-[12%] bottom-0 h-px bg-gradient-to-r from-transparent via-hp-spellGlow/55 to-transparent"
        animate={{ opacity: [0.18, 0.55, 0.18], scaleX: [0.94, 1.02, 0.98] }}
        transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
      />
    </div>
  )
}

function CastleSilhouette() {
  return (
    <motion.svg
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.25, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      viewBox="0 0 520 220"
      className="mx-auto h-[220px] w-full max-w-[560px] drop-shadow-[0_0_40px_rgba(245,197,66,0.18)]"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="castleGlow" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#7eb8ff" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <circle cx="420" cy="46" r="26" fill="rgba(245,197,66,0.22)" />
      <path d="M30 195h460v18H30z" fill="rgba(10,6,18,0.95)" />
      <path d="M68 195V120h48v-40l16-18 16 18v40h30V98l18-18 18 18v22h40V70l16-18 16 18v50h42V86l18-18 18 18v34h34V96l16-18 16 18v24h30v75z" fill="rgba(10,6,18,0.95)" stroke="url(#castleGlow)" strokeWidth="2" />
      <rect x="232" y="118" width="56" height="77" rx="28" fill="rgba(26,10,46,0.98)" stroke="rgba(212,168,67,0.7)" strokeWidth="2" />

      {[96, 128, 176, 208, 312, 344, 404].map((x, index) => (
        <motion.rect
          key={x}
          x={x}
          y={index % 2 === 0 ? 128 : 144}
          width="12"
          height="20"
          rx="6"
          fill="#f5c542"
          animate={{ opacity: [0.45, 1, 0.5], scaleY: [1, 1.1, 1] }}
          transition={{ delay: index * 0.18, duration: 2.4, repeat: Number.POSITIVE_INFINITY }}
        />
      ))}

      <motion.path
        d="M48 195c36-28 86-42 150-42 38 0 92 8 149 28 52-18 86-26 116-26 26 0 46 4 58 10"
        fill="none"
        stroke="rgba(126,184,255,0.28)"
        strokeWidth="4"
        strokeLinecap="round"
        animate={{ opacity: [0.2, 0.55, 0.22] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
      />
    </motion.svg>
  )
}

function HomeScreen({ playerName, onSaveName, onStartAdventure, onResetProgress }: HomeScreenProps) {
  const [draftName, setDraftName] = useState(playerName)
  const { playClick, playHover } = useSound()
  const heroMood = playerName ? 'celebrate' : 'idle'

  useEffect(() => {
    setDraftName(playerName)
  }, [playerName])

  const handleSubmit = () => {
    const safeName = draftName.trim()

    if (!safeName) {
      return
    }

    onSaveName(safeName)
    onStartAdventure()
  }

  const handleStartAdventure = () => {
    playClick({ volume: 0.24 })
    handleSubmit()
  }

  const handleContinueJourney = () => {
    playClick({ volume: 0.24 })
    onStartAdventure()
  }

  const handleResetJourney = () => {
    playClick({ volume: 0.18 })
    onResetProgress()
  }

  return (
    <div className="relative isolate text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-52 w-52 rounded-full bg-hp-gold/15 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <p className="mb-4 text-sm font-bold uppercase tracking-[0.5em] text-hp-warmGold/80">הוגוורטס • קסם של מספרים • עברית</p>
        <motion.h1
          className="magic-title text-[clamp(3.2rem,11vw,6.4rem)] leading-none"
          animate={{ textShadow: ['0 0 18px rgba(212,168,67,0.45)', '0 0 34px rgba(245,197,66,0.78)', '0 0 18px rgba(212,168,67,0.45)'] }}
          transition={{ duration: 3.5, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        >
          🏰 אקדמיית הוגוורטס למתמטיקה
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.7 }}
          className="mt-4 text-xl font-semibold text-hp-parchment md:text-2xl"
        >
          !ברוכה הבאה, קוסמת צעירה
        </motion.p>
      </motion.div>

      <div className="relative z-10 mt-8">
        <SkyTwinkles />
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[38px] border border-hp-gold/35 bg-hp-shadow/65 shadow-[0_26px_90px_rgba(10,6,18,0.48)]"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/backgrounds/hogwarts-castle.jpg')" }} />
          <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,6,18,0.92)_10%,rgba(26,10,46,0.72)_48%,rgba(10,6,18,0.38)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(245,197,66,0.24),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(126,184,255,0.22),transparent_24%)]" />

          <div className="relative grid gap-6 px-6 py-7 md:grid-cols-[1.05fr_0.95fr] md:items-end md:px-8 md:py-9">
            <div className="space-y-4 text-start">
              <div className="inline-flex items-center gap-3 rounded-full border border-hp-gold/35 bg-hp-shadow/55 px-4 py-2 text-sm font-black uppercase tracking-[0.28em] text-hp-parchment backdrop-blur-sm">
                <WandIcon size={24} className="shrink-0" />
                <span>Harry guides the first spell</span>
              </div>
              <div className="max-w-[390px] text-3xl font-black leading-tight text-hp-parchment md:text-4xl">
                הארי מחכה ליד שערי הוגוורטס עם שרביט זוהר, צעיף גריפינדורי ורגע פתיחה שמרגיש כמו סיפור אמיתי.
              </div>
              <p className="max-w-[420px] text-base leading-8 text-hp-parchment/88 md:text-lg">
                הטירה מאחורייך, הנרות כבר נדלקו, וכל תרגיל יהפוך כאן ללחש קטן. כל מה שנשאר הוא לכתוב את השם שלך ולהיכנס למסע.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-hp-gold/35 bg-hp-shadow/55 px-4 py-2 text-sm font-bold text-hp-parchment backdrop-blur-sm">
                  <StarIcon size={18} className="shrink-0" />
                  פרסים, לחשים וכוכבים בכל שלב
                </div>
                <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-hp-parchment/85 backdrop-blur-sm">
                  רקע אמיתי של הוגוורטס • תנועות קסומות • RTL מלא
                </div>
              </div>
            </div>

            <div className="relative flex justify-center md:justify-end">
              <div className="absolute bottom-6 h-40 w-40 rounded-full bg-hp-gold/18 blur-3xl" />
              <Character name="harry" mood={heroMood} className="relative h-[320px] w-[230px] drop-shadow-[0_28px_40px_rgba(10,6,18,0.52)]" />
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-[-44px] opacity-60">
            <CastleSilhouette />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto mt-6 max-w-[660px]"
      >
        <div className="parchment-card rounded-[32px] px-6 py-7 shadow-[0_24px_80px_rgba(10,6,18,0.4)] md:px-8">
          {playerName ? (
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-hp-gold/40 bg-hp-gold/10 px-4 py-2 text-sm font-black uppercase tracking-[0.3em] text-hp-gryffindorRed/75">
                <StarIcon size={18} className="shrink-0" />
                ברוכה השבה לטירה
              </div>
              <div className="text-2xl font-black text-hp-gryffindorRed md:text-3xl">!שלום {playerName}</div>
              <p className="text-lg leading-8 text-hp-royalPurple/80">
                הטירה כבר הדליקה את כל הנרות במיוחד בשבילך — המפה, הלחשים והכוכבים שלך מחכים בדיוק מהמקום שבו עצרת.
              </p>
              <motion.button
                type="button"
                onClick={handleContinueJourney}
                onMouseEnter={() => playHover({ volume: 0.4 })}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="magic-button w-full text-2xl shadow-[0_18px_34px_rgba(123,45,63,0.45)] md:text-[1.65rem]"
              >
                ✨ המשיכי במסע
              </motion.button>
              <button
                type="button"
                onClick={handleResetJourney}
                onMouseEnter={() => playHover({ volume: 0.3 })}
                className="text-sm font-bold text-hp-royalPurple/72 underline decoration-hp-gold/60 underline-offset-4 transition hover:text-hp-gryffindorRed"
              >
                אני רוצה להתחיל מחדש
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              <label className="block text-start" htmlFor="player-name">
                <span className="mb-3 block text-sm font-black uppercase tracking-[0.35em] text-hp-gryffindorRed/70">
                  מגילת ההרשמה לקוסמות צעירות
                </span>
                <input
                  id="player-name"
                  value={draftName}
                  onChange={(event) => setDraftName(event.currentTarget.value)}
                  placeholder="...מה שמך, קוסמת"
                  className="w-full rounded-[28px] border-2 border-hp-gold/40 bg-[linear-gradient(180deg,rgba(245,230,200,0.92)_0%,rgba(253,248,239,0.98)_100%)] px-6 py-4 text-2xl font-bold text-hp-deepPurple shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_30px_rgba(10,6,18,0.15)] outline-none transition placeholder:text-hp-royalPurple/45 focus:border-hp-warmGold focus:shadow-[0_0_0_4px_rgba(245,197,66,0.18)]"
                />
              </label>

              <motion.button
                type="button"
                onClick={handleStartAdventure}
                onMouseEnter={() => playHover({ volume: 0.4 })}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                animate={
                  draftName.trim().length > 0
                    ? {
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          '0 18px 34px rgba(123,45,63,0.38)',
                          '0 24px 42px rgba(212,168,67,0.28)',
                          '0 18px 34px rgba(123,45,63,0.38)',
                        ],
                      }
                    : undefined
                }
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
                className="magic-button w-full text-2xl shadow-[0_18px_34px_rgba(123,45,63,0.45)] md:text-[1.65rem]"
                disabled={draftName.trim().length === 0}
              >
                ✨ !בואי נתחיל את ההרפתקה
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default HomeScreen
