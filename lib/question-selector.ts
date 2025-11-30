import { ARBITRUM_QUESTIONS } from './questions';
import type { GeminiQuestionResponse } from '@/types/quiz';

// Convert question format from your JSON to our app format
function convertQuestion(q: any) {
    const optionsArray = [q.options.A, q.options.B, q.options.C, q.options.D];
    const correctAnswerIndex = ['A', 'B', 'C', 'D'].indexOf(q.correctOption);

    return {
        question: q.question,
        options: optionsArray,
        correctAnswer: correctAnswerIndex,
        explanation: `The correct answer is ${q.correctOption}: ${q.options[q.correctOption]}`,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard'
    };
}

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export async function generateQuizQuestions(): Promise<GeminiQuestionResponse> {
    console.log('🎲 Generating quiz from question bank...');

    // Separate questions by difficulty
    const easyQuestions = ARBITRUM_QUESTIONS.questions.filter(q => q.difficulty === 'easy');
    const mediumQuestions = ARBITRUM_QUESTIONS.questions.filter(q => q.difficulty === 'medium');
    const hardQuestions = ARBITRUM_QUESTIONS.questions.filter(q => q.difficulty === 'hard');

    console.log(`📊 Question bank: ${easyQuestions.length} easy, ${mediumQuestions.length} medium, ${hardQuestions.length} hard`);

    // Shuffle each difficulty pool
    const shuffledEasy = shuffleArray(easyQuestions);
    const shuffledMedium = shuffleArray(mediumQuestions);
    const shuffledHard = shuffleArray(hardQuestions);

    // Select 4 easy, 3 medium, 3 hard
    const selectedQuestions = [
        ...shuffledEasy.slice(0, 4),
        ...shuffledMedium.slice(0, 3),
        ...shuffledHard.slice(0, 3)
    ];

    // Shuffle the final selection so difficulties are mixed
    const finalQuestions = shuffleArray(selectedQuestions);

    console.log('✅ Selected 10 questions (4 easy, 3 medium, 3 hard)');

    return {
        questions: finalQuestions.map(convertQuestion)
    };
}

export async function generateDailyQuestions(): Promise<GeminiQuestionResponse> {
    // For now, just generate random questions
    // In future, could cache based on date
    return generateQuizQuestions();
}
