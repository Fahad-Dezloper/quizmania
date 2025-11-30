'use client';

import { useState, useEffect } from 'react';
import { Timer } from './Timer';
import { QuestionCard } from './QuestionCard';
import { ScoreDisplay } from './ScoreDisplay';
import { ResultsScreen } from './ResultsScreen';
import type { QuizQuestion } from '@/types/quiz';

interface QuizGameProps {
    questions: QuizQuestion[];
    sessionId: string;
    userId: string;
    username: string;
    pfpUrl: string;
    onComplete: () => void;
}

interface Answer {
    questionId: string;
    selectedAnswer: number;
    timeSpent: number;
}

export function QuizGame({ questions, sessionId, userId, username, pfpUrl, onComplete }: QuizGameProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentScore, setCurrentScore] = useState(0);
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [results, setResults] = useState<any>(null);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (answerIndex: number) => {
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

        const answer: Answer = {
            questionId: currentQuestion.id,
            selectedAnswer: answerIndex,
            timeSpent: Math.min(timeSpent, 10) // Cap at 10 seconds
        };

        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);

        // Calculate temporary score (will be validated by backend)
        const basePoints = 10;
        let speedBonus = 0;
        if (timeSpent <= 3) speedBonus = 5;
        else if (timeSpent <= 6) speedBonus = 3;
        else if (timeSpent <= 10) speedBonus = 1;

        setCurrentScore(prev => prev + basePoints + speedBonus);

        // Move to next question or submit
        if (isLastQuestion) {
            submitQuiz(newAnswers);
        } else {
            setIsTimerActive(false);
            setTimeout(() => {
                setCurrentQuestionIndex(prev => prev + 1);
                setQuestionStartTime(Date.now());
                setIsTimerActive(true);
            }, 500);
        }
    };

    const handleTimeUp = () => {
        // Auto-submit with no answer (-1 indicates no answer)
        handleAnswer(-1);
    };

    const submitQuiz = async (finalAnswers: Answer[]) => {
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    answers: finalAnswers
                })
            });

            const data = await response.json();

            if (data.success) {
                setResults(data.result);
            } else {
                console.error('Failed to submit quiz:', data.error);
                alert('Failed to submit quiz. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            alert('Network error. Please check your connection.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mb-4"></div>
                <p className="text-xl font-bold text-gray-700">Calculating your score...</p>
            </div>
        );
    }

    if (results) {
        return (
            <ResultsScreen
                score={results.score}
                totalTime={results.totalTime}
                correctCount={results.correctCount}
                totalQuestions={questions.length}
                accuracy={results.accuracy}
                rank={results.rank}
                achievements={results.achievements || []}
                onPlayAgain={onComplete}
                onViewLeaderboard={onComplete}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 py-8">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Score display */}
                <ScoreDisplay
                    currentScore={currentScore}
                    questionsAnswered={currentQuestionIndex}
                    totalQuestions={questions.length}
                />

                {/* Timer */}
                <Timer
                    duration={10}
                    onTimeUp={handleTimeUp}
                    isActive={isTimerActive}
                />

                {/* Question */}
                <QuestionCard
                    question={currentQuestion.question}
                    options={currentQuestion.options}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questions.length}
                    onAnswer={handleAnswer}
                    selectedAnswer={null}
                />
            </div>
        </div>
    );
}
