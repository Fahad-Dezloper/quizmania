'use client';

interface QuestionCardProps {
    question: string;
    options: string[];
    questionNumber: number;
    totalQuestions: number;
    onAnswer: (answerIndex: number) => void;
    selectedAnswer: number | null;
    showResult?: boolean;
    correctAnswer?: number;
}

export function QuestionCard({
    question,
    options,
    questionNumber,
    totalQuestions,
    onAnswer,
    selectedAnswer,
    showResult = false,
    correctAnswer
}: QuestionCardProps) {

    const getButtonClass = (index: number) => {
        const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all duration-200 font-medium";

        if (!showResult) {
            if (selectedAnswer === index) {
                return `${baseClass} border-blue-500 bg-blue-50 text-blue-900`;
            }
            return `${baseClass} border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-900`;
        }

        // Show results
        if (index === correctAnswer) {
            return `${baseClass} border-green-500 bg-green-50 text-green-900`;
        }
        if (selectedAnswer === index && index !== correctAnswer) {
            return `${baseClass} border-red-500 bg-red-50 text-red-900`;
        }
        return `${baseClass} border-gray-300 bg-gray-50 text-gray-600`;
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-fadeIn">
            {/* Progress indicator */}
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                    Question {questionNumber} of {totalQuestions}
                </span>
                <div className="flex gap-1">
                    {Array.from({ length: totalQuestions }).map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-8 rounded-full ${i < questionNumber - 1
                                ? 'bg-green-500'
                                : i === questionNumber - 1
                                    ? 'bg-blue-500'
                                    : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Question */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">{question}</h2>

                {/* Options */}
                <div className="space-y-3">
                    {options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => !showResult && onAnswer(index)}
                            disabled={showResult}
                            className={getButtonClass(index)}
                        >
                            <div className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold text-sm mt-0.5">
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="flex-1 text-sm leading-relaxed text-gray-900 break-words">{option}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
