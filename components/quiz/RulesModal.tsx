'use client';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: () => void;
}

export function RulesModal({ isOpen, onClose, onStart }: RulesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-slideUp">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Quiz Rules</h2>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">📝</span>
                        <div>
                            <h3 className="font-bold text-gray-900">10 Questions</h3>
                            <p className="text-gray-600 text-sm">Test your knowledge about Base blockchain ecosystem</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⏱️</span>
                        <div>
                            <h3 className="font-bold text-gray-900">10 Seconds Per Question</h3>
                            <p className="text-gray-600 text-sm">Answer quickly to maximize your score!</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <h3 className="font-bold text-gray-900">Speed Bonus</h3>
                            <p className="text-gray-600 text-sm">
                                Base: 10 points per correct answer<br />
                                Bonus: +5 pts (0-3s), +3 pts (3-6s), +1 pt (6-10s)
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                            <h3 className="font-bold text-gray-900">Leaderboard</h3>
                            <p className="text-gray-600 text-sm">Compete with others and climb the ranks!</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onStart}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-bold hover:from-purple-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                    >
                        Start Quiz! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}
