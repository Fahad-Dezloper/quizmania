import mongoose, { Schema, Document } from 'mongoose';

export interface ILeaderboard extends Document {
    userId: string; // Farcaster FID
    username: string;
    pfpUrl: string;
    bestScore: number;
    bestTime: number;
    totalQuizzes: number;
    averageScore: number;
    totalCorrect: number;
    totalQuestions: number;
    accuracy: number;
    streak: number;
    lastPlayedAt: Date;
    achievements: string[];
    updatedAt: Date;
}

const LeaderboardSchema = new Schema<ILeaderboard>({
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    pfpUrl: { type: String, required: true },
    bestScore: { type: Number, default: 0 },
    bestTime: { type: Number, default: 0 },
    totalQuizzes: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastPlayedAt: { type: Date, default: Date.now },
    achievements: { type: [String], default: [] },
    updatedAt: { type: Date, default: Date.now }
});

// Indexes for leaderboard queries
LeaderboardSchema.index({ bestScore: -1, bestTime: 1 }); // Primary leaderboard sort
LeaderboardSchema.index({ userId: 1 });
LeaderboardSchema.index({ accuracy: -1 });

export default mongoose.models.Leaderboard || mongoose.model<ILeaderboard>('Leaderboard', LeaderboardSchema);
