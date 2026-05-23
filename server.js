import process from 'node:process';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const app = express();

const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

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

app.post('/api/questions', async (req, res) => {
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
        return res
            .status(500)
            .json({
                error:
                    error?.message || 'Failed to generate interview questions',
            });
    }
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
    console.log(`Gemini proxy server listening on http://localhost:${port}`);
});
