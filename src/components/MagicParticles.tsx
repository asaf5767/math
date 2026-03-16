import { useEffect, useMemo, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  drift: number
  rise: number
  size: number
  delay: number
}

interface MagicParticlesProps {
  trigger: number
  count?: number
  className?: string
}

const DURATION_MS = 950

const pseudoRandom = (seed: number) => {
  const value = Math.sin(seed * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

function MagicParticles({ trigger, count = 18, className = '' }: MagicParticlesProps) {
  const [progress, setProgress] = useState(1)

  const particles = useMemo<Particle[]>(() => {
    if (trigger <= 0) {
      return []
    }

    return Array.from({ length: count }, (_, index) => {
      const baseSeed = trigger * 97 + index * 13

      return {
        id: index,
        x: 18 + pseudoRandom(baseSeed + 1) * 64,
        y: 38 + pseudoRandom(baseSeed + 2) * 26,
        drift: (pseudoRandom(baseSeed + 3) - 0.5) * 90,
        rise: 40 + pseudoRandom(baseSeed + 4) * 70,
        size: 4 + pseudoRandom(baseSeed + 5) * 8,
        delay: pseudoRandom(baseSeed + 6) * 0.16,
      }
    })
  }, [count, trigger])

  useEffect(() => {
    if (trigger <= 0) {
      return
    }

    let frameId = 0
    let startTime: number | null = null

    const tick = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
      }

      const nextProgress = Math.min(1, (timestamp - startTime) / DURATION_MS)
      setProgress(nextProgress)

      if (nextProgress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frameId)
    }
  }, [trigger])

  if (particles.length === 0 || progress >= 1) {
    return null
  }

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => {
        const localProgress = Math.max(0, Math.min(1, (progress - particle.delay) / (1 - particle.delay)))
        const opacity = 1 - localProgress
        const translateY = localProgress * particle.rise
        const translateX = Math.sin(localProgress * Math.PI) * particle.drift
        const scale = 0.6 + (1 - localProgress) * 0.9

        return (
          <div
            key={particle.id}
            className="absolute rounded-full bg-hp-gold"
            style={{
              left: `calc(${particle.x}% + ${translateX}px)`,
              top: `calc(${particle.y}% - ${translateY}px)`,
              width: particle.size,
              height: particle.size,
              opacity,
              transform: `translate(-50%, -50%) scale(${scale})`,
              boxShadow: '0 0 10px rgba(245, 197, 66, 0.9), 0 0 22px rgba(245, 197, 66, 0.45)',
            }}
          />
        )
      })}
    </div>
  )
}

export default MagicParticles
