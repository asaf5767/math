interface CandleConfig {
  id: number
  left: number
  top: number
  duration: number
  delay: number
  scale: number
}

interface FloatingCandlesProps {
  count?: number
}

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function FloatingCandles({ count = 8 }: FloatingCandlesProps) {
  const candles: CandleConfig[] = Array.from({ length: count }, (_, index) => ({
    id: index,
    left: 6 + pseudoRandom(index + 1) * 88,
    top: 8 + pseudoRandom((index + 1) * 2) * 70,
    duration: 6 + pseudoRandom((index + 1) * 3) * 6,
    delay: pseudoRandom((index + 1) * 4) * 5,
    scale: 0.85 + pseudoRandom((index + 1) * 5) * 0.6,
  }))

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {candles.map((candle) => (
        <div
          key={candle.id}
          className="floating-candle"
          style={{
            left: `${candle.left}%`,
            top: `${candle.top}%`,
            opacity: 0.18 + candle.scale * 0.18,
            transform: `scale(${candle.scale})`,
            animation: `floatCandle ${candle.duration}s ease-in-out ${candle.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default FloatingCandles
