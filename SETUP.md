# BasedQuiz - Environment Setup

## Required Environment Variables

You need to add the following to your `.env.local` file:

### 1. MongoDB Connection String

Sign up for MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas

1. Create a new cluster
2. Go to "Database Access" and create a database user
3. Go to "Network Access" and add your IP (or allow from anywhere: 0.0.0.0/0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

Add to `.env.local`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/basedquiz?retryWrites=true&w=majority
```

Replace `username` and `password` with your database credentials.

### 2. Gemini API Key

Get a free API key from Google AI Studio: https://makersuite.google.com/app/apikey

Add to `.env.local`:
```
GEMINI_API_KEY=your_api_key_here
```

## Complete .env.local Example

```bash
# Next.js
NEXT_PUBLIC_URL="http://localhost:3000"

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

NEYNAR_API_KEY=

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/basedquiz?retryWrites=true&w=majority

# Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

## Testing the App

Once you've added the environment variables:

1. The dev server should auto-reload
2. Open the app in the Warpcast embed tool
3. Click "Start Quiz" to test the flow
4. Questions will be generated using Gemini API
5. Scores will be saved to MongoDB
6. Check the leaderboard to see rankings

## Troubleshooting

- **MongoDB connection error**: Check your connection string and network access settings
- **Gemini API error**: Verify your API key is correct and has quota remaining
- **Questions not generating**: Check browser console for API errors
