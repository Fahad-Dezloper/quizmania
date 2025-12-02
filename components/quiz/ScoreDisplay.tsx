'use client';

interface ScoreDisplayProps {
    currentScore: number;
    questionsAnswered: number;
    totalQuestions: number;
}

export function ScoreDisplay({ currentScore, questionsAnswered, totalQuestions }: ScoreDisplayProps) {
    return (
        <div className=" bg-[#0000FF] rounded-xl py-3 px-6 shadow-lg text-white">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm opacity-90">Current Score</p>
                    <p className="text-4xl font-bold">{currentScore}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm opacity-90">Progress</p>
                    <p className="text-2xl font-bold">
                        {questionsAnswered}/{totalQuestions}
                    </p>
                </div>
            </div>
        </div>
    );
}
