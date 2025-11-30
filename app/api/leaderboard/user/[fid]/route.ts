import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Leaderboard from '@/models/Leaderboard';

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { fid: string } }
) {
    try {
        await connectDB();

        const { fid } = params;

        // Get user's stats
        const userStats = await Leaderboard.findOne({ userId: fid });

        if (!userStats) {
            return NextResponse.json({
                success: true,
                found: false,
                message: 'User has not played yet'
            });
        }

        // Calculate user's rank
        const rank = await Leaderboard.countDocuments({
            $or: [
                { bestScore: { $gt: userStats.bestScore } },
                {
                    bestScore: userStats.bestScore,
                    bestTime: { $lt: userStats.bestTime }
                }
            ]
        }) + 1;

        return NextResponse.json({
            success: true,
            found: true,
            user: {
                rank,
                userId: userStats.userId,
                username: userStats.username,
                pfpUrl: userStats.pfpUrl,
                bestScore: userStats.bestScore,
                bestTime: userStats.bestTime,
                averageScore: userStats.averageScore,
                accuracy: userStats.accuracy,
                totalQuizzes: userStats.totalQuizzes,
                streak: userStats.streak,
                achievements: userStats.achievements,
                lastPlayedAt: userStats.lastPlayedAt
            }
        });

    } catch (error) {
        console.error('Error fetching user stats:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user stats' },
            { status: 500 }
        );
    }
}
