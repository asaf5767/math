import type { Level, Question, SessionState } from '../types/game';

const FAST_AVERAGE_TIME_MS = 6000;

const shuffleQuestions = (questions: Question[]): Question[] => {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
};

const getScore = (session: SessionState): number => {
  if (session.totalQuestions === 0) {
    return 0;
  }

  return Math.round((session.correctAnswers / session.totalQuestions) * 100);
};

const getTotalAnswerTime = (session: SessionState): number =>
  session.answers.reduce((total, entry) => total + entry.timeMs, 0);

export function generateLevelSession(level: Level): SessionState {
  const questions = shuffleQuestions(level.questions);

  return {
    questions,
    currentQuestion: 0,
    totalQuestions: questions.length,
    correctAnswers: 0,
    startTime: Date.now(),
    answers: [],
    hintLevel: level.isNearDoubles ? getHintLevel(0) : 'none',
  };
}

export function checkAnswer(
  session: SessionState,
  answer: number,
): { correct: boolean; newSession: SessionState } {
  if (isLevelComplete(session)) {
    return { correct: false, newSession: session };
  }

  const question = session.questions[session.currentQuestion];

  if (!question) {
    return { correct: false, newSession: session };
  }

  const correct = question.answer === answer;
  const elapsedSinceStart = Date.now() - session.startTime;
  const timeMs = Math.max(0, elapsedSinceStart - getTotalAnswerTime(session));
  const nextQuestionIndex = session.currentQuestion + 1;
  const nextQuestion = session.questions[nextQuestionIndex];

  const newSession: SessionState = {
    ...session,
    currentQuestion: nextQuestionIndex,
    correctAnswers: session.correctAnswers + (correct ? 1 : 0),
    answers: [
      ...session.answers,
      {
        question,
        userAnswer: answer,
        correct,
        timeMs,
      },
    ],
    hintLevel: nextQuestion?.hintDouble !== undefined ? getHintLevel(nextQuestionIndex) : 'none',
  };

  return { correct, newSession };
}

export function calculateStars(session: SessionState): number {
  if (!isLevelComplete(session)) {
    return 0;
  }

  const score = getScore(session);

  if (score < 80) {
    return 0;
  }

  if (score >= 100) {
    const averageTimeMs = getTotalAnswerTime(session) / Math.max(session.totalQuestions, 1);
    return averageTimeMs <= FAST_AVERAGE_TIME_MS ? 3 : 2;
  }

  if (score >= 90) {
    return 2;
  }

  return 1;
}

export function isLevelComplete(session: SessionState): boolean {
  return session.currentQuestion >= session.totalQuestions;
}

export function getLevelResult(
  session: SessionState,
  level: Level,
): { passed: boolean; score: number; stars: number; spellUnlocked: boolean } {
  const score = getScore(session);
  const passed = isLevelComplete(session) && score >= level.passingScore;
  const stars = isLevelComplete(session) ? calculateStars(session) : 0;

  return {
    passed,
    score,
    stars,
    spellUnlocked: passed,
  };
}

export function getHintLevel(questionIndex: number): 'full' | 'partial' | 'none' {
  if (questionIndex < 3) {
    return 'full';
  }

  if (questionIndex < 6) {
    return 'partial';
  }

  return 'none';
}
