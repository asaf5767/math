import { useId } from 'react'

export interface IconProps {
  size?: number
  className?: string
}

interface SpellIllustrationProps extends IconProps {
  spellId: string
}

function GlowStar({ x, y, scale = 1, rotate = 0, fill = '#FFE8A3' }: { x: number; y: number; scale?: number; rotate?: number; fill?: string }) {
  return (
    <path
      d="M0 -8 L2.3 -2.3 L8 0 L2.3 2.3 L0 8 L-2.3 2.3 L-8 0 L-2.3 -2.3 Z"
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
      fill={fill}
    />
  )
}

export function WandIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const glow = `wand-glow-${uid}`
  const wood = `wand-wood-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id={glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(48 14) rotate(90) scale(14)">
          <stop offset="0" stopColor="#FFF4BF" />
          <stop offset="1" stopColor="#FFF4BF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={wood} x1="16" y1="48" x2="48" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6E3B1D" />
          <stop offset="1" stopColor="#C28D55" />
        </linearGradient>
      </defs>
      <circle cx="48" cy="14" r="12" fill={`url(#${glow})`} />
      <path d="M15 49 L47 17" stroke={`url(#${wood})`} strokeWidth="5" strokeLinecap="round" />
      <path d="M14 50 L22 42" stroke="#2F160D" strokeWidth="1.6" strokeLinecap="round" opacity="0.4" />
      <GlowStar x={48} y={14} scale={1.05} fill="#FCE588" />
      <GlowStar x={54} y={8} scale={0.44} rotate={15} fill="#FFFFFF" />
      <GlowStar x={40} y={22} scale={0.38} rotate={-18} fill="#FFE8A3" />
    </svg>
  )
}

export function SnitchIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const metal = `snitch-metal-${uid}`
  const wing = `snitch-wing-${uid}`
  const shadow = `snitch-shadow-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id={metal} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(33 27) rotate(90) scale(18)">
          <stop offset="0" stopColor="#FFF5B4" />
          <stop offset="0.58" stopColor="#EAC65B" />
          <stop offset="1" stopColor="#A96E14" />
        </radialGradient>
        <linearGradient id={wing} x1="10" y1="18" x2="54" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="1" stopColor="#BED9FF" stopOpacity="0.72" />
        </linearGradient>
        <radialGradient id={shadow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 53) rotate(90) scale(6 18)">
          <stop offset="0" stopColor="#1A0A2E" stopOpacity="0.34" />
          <stop offset="1" stopColor="#1A0A2E" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="53" rx="18" ry="6" fill={`url(#${shadow})`} />
      <path d="M22 30 C6 18, 3 8, 11 8 C17 8, 23 16, 28 27" fill={`url(#${wing})`} stroke="#F3FAFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 30 C58 18, 61 8, 53 8 C47 8, 41 16, 36 27" fill={`url(#${wing})`} stroke="#F3FAFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="31" r="12.5" fill={`url(#${metal})`} />
      <path d="M24 30.5 C27.5 27, 36.5 27, 40 30.5" stroke="#FFF6C5" strokeWidth="1.8" strokeLinecap="round" opacity="0.82" />
      <path d="M20.5 31 H43.5" stroke="#A96E14" strokeWidth="1.7" strokeLinecap="round" opacity="0.4" />
      <path d="M32 18.5 V43.5" stroke="#FFF0AE" strokeWidth="1.3" strokeLinecap="round" opacity="0.66" />
    </svg>
  )
}

export function SortingHatIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const felt = `hat-felt-${uid}`
  const brim = `hat-brim-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={felt} x1="20" y1="12" x2="42" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A613D" />
          <stop offset="0.56" stopColor="#5D351E" />
          <stop offset="1" stopColor="#2C160B" />
        </linearGradient>
        <linearGradient id={brim} x1="8" y1="44" x2="56" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A1734E" />
          <stop offset="1" stopColor="#4D2B17" />
        </linearGradient>
      </defs>
      <path d="M29 11 C37 12, 45 20, 42 30 C40.4 35.4, 39.5 38.5, 41 43 C35.5 39.4, 29.8 39.5, 24.8 42.5 C24.8 35.3, 22.5 30.3, 24.3 24.4 C25.7 19.7, 27.1 15.5, 29 11 Z" fill={`url(#${felt})`} />
      <path d="M14 46 C19 39.5, 31.5 37.2, 43.5 40 C49.7 41.5, 53.3 44.4, 53 47.5 C52.6 51, 47.4 53.6, 38.7 54.4 C28.6 55.4, 17.8 53.6, 12.2 50.1 C9.2 48.2, 10 45.7, 14 46 Z" fill={`url(#${brim})`} />
      <path d="M24.8 33.6 C28.2 30.6, 35 30.6, 38.2 33.8" stroke="#22110A" strokeWidth="2" strokeLinecap="round" />
      <path d="M25.5 32.5 C27 26.5, 34.4 24.6, 37.8 28.5" stroke="#C39A67" strokeWidth="1.1" strokeLinecap="round" opacity="0.72" />
      <path d="M24.8 38.5 C26.5 42, 37 42, 39.2 37.7" stroke="#1F0C05" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="35.4" r="1.1" fill="#150903" />
      <circle cx="36.4" cy="35.4" r="1.1" fill="#150903" />
    </svg>
  )
}

export function PotionIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const glass = `potion-glass-${uid}`
  const liquid = `potion-liquid-${uid}`
  const cork = `potion-cork-${uid}`
  const glow = `potion-glow-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={glass} x1="20" y1="12" x2="46" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F5FBFF" stopOpacity="0.9" />
          <stop offset="1" stopColor="#C3D8FF" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={liquid} x1="18" y1="24" x2="46" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B879FF" />
          <stop offset="0.5" stopColor="#8D5CFF" />
          <stop offset="1" stopColor="#31D8B1" />
        </linearGradient>
        <linearGradient id={cork} x1="25" y1="8" x2="38" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D9AE70" />
          <stop offset="1" stopColor="#8A5A2A" />
        </linearGradient>
        <radialGradient id={glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 43) rotate(90) scale(17)">
          <stop offset="0" stopColor="#B879FF" stopOpacity="0.4" />
          <stop offset="1" stopColor="#B879FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="43" r="17" fill={`url(#${glow})`} />
      <path d="M26 10 H38 V17 C38 20.5, 40 23.5, 43.5 27.5 C47.4 31.8, 48.8 36.5, 47.3 42.8 C45.6 50, 40.5 54, 32 54 C23.5 54, 18.4 50, 16.7 42.8 C15.2 36.5, 16.6 31.8, 20.5 27.5 C24 23.5, 26 20.5, 26 17 V10 Z" fill={`url(#${glass})`} stroke="#F3F8FF" strokeWidth="2" />
      <path d="M18.8 38.4 C20.4 32.3, 24.8 28.7, 30.6 28 C37.8 27.2, 45.5 31.3, 46 39.4 C46.5 47.5, 41.2 52.2, 31.8 52 C24 51.8, 19.6 46.8, 18.8 38.4 Z" fill={`url(#${liquid})`} opacity="0.95" />
      <path d="M25.4 10 H38.6 V15.8 H25.4 Z" fill={`url(#${cork})`} rx="2" />
      <circle cx="25.5" cy="25" r="2.5" fill="#F6DBFF" opacity="0.75" />
      <circle cx="41.5" cy="20.5" r="1.7" fill="#FCEBFF" opacity="0.88" />
      <circle cx="36.5" cy="26" r="1.3" fill="#FFFFFF" opacity="0.92" />
    </svg>
  )
}

export function ScrollIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const paper = `scroll-paper-${uid}`
  const edge = `scroll-edge-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={paper} x1="11" y1="16" x2="50" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF7DD" />
          <stop offset="1" stopColor="#E8C98B" />
        </linearGradient>
        <linearGradient id={edge} x1="10" y1="12" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A56A2A" />
          <stop offset="1" stopColor="#6A3C13" />
        </linearGradient>
      </defs>
      <path d="M16 16 H47 C50.3 16, 53 18.7, 53 22 V41.5 C53 45.6, 49.6 49, 45.5 49 H15 C11.1 49, 8 45.9, 8 42 C8 38.1, 11.1 35, 15 35 H18.5 V22 C18.5 18.7, 15.8 16, 12.5 16 C14 16, 15 16, 16 16 Z" fill={`url(#${paper})`} stroke={`url(#${edge})`} strokeWidth="2" />
      <path d="M16.5 16 C11.8 16, 8 19.8, 8 24.5 C8 29.2, 11.8 33, 16.5 33" stroke={`url(#${edge})`} strokeWidth="2" />
      <path d="M45.5 49 C49.6 49, 53 45.6, 53 41.5 C53 37.4, 49.6 34, 45.5 34" stroke={`url(#${edge})`} strokeWidth="2" />
      <path d="M23 24 H42" stroke="#A1733B" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      <path d="M23 31 H39" stroke="#A1733B" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <path d="M23 38 H41" stroke="#A1733B" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </svg>
  )
}

export function LightningBoltIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const bolt = `bolt-${uid}`
  const halo = `bolt-halo-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={bolt} x1="18" y1="8" x2="42" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF7C7" />
          <stop offset="0.45" stopColor="#F5C542" />
          <stop offset="1" stopColor="#C97A00" />
        </linearGradient>
        <radialGradient id={halo} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(31 31) rotate(90) scale(20)">
          <stop offset="0" stopColor="#F5C542" stopOpacity="0.4" />
          <stop offset="1" stopColor="#F5C542" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="31" cy="31" r="20" fill={`url(#${halo})`} />
      <path d="M35.5 8 L20.5 31 H30.8 L25.5 56 L43.5 28.7 H33.2 L35.5 8 Z" fill={`url(#${bolt})`} stroke="#FFF0AD" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function StarIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const star = `star-${uid}`
  const halo = `star-halo-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <radialGradient id={halo} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 32) rotate(90) scale(18)">
          <stop offset="0" stopColor="#FFF4C2" stopOpacity="0.44" />
          <stop offset="1" stopColor="#FFF4C2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={star} x1="22" y1="11" x2="41" y2="49" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFF6C8" />
          <stop offset="0.55" stopColor="#FFD86A" />
          <stop offset="1" stopColor="#E5A922" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="18" fill={`url(#${halo})`} />
      <path d="M32 10.5 L37.4 24.1 L52 25.8 L40.9 35.2 L44.2 49.5 L32 42.2 L19.8 49.5 L23.1 35.2 L12 25.8 L26.6 24.1 L32 10.5 Z" fill={`url(#${star})`} stroke="#FFF4BE" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

export function OwlIcon({ size = 64, className }: IconProps) {
  const uid = useId().replace(/:/g, '')
  const feather = `owl-feather-${uid}`
  const eye = `owl-eye-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={feather} x1="18" y1="10" x2="42" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFDF6" />
          <stop offset="1" stopColor="#C9D0DE" />
        </linearGradient>
        <radialGradient id={eye} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(32 27) rotate(90) scale(18)">
          <stop offset="0" stopColor="#FFF7D0" />
          <stop offset="1" stopColor="#F1B93E" />
        </radialGradient>
      </defs>
      <path d="M20 16 C23 10, 28 8, 32 8 C36 8, 41 10, 44 16 L47 22 C50.2 28.6, 50.4 36.2, 47.6 42.7 C44.4 50.1, 38.6 55, 32 55 C25.4 55, 19.6 50.1, 16.4 42.7 C13.6 36.2, 13.8 28.6, 17 22 L20 16 Z" fill={`url(#${feather})`} />
      <path d="M22.2 17.4 L19.5 21" stroke="#B5BECF" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M41.8 17.4 L44.5 21" stroke="#B5BECF" strokeWidth="2.2" strokeLinecap="round" />
      <ellipse cx="25.8" cy="27.5" rx="8.2" ry="8.8" fill={`url(#${eye})`} />
      <ellipse cx="38.2" cy="27.5" rx="8.2" ry="8.8" fill={`url(#${eye})`} />
      <circle cx="25.8" cy="27.8" r="3.3" fill="#23150A" />
      <circle cx="38.2" cy="27.8" r="3.3" fill="#23150A" />
      <circle cx="24.7" cy="26.6" r="1" fill="#FFFFFF" />
      <circle cx="37.1" cy="26.6" r="1" fill="#FFFFFF" />
      <path d="M32 31.5 L29.6 35.6 H34.4 L32 31.5 Z" fill="#D79A2B" />
      <path d="M25 40 C28.8 43.5, 35.2 43.5, 39 40" stroke="#98A3B7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

const spellIconMap = {
  lumos: StarIcon,
  'wingardium-leviosa': WandIcon,
  'expecto-patronum': OwlIcon,
  'marauders-map': ScrollIcon,
  accio: LightningBoltIcon,
  'house-cup': SnitchIcon,
} as const

export function SpellIllustration({ spellId, size = 64, className }: SpellIllustrationProps) {
  const Icon = spellIconMap[spellId as keyof typeof spellIconMap] ?? StarIcon
  return <Icon size={size} className={className} />
}

