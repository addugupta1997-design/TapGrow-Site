import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize GoogleGenAI client utility if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey.trim()) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

import { safeFetchHtml } from './server/seoScraper.js';

// ==========================================
// API ENDPOINTS
// ==========================================

// 0. Website & SEO Audit Endpoint (SSRF Protected)
app.post('/api/audit/website', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'A valid website URL string is required.' });
    }

    const scrapeResult = await safeFetchHtml(url);
    res.json({
      success: true,
      scrapeResult,
    });
  } catch (err: any) {
    console.error('Audit crawl error:', err.message);
    res.status(400).json({
      error: err.message || 'Failed to crawl target website.',
    });
  }
});

// 1. Advisor Status Endpoint
app.get('/api/advisor/status', (_req, res) => {
  const isConfigured = Boolean(aiClient);
  res.json({
    configured: isConfigured,
    provider: isConfigured ? 'gemini' : 'local',
    model: 'gemini-3.8-flash',
    notice: isConfigured
      ? 'Connected to Gemini 3.8 Flash via server proxy.'
      : 'AI Advisor running in Local Strategy & Knowledge Mode (No remote API key required).',
  });
});

// 2. Advisor Chat Endpoint
app.post('/api/advisor/chat', async (req, res) => {
  if (!aiClient) {
    return res.status(200).json({
      configured: false,
      text: null,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local strategy engine.',
    });
  }

  try {
    const { message, businessProfile, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing user message string' });
    }

    const bizName = businessProfile?.businessName || 'the local business';
    const category = businessProfile?.categoryLabel || 'local business';
    const location = businessProfile?.locationDisplay || 'local service area';
    const goal = businessProfile?.primaryGoal || 'growth';
    const weeklyTime = businessProfile?.weeklyTime || '1 to 3 hours';
    const budget = businessProfile?.budgetPreference || 'mostly free';
    const strengths = Array.isArray(businessProfile?.verifiedStrengths)
      ? businessProfile.verifiedStrengths.join(', ')
      : 'None noted';
    const weaknesses = Array.isArray(businessProfile?.identifiedWeaknesses)
      ? businessProfile.identifiedWeaknesses.join(', ')
      : 'None noted';

    const systemInstruction = `You are the TapGrow AI Marketing Advisor—a senior digital marketing strategist, local SEO architect, and pragmatic advisor dedicated to helping small and local businesses succeed.

You are advising: ${bizName} (${category} in ${location}).
Profile Context:
- Primary Goal: ${goal}
- Weekly Time Dedicated: ${weeklyTime}
- Budget: ${budget}
- Current Verified Strengths: ${strengths}
- Current Identified Gaps: ${weaknesses}

CRITICAL RULES:
1. Never invent or fabricate business information. If key details are missing, ask a brief, relevant follow-up question.
2. Provide simple, jargon-free, actionable guidance tailored to small business owners.
3. When appropriate, structure advice using these 7 components:
   1. Understanding of the problem
   2. Business-specific observation
   3. Recommended solution
   4. Step-by-step implementation (numbered list)
   5. Estimated effort
   6. Expected benefit
   7. Suggested next action
4. Do not force every single answer into the 7-part structure if a brief, direct answer is more helpful.
5. Emphasize organic discovery (Google Business Profile, local reviews, mobile website clarity) before recommending paid ads.
6. Format your advice using clean, professional Markdown: use **bold** for key concepts, bullet lists (-) for options, numbered lists (1., 2.) for step-by-step instructions, subheadings (###) for distinct sections, and \`inline code\` for technical terms, URLs, or buttons.`;

    const chatContents = [];
    if (Array.isArray(history)) {
      for (const h of history) {
        if (h.role === 'user' || h.role === 'assistant') {
          chatContents.push(`${h.role === 'user' ? 'User' : 'Advisor'}: ${h.content}`);
        }
      }
    }
    chatContents.push(`User query: ${message}`);

    const promptText = chatContents.join('\n\n');

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptText,
      config: {
        systemInstruction,
      },
    });

    const replyText = response.text || 'I analyzed your request and recommend focusing on your core local visibility foundations.';
    res.json({
      text: replyText,
      source: 'gemini',
    });
  } catch (err: any) {
    console.error('Gemini API chat error:', err);
    res.status(500).json({
      error: 'Failed to generate response from Gemini model',
      details: err?.message,
    });
  }
});

// 3. Strategy Blueprint Endpoint
app.post('/api/advisor/strategy', async (req, res) => {
  if (!aiClient) {
    return res.status(200).json({
      configured: false,
      message: 'GEMINI_API_KEY is not configured on the server. Falling back to local strategy generator.',
    });
  }

  try {
    const { businessProfile } = req.body;
    const bizName = businessProfile?.businessName || 'Local Business';
    const category = businessProfile?.categoryLabel || 'Local Business';
    const location = businessProfile?.locationDisplay || 'Local Area';

    const prompt = `Generate a comprehensive 8-part Local Marketing Strategy for ${bizName} (${category} in ${location}).
Return a clean JSON object with keys:
- businessOverview: { title, summary, points: string[] }
- currentSituation: { title, summary, points: string[] }
- mainOpportunities: { title, summary, points: string[] }
- shortTermPriorities: { title, summary, points: string[] }
- longTermObjectives: { title, summary, points: string[] }
- recommendedChannels: { title, summary, points: string[] }
- implementationSteps: { title, summary, points: string[] }
- successMeasurements: { title, summary, points: string[] }
- markdownContent: complete Markdown version of the strategy document`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      ...parsed,
      id: `strategy_${Date.now()}`,
      businessName: bizName,
      businessCategory: businessProfile?.category || 'other_local',
      categoryLabel: category,
      createdAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Gemini strategy generation error:', err);
    res.status(500).json({
      error: 'Failed to generate strategy blueprint with Gemini',
      details: err?.message,
    });
  }
});

// ==========================================
// VITE / STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TapGrow full-stack server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
