'use client';

interface ResultsScreenProps {
    score: number;
    totalTime: number;
    correctCount: number;
    totalQuestions: number;
    accuracy: number;
    rank: number;
    achievements: string[];
    onPlayAgain: () => void;
    onViewLeaderboard: () => void;
}

export function ResultsScreen({
    score,
    totalTime,
    correctCount,
    totalQuestions,
    accuracy,
    rank,
    achievements,
    onPlayAgain,
    onViewLeaderboard
}: ResultsScreenProps) {

    const getRankEmoji = () => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        if (rank <= 10) return '🏆';
        return '⭐';
    };

    const getScoreMessage = () => {
        if (accuracy >= 90) return 'Outstanding! 🎉';
        if (accuracy >= 70) return 'Great job! 👏';
        if (accuracy >= 50) return 'Good effort! 💪';
        return 'Keep practicing! 📚';
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Confetti effect for high scores */}
            {accuracy >= 80 && (
                <div className="text-center text-6xl">
                    🎊 🎉 🎊
                </div>
            )}

            {/* Main results card */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-200">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
                    <p className="text-xl text-gray-600">{getScoreMessage()}</p>
                </div>

                {/* Score display */}
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-8 text-white text-center mb-6">
                    <p className="text-lg opacity-90 mb-2">Your Score</p>
                    <p className="text-6xl font-bold mb-4">{score}</p>
                    <div className="flex justify-center gap-8 text-sm">
                        <div>
                            <p className="opacity-90">Time</p>
                            <p className="text-xl font-bold">{totalTime}s</p>
                        </div>
                        <div>
                            <p className="opacity-90">Accuracy</p>
                            <p className="text-xl font-bold">{accuracy.toFixed(0)}%</p>
                        </div>
                    </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-gray-600 text-sm mb-1">Correct Answers</p>
                        <p className="text-3xl font-bold text-green-600">{correctCount}/{totalQuestions}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-gray-600 text-sm mb-1">Your Rank</p>
                        <p className="text-3xl font-bold text-purple-600">{getRankEmoji()} #{rank}</p>
                    </div>
                </div>

                {/* Achievements */}
                {achievements.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-bold text-gray-900 mb-3">🏅 Achievements</h3>
                        <div className="flex flex-wrap gap-2">
                            {achievements.map((achievement, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-300"
                                >
                                    {achievement}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                    <button
                        onClick={onPlayAgain}
                        className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold text-lg shadow-lg"
                    >
                        Play Again 🎮
                    </button>
                    <button
                        onClick={onViewLeaderboard}
                        className="w-full px-6 py-4 border-2 border-purple-500 text-purple-600 rounded-lg font-bold text-lg"
                    >
                        View Leaderboard 🏆
                    </button>
                </div>
            </div>
        </div>
    );
}
