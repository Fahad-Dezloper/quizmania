import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import QuizSession from '@/models/QuizSession';
import Question from '@/models/Question';
import Leaderboard from '@/models/Leaderboard';

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
}

function calculateScore(answers: any[]): number {
    let totalScore = 0;

    for (const answer of answers) {
        if (answer.isCorrect) {
            // Base points: 10 per correct answer
            let points = 10;

            // Speed bonus: up to 5 extra points based on time
            // 0-3 seconds: +5 points
            // 3-6 seconds: +3 points
            // 6-10 seconds: +1 point
            if (answer.timeSpent <= 3) {
                points += 5;
            } else if (answer.timeSpent <= 6) {
                points += 3;
            } else if (answer.timeSpent <= 10) {
                points += 1;
            }

            totalScore += points;
        }
    }

    return totalScore;
}

function checkAchievements(accuracy: number, averageTime: number, score: number): string[] {
    const achievements: string[] = [];

    if (accuracy >= 90) {
        achievements.push('Base Expert');
    }
    if (averageTime < 3) {
        achievements.push('Speed Demon');
    }
    if (score >= 140) { // Near perfect score
        achievements.push('Perfect Score');
    }

    return achievements;
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { sessionId, answers } = body;

        if (!sessionId || !answers || answers.length !== 10) {
            return NextResponse.json(
                { success: false, error: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Get session
        const session = await QuizSession.findById(sessionId);
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Session not found' },
                { status: 404 }
            );
        }

        // Get questions to verify answers
        const questions = await Question.find({ _id: { $in: session.questions } });
        const questionMap = new Map(questions.map(q => [q._id.toString(), q]));

        // Validate and score answers
        const validatedAnswers = answers.map((answer: any) => {
            const question = questionMap.get(answer.questionId);
            const isCorrect = question ? answer.selectedAnswer === question.correctAnswer : false;

            return {
                questionId: answer.questionId,
                selectedAnswer: answer.selectedAnswer,
                timeSpent: answer.timeSpent,
                isCorrect
            };
        });

        const score = calculateScore(validatedAnswers);
        const totalTime = validatedAnswers.reduce((sum: number, a: any) => sum + a.timeSpent, 0);
        const correctCount = validatedAnswers.filter((a: any) => a.isCorrect).length;
        const accuracy = (correctCount / 10) * 100;
        const averageTime = totalTime / 10;

        // Update session
        session.answers = validatedAnswers;
        session.score = score;
        session.totalTime = totalTime;
        session.accuracy = accuracy;
        session.completedAt = new Date();
        await session.save();

        // Update leaderboard
        let leaderboardEntry = await Leaderboard.findOne({ userId: session.userId });

        if (!leaderboardEntry) {
            // Create new leaderboard entry
            leaderboardEntry = new Leaderboard({
                userId: session.userId,
                username: session.username,
                pfpUrl: session.pfpUrl,
                bestScore: score,
                bestTime: totalTime,
                totalQuizzes: 1,
                averageScore: score,
                totalCorrect: correctCount,
                totalQuestions: 10,
                accuracy: accuracy,
                streak: 1,
                lastPlayedAt: new Date(),
                achievements: checkAchievements(accuracy, averageTime, score)
            });
        } else {
            // Update existing entry
            leaderboardEntry.totalQuizzes += 1;
            leaderboardEntry.totalCorrect += correctCount;
            leaderboardEntry.totalQuestions += 10;
            leaderboardEntry.averageScore =
                (leaderboardEntry.averageScore * (leaderboardEntry.totalQuizzes - 1) + score) / leaderboardEntry.totalQuizzes;
            leaderboardEntry.accuracy = (leaderboardEntry.totalCorrect / leaderboardEntry.totalQuestions) * 100;

            if (score > leaderboardEntry.bestScore) {
                leaderboardEntry.bestScore = score;
                leaderboardEntry.bestTime = totalTime;
            }

            // Update streak
            const lastPlayed = new Date(leaderboardEntry.lastPlayedAt);
            const now = new Date();
            const daysDiff = Math.floor((now.getTime() - lastPlayed.getTime()) / (1000 * 60 * 60 * 24));

            if (daysDiff === 1) {
                leaderboardEntry.streak += 1;
            } else if (daysDiff > 1) {
                leaderboardEntry.streak = 1;
            }

            leaderboardEntry.lastPlayedAt = now;

            // Update achievements
            const newAchievements = checkAchievements(accuracy, averageTime, score);
            for (const achievement of newAchievements) {
                if (!leaderboardEntry.achievements.includes(achievement)) {
                    leaderboardEntry.achievements.push(achievement);
                }
            }
        }

        await leaderboardEntry.save();

        // Get user's rank
        const rank = await Leaderboard.countDocuments({
            $or: [
                { bestScore: { $gt: leaderboardEntry.bestScore } },
                {
                    bestScore: leaderboardEntry.bestScore,
                    bestTime: { $lt: leaderboardEntry.bestTime }
                }
            ]
        }) + 1;

        return NextResponse.json({
            success: true,
            result: {
                score,
                totalTime,
                accuracy,
                correctCount,
                rank,
                achievements: leaderboardEntry.achievements,
                newAchievements: checkAchievements(accuracy, averageTime, score)
            }
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to submit quiz' },
            { status: 500 }
        );
    }
}
