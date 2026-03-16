export interface Level {
  id: number
  nameHe: string
  emoji: string
  questions: Question[]
  passingScore: number
  spellReward: Spell
  isNearDoubles: boolean
}

export interface Question {
  a: number
  b: number
  answer: number
  hintDouble?: number
}

export interface Spell {
  id: string
  nameHe: string
  nameEn: string
  emoji: string
  description: string
}

export interface LevelProgress {
  completed: boolean
  stars: number
  bestScore: number
}

export interface GameState {
  version: number
  playerName: string
  unlockedLevels: number[]
  completedLevels: Record<number, LevelProgress>
  unlockedSpells: string[]
  totalStars: number
}

export interface SessionState {
  questions: Question[]
  currentQuestion: number
  totalQuestions: number
  correctAnswers: number
  startTime: number
  answers: { question: Question; userAnswer: number; correct: boolean; timeMs: number }[]
  hintLevel: 'full' | 'partial' | 'none'
}

export interface TeachingStep {
  id: string
  titleHe: string
  textHe: string
  expression?: string
  accent?: 'base' | 'double' | 'extra' | 'answer'
}

export type CharacterMood =
  | 'idle'
  | 'celebrate'
  | 'encourage'
  | 'encouraging'
  | 'teach'
  | 'teaching'
  | 'thinking'
  | 'surprised'
  | 'proud'
  | 'pointing'
  | 'flying'
  | 'delivering'
export type CharacterName = 'harry' | 'hermione' | 'ron' | 'dumbledore' | 'hedwig'

export type Screen = 'home' | 'map' | 'practice' | 'spellbook' | 'complete'
