import { AssessmentAnswers } from '../../types/assessment';
import { BusinessIntelligenceProfile, buildBusinessIntelligenceProfile } from '../recommendations/businessProfile';
import {
  ChatMessage,
  StructuredAdviceSection,
  GeneratedMarketingStrategy,
  AdvisorServiceStatus,
} from '../../types/advisor';
import {
  generateLocalAdvisorResponse,
  generateStructuredMarketingStrategy,
} from './localAdvisorEngine';

let cachedStatus: AdvisorServiceStatus | null = null;
let lastStatusCheck = 0;

/**
 * Checks server-side Gemini API availability.
 * Caches status for 60 seconds to avoid spamming the endpoint.
 */
export async function checkAdvisorServiceStatus(): Promise<AdvisorServiceStatus> {
  const now = Date.now();
  if (cachedStatus && now - lastStatusCheck < 60000) {
    return cachedStatus;
  }

  try {
    const res = await fetch('/api/advisor/status', {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      cachedStatus = {
        configured: Boolean(data.configured),
        provider: data.configured ? 'gemini' : 'local',
        model: data.model || 'gemini-3.8-flash',
        notice: data.notice,
      };
      lastStatusCheck = now;
      return cachedStatus;
    }
  } catch {
    // Server endpoint not reachable (e.g. static hosting)
  }

  cachedStatus = {
    configured: false,
    provider: 'local',
    notice: 'AI Advisor running in Local Strategy & Knowledge Mode (No remote API key required).',
  };
  lastStatusCheck = now;
  return cachedStatus;
}

export interface AskAdvisorParams {
  userMessage: string;
  answers: AssessmentAnswers;
  conversationHistory: ChatMessage[];
}

export interface AdvisorResponseResult {
  text: string;
  source: 'gemini' | 'local_engine';
  structuredAdvice?: StructuredAdviceSection;
}

/**
 * Sends a question to the advisor.
 * If server-side Gemini is available, proxies to `/api/advisor/chat`.
 * Otherwise, falls back to the local deterministic strategy engine.
 */
export async function askAdvisor(params: AskAdvisorParams): Promise<AdvisorResponseResult> {
  const { userMessage, answers, conversationHistory } = params;
  const profile = buildBusinessIntelligenceProfile(answers);

  // Check if server Gemini API is available
  const status = await checkAdvisorServiceStatus();

  if (status.configured) {
    try {
      const payload = {
        message: userMessage,
        businessProfile: profile,
        answers: {
          category: answers.category,
          businessModel: answers.businessModel,
          hasWebsite: answers.hasWebsite,
          hasBusinessListing: answers.hasBusinessListing,
          askForReviews: answers.askForReviews,
          clearConversionAction: answers.clearConversionAction,
          mainGoal: answers.mainGoal,
          weeklyHours: answers.weeklyHours,
          budgetPreference: answers.budgetPreference,
        },
        history: conversationHistory.slice(-6).map((m) => ({
          role: m.role,
          content: m.content,
        })),
      };

      const res = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.text) {
          return {
            text: data.text,
            source: 'gemini',
            structuredAdvice: data.structuredAdvice,
          };
        }
      }
    } catch (err) {
      console.warn('Server AI call failed, falling back to local strategy engine:', err);
    }
  }

  // Graceful deterministic fallback
  const localResult = generateLocalAdvisorResponse(
    userMessage,
    profile,
    answers,
    conversationHistory
  );

  return {
    text: localResult.text,
    source: 'local_engine',
    structuredAdvice: localResult.structuredAdvice,
  };
}

/**
 * Generates an 8-part Marketing Strategy.
 * Tries server-side Gemini first, then falls back to local engine.
 */
export async function generateMarketingStrategyPlan(
  answers: AssessmentAnswers
): Promise<GeneratedMarketingStrategy> {
  const profile = buildBusinessIntelligenceProfile(answers);
  const status = await checkAdvisorServiceStatus();

  if (status.configured) {
    try {
      const res = await fetch('/api/advisor/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessProfile: profile,
          answers,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.businessOverview) {
          return data as GeneratedMarketingStrategy;
        }
      }
    } catch (err) {
      console.warn('Server strategy generation failed, falling back to local engine:', err);
    }
  }

  // Local deterministic generator
  return generateStructuredMarketingStrategy(profile, answers);
}
