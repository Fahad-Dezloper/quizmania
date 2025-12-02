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
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <div className="rounded-full h-16 w-16 border-4 border-purple-500 mb-4"></div>
                <p className="text-xl font-bold text-gray-700">Generating questions...</p>
                <p className="text-sm text-gray-500 mt-2">Powered by Gemini AI ✨</p>
            </div>
        );
    }

    // Welcome screen
    return (
        <div className="h-fit flex flex-col items-center">
            <div className="w-full">
                {/* Welcome card */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl text-center mb-6">
                    <p className="text-xl text-gray-600 mb-6 font-space ">
                        Test your knowledge about the <span className='text-[#0000FF] font-semibold'>Base</span> blockchain
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                            {error}
                        </div>
                    )}

{context?.user && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center flex-col justify-center gap-1">
                                {pfpUrl && (
                                    <img
                                        src={pfpUrl}
                                        alt={username}
                                        className="w-24 h-24 rounded-full"
                                    />
                                )}
                                <div className="text-left">
                                    <p className="font-bold text-gray-900">{username}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 mt-6">
                        <button
                            onClick={() => setAppState('rules')}
                            className="w-full px-8 py-4 font-space bg-[#0000FF] hover:bg-[#0000FF]/80 text-white rounded-xl font-bold text-lg shadow-lg"
                        >
                            Start Quiz 🚀
                        </button>
                    </div>

                </div>

                {/* Info cards */}
                <div className='flex flex-col gap-4'>
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
                    <button
                            onClick={handleViewLeaderboard}
                            className="w-full px-8 py-4 bg-white hover:bg-[#0000FF] hover:text-white transition-all duration-200  text-black rounded-xl font-bold text-lg"
                        >
                            View Leaderboard
                        </button>
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
