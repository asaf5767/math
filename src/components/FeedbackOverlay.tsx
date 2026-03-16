import { AnimatePresence, motion } from 'framer-motion'

interface FeedbackOverlayProps {
  state: 'idle' | 'correct' | 'wrong'
  trigger: number
}

const sparkleBursts = [
  { x: -112, y: -58, delay: 0.02, size: 12 },
  { x: -82, y: 32, delay: 0.08, size: 10 },
  { x: -28, y: -82, delay: 0.04, size: 8 },
  { x: 18, y: -96, delay: 0.1, size: 10 },
  { x: 84, y: -42, delay: 0.14, size: 12 },
  { x: 108, y: 26, delay: 0.2, size: 9 },
  { x: 24, y: 76, delay: 0.18, size: 8 },
  { x: -42, y: 86, delay: 0.12, size: 10 },
]

function FeedbackOverlay({ state, trigger }: FeedbackOverlayProps) {
  return (
    <AnimatePresence>
      {state !== 'idle' && (
        <motion.div
          key={`${state}-${trigger}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
        >
          {state === 'correct' ? (
            <motion.div
              initial={{ opacity: 0, y: 26, scale: 0.86 }}
              animate={{ opacity: [0, 1, 1, 0], y: [26, 0, -18, -54], scale: [0.86, 1.02, 1, 0.94] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex min-w-[240px] items-center justify-center"
            >
              {sparkleBursts.map((sparkle, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.2, x: 0, y: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.2, 1.2, 0.4], x: sparkle.x, y: sparkle.y, rotate: [0, 90, 180] }}
                  transition={{ duration: 0.6, delay: sparkle.delay, ease: 'easeOut' }}
                  className="absolute rounded-full bg-hp-warmGold"
                  style={{
                    width: sparkle.size,
                    height: sparkle.size,
                    boxShadow: '0 0 16px rgba(245, 197, 66, 0.85), 0 0 28px rgba(126, 184, 255, 0.35)',
                  }}
                />
              ))}

              <div className="rounded-full border border-hp-warmGold/70 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.55),rgba(245,230,200,0.94)_32%,rgba(123,45,63,0.9)_100%)] px-8 py-4 text-[clamp(2rem,6vw,3.35rem)] font-black text-hp-parchment shadow-[0_20px_60px_rgba(10,6,18,0.34),0_0_24px_rgba(245,197,66,0.28)]">
                !נכון
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.92, 1, 0.98, 0.94], x: [0, -10, 10, -6, 6, 0], y: [0, 0, -8, -14] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.82, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-full border border-hp-parchment/40 bg-hp-shadow/65 px-8 py-4 text-[clamp(1.8rem,5vw,2.8rem)] font-black text-hp-parchment shadow-[0_18px_44px_rgba(10,6,18,0.42)] backdrop-blur-md"
            >
              ננסה שוב
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FeedbackOverlay
