import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY ?? '';

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
export const geminiModel = genAI?.getGenerativeModel({ model: 'gemini-1.5-flash' }) ?? null;
export const GEMINI_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 30_000);
