import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import HomeScreen from '../components/HomeScreen'
import LevelMap from '../components/LevelMap'
import NumberPad from '../components/NumberPad'
import ProgressBar from '../components/ProgressBar'
import QuestionCard from '../components/QuestionCard'
import { LEVELS } from '../game/levels'
import he from '../i18n/he'

afterEach(() => {
  cleanup()
})

const indexHtml = readFileSync(resolve(process.cwd(), 'index.html'), 'utf8')
const indexCss = readFileSync(resolve(process.cwd(), 'src', 'index.css'), 'utf8')
const hebrewRegex = /[\u0590-\u05FF]/

describe('RTL layout and Hebrew UI', () => {
  it('HTML root has dir="rtl" and lang="he"', () => {
    expect(indexHtml).toMatch(/<html[^>]*lang="he"[^>]*dir="rtl"/)
    expect(he.meta.direction).toBe('rtl')
  })

  it('math expressions stay LTR inside RTL screens', () => {
    const { container } = render(
      <>
        <QuestionCard question={{ a: 4, b: 4, answer: 8 }} currentInput="8" questionIndex={0} />
        <ProgressBar current={3} total={10} />
        <NumberPad value="12" onDigit={() => {}} onBackspace={() => {}} onSubmit={() => {}} />
      </>,
    )

    expect(indexCss).toMatch(/\.math-expr\s*\{[\s\S]*direction:\s*ltr;[\s\S]*unicode-bidi:\s*isolate;/)
    expect(container.querySelectorAll('.math-expr').length).toBeGreaterThanOrEqual(3)
  })

  it('number pad isolates LTR input', () => {
    const { container } = render(
      <NumberPad value="42" onDigit={() => {}} onBackspace={() => {}} onSubmit={() => {}} />,
    )

    expect(indexCss).toMatch(/\.number-pad\s*\{[\s\S]*direction:\s*ltr;[\s\S]*unicode-bidi:\s*isolate;/)
    expect(container.querySelector('.number-pad')).toBeInTheDocument()
  })

  it('Hebrew text from i18n renders correctly', () => {
    render(<HomeScreen playerName="" onSaveName={() => {}} onStartAdventure={() => {}} onResetProgress={() => {}} />)
    // The welcome text contains Hebrew characters
    expect(screen.getByText(/אקדמיית הוגוורטס למתמטיקה/)).toBeInTheDocument()
    // Start button contains Hebrew
    expect(screen.getByRole('button', { name: /בואי/ })).toBeInTheDocument()

    cleanup()

    render(
      <LevelMap
        levels={LEVELS}
        unlockedLevels={[1]}
        completedLevels={{}}
        unlockedSpells={[]}
        currentLevelId={1}
        onSelectLevel={() => {}}
        onOpenSpellBook={() => {}}
      />,
    )

    // Level map has Hebrew content
    const hebrewElements = screen.getAllByText(/הוגוורטס|הרפתקה|מפת/)
    expect(hebrewElements.length).toBeGreaterThan(0)
  })

  it('progress bar fills from the right', () => {
    const { container } = render(<ProgressBar current={5} total={10} />)
    const fill = container.querySelector('.progress-fill-rtl')

    expect(fill).toBeInTheDocument()
    expect(indexCss).toMatch(/\.progress-fill-rtl\s*\{[\s\S]*transform-origin:\s*right;/)
  })

  it('button text is Hebrew and not English', () => {
    render(<HomeScreen playerName="" onSaveName={() => {}} onStartAdventure={() => {}} onResetProgress={() => {}} />)

    const startButton = screen.getByRole('button', { name: /בואי/ })
    expect(startButton).toBeInTheDocument()
    // Button text should contain Hebrew characters, not just English
    expect(startButton.textContent).toMatch(/[\u0590-\u05FF]/)

    cleanup()

    render(
      <LevelMap
        levels={LEVELS}
        unlockedLevels={[1]}
        completedLevels={{}}
        unlockedSpells={[]}
        currentLevelId={1}
        onSelectLevel={() => {}}
        onOpenSpellBook={() => {}}
      />,
    )

    const spellBookButton = screen.getByRole('button', { name: /ספר הלחשים/ })
    expect(spellBookButton.textContent).not.toMatch(/[A-Za-z]{2,}/)
  })

  it('level names are stored in Hebrew', () => {
    expect(LEVELS).toHaveLength(6)
    expect(LEVELS.every((level) => hebrewRegex.test(level.nameHe))).toBe(true)
  })
})
