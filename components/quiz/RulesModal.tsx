'use client';

interface RulesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: () => void;
}

export function RulesModal({ isOpen, onClose, onStart }: RulesModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
                <div className="mb-4 text-center">
                    <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Quiz Rules</h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Short, timed quiz with speed bonuses and a global leaderboard.
                    </p>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900">10 questions</p>
                        <p className="text-xs text-gray-600">
                            All about the Base blockchain ecosystem.
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900">10 seconds per question</p>
                        <p className="text-xs text-gray-600">
                            When time is up, the question is counted as unanswered.
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900">Scoring</p>
                        <p className="text-xs text-gray-600">
                            10 points per correct answer + speed bonus:
                        </p>
                        <div className="mt-1 flex flex-col gap-y-0.5 text-xs text-gray-600">
                            <span>+5 pts (0–3s)</span>
                            <span>+3 pts (3–6s)</span>
                            <span>+1 pt (6–10s)</span>
                        </div>
                    </div>

                    <div className="rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900">Leaderboard</p>
                        <p className="text-xs text-gray-600">
                            Your best scores and times are ranked against other players.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                        onClick={onClose}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-base font-semibold text-gray-700 sm:flex-1 sm:text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onStart}
                        className="w-full rounded-lg bg-[#0000FF] px-4 py-2 text-base font-semibold text-white shadow-lg sm:flex-1 sm:text-sm"
                    >
                        Start Quiz! 🚀
                    </button>
                </div>
            </div>
        </div>
    );
}
