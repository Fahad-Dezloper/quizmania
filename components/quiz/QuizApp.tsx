'use client';

import { useState } from 'react';
import { useFrame } from '@/components/farcaster-provider';
import { RulesModal } from './RulesModal';
import { QuizGame } from './QuizGame';
import { Leaderboard } from '../leaderboard/Leaderboard';

type AppState = 'welcome' | 'rules' | 'loading' | 'playing' | 'leaderboard';

export function QuizApp() {
    const { context } = useFrame();
    const [appState, setAppState] = useState<AppState>('welcome');
    const [questions, setQuestions] = useState<any[]>([]);
    const [sessionId, setSessionId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const userId = context?.user?.fid?.toString() || 'anonymous';
    const username = context?.user?.username || context?.user?.displayName || 'Anonymous';
    const pfpUrl = context?.user?.pfpUrl || '';

    const startQuiz = async () => {
        setAppState('loading');
        setError(null);

        try {
            // Generate questions
            const generateResponse = await fetch('/api/quiz/generate', {
                method: 'POST'
            });
            const generateData = await generateResponse.json();

            if (!generateData.success) {
                throw new Error(generateData.error || 'Failed to generate questions');
            }

            const questionIds = generateData.questions.map((q: any) => q.id);

            // Start session
            const startResponse = await fetch('/api/quiz/start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    username,
                    pfpUrl,
                    questionIds
                })
            });

            const startData = await startResponse.json();

            if (!startData.success) {
                throw new Error(startData.error || 'Failed to start quiz');
            }

            setQuestions(startData.questions);
            setSessionId(startData.sessionId);
            setAppState('playing');

        } catch (err: any) {
            console.error('Error starting quiz:', err);
            setError(err.message || 'Failed to start quiz');
            setAppState('welcome');
        }
    };

    const handleQuizComplete = () => {
        setAppState('welcome');
    };

    const handleViewLeaderboard = () => {
        setAppState('leaderboard');
    };

    if (appState === 'leaderboard') {
        return <Leaderboard currentUserId={userId} onClose={() => setAppState('welcome')} />;
    }

    if (appState === 'playing' && questions.length > 0) {
        return (
            <QuizGame
                questions={questions}
                sessionId={sessionId}
                userId={userId}
                username={username}
                pfpUrl={pfpUrl}
                onComplete={handleQuizComplete}
            />
        );
    }

    if (appState === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500 mb-4"></div>
                <p className="text-xl font-bold text-gray-700">Generating questions...</p>
                <p className="text-sm text-gray-500 mt-2">Powered by Gemini AI ✨</p>
            </div>
        );
    }

    // Welcome screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Welcome card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-6 animate-slideUp">
                    <div className="text-6xl mb-4">🎯</div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">BasedQuiz</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Test your knowledge about the Base blockchain ecosystem!
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button
                            onClick={() => setAppState('rules')}
                            className="w-full px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Start Quiz 🚀
                        </button>
                        <button
                            onClick={handleViewLeaderboard}
                            className="w-full px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all"
                        >
                            View Leaderboard 🏆
                        </button>
                    </div>

                    {/* User info */}
                    {context?.user && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-center gap-3">
                                {pfpUrl && (
                                    <img
                                        src={pfpUrl}
                                        alt={username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                )}
                                <div className="text-left">
                                    <p className="text-sm text-gray-500">Playing as</p>
                                    <p className="font-bold text-gray-900">{username}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-3 gap-3 text-white text-center">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-2xl font-bold">10</p>
                        <p className="text-xs opacity-90">Questions</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-2xl font-bold">10s</p>
                        <p className="text-xs opacity-90">Per Question</p>
                    </div>
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4">
                        <p className="text-2xl font-bold">150</p>
                        <p className="text-xs opacity-90">Max Score</p>
                    </div>
                </div>
            </div>

            {/* Rules modal */}
            <RulesModal
                isOpen={appState === 'rules'}
                onClose={() => setAppState('welcome')}
                onStart={startQuiz}
            />
        </div>
    );
}
