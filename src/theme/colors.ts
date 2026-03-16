const toCssVariableName = (colorName: string) =>
  colorName.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export const hogwartsColors = {
  // Primary
  deepPurple: '#1a0a2e',
  royalPurple: '#2d1b69',
  midnightBlue: '#0d1b3e',

  // Gold & Warm
  gold: '#d4a843',
  warmGold: '#f5c542',
  parchment: '#f5e6c8',
  cream: '#fdf8ef',

  // Gryffindor
  gryffindorRed: '#7b2d3f',
  scarlet: '#ae0001',

  // Magic
  spellGlow: '#7eb8ff',
  emerald: '#1a5c3a',
  potionPurple: '#8b5cf6',

  // Neutrals
  stone: '#4a4458',
  shadow: '#0a0612',
} as const

export type HogwartsColorName = keyof typeof hogwartsColors

export const cssVariables = `:root {\n${Object.entries(hogwartsColors)
  .map(([name, value]) => `  --color-${toCssVariableName(name)}: ${value};`)
  .join('\n')}\n}`
