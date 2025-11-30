'use client';

import { useEffect, useState } from 'react';
import type { LeaderboardEntry } from '@/types/quiz';

interface LeaderboardProps {
    currentUserId?: string;
    onClose: () => void;
}

export function Leaderboard({ currentUserId, onClose }: LeaderboardProps) {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const response = await fetch('/api/leaderboard?limit=50');
            const data = await response.json();

            if (data.success) {
                setLeaderboard(data.leaderboard);
            } else {
                setError('Failed to load leaderboard');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (rank: number) => {
        if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
        if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400';
        if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
        return 'bg-gray-200';
    };

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return '';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-xl text-red-600 mb-4">{error}</p>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg font-bold hover:bg-purple-600"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-xl mb-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">🏆 Leaderboard</h1>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            ✕ Close
                        </button>
                    </div>
                    <p className="text-gray-600 mt-2">Top players in BasedQuiz</p>
                </div>

                {/* Leaderboard list */}
                <div className="space-y-3">
                    {leaderboard.map((entry) => (
                        <div
                            key={entry.userId}
                            className={`bg-white rounded-xl p-4 shadow-md transition-all hover:shadow-lg ${entry.userId === currentUserId ? 'ring-2 ring-purple-500' : ''
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Rank */}
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getRankColor(entry.rank)} flex items-center justify-center text-white font-bold text-lg`}>
                                    {getRankEmoji(entry.rank) || entry.rank}
                                </div>

                                {/* User info */}
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {entry.pfpUrl && (
                                        <img
                                            src={entry.pfpUrl}
                                            alt={entry.username}
                                            className="w-10 h-10 rounded-full"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                            }}
                                        />
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-900 truncate">
                                            {entry.username}
                                            {entry.userId === currentUserId && (
                                                <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">You</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {entry.accuracy.toFixed(0)}% accuracy • {entry.totalQuizzes} quiz{entry.totalQuizzes !== 1 ? 'zes' : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="text-right flex-shrink-0">
                                    <p className="text-2xl font-bold text-purple-600">{entry.score}</p>
                                    <p className="text-xs text-gray-500">{entry.time}s</p>
                                </div>
                            </div>

                            {/* Achievements */}
                            {entry.achievements && entry.achievements.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {entry.achievements.map((achievement, idx) => (
                                        <span
                                            key={idx}
                                            className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium"
                                        >
                                            🏅 {achievement}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {leaderboard.length === 0 && (
                    <div className="bg-white rounded-xl p-12 text-center">
                        <p className="text-xl text-gray-600">No players yet. Be the first! 🚀</p>
                    </div>
                )}
            </div>
        </div>
    );
}
