import { motion } from 'framer-motion'
import type { Question } from '../types/game'

interface QuestionCardProps {
  question: Question
  currentInput: string
  questionIndex: number
  highlight?: boolean
}

function QuestionCard({ question, currentInput, questionIndex, highlight = true }: QuestionCardProps) {
  return (
    <motion.div
      key={`${questionIndex}-${question.a}-${question.b}`}
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 180, damping: 16 }}
      className={`parchment-card relative px-6 py-8 text-center shadow-[0_20px_60px_rgba(10,6,18,0.35)] md:px-8 md:py-10 ${highlight ? 'spell-glow' : ''}`}
    >
      <div className="absolute inset-x-8 top-3 h-px bg-gradient-to-r from-transparent via-hp-gold/60 to-transparent" />
      <p className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-hp-gryffindorRed/70">שיעור הכישוף הנוכחי</p>

      <div className="mb-3 text-hp-royalPurple/75">חשבי לאט, הקסם כבר יגיע</div>

      <div className="math-expr text-[clamp(3rem,8vw,4.8rem)] font-black leading-none text-hp-deepPurple drop-shadow-[0_6px_18px_rgba(45,27,105,0.18)]">
        {question.a} + {question.b} ={' '}
        <span className="inline-flex min-w-[1.5ch] justify-center rounded-2xl border-2 border-dashed border-hp-gold/45 bg-white/45 px-3 py-1 text-hp-gryffindorRed shadow-[0_0_30px_rgba(245,197,66,0.2)]">
          {currentInput || '?'}
        </span>
      </div>
    </motion.div>
  )
}

export default QuestionCard
