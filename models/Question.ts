import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
    question: string;
    options: string[];
    correctAnswer: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    explanation?: string;
    createdAt: Date;
    usageCount: number;
}

const QuestionSchema = new Schema<IQuestion>({
    question: { type: String, required: true },
    options: { type: [String], required: true, validate: [arrayLimit, 'Must have exactly 4 options'] },
    correctAnswer: { type: Number, required: true, min: 0, max: 3 },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    category: { type: String, default: 'base-ecosystem' },
    explanation: { type: String },
    createdAt: { type: Date, default: Date.now },
    usageCount: { type: Number, default: 0 }
});

function arrayLimit(val: string[]) {
    return val.length === 4;
}

// Index for efficient querying
QuestionSchema.index({ difficulty: 1, usageCount: 1 });
QuestionSchema.index({ createdAt: -1 });

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
