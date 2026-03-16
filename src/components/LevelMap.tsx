import { motion } from 'framer-motion'
import type { Level, LevelProgress } from '../types/game'
import { useSound } from '../hooks/useSound'
import he from '../i18n/he'
import { ScrollIcon, SpellIllustration, WandIcon } from './MagicIcons'
import StarRating from './StarRating'

interface LevelMapProps {
  levels: Level[]
  unlockedLevels: number[]
  completedLevels: Record<number, LevelProgress>
  unlockedSpells: string[]
  currentLevelId: number
  onSelectLevel: (levelId: number) => void
  onOpenSpellBook: () => void
}

function LevelMap({
  levels,
  unlockedLevels,
  completedLevels,
  unlockedSpells,
  currentLevelId,
  onSelectLevel,
  onOpenSpellBook,
}: LevelMapProps) {
  const { playHover } = useSound()

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[34px] border border-hp-gold/35 shadow-[0_24px_80px_rgba(10,6,18,0.32)]"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/backgrounds/hogwarts-express.jpg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,6,18,0.88)_4%,rgba(26,10,46,0.68)_58%,rgba(10,6,18,0.42)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(245,197,66,0.22),transparent_24%),radial-gradient(circle_at_86%_15%,rgba(126,184,255,0.18),transparent_22%)]" />

        <div className="relative flex flex-col gap-5 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="max-w-[470px] text-start">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.45em] text-hp-gold/85">The Great Staircase of Arithmetic</p>
            <h2 className="magic-title text-[clamp(2.7rem,9vw,5rem)]">{he.levelMap.title}</h2>
            <p className="mt-3 text-lg leading-8 text-hp-parchment/88">{he.levelMap.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 rounded-[28px] border border-hp-gold/35 bg-hp-shadow/55 px-4 py-4 backdrop-blur-md">
            <div className="rounded-full bg-hp-gold/15 p-3 shadow-[0_0_24px_rgba(245,197,66,0.2)]">
              <WandIcon size={34} />
            </div>
            <div className="text-start">
              <div className="text-sm font-black uppercase tracking-[0.28em] text-hp-gold/85">Wizard progress</div>
              <div className="mt-1 text-xl font-black text-hp-parchment">{unlockedSpells.length} לחשים כבר נאספו</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.11 } } }}
        className="max-h-[62vh] space-y-4 overflow-y-auto pe-1"
      >
        {levels.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id)
          const stars = completedLevels[level.id]?.stars ?? 0
          const isFocusLevel = currentLevelId === level.id
          const spellEarned = unlockedSpells.includes(level.spellReward.id)

          return (
            <motion.button
              key={level.id}
              type="button"
              disabled={!isUnlocked}
              variants={{ hidden: { opacity: 0, y: 26, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } }}
              whileHover={isUnlocked ? { y: -4, scale: 1.01 } : undefined}
              whileTap={isUnlocked ? { scale: 0.985 } : undefined}
              onClick={() => onSelectLevel(level.id)}
              onMouseEnter={() => playHover({ volume: 0.4 })}
              className={`parchment-card relative block w-full overflow-hidden rounded-[28px] px-6 py-5 text-start shadow-[0_16px_50px_rgba(10,6,18,0.28)] transition ${
                !isUnlocked ? 'level-locked' : ''
              } ${isFocusLevel ? 'spell-glow ring-2 ring-hp-warmGold/60' : ''}`}
            >
              <div className="absolute inset-y-0 start-0 w-2 bg-[linear-gradient(180deg,rgba(245,197,66,0.95)_0%,rgba(123,45,63,0.95)_100%)]" />
              {!isUnlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-hp-shadow/30 backdrop-blur-[1px]">
                  <div className="rounded-full border border-hp-gold/45 bg-hp-shadow/75 px-4 py-2 text-xl text-hp-parchment">🔒</div>
                </div>
              )}

              <div className="flex items-start justify-between gap-4 ps-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[20px] border border-hp-gold/28 bg-hp-shadow/70 p-2 shadow-[0_10px_26px_rgba(10,6,18,0.18)]">
                      <SpellIllustration spellId={level.spellReward.id} size={36} />
                    </div>
                    <div>
                      <div className="text-sm font-black uppercase tracking-[0.32em] text-hp-gryffindorRed/70">שנה {level.id}</div>
                      <h3 className="text-2xl font-black text-hp-deepPurple md:text-[1.75rem]">{level.nameHe}</h3>
                    </div>
                    <span className="rounded-full border border-hp-gold/30 bg-white/50 px-3 py-1 text-2xl shadow-[0_8px_18px_rgba(10,6,18,0.08)]">
                      {level.emoji}
                    </span>
                  </div>

                  <p className="mt-4 text-sm font-semibold text-hp-royalPurple/80">הלחש שמחכה כאן</p>
                  <div className={`mt-2 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ${spellEarned ? 'border-hp-gold/50 bg-hp-gold/15 text-hp-deepPurple' : 'border-hp-stone/25 bg-hp-stone/10 text-hp-stone/80'}`}>
                    <SpellIllustration spellId={level.spellReward.id} size={20} />
                    <span>{level.spellReward.nameHe}</span>
                    {!spellEarned && <span className="opacity-70">• עוד לא הושג</span>}
                  </div>
                </div>

                <div className="shrink-0 text-center">
                  <StarRating stars={stars} />
                  {isFocusLevel && isUnlocked && (
                    <div className="mt-3 rounded-full bg-hp-deepPurple/90 px-4 py-2 text-sm font-black text-hp-parchment shadow-[0_0_24px_rgba(245,197,66,0.25)]">
                      ✨ זה השלב הבא שלך
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={onOpenSpellBook}
          onMouseEnter={() => playHover({ volume: 0.4 })}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="magic-button inline-flex items-center gap-3 text-xl"
        >
          <ScrollIcon size={24} />
          ספר הלחשים
        </motion.button>
      </div>
    </div>
  )
}

export default LevelMap
