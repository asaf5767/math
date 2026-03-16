import type { Transition, Variants } from 'framer-motion'

export interface RtlAnimationContext {
  isRtl?: boolean
  distance?: number
}

const resolveDistance = (context?: RtlAnimationContext) => context?.distance ?? 40
const resolveDirection = (context?: RtlAnimationContext) => (context?.isRtl ? -1 : 1)

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 16 },
}

export const slideFromRight: Variants = {
  hidden: (context?: RtlAnimationContext) => ({
    opacity: 0,
    x: resolveDirection(context) * resolveDistance(context),
  }),
  visible: { opacity: 1, x: 0 },
  exit: (context?: RtlAnimationContext) => ({
    opacity: 0,
    x: resolveDirection(context) * (resolveDistance(context) / 2),
  }),
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.94 },
}

export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 18 },
  visible: { opacity: 1, scale: [0.7, 1.08, 0.97, 1], y: [18, -8, 0] },
  exit: { opacity: 0, scale: 0.92 },
}

export const sparkle: Variants = {
  hidden: { opacity: 0, scale: 0.6, rotate: -12 },
  visible: {
    opacity: [0, 1, 0.8, 1],
    scale: [0.6, 1.2, 0.96, 1],
    rotate: [-12, 8, -4, 0],
  },
  exit: { opacity: 0, scale: 0.8 },
}

export const float: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: [0, -10, 0],
  },
  exit: { opacity: 0, y: 8 },
}

export const shake: Variants = {
  hidden: { x: 0 },
  visible: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
  },
  exit: { x: 0 },
}

export const snappy: Transition = {
  duration: 0.2,
  ease: 'easeOut',
}

export const smooth: Transition = {
  duration: 0.4,
  ease: [0.22, 1, 0.36, 1],
}

export const bouncy: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 16,
  mass: 0.8,
}

export const magical: Transition = {
  type: 'spring',
  stiffness: 150,
  damping: 12,
  mass: 0.9,
}
