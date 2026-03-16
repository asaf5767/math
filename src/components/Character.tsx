import { AnimatePresence, motion } from 'framer-motion'
import type { ComponentType } from 'react'
import type { CharacterName } from '../types/game'
import { StarIcon } from './MagicIcons'
import {
  DumbledoreCelebrateSvg,
  DumbledoreIdleSvg,
  DumbledoreProudSvg,
  HarryCelebrateSvg,
  HarryIdleSvg,
  HarryPointingSvg,
  HarryThinkingSvg,
  HedwigDeliveringSvg,
  HedwigFlyingSvg,
  HedwigIdleSvg,
  HermioneCelebrateSvg,
  HermioneEncouragingSvg,
  HermioneIdleSvg,
  HermioneTeachingSvg,
  RonCelebrateSvg,
  RonEncouragingSvg,
  RonIdleSvg,
  RonSurprisedSvg,
  type CharacterSvgProps,
} from './characters/CharacterSVGs'

export interface CharacterProps {
  name: CharacterName
  mood: string
  className?: string
}

const characterMap: Record<CharacterName, Record<string, ComponentType<CharacterSvgProps>>> = {
  harry: {
    idle: HarryIdleSvg,
    celebrate: HarryCelebrateSvg,
    thinking: HarryThinkingSvg,
    pointing: HarryPointingSvg,
  },
  hermione: {
    idle: HermioneIdleSvg,
    celebrate: HermioneCelebrateSvg,
    teaching: HermioneTeachingSvg,
    encouraging: HermioneEncouragingSvg,
  },
  ron: {
    idle: RonIdleSvg,
    celebrate: RonCelebrateSvg,
    encouraging: RonEncouragingSvg,
    surprised: RonSurprisedSvg,
  },
  dumbledore: {
    idle: DumbledoreIdleSvg,
    celebrate: DumbledoreCelebrateSvg,
    proud: DumbledoreProudSvg,
  },
  hedwig: {
    idle: HedwigIdleSvg,
    flying: HedwigFlyingSvg,
    delivering: HedwigDeliveringSvg,
  },
}

const defaultMoodByCharacter: Record<CharacterName, string> = {
  harry: 'idle',
  hermione: 'idle',
  ron: 'idle',
  dumbledore: 'idle',
  hedwig: 'idle',
}

const moodAliases: Record<string, string> = {
  teach: 'teaching',
  encourage: 'encouraging',
}

const sparklePositions = [
  { left: '8%', top: '18%', delay: 0 },
  { right: '10%', top: '12%', delay: 0.22 },
  { left: '18%', bottom: '18%', delay: 0.34 },
  { right: '16%', bottom: '12%', delay: 0.48 },
  { left: '42%', top: '4%', delay: 0.14 },
]

function resolveMood(name: CharacterName, mood: string) {
  const normalized = moodAliases[mood] ?? mood
  return characterMap[name][normalized] ? normalized : defaultMoodByCharacter[name]
}

function Character({ name, mood, className }: CharacterProps) {
  const resolvedMood = resolveMood(name, mood)
  const ActiveCharacter = characterMap[name][resolvedMood]
  const showSparkles = resolvedMood === 'celebrate' || resolvedMood === 'delivering'
  const floatAmplitude = name === 'hedwig' ? 10 : 7

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -floatAmplitude, 0] }}
        transition={{ duration: 3.6, ease: 'easeInOut', repeat: Number.POSITIVE_INFINITY }}
        className="relative h-full w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${name}-${resolvedMood}`}
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.03, filter: 'blur(6px)' }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            <ActiveCharacter className="h-full w-full" />
          </motion.div>
        </AnimatePresence>

        {showSparkles && (
          <div className="pointer-events-none absolute inset-0">
            {sparklePositions.map((position, index) => (
              <motion.div
                key={`${position.delay}-${index}`}
                className="absolute"
                style={position}
                animate={{ y: [0, -10, 0], scale: [0.85, 1.12, 0.9], opacity: [0.55, 1, 0.55], rotate: [0, 8, -8, 0] }}
                transition={{ duration: 2.1, delay: position.delay, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
              >
                <StarIcon size={18 + index * 2} className="drop-shadow-[0_0_14px_rgba(245,197,66,0.5)]" />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Character
