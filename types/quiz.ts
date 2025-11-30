// Quiz-related TypeScript interfaces

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  explanation?: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedAnswer: number;
  timeSpent: number; // in seconds
  isCorrect: boolean;
}

export interface QuizSession {
  id: string;
  userId: string; // Farcaster FID
  questions: QuizQuestion[];
  answers: QuizAnswer[];
  score: number;
  totalTime: number;
  completedAt?: Date;
  createdAt: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string; // Farcaster FID
  username: string;
  pfpUrl: string;
  score: number;
  time: number;
  totalTime: number;
  accuracy: number; // percentage
  completedAt: Date;
  achievements?: string[];
  totalQuizzes?: number;
  streak?: number;
}

export interface UserStats {
  userId: string;
  totalQuizzes: number;
  bestScore: number;
  averageScore: number;
  totalCorrect: number;
  totalQuestions: number;
  streak: number;
  lastPlayedAt: Date;
}

export interface GeminiQuestionResponse {
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
}
