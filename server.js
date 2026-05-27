import process from 'node:process';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    'https://talentprompt.vercel.app',
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, curl, or server-to-server)
            if (!origin) return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.log(`Blocked by CORS: ${origin}`);
                callback(null, false);
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('Missing GEMINI_API_KEY in environment variables.');
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const parseQuestions = (text) => {
    return text
        .split('\n')
        .map((q) => q.replace(/^\d+[.\s-]+/, '').trim())
        .filter((q) => q.length > 0)
        .slice(0, 3);
};

// Define the limit rule: Max5 requests every 10 minutes per IP
const apiLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,
    // Using a dynamic handler function lets us customize the response cleanly
    handler: (req, res, next, options) => {
        return res.status(429).json({
            status: 'throttled',
            // A friendly message explaining the "why" behind the limit
            error: "You've generated a few roles! To keep our community free-tier tokens safe from automated bots, we cap requests at 5 per 10 minutes. Please take a quick breather and try again shortly!",
            retryAfterMins: 10,
        });
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply the limiter strictly to your AI generation route
app.post('/api/questions', apiLimiter, async (req, res) => {
    const { jobTitle } = req.body;

    if (!jobTitle || typeof jobTitle !== 'string' || !jobTitle.trim()) {
        return res.status(400).json({ error: 'jobTitle is required' });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are an expert HR manager. Generate exactly 3 thoughtful, role-specific interview questions for a candidate applying for the position of: ${jobTitle}. Provide only the questions in a plain numbered list format, without any introductory or concluding text.`,
        });

        const questions = parseQuestions(response.text);
        return res.json({ questions });
    } catch (error) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({
            error: error?.message || 'Failed to generate interview questions',
        });
    }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`Gemini proxy server listening on http://localhost:${port}`);
});
