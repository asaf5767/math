import type { Question, TeachingStep } from '../types/game';

export function decomposeNearDouble(
  a: number,
  b: number,
): { base: number; double: number; extra: number } {
  const base = Math.min(a, b);
  const extra = Math.max(a, b) - base;

  return {
    base,
    double: base * 2,
    extra,
  };
}

export function getTeachingSteps(
  question: Question,
  hintLevel: 'full' | 'partial' | 'none',
): TeachingStep[] {
  const { a, b, answer } = question;
  const hintBase = question.hintDouble ?? Math.min(a, b);
  const double = hintBase * 2;
  const extra = answer - double;

  if (hintLevel === 'none') {
    return [];
  }

  if (hintLevel === 'partial') {
    return [
      {
        id: 'remember-double',
        titleHe: 'נזכרים בכפולה',
        textHe: `קודם נחשוב על ${hintBase}+${hintBase}.`,
        expression: `${hintBase} + ${hintBase} = ${double}`,
        accent: 'double',
      },
      {
        id: 'finish-near-double',
        titleHe: 'מסיימים את הדרך',
        textHe: `עכשיו נוסיף עוד ${extra} ונגיע לתשובה.`,
        expression: `${double} + ${extra} = ${answer}`,
        accent: 'answer',
      },
    ];
  }

  return [
    {
      id: 'spot-near-double',
      titleHe: 'מוצאים כפולה קרובה',
      textHe: `בתרגיל ${a}+${b} יש כמעט את הכפולה של ${hintBase}.`,
      expression: `${hintBase} + ${hintBase}`,
      accent: 'base',
    },
    {
      id: 'make-the-double',
      titleHe: 'עושים כפולה',
      textHe: `${hintBase}+${hintBase} שווה ${double}.`,
      expression: `${hintBase} + ${hintBase} = ${double}`,
      accent: 'double',
    },
    {
      id: 'add-the-extra',
      titleHe: 'מוסיפים עוד קצת',
      textHe: `לאחד המספרים יש עוד ${extra}, אז נוסיף ${extra}.`,
      expression: `${double} + ${extra}`,
      accent: 'extra',
    },
    {
      id: 'reveal-answer',
      titleHe: 'מגלים את התשובה',
      textHe: `עכשיו רואים שהתשובה היא ${answer}.`,
      expression: `${double} + ${extra} = ${answer}`,
      accent: 'answer',
    },
  ];
}
