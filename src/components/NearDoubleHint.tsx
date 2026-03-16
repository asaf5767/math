import { motion } from 'framer-motion'
import { decomposeNearDouble } from '../game/nearDoubles'
import type { Question, SessionState } from '../types/game'

interface NearDoubleHintProps {
  question: Question
  hintLevel: SessionState['hintLevel']
}

function NearDoubleHint({ question, hintLevel }: NearDoubleHintProps) {
  if (hintLevel === 'none') {
    return null
  }

  const { base, double, extra } = decomposeNearDouble(question.a, question.b)
  const larger = Math.max(question.a, question.b)

  if (hintLevel === 'partial') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-hp-gold/40 bg-hp-parchment/95 px-4 py-2 text-sm font-black text-hp-deepPurple shadow-[0_10px_24px_rgba(10,6,18,0.18)]"
      >
        <span>🪄 הרמיוני לוחשת</span>
        <span className="math-expr">(+{extra})</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="parchment-card relative overflow-hidden rounded-[28px] px-5 py-5 text-center shadow-[0_16px_50px_rgba(10,6,18,0.22)]"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,rgba(126,184,255,0.95)_0%,rgba(245,197,66,1)_100%)]" />
      <div className="mb-4 flex items-center justify-center gap-3 text-hp-deepPurple">
        <span className="text-4xl">📚</span>
        <div>
          <div className="text-sm font-black uppercase tracking-[0.3em] text-hp-gryffindorRed/70">Hermione's Hint</div>
          <div className="text-lg font-black">בואי נחשוב על זה ככה...</div>
        </div>
      </div>

      <div className="space-y-3 text-hp-deepPurple">
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-white/50 px-4 py-3">
          <div className="math-expr text-2xl font-black">{base} + {base} = {double} ✓</div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }} className="rounded-2xl bg-hp-royalPurple/10 px-4 py-3">
          <div className="math-expr flex items-center justify-center gap-2 text-2xl font-black">
            <span>{base} + {larger} = ?</span>
            <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ delay: 0.45, duration: 0.8 }}>→</motion.span>
            <span>
              {base} +
              <motion.span className="mx-1 inline-block rounded-lg bg-hp-gold/20 px-2" animate={{ y: [0, -6, 0] }} transition={{ delay: 0.42, duration: 0.8 }}>
                {base}
              </motion.span>
              +
              <motion.span className="mx-1 inline-block rounded-lg bg-hp-spellGlow/20 px-2" animate={{ scale: [0.8, 1.15, 1] }} transition={{ delay: 0.58, duration: 0.6 }}>
                {extra}
              </motion.span>
            </span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.34 }} className="rounded-2xl bg-hp-gold/20 px-4 py-4">
          <div className="math-expr text-3xl font-black text-hp-gryffindorRed">{double} + {extra} = {question.answer}!</div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default NearDoubleHint
