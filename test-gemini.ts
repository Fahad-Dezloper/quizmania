// Quick test script for Gemini API
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCWq1CnYK--Z1OPux3M09uhQ-FqzuLkQRA';
console.log('API Key:', apiKey);
console.log('API Key length:', apiKey.length);

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    try {
        console.log('\n🧪 Testing gemini-2.0-flash-exp...');
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
        const result = await model.generateContent('Say hello');
        console.log('✅ Success!');
        console.log('Response:', result.response.text());
    } catch (error: any) {
        console.error('❌ Error with gemini-2.0-flash-exp:');
        console.error('Message:', error.message);
        console.error('Status:', error.status);
        console.error('Full error:', error);
    }

    try {
        console.log('\n🧪 Testing gemini-1.5-flash...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say hello');
        console.log('✅ Success!');
        console.log('Response:', result.response.text());
    } catch (error: any) {
        console.error('❌ Error with gemini-1.5-flash:');
        console.error('Message:', error.message);
        console.error('Status:', error.status);
    }
}

test();
