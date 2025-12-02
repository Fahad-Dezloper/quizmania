import mongoose, { Schema, Document } from 'mongoose';

export interface IQuizAnswer {
    questionId: string;
    selectedAnswer: number;
    timeSpent: number;
    isCorrect: boolean;
}

export interface IQuizSession extends Document {
    userId: string; // Farcaster FID
    username: string;
    pfpUrl: string;
    questions: string[]; // Array of Question IDs
    answers: IQuizAnswer[];
    score: number;
    totalTime: number;
    accuracy: number;
    completedAt?: Date;
    createdAt: Date;
}

const QuizAnswerSchema = new Schema<IQuizAnswer>({
    questionId: { type: String, required: true },
    // -1 indicates no answer was selected (e.g. time ran out)
    selectedAnswer: { type: Number, required: true, min: -1, max: 3 },
    timeSpent: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true }
}, { _id: false });

const QuizSessionSchema = new Schema<IQuizSession>({
    userId: { type: String, required: true },
    username: { type: String, required: true },
    pfpUrl: { type: String, required: true },
    questions: { type: [String], required: true },
    answers: { type: [QuizAnswerSchema], default: [] },
    score: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

// Indexes for efficient querying
QuizSessionSchema.index({ userId: 1, createdAt: -1 });
QuizSessionSchema.index({ score: -1, totalTime: 1 }); // For leaderboard
QuizSessionSchema.index({ completedAt: -1 });

export default mongoose.models.QuizSession || mongoose.model<IQuizSession>('QuizSession', QuizSessionSchema);
