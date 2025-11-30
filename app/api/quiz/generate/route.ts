import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Question from '@/models/Question';
import { generateQuizQuestions } from '@/lib/question-selector';

// Connect to MongoDB
async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        // Generate questions from static question bank
        const response = await generateQuizQuestions();

        // Save questions to database for caching
        const savedQuestions = await Promise.all(
            response.questions.map(async (q) => {
                const question = new Question({
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    difficulty: q.difficulty,
                    category: 'base-ecosystem',
                    explanation: q.explanation
                });
                return await question.save();
            })
        );

        // Return questions without correct answers (for security)
        const questionsForClient = savedQuestions.map(q => ({
            id: q._id.toString(),
            question: q.question,
            options: q.options,
            difficulty: q.difficulty,
            category: q.category
        }));

        return NextResponse.json({
            success: true,
            questions: questionsForClient
        });

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate quiz questions' },
            { status: 500 }
        );
    }
}
