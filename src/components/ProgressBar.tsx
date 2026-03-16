import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
}

function ProgressBar({ current, total }: ProgressBarProps) {
  const percent = total === 0 ? 0 : Math.min(100, Math.max(0, (current / total) * 100))

  return (
    <div className="w-full">
      <div className="relative h-4 overflow-hidden rounded-full border border-hp-gold/30 bg-hp-shadow/60 shadow-[inset_0_2px_8px_rgba(10,6,18,0.6)]">
        <motion.div
          className="absolute inset-y-0 right-0 rounded-full bg-[linear-gradient(90deg,rgba(45,27,105,1)_0%,rgba(139,92,246,0.95)_45%,rgba(245,197,66,1)_100%)] progress-fill-rtl shadow-[0_0_24px_rgba(245,197,66,0.35)]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />

        {percent > 0 && (
          <motion.div
            className="absolute top-1/2 size-4 -translate-y-1/2 rounded-full bg-hp-warmGold"
            style={{ right: `calc(${percent}% - 8px)` }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.7, 1, 0.75] }}
            transition={{ duration: 1.3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
        )}
      </div>

      <div className="mt-2 text-center text-sm font-semibold text-hp-parchment/80">
        <span className="math-expr">{current}/{total}</span>
      </div>
    </div>
  )
}

export default ProgressBar
