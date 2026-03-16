import { useId } from 'react'

export interface CharacterSvgProps {
  className?: string
}

type HarryMood = 'idle' | 'celebrate' | 'thinking' | 'pointing'
type HermioneMood = 'idle' | 'celebrate' | 'teaching' | 'encouraging'
type RonMood = 'idle' | 'celebrate' | 'encouraging' | 'surprised'
type DumbledoreMood = 'idle' | 'celebrate' | 'proud'
type HedwigMood = 'idle' | 'flying' | 'delivering'

function Sparkle({
  x,
  y,
  scale = 1,
  rotate = 0,
  fill = '#FFE59A',
  opacity = 1,
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  fill?: string
  opacity?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      <path d="M0 -10 L2.8 -2.8 L10 0 L2.8 2.8 L0 10 L-2.8 2.8 L-10 0 L-2.8 -2.8 Z" fill={fill} />
      <circle cx="0" cy="0" r="2.4" fill="#FFF8D5" />
    </g>
  )
}

function Wand({
  x1,
  y1,
  x2,
  y2,
  sparkle = false,
  sparkleColor = '#FFE59A',
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  sparkle?: boolean
  sparkleColor?: string
}) {
  return (
    <g>
      <path d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke="#6F3F1F" strokeWidth="5" strokeLinecap="round" />
      <path d={`M ${x1 + 2} ${y1 + 2} L ${x2 + 2} ${y2 + 2}`} stroke="#C79A63" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
      {sparkle && (
        <>
          <Sparkle x={x2} y={y2} scale={0.55} fill={sparkleColor} />
          <Sparkle x={x2 + 10} y={y2 - 8} scale={0.28} rotate={14} fill="#FFFFFF" />
          <circle cx={x2 - 7} cy={y2 + 7} r="2.3" fill={sparkleColor} opacity="0.78" />
        </>
      )}
    </g>
  )
}

function ClosedBook({ x, y, scale = 1, rotate = 0 }: { x: number; y: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <rect x="0" y="0" width="36" height="44" rx="8" fill="#6E3427" />
      <rect x="5" y="3" width="26" height="38" rx="6" fill="#8D4A32" />
      <rect x="12" y="7" width="17" height="30" rx="3" fill="#F5E4B7" />
      <path d="M18 7 V37" stroke="#D1B67B" strokeWidth="1.5" opacity="0.6" />
      <path d="M10 16 H25" stroke="#B0884E" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
      <path d="M10 24 H23" stroke="#B0884E" strokeWidth="1.5" strokeLinecap="round" opacity="0.46" />
      <path d="M10 31 H24" stroke="#B0884E" strokeWidth="1.5" strokeLinecap="round" opacity="0.46" />
    </g>
  )
}

function OpenBook({ x, y, scale = 1, rotate = 0 }: { x: number; y: number; scale?: number; rotate?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M2 12 C2 6.5, 6 2, 12 2 H24 C28.5 2, 31.5 4.2, 34 8 C36.5 4.2, 39.5 2, 44 2 H56 C62 2, 66 6.5, 66 12 V40 C66 46, 62 50, 56 50 H45 C40 50, 37 48.4, 34 44.5 C31 48.4, 28 50, 23 50 H12 C6 50, 2 46, 2 40 V12 Z" fill="#F9ECCC" />
      <path d="M34 8 V44" stroke="#D4BE8D" strokeWidth="2" />
      <path d="M9 15 H26" stroke="#C79E62" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      <path d="M9 23 H24" stroke="#C79E62" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M9 31 H25" stroke="#C79E62" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M42 15 H58" stroke="#C79E62" strokeWidth="2" strokeLinecap="round" opacity="0.65" />
      <path d="M42 23 H56" stroke="#C79E62" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M42 31 H57" stroke="#C79E62" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M2 12 C2 6.5, 6 2, 12 2 H24 C29 2, 31.5 4.4, 34 8 C36.5 4.4, 39 2, 44 2 H56 C62 2, 66 6.5, 66 12" stroke="#996533" strokeWidth="2" strokeLinejoin="round" />
    </g>
  )
}

function SpeechBubble({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M4 0 H34 C39.5 0, 44 4.5, 44 10 V19 C44 24.5, 39.5 29, 34 29 H18 L8 37 L10 29 H4 C-1.5 29 -6 24.5 -6 19 V10 C-6 4.5 -1.5 0 4 0 Z" fill="#FFF6DA" stroke="#D4A843" strokeWidth="2" />
      <Sparkle x={10} y={14} scale={0.28} rotate={12} fill="#D3A625" />
      <Sparkle x={22} y={12} scale={0.2} rotate={-14} fill="#7EB8FF" />
      <circle cx="30" cy="16" r="3" fill="#D3A625" opacity="0.8" />
    </g>
  )
}

function HarrySvg({ mood, className }: { mood: HarryMood; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    skin: `harry-skin-${uid}`,
    robe: `harry-robe-${uid}`,
    scarf: `harry-scarf-${uid}`,
    hair: `harry-hair-${uid}`,
    glow: `harry-glow-${uid}`,
    iris: `harry-iris-${uid}`,
  }

  const isCelebrate = mood === 'celebrate'
  const isThinking = mood === 'thinking'
  const isPointing = mood === 'pointing'

  return (
    <svg viewBox="0 0 200 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={ids.skin} x1="74" y1="48" x2="126" y2="148" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE5CB" />
          <stop offset="1" stopColor="#F1B585" />
        </linearGradient>
        <linearGradient id={ids.robe} x1="70" y1="132" x2="136" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2C2254" />
          <stop offset="1" stopColor="#11091D" />
        </linearGradient>
        <linearGradient id={ids.scarf} x1="74" y1="122" x2="124" y2="190" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#8A0404" />
          <stop offset="0.52" stopColor="#740001" />
          <stop offset="1" stopColor="#D3A625" />
        </linearGradient>
        <linearGradient id={ids.hair} x1="61" y1="40" x2="135" y2="102" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#34343A" />
          <stop offset="0.55" stopColor="#101117" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 101) rotate(90) scale(108 82)">
          <stop offset="0" stopColor="#F6D978" stopOpacity="0.36" />
          <stop offset="0.6" stopColor="#7EB8FF" stopOpacity="0.12" />
          <stop offset="1" stopColor="#7EB8FF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.iris} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(90 91) rotate(90) scale(12)">
          <stop offset="0" stopColor="#7BC274" />
          <stop offset="1" stopColor="#234321" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="250" rx="45" ry="12" fill="#140A21" opacity="0.22" />
      <circle cx="100" cy="102" r="88" fill={`url(#${ids.glow})`} />
      {isCelebrate && (
        <>
          <Sparkle x={37} y={44} scale={0.72} rotate={8} fill="#FCE588" />
          <Sparkle x={160} y={38} scale={0.62} rotate={-8} fill="#8FD5FF" />
          <Sparkle x={150} y={90} scale={0.4} fill="#FFE59A" />
        </>
      )}

      <g transform={`translate(0 ${isCelebrate ? -12 : isThinking ? 4 : 0})`}>
        <path d="M60 166 C48 186, 48 213, 55 238 C83 253, 117 253, 145 238 C152 212, 152 186, 140 166 C128 147, 114 138, 100 138 C86 138, 72 147, 60 166 Z" fill={`url(#${ids.robe})`} stroke="#2E173B" strokeWidth="2.5" />
        <path d="M77 139 H124 L120 166 H82 L77 139 Z" fill={`url(#${ids.scarf})`} />
        <path d="M90 166 L86 226" stroke="#D3A625" strokeWidth="7" strokeLinecap="round" />
        <path d={isCelebrate ? 'M114 165 L134 206' : 'M110 165 L114 223'} stroke="#740001" strokeWidth="11" strokeLinecap="round" />
        <path d={isCelebrate ? 'M115 164 L127 194' : 'M110 164 L112 214'} stroke="#D3A625" strokeWidth="3.5" strokeLinecap="round" opacity="0.92" />

        {!isThinking && !isPointing && !isCelebrate && (
          <>
            <path d="M68 156 Q54 184 56 211" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="56" cy="211" r="8" fill={`url(#${ids.skin})`} />
            <path d="M132 156 Q146 178 152 195" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="152" cy="195" r="8" fill={`url(#${ids.skin})`} />
            <Wand x1={151} y1={196} x2={170} y2={220} sparkle={false} />
          </>
        )}

        {isCelebrate && (
          <>
            <path d="M69 156 Q48 129 44 102" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="44" cy="101" r="8" fill={`url(#${ids.skin})`} />
            <path d="M131 156 Q148 128 156 106" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="156" cy="106" r="8" fill={`url(#${ids.skin})`} />
            <Wand x1={156} y1={106} x2={171} y2={76} sparkle sparkleColor="#FCE588" />
          </>
        )}

        {isThinking && (
          <>
            <path d="M68 156 Q59 171 74 191" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="74" cy="192" r="8" fill={`url(#${ids.skin})`} />
            <path d="M132 156 Q120 150 118 135" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="118" cy="134" r="8" fill={`url(#${ids.skin})`} />
            <Wand x1={72} y1={194} x2={63} y2={224} sparkle={false} />
          </>
        )}

        {isPointing && (
          <>
            <path d="M68 156 Q56 175 58 203" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="58" cy="203" r="8" fill={`url(#${ids.skin})`} />
            <path d="M132 156 Q155 144 170 136" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="170" cy="136" r="8" fill={`url(#${ids.skin})`} />
            <Wand x1={171} y1={136} x2={190} y2={128} sparkle sparkleColor="#F6E29B" />
          </>
        )}

        <ellipse cx="100" cy="88" rx="43" ry="47" fill={`url(#${ids.skin})`} stroke="#E1A06F" strokeWidth="2" />
        <circle cx="74" cy="93" r="5.5" fill="#EAA6A0" opacity="0.45" />
        <circle cx="126" cy="93" r="5.5" fill="#EAA6A0" opacity="0.45" />

        <path d="M58 66 C60 42, 80 30, 99 30 C120 30, 136 43, 140 68 C132 58, 127 55, 119 52 C116 59, 111 62, 104 60 C99 66, 94 69, 86 68 C84 61, 78 58, 70 58 C66 59, 62 62, 58 66 Z" fill={`url(#${ids.hair})`} />
        <path d="M59 68 C63 58, 73 53, 80 50 C78 60, 70 67, 59 68 Z" fill="#07080A" opacity="0.86" />
        <path d="M141 68 C137 59, 129 54, 120 51 C123 61, 132 67, 141 68 Z" fill="#07080A" opacity="0.76" />
        <path d="M103 46 L97 55 L104 55 L100 63" stroke="#D3A625" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="83" cy="89" r="12" stroke="#1F1411" strokeWidth="3" />
        <circle cx="117" cy="89" r="12" stroke="#1F1411" strokeWidth="3" />
        <path d="M95 89 H105" stroke="#1F1411" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M71 87 Q74 80 80 80" stroke="#5B3422" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M121 80 Q126 80 129 87" stroke="#5B3422" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <ellipse cx="83" cy="90" rx="4.6" ry="5.7" fill={`url(#${ids.iris})`} />
        <ellipse cx="117" cy="90" rx="4.6" ry="5.7" fill={`url(#${ids.iris})`} />
        <circle cx="83" cy="90.5" r="2.4" fill="#17100F" />
        <circle cx="117" cy="90.5" r="2.4" fill="#17100F" />
        <circle cx="81.6" cy="88.8" r="0.9" fill="#FFFFFF" />
        <circle cx="115.6" cy="88.8" r="0.9" fill="#FFFFFF" />
        <path d="M100 93 L97 105 C99.5 107, 102.5 107, 105 104" stroke="#D6986F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d={isCelebrate ? 'M87 113 C94 121, 107 121, 114 113' : isThinking ? 'M90 116 C96 112, 104 112, 110 116' : 'M90 114 C95 118, 105 118, 110 114'} stroke="#8A3A46" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function HermioneSvg({ mood, className }: { mood: HermioneMood; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    skin: `hermione-skin-${uid}`,
    robe: `hermione-robe-${uid}`,
    hair: `hermione-hair-${uid}`,
    glow: `hermione-glow-${uid}`,
    book: `hermione-book-${uid}`,
    iris: `hermione-iris-${uid}`,
  }

  const isCelebrate = mood === 'celebrate'
  const isTeaching = mood === 'teaching'
  const isEncouraging = mood === 'encouraging'

  return (
    <svg viewBox="0 0 200 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={ids.skin} x1="70" y1="48" x2="126" y2="145" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE6D4" />
          <stop offset="1" stopColor="#E9A987" />
        </linearGradient>
        <linearGradient id={ids.robe} x1="60" y1="132" x2="144" y2="246" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3D325F" />
          <stop offset="1" stopColor="#17111E" />
        </linearGradient>
        <linearGradient id={ids.hair} x1="45" y1="46" x2="148" y2="134" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A76830" />
          <stop offset="0.5" stopColor="#7A4323" />
          <stop offset="1" stopColor="#4E2717" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 108) rotate(90) scale(110 88)">
          <stop offset="0" stopColor="#F6D978" stopOpacity="0.34" />
          <stop offset="0.56" stopColor="#F6D978" stopOpacity="0.1" />
          <stop offset="1" stopColor="#F6D978" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={ids.book} x1="0" y1="0" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7C3F36" />
          <stop offset="1" stopColor="#4A241E" />
        </linearGradient>
        <radialGradient id={ids.iris} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(89 92) rotate(90) scale(12)">
          <stop offset="0" stopColor="#745BD8" />
          <stop offset="1" stopColor="#2A1B63" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="252" rx="46" ry="11" fill="#140A21" opacity="0.22" />
      <circle cx="100" cy="104" r="90" fill={`url(#${ids.glow})`} />
      {isCelebrate && (
        <>
          <Sparkle x={36} y={48} scale={0.72} fill="#FFE59A" />
          <Sparkle x={164} y={58} scale={0.58} fill="#8FD5FF" />
        </>
      )}

      <g transform={`translate(0 ${isCelebrate ? -10 : 0})`}>
        <path d="M57 167 C45 188, 47 214, 55 239 C83 255, 117 255, 145 239 C153 213, 155 188, 143 167 C129 146, 114 138, 100 138 C86 138, 71 146, 57 167 Z" fill={`url(#${ids.robe})`} stroke="#281934" strokeWidth="2.5" />
        <path d="M90 140 H112 L108 164 H94 L90 140 Z" fill="#8A0912" />
        <path d="M100 140 L104 164 L100 174 L96 164 L100 140 Z" fill="#D3A625" />

        {!isCelebrate && !isTeaching && !isEncouraging && (
          <>
            <path d="M68 156 Q58 181 57 208" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="57" cy="208" r="8" fill={`url(#${ids.skin})`} />
            <path d="M132 156 Q140 173 148 187" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="149" cy="187" r="8" fill={`url(#${ids.skin})`} />
            <g transform="translate(132 160) rotate(10)">
              <rect x="0" y="0" width="34" height="45" rx="8" fill={`url(#${ids.book})`} />
              <rect x="4.5" y="4" width="24" height="36" rx="5" fill="#F5E4B7" />
              <path d="M16 4 V40" stroke="#D1B67B" strokeWidth="1.5" opacity="0.6" />
              <path d="M10 18 H23" stroke="#B0884E" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
            </g>
          </>
        )}

        {isCelebrate && (
          <>
            <path d="M69 156 Q51 129 49 100" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="49" cy="100" r="8" fill={`url(#${ids.skin})`} />
            <path d="M131 156 Q149 128 151 100" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="151" cy="100" r="8" fill={`url(#${ids.skin})`} />
            <g transform="translate(136 54) rotate(-12)">
              <rect x="0" y="0" width="34" height="45" rx="8" fill={`url(#${ids.book})`} />
              <rect x="4.5" y="4" width="24" height="36" rx="5" fill="#F5E4B7" />
            </g>
            <Sparkle x={151} y={50} scale={0.46} fill="#FFE59A" />
          </>
        )}

        {isTeaching && (
          <>
            <path d="M68 156 Q54 144 46 127" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="46" cy="127" r="8" fill={`url(#${ids.skin})`} />
            <path d="M132 156 Q144 168 147 186" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="147" cy="186" r="8" fill={`url(#${ids.skin})`} />
            <OpenBook x={116} y={162} scale={0.76} rotate={6} />
            <SpeechBubble x={144} y={56} />
          </>
        )}

        {isEncouraging && (
          <>
            <path d="M68 156 Q56 170 50 189" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="49" cy="190" r="8" fill={`url(#${ids.skin})`} />
            <path d="M132 156 Q146 168 152 186" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="153" cy="186" r="8" fill={`url(#${ids.skin})`} />
            <path d="M42 187 H54" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M147 183 H159" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M50 189 V179" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M153 186 V176" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <ClosedBook x={20} y={165} scale={0.72} rotate={-12} />
          </>
        )}

        <path d="M56 79 C56 48, 78 33, 100 33 C122 33, 144 48, 144 79 C144 104, 131 118, 121 124 C114 128, 106 132, 100 132 C94 132, 86 128, 79 124 C69 118, 56 104, 56 79 Z" fill={`url(#${ids.hair})`} />
        <path d="M50 72 C50 43, 73 27, 100 27 C127 27, 150 43, 150 72 C145 61, 136 58, 131 57 C134 69, 129 77, 123 83 C117 76, 109 74, 100 74 C91 74, 82 76, 76 83 C69 76, 66 69, 68 56 C63 58, 55 61, 50 72 Z" fill={`url(#${ids.hair})`} />
        <ellipse cx="100" cy="90" rx="42" ry="45" fill={`url(#${ids.skin})`} stroke="#D89A73" strokeWidth="2" />
        <circle cx="74" cy="95" r="5.7" fill="#F2A1A8" opacity="0.34" />
        <circle cx="126" cy="95" r="5.7" fill="#F2A1A8" opacity="0.34" />
        <path d="M73 83 Q79 79 86 82" stroke="#6A351C" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M114 82 Q121 79 127 83" stroke="#6A351C" strokeWidth="2.4" strokeLinecap="round" />
        <ellipse cx="84" cy="92" rx="6" ry="7" fill={`url(#${ids.iris})`} />
        <ellipse cx="116" cy="92" rx="6" ry="7" fill={`url(#${ids.iris})`} />
        <circle cx="84" cy="93" r="2.5" fill="#16101A" />
        <circle cx="116" cy="93" r="2.5" fill="#16101A" />
        <circle cx="82.2" cy="91.1" r="1" fill="#FFFFFF" />
        <circle cx="114.2" cy="91.1" r="1" fill="#FFFFFF" />
        <path d="M100 95 L98 107 C100.4 109, 103 109, 105 106" stroke="#DA9A74" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d={isTeaching ? 'M89 116 C95 111, 105 111, 112 116' : isCelebrate ? 'M86 114 C94 123, 106 123, 114 114' : 'M90 114 C96 118, 104 118, 110 114'} stroke="#944460" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

function RonSvg({ mood, className }: { mood: RonMood; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    skin: `ron-skin-${uid}`,
    robe: `ron-robe-${uid}`,
    hair: `ron-hair-${uid}`,
    glow: `ron-glow-${uid}`,
    iris: `ron-iris-${uid}`,
  }

  const isCelebrate = mood === 'celebrate'
  const isEncouraging = mood === 'encouraging'
  const isSurprised = mood === 'surprised'

  return (
    <svg viewBox="0 0 200 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={ids.skin} x1="72" y1="46" x2="126" y2="146" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE1C7" />
          <stop offset="1" stopColor="#EDB089" />
        </linearGradient>
        <linearGradient id={ids.robe} x1="59" y1="132" x2="146" y2="248" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4B2E5B" />
          <stop offset="1" stopColor="#1A1220" />
        </linearGradient>
        <linearGradient id={ids.hair} x1="66" y1="42" x2="138" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFB062" />
          <stop offset="0.58" stopColor="#E36E2B" />
          <stop offset="1" stopColor="#A23B17" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 108) rotate(90) scale(108 86)">
          <stop offset="0" stopColor="#F6D978" stopOpacity="0.24" />
          <stop offset="1" stopColor="#F6D978" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.iris} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(88 92) rotate(90) scale(12)">
          <stop offset="0" stopColor="#75B0FF" />
          <stop offset="1" stopColor="#234382" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="252" rx="46" ry="11" fill="#140A21" opacity="0.22" />
      <circle cx="100" cy="104" r="90" fill={`url(#${ids.glow})`} />
      {isCelebrate && <Sparkle x={160} y={44} scale={0.58} fill="#FFE59A" />}

      <g transform={`translate(0 ${isCelebrate ? -8 : isEncouraging ? 4 : 0})`}>
        <path d="M54 168 C42 190, 45 218, 53 240 C81 255, 119 255, 147 240 C155 217, 158 190, 146 168 C132 146, 116 137, 100 137 C84 137, 68 146, 54 168 Z" fill={`url(#${ids.robe})`} stroke="#2F1838" strokeWidth="2.5" />
        <path d="M83 142 H117 L112 171 H88 L83 142 Z" fill="#7A1A1A" opacity="0.88" />
        <path d="M100 142 L104 170 L100 179 L96 170 L100 142 Z" fill="#D3A625" />

        {!isCelebrate && !isEncouraging && !isSurprised && (
          <>
            <path d="M70 160 Q64 184 66 210" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
            <path d="M130 160 Q136 184 134 210" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" opacity="0.9" />
          </>
        )}

        {isCelebrate && (
          <>
            <path d="M70 158 Q52 131 50 109" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="50" cy="109" r="8" fill={`url(#${ids.skin})`} />
            <path d="M130 158 Q149 132 153 96" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="153" cy="96" r="8" fill={`url(#${ids.skin})`} />
            <path d="M148 90 L159 101" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M153 96 V82" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
          </>
        )}

        {isEncouraging && (
          <>
            <path d="M70 158 Q56 176 50 192" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="49" cy="192" r="8" fill={`url(#${ids.skin})`} />
            <path d="M130 158 Q144 176 150 192" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="151" cy="192" r="8" fill={`url(#${ids.skin})`} />
            <path d="M41 191 H54" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M146 191 H159" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M49 193 V182" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
            <path d="M151 193 V182" stroke="#F5D0A9" strokeWidth="7" strokeLinecap="round" />
          </>
        )}

        {isSurprised && (
          <>
            <path d="M70 158 Q56 145 50 129" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="49" cy="129" r="8" fill={`url(#${ids.skin})`} />
            <path d="M130 158 Q144 145 150 129" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="151" cy="129" r="8" fill={`url(#${ids.skin})`} />
          </>
        )}

        <path d="M66 66 C66 43, 84 32, 100 32 C116 32, 134 43, 134 66 C138 71, 140 77, 140 86 C140 111, 122 128, 100 128 C78 128, 60 111, 60 86 C60 77, 62 71, 66 66 Z" fill={`url(#${ids.skin})`} stroke="#D49674" strokeWidth="2" />
        <path d="M63 70 C66 44, 86 31, 100 31 C114 31, 134 44, 137 70 C132 61, 124 55, 116 53 C112 61, 104 66, 95 66 C86 66, 77 62, 70 56 C65 58, 62 62, 63 70 Z" fill={`url(#${ids.hair})`} />
        <path d="M67 68 C75 67, 82 61, 85 53 C78 55, 71 60, 67 68 Z" fill="#B54819" opacity="0.72" />
        <path d="M133 68 C126 66, 119 60, 116 52 C123 54, 130 59, 133 68 Z" fill="#B54819" opacity="0.72" />
        <path d="M73 84 Q79 80 86 83" stroke="#8D4A29" strokeWidth="2.3" strokeLinecap="round" />
        <path d="M114 83 Q121 80 127 84" stroke="#8D4A29" strokeWidth="2.3" strokeLinecap="round" />
        <ellipse cx="84" cy="92" rx="6.2" ry={isSurprised ? 8 : 6.8} fill={`url(#${ids.iris})`} />
        <ellipse cx="116" cy="92" rx="6.2" ry={isSurprised ? 8 : 6.8} fill={`url(#${ids.iris})`} />
        <circle cx="84" cy="93" r="2.5" fill="#151016" />
        <circle cx="116" cy="93" r="2.5" fill="#151016" />
        <circle cx="82.3" cy="91.1" r="1" fill="#FFFFFF" />
        <circle cx="114.3" cy="91.1" r="1" fill="#FFFFFF" />
        <circle cx="75" cy="100" r="1.1" fill="#C67759" />
        <circle cx="71" cy="103.5" r="1.2" fill="#C67759" />
        <circle cx="79" cy="104.5" r="1.1" fill="#C67759" />
        <circle cx="125" cy="100" r="1.1" fill="#C67759" />
        <circle cx="129" cy="103.5" r="1.2" fill="#C67759" />
        <circle cx="121" cy="104.5" r="1.1" fill="#C67759" />
        <path d="M100 95 L98 106 C100 108, 103 108, 105 106" stroke="#D59674" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d={isSurprised ? 'M100 116 C103.5 116, 106 118.5, 106 122 C106 125.5, 103.5 128, 100 128 C96.5 128, 94 125.5, 94 122 C94 118.5, 96.5 116, 100 116 Z' : isCelebrate ? 'M86 114 C93 124, 107 124, 114 114' : 'M89 114 C95 119, 105 119, 111 114'} stroke="#8B4351" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill={isSurprised ? '#F6B2AF' : 'none'} />
      </g>
    </svg>
  )
}

function DumbledoreSvg({ mood, className }: { mood: DumbledoreMood; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    skin: `dumbledore-skin-${uid}`,
    robe: `dumbledore-robe-${uid}`,
    beard: `dumbledore-beard-${uid}`,
    hat: `dumbledore-hat-${uid}`,
    glow: `dumbledore-glow-${uid}`,
  }

  const isCelebrate = mood === 'celebrate'
  const isProud = mood === 'proud'

  return (
    <svg viewBox="0 0 200 280" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={ids.skin} x1="74" y1="52" x2="128" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFE5D1" />
          <stop offset="1" stopColor="#EAB18D" />
        </linearGradient>
        <linearGradient id={ids.robe} x1="52" y1="112" x2="154" y2="246" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6A4AC4" />
          <stop offset="0.52" stopColor="#4F2E8A" />
          <stop offset="1" stopColor="#24133F" />
        </linearGradient>
        <linearGradient id={ids.beard} x1="72" y1="92" x2="128" y2="228" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C8D3E4" />
        </linearGradient>
        <linearGradient id={ids.hat} x1="72" y1="18" x2="129" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#7F62D8" />
          <stop offset="1" stopColor="#381E72" />
        </linearGradient>
        <radialGradient id={ids.glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 102) rotate(90) scale(116 90)">
          <stop offset="0" stopColor="#F7E28D" stopOpacity="0.42" />
          <stop offset="0.5" stopColor="#8FD5FF" stopOpacity="0.16" />
          <stop offset="1" stopColor="#8FD5FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="252" rx="48" ry="12" fill="#150B21" opacity="0.22" />
      <circle cx="100" cy="100" r="94" fill={`url(#${ids.glow})`} />
      {(isCelebrate || isProud) && (
        <>
          <Sparkle x={38} y={54} scale={0.78} fill="#FFE59A" />
          <Sparkle x={161} y={46} scale={0.58} fill="#A8E4FF" />
          <Sparkle x={150} y={124} scale={0.34} fill="#FFE59A" />
        </>
      )}

      <g transform={`translate(0 ${isCelebrate ? -10 : isProud ? 6 : 0}) rotate(${isProud ? -2 : 0} 100 170)`}>
        <path d="M58 154 C44 182, 43 216, 55 241 C83 257, 117 257, 145 241 C157 216, 156 182, 142 154 C129 129, 114 117, 100 117 C86 117, 71 129, 58 154 Z" fill={`url(#${ids.robe})`} stroke="#2B1742" strokeWidth="2.5" />
        <path d="M69 129 H131" stroke="#D3A625" strokeWidth="4" strokeLinecap="round" opacity="0.9" />
        <path d="M72 145 C89 137, 112 137, 128 145" stroke="#D3A625" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <Sparkle x={82} y={166} scale={0.22} fill="#FFF0BA" opacity={0.88} />
        <Sparkle x={119} y={180} scale={0.18} fill="#FFF0BA" opacity={0.72} />
        <Sparkle x={102} y={206} scale={0.22} fill="#8FD5FF" opacity={0.82} />

        {!isCelebrate && !isProud && (
          <>
            <path d="M74 153 Q88 176 93 194" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <path d="M126 153 Q112 176 107 194" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="98" cy="197" r="8" fill={`url(#${ids.skin})`} />
            <circle cx="102" cy="197" r="8" fill={`url(#${ids.skin})`} />
          </>
        )}

        {isCelebrate && (
          <>
            <path d="M74 153 Q53 124 42 118" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <path d="M126 153 Q147 124 158 118" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="40" cy="118" r="8" fill={`url(#${ids.skin})`} />
            <circle cx="160" cy="118" r="8" fill={`url(#${ids.skin})`} />
          </>
        )}

        {isProud && (
          <>
            <path d="M74 153 Q60 176 58 195" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="58" cy="195" r="8" fill={`url(#${ids.skin})`} />
            <path d="M126 153 Q115 159 111 177" stroke={`url(#${ids.skin})`} strokeWidth="14" strokeLinecap="round" />
            <circle cx="110" cy="179" r="8" fill={`url(#${ids.skin})`} />
          </>
        )}

        <path d="M96 27 C107 30, 116 42, 114 61 H86 C84 43, 92 31, 96 27 Z" fill={`url(#${ids.hat})`} />
        <path d="M100 18 C113 25, 126 42, 125 61 C117 55, 110 54, 100 55 C90 54, 83 55, 75 61 C74 42, 87 25, 100 18 Z" fill={`url(#${ids.hat})`} />
        <path d="M70 63 C79 56, 90 52, 100 52 C110 52, 121 56, 130 63 C121 65, 111 66, 100 66 C89 66, 79 65, 70 63 Z" fill="#D3A625" opacity="0.9" />

        <ellipse cx="100" cy="88" rx="38" ry="40" fill={`url(#${ids.skin})`} stroke="#D09574" strokeWidth="2" />
        <path d="M74 84 C78 81, 84 81, 88 84" stroke="#6B5E63" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M112 84 C116 81, 122 81, 126 84" stroke="#6B5E63" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M78 90 Q84 86 90 90" stroke="#7D8493" strokeWidth="2" strokeLinecap="round" />
        <path d="M110 90 Q116 86 122 90" stroke="#7D8493" strokeWidth="2" strokeLinecap="round" />
        <path d="M92 89 H108" stroke="#7D8493" strokeWidth="1.8" strokeLinecap="round" />
        <ellipse cx="85" cy="91" rx="5" ry="6.2" fill="#4B5E86" />
        <ellipse cx="115" cy="91" rx="5" ry="6.2" fill="#4B5E86" />
        <circle cx="85" cy="92" r="2.1" fill="#14100F" />
        <circle cx="115" cy="92" r="2.1" fill="#14100F" />
        <circle cx="83.6" cy="90.7" r="0.9" fill="#FFFFFF" />
        <circle cx="113.6" cy="90.7" r="0.9" fill="#FFFFFF" />
        <path d="M100 95 L98 106 C99.5 108.5, 102.5 108.5, 104 106" stroke="#D59C7B" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M88 112 C94 118, 106 118, 112 112" stroke="#A15765" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M78 108 C82 125, 84 150, 82 188 C83 206, 89 226, 100 244 C111 226, 117 206, 118 188 C116 150, 118 125, 122 108 C113 112, 107 114, 100 114 C93 114, 87 112, 78 108 Z" fill={`url(#${ids.beard})`} stroke="#C5D2E0" strokeWidth="2" />
      </g>
    </svg>
  )
}

function HedwigSvg({ mood, className }: { mood: HedwigMood; className?: string }) {
  const uid = useId().replace(/:/g, '')
  const ids = {
    feather: `hedwig-feather-${uid}`,
    shadow: `hedwig-shadow-${uid}`,
    eye: `hedwig-eye-${uid}`,
    glow: `hedwig-glow-${uid}`,
  }

  const isFlying = mood === 'flying'
  const isDelivering = mood === 'delivering'

  return (
    <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={ids.feather} x1="66" y1="34" x2="128" y2="166" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#C7D1DE" />
        </linearGradient>
        <radialGradient id={ids.shadow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 170) rotate(90) scale(11 42)">
          <stop offset="0" stopColor="#140A21" stopOpacity="0.25" />
          <stop offset="1" stopColor="#140A21" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ids.eye} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 82) rotate(90) scale(16)">
          <stop offset="0" stopColor="#FFE5A1" />
          <stop offset="1" stopColor="#D39A22" />
        </radialGradient>
        <radialGradient id={ids.glow} cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 88) rotate(90) scale(88)">
          <stop offset="0" stopColor="#7EB8FF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#7EB8FF" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="100" cy="170" rx="42" ry="11" fill={`url(#${ids.shadow})`} />
      <circle cx="100" cy="88" r="74" fill={`url(#${ids.glow})`} />
      {isDelivering && (
        <>
          <Sparkle x={50} y={72} scale={0.48} fill="#FFE59A" />
          <Sparkle x={154} y={82} scale={0.38} fill="#A8E4FF" />
        </>
      )}

      {!isFlying && !isDelivering && (
        <g transform="translate(0 2)">
          <path d="M66 155 H136" stroke="#6E3B1D" strokeWidth="10" strokeLinecap="round" />
          <path d="M78 154 C74 145, 78 136, 88 134" stroke="#835123" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M132 154 C136 145, 132 136, 122 134" stroke="#835123" strokeWidth="3.2" strokeLinecap="round" />
          <path d="M70 76 C70 48, 84 34, 100 34 C116 34, 130 48, 130 76 C130 98, 122 118, 116 132 C112 140, 107 149, 100 149 C93 149, 88 140, 84 132 C78 118, 70 98, 70 76 Z" fill={`url(#${ids.feather})`} stroke="#CCD5E3" strokeWidth="2" />
          <path d="M64 94 C71 82, 79 78, 89 74 C86 88, 80 102, 67 113" fill="#E7EDF7" />
          <path d="M136 94 C129 82, 121 78, 111 74 C114 88, 120 102, 133 113" fill="#E7EDF7" />
          <ellipse cx="100" cy="83" rx="32" ry="31" fill={`url(#${ids.feather})`} />
          <path d="M84 72 C88 68, 94 66, 100 66 C106 66, 112 68, 116 72" stroke="#B8C4D6" strokeWidth="2" strokeLinecap="round" />
          <ellipse cx="90" cy="82" rx="10.5" ry="11.8" fill={`url(#${ids.eye})`} />
          <ellipse cx="110" cy="82" rx="10.5" ry="11.8" fill={`url(#${ids.eye})`} />
          <circle cx="90" cy="83" r="4.2" fill="#1B130D" />
          <circle cx="110" cy="83" r="4.2" fill="#1B130D" />
          <circle cx="88.4" cy="81.4" r="1.2" fill="#FFFFFF" />
          <circle cx="108.4" cy="81.4" r="1.2" fill="#FFFFFF" />
          <path d="M100 91 L95 97 H105 L100 91 Z" fill="#D49B2A" />
          <path d="M80 94 C86 102, 95 106, 100 106 C105 106, 114 102, 120 94" stroke="#B6C2D2" strokeWidth="2" strokeLinecap="round" />
        </g>
      )}

      {isFlying && (
        <g transform="translate(0 -4)">
          <path d="M45 95 C29 72, 25 51, 31 43 C39 33, 61 42, 79 68 C72 79, 61 88, 45 95 Z" fill="#EEF3FB" stroke="#CAD4E2" strokeWidth="2" />
          <path d="M155 95 C171 72, 175 51, 169 43 C161 33, 139 42, 121 68 C128 79, 139 88, 155 95 Z" fill="#EEF3FB" stroke="#CAD4E2" strokeWidth="2" />
          <path d="M70 106 C70 76, 83 58, 100 58 C117 58, 130 76, 130 106 C130 130, 118 148, 100 148 C82 148, 70 130, 70 106 Z" fill={`url(#${ids.feather})`} stroke="#CAD4E2" strokeWidth="2" />
          <ellipse cx="100" cy="88" rx="28" ry="28" fill={`url(#${ids.feather})`} />
          <ellipse cx="90" cy="86" rx="10.5" ry="11.6" fill={`url(#${ids.eye})`} />
          <ellipse cx="110" cy="86" rx="10.5" ry="11.6" fill={`url(#${ids.eye})`} />
          <circle cx="90" cy="87" r="4.2" fill="#1B130D" />
          <circle cx="110" cy="87" r="4.2" fill="#1B130D" />
          <circle cx="88.5" cy="85.2" r="1.1" fill="#FFFFFF" />
          <circle cx="108.5" cy="85.2" r="1.1" fill="#FFFFFF" />
          <path d="M100 95 L95 101 H105 L100 95 Z" fill="#D49B2A" />
          <path d="M101 95 L123 95" stroke="#D49B2A" strokeWidth="2" strokeLinecap="round" />
          <path d="M123 91 H142 V106 H123 Z" fill="#FFF7E3" stroke="#C49A61" strokeWidth="2" />
          <path d="M127 94 H138" stroke="#D5BA8D" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      )}

      {isDelivering && (
        <g transform="translate(0 -2) rotate(-12 100 100)">
          <path d="M56 118 C36 113, 24 101, 22 88 C20 74, 31 68, 50 76 C64 82, 73 91, 82 101" fill="#EEF4FB" stroke="#CAD4E2" strokeWidth="2" />
          <path d="M144 116 C164 111, 176 99, 178 86 C180 72, 169 66, 150 74 C136 80, 127 89, 118 99" fill="#EEF4FB" stroke="#CAD4E2" strokeWidth="2" />
          <path d="M72 118 C72 86, 84 64, 100 64 C116 64, 128 86, 128 118 C128 141, 117 156, 100 156 C83 156, 72 141, 72 118 Z" fill={`url(#${ids.feather})`} stroke="#CAD4E2" strokeWidth="2" />
          <ellipse cx="100" cy="94" rx="28" ry="28" fill={`url(#${ids.feather})`} />
          <ellipse cx="90" cy="92" rx="10.5" ry="11.6" fill={`url(#${ids.eye})`} />
          <ellipse cx="110" cy="92" rx="10.5" ry="11.6" fill={`url(#${ids.eye})`} />
          <circle cx="90" cy="93" r="4.2" fill="#1B130D" />
          <circle cx="110" cy="93" r="4.2" fill="#1B130D" />
          <circle cx="88.5" cy="91.2" r="1.1" fill="#FFFFFF" />
          <circle cx="108.5" cy="91.2" r="1.1" fill="#FFFFFF" />
          <path d="M100 101 L95 107 H105 L100 101 Z" fill="#D49B2A" />
          <path d="M101 101 L123 101" stroke="#D49B2A" strokeWidth="2" strokeLinecap="round" />
          <path d="M123 97 H143 V112 H123 Z" fill="#FFF7E3" stroke="#C49A61" strokeWidth="2" />
          <path d="M50 145 C44 151, 36 157, 28 162" stroke="#A8E4FF" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 8" opacity="0.88" />
        </g>
      )}
    </svg>
  )
}

export const HarryIdleSvg = (props: CharacterSvgProps) => <HarrySvg mood="idle" {...props} />
export const HarryCelebrateSvg = (props: CharacterSvgProps) => <HarrySvg mood="celebrate" {...props} />
export const HarryThinkingSvg = (props: CharacterSvgProps) => <HarrySvg mood="thinking" {...props} />
export const HarryPointingSvg = (props: CharacterSvgProps) => <HarrySvg mood="pointing" {...props} />

export const HermioneIdleSvg = (props: CharacterSvgProps) => <HermioneSvg mood="idle" {...props} />
export const HermioneCelebrateSvg = (props: CharacterSvgProps) => <HermioneSvg mood="celebrate" {...props} />
export const HermioneTeachingSvg = (props: CharacterSvgProps) => <HermioneSvg mood="teaching" {...props} />
export const HermioneEncouragingSvg = (props: CharacterSvgProps) => <HermioneSvg mood="encouraging" {...props} />

export const RonIdleSvg = (props: CharacterSvgProps) => <RonSvg mood="idle" {...props} />
export const RonCelebrateSvg = (props: CharacterSvgProps) => <RonSvg mood="celebrate" {...props} />
export const RonEncouragingSvg = (props: CharacterSvgProps) => <RonSvg mood="encouraging" {...props} />
export const RonSurprisedSvg = (props: CharacterSvgProps) => <RonSvg mood="surprised" {...props} />

export const DumbledoreIdleSvg = (props: CharacterSvgProps) => <DumbledoreSvg mood="idle" {...props} />
export const DumbledoreCelebrateSvg = (props: CharacterSvgProps) => <DumbledoreSvg mood="celebrate" {...props} />
export const DumbledoreProudSvg = (props: CharacterSvgProps) => <DumbledoreSvg mood="proud" {...props} />

export const HedwigIdleSvg = (props: CharacterSvgProps) => <HedwigSvg mood="idle" {...props} />
export const HedwigFlyingSvg = (props: CharacterSvgProps) => <HedwigSvg mood="flying" {...props} />
export const HedwigDeliveringSvg = (props: CharacterSvgProps) => <HedwigSvg mood="delivering" {...props} />
