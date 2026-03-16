import { motion } from 'framer-motion'
import { useState } from 'react'
import { SPELL_LIST } from '../game/spells'
import { useSound } from '../hooks/useSound'
import he from '../i18n/he'
import { PotionIcon, SortingHatIcon, SpellIllustration, WandIcon } from './MagicIcons'
import MagicParticles from './MagicParticles'

interface SpellBookProps {
  unlockedSpells: string[]
  onBack: () => void
}

function SpellBook({ unlockedSpells, onBack }: SpellBookProps) {
  const [activeSpellId, setActiveSpellId] = useState<string | null>(null)
  const [sparkleTrigger, setSparkleTrigger] = useState(0)
  const { playHover } = useSound()

  const handleSpellTap = (spellId: string) => {
    if (!unlockedSpells.includes(spellId)) {
      return
    }

    setActiveSpellId(spellId)
    setSparkleTrigger((currentValue) => currentValue + 1)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 22, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[34px] border border-hp-gold/35 shadow-[0_24px_80px_rgba(10,6,18,0.32)]"
      >
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/backgrounds/spell-book-bg.jpg')" }} />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,6,18,0.9)_8%,rgba(26,10,46,0.76)_56%,rgba(10,6,18,0.44)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(245,197,66,0.24),transparent_24%),radial-gradient(circle_at_82%_12%,rgba(126,184,255,0.18),transparent_18%)]" />

        <div className="relative flex flex-col gap-5 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8">
          <div className="max-w-[470px] text-start">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.45em] text-hp-gold/85">Arcane Collection</p>
            <h2 className="magic-title text-[clamp(2.8rem,9vw,5rem)]">{he.spellBook.title}</h2>
            <p className="mt-3 text-lg leading-8 text-hp-parchment/88">{he.spellBook.subtitle}</p>
          </div>

          <div className="flex items-center gap-3 rounded-[28px] border border-hp-gold/35 bg-hp-shadow/55 px-4 py-4 backdrop-blur-md">
            <div className="rounded-full bg-hp-gold/15 p-3 shadow-[0_0_24px_rgba(245,197,66,0.2)]">
              <PotionIcon size={34} />
            </div>
            <div className="text-start">
              <div className="text-sm font-black uppercase tracking-[0.28em] text-hp-gold/85">Spell pages</div>
              <div className="mt-1 text-xl font-black text-hp-parchment">{unlockedSpells.length} דפים פתוחים כבר זוהרים</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {SPELL_LIST.map((spell, index) => {
          const unlocked = unlockedSpells.includes(spell.id)
          const isActive = activeSpellId === spell.id

          return (
            <motion.button
              key={spell.id}
              type="button"
              disabled={!unlocked}
              onClick={() => handleSpellTap(spell.id)}
              onMouseEnter={() => playHover({ volume: 0.4 })}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={unlocked ? { y: -5, scale: 1.01 } : undefined}
              className={`parchment-card relative min-h-[240px] overflow-hidden rounded-[28px] px-5 py-5 text-start shadow-[0_18px_60px_rgba(10,6,18,0.28)] ${unlocked ? 'spell-glow' : 'grayscale-[0.85] opacity-70'} ${isActive ? 'ring-2 ring-hp-warmGold/55' : ''}`}
            >
              <MagicParticles trigger={isActive ? sparkleTrigger : 0} />
              <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(126,184,255,0.9)_0%,rgba(245,197,66,1)_100%)]" />

              <div className="flex items-center justify-between gap-3">
                <div className="rounded-[24px] bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.18),transparent_58%),linear-gradient(180deg,rgba(45,27,105,0.08),rgba(26,10,46,0.03))] p-3 shadow-[0_12px_30px_rgba(10,6,18,0.12)]">
                  {unlocked ? <SpellIllustration spellId={spell.id} size={72} /> : <SortingHatIcon size={72} />}
                </div>
                <div className="rounded-full border border-hp-gold/35 bg-white/45 px-3 py-1 text-xs font-black uppercase tracking-[0.28em] text-hp-gryffindorRed/70">
                  {unlocked ? 'נפתח' : 'נעול'}
                </div>
              </div>

              <h3 className="mt-5 text-2xl font-black text-hp-deepPurple">{unlocked ? spell.nameHe : '🔒 עוד לא נפתח'}</h3>
              <p className="mt-3 text-base leading-7 text-hp-royalPurple/80">
                {unlocked ? spell.description : 'המשיכי לאסוף כוכבים בטירה, והספר יפתח את הדף הזה ברגע הנכון.'}
              </p>
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={onBack}
          onMouseEnter={() => playHover({ volume: 0.4 })}
          whileHover={{ scale: 1.03, y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="magic-button inline-flex items-center gap-3 text-xl"
        >
          <WandIcon size={24} />
          חזרה למפת השנים
        </motion.button>
      </div>
    </div>
  )
}

export default SpellBook
