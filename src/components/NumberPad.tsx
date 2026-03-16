import { motion } from 'framer-motion'

interface NumberPadProps {
  value: string
  onDigit: (digit: string) => void
  onBackspace: () => void
  onSubmit: () => void
  disabled?: boolean
}

const digitButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

function NumberPad({ value, onDigit, onBackspace, onSubmit, disabled = false }: NumberPadProps) {
  return (
    <div className="number-pad mx-auto w-full max-w-[340px]">
      <div className="mb-4 rounded-[24px] border border-hp-gold/30 bg-hp-shadow/45 px-5 py-4 text-center shadow-[0_12px_30px_rgba(10,6,18,0.35)] backdrop-blur-sm">
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.35em] text-hp-gold/80">תשובה נוכחית</div>
        <div className="math-expr text-5xl font-black text-hp-parchment">{value || '—'}</div>
      </div>

      <div className="grid grid-cols-3 justify-items-center gap-3">
        {digitButtons.map((digit) => (
          <motion.button
            key={digit}
            type="button"
            disabled={disabled}
            whileHover={disabled ? undefined : { y: -3, scale: 1.04 }}
            whileTap={disabled ? undefined : { scale: 0.92 }}
            onClick={() => onDigit(digit)}
            className="numpad-btn shadow-[0_12px_30px_rgba(10,6,18,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {digit}
          </motion.button>
        ))}

        <motion.button
          type="button"
          disabled={disabled}
          whileHover={disabled ? undefined : { y: -3, scale: 1.04 }}
          whileTap={disabled ? undefined : { scale: 0.92 }}
          onClick={() => onDigit('0')}
          className="numpad-btn shadow-[0_12px_30px_rgba(10,6,18,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          0
        </motion.button>

        <motion.button
          type="button"
          disabled={disabled}
          whileHover={disabled ? undefined : { y: -3, scale: 1.04 }}
          whileTap={disabled ? undefined : { scale: 0.92 }}
          onClick={onBackspace}
          className="numpad-btn bg-[linear-gradient(135deg,rgba(74,68,88,0.92)_0%,rgba(26,10,46,0.98)_100%)] shadow-[0_12px_30px_rgba(10,6,18,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ←
        </motion.button>

        <motion.button
          type="button"
          disabled={disabled || value.length === 0}
          whileHover={disabled ? undefined : { y: -3, scale: 1.04 }}
          whileTap={disabled ? undefined : { scale: 0.92 }}
          onClick={onSubmit}
          className="numpad-btn border-hp-warmGold/70 bg-[linear-gradient(135deg,rgba(245,197,66,0.92)_0%,rgba(212,168,67,1)_100%)] text-hp-deepPurple shadow-[0_12px_30px_rgba(245,197,66,0.35)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ✓
        </motion.button>
      </div>
    </div>
  )
}

export default NumberPad
