'use client';

import { useEffect, useState } from 'react';

interface TimerProps {
    duration: number; // in seconds
    onTimeUp: () => void;
    isActive: boolean;
}

export function Timer({ duration, onTimeUp, isActive }: TimerProps) {
    const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (!isActive) return;

        setTimeLeft(duration);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [duration, isActive, onTimeUp]);

    const percentage = (timeLeft / duration) * 100;
    const getColor = () => {
        if (percentage > 60) return 'bg-green-500';
        if (percentage > 30) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Time Left</span>
                <span className={`text-2xl font-bold ${percentage <= 30 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                    {timeLeft}s
                </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-1000 ease-linear ${getColor()}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
