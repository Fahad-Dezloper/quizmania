import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Leaderboard from '@/models/Leaderboard';

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Get top players sorted by best score (desc) and best time (asc)
        const leaderboard = await Leaderboard.find()
            .sort({ bestScore: -1, bestTime: 1 })
            .skip(offset)
            .limit(Math.min(limit, 100));

        // Add rank to each entry
        const leaderboardWithRank = leaderboard.map((entry, index) => ({
            rank: offset + index + 1,
            userId: entry.userId,
            username: entry.username,
            pfpUrl: entry.pfpUrl,
            score: entry.bestScore,
            time: entry.bestTime,
            accuracy: entry.accuracy,
            totalQuizzes: entry.totalQuizzes,
            streak: entry.streak,
            achievements: entry.achievements,
            lastPlayedAt: entry.lastPlayedAt
        }));

        return NextResponse.json({
            success: true,
            leaderboard: leaderboardWithRank,
            total: await Leaderboard.countDocuments()
        });

    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch leaderboard' },
            { status: 500 }
        );
    }
}
