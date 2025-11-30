import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import QuizSession from '@/models/QuizSession';
import Question from '@/models/Question';

async function connectDB() {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI as string);
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const body = await req.json();
        const { userId, username, pfpUrl, questionIds } = body;

        if (!userId || !username || !questionIds || questionIds.length !== 10) {
            return NextResponse.json(
                { success: false, error: 'Invalid request data' },
                { status: 400 }
            );
        }

        // Verify all questions exist
        const questions = await Question.find({ _id: { $in: questionIds } });
        if (questions.length !== 10) {
            return NextResponse.json(
                { success: false, error: 'Invalid question IDs' },
                { status: 400 }
            );
        }

        // Create new quiz session
        const session = new QuizSession({
            userId,
            username,
            pfpUrl: pfpUrl || '',
            questions: questionIds,
            answers: [],
            score: 0,
            totalTime: 0,
            accuracy: 0
        });

        await session.save();

        // Return session ID and questions (without correct answers)
        const questionsForClient = questions.map(q => ({
            id: q._id.toString(),
            question: q.question,
            options: q.options,
            difficulty: q.difficulty,
            category: q.category
        }));

        return NextResponse.json({
            success: true,
            sessionId: session._id.toString(),
            questions: questionsForClient
        });

    } catch (error) {
        console.error('Error starting quiz:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to start quiz session' },
            { status: 500 }
        );
    }
}
