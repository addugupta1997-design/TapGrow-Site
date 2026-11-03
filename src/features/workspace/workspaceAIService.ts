import { AssessmentAnswers } from '../../types/assessment';
import { askAdvisor } from '../advisor/advisorService';
import { ContentItem, Campaign, SavedIdea } from '../../types/workspace';

export interface GeneratedContentDraft {
  title: string;
  platform: 'instagram' | 'facebook' | 'linkedin' | 'youtube' | 'tiktok' | 'google_business';
  contentType: 'reel' | 'image_post' | 'carousel' | 'story' | 'short_video' | 'blog_article';
  caption: string;
  hashtags: string[];
  callToAction: string;
}

export interface GeneratedCampaignConcept {
  name: string;
  objective: string;
  description: string;
  targetAudience: string;
  marketingChannel: string;
  durationWeeks: number;
  starterContentIdeas: string[];
}

/**
 * 1. Generates 4 tailored content ideas based on business category and current goal.
 */
export async function generateContentIdeasAI(
  answers: AssessmentAnswers,
  topicPrompt?: string
): Promise<string> {
  const bizName = answers.businessName || 'Our Business';
  const category = answers.category;
  const goal = answers.mainGoal;

  const prompt = `Act as the TapGrow Marketing Advisor.
Please generate 4 distinct, high-engagement content ideas tailored specifically for:
- Business: ${bizName}
- Category: ${category}
- Main Growth Goal: ${goal}
${topicPrompt ? `- Focused Topic or Theme: ${topicPrompt}` : ''}

Format each idea clearly with:
1. **Title & Format** (e.g., Reel, Carousel, Photo Post)
2. **Hook / Concept** (what catches attention)
3. **Key Value or Visual**
4. **Suggested Call to Action**

Make sure these ideas are practical for a small local business owner to produce with a phone in under 20 minutes.`;

  const response = await askAdvisor({
    userMessage: prompt,
    answers,
    conversationHistory: [],
  });

  return response.text;
}

/**
 * 2. Improves an existing caption with selected tone.
 */
export async function improveCaptionAI(
  answers: AssessmentAnswers,
  originalCaption: string,
  tone: 'engaging' | 'friendly' | 'promotional' | 'educational' = 'engaging'
): Promise<string> {
  const prompt = `Act as the TapGrow Copywriting Assistant.
Please improve and polish this social media caption for ${answers.businessName || 'our local business'}.

Current Draft Caption:
"${originalCaption}"

Requested Tone: ${tone.toUpperCase()}

Please provide:
1. **Polished Caption** (with strong opening line, natural readability, and clear spacing)
2. **Clear Call to Action (CTA)**
3. **5–8 Relevant Local & Niche Hashtags**`;

  const response = await askAdvisor({
    userMessage: prompt,
    answers,
    conversationHistory: [],
  });

  return response.text;
}

/**
 * 3. Suggests 5 scroll-stopping video/post hooks tailored to the category.
 */
export async function suggestContentHooksAI(
  answers: AssessmentAnswers,
  topic?: string
): Promise<string> {
  const prompt = `Generate 5 scroll-stopping video/reel hooks for ${answers.businessName || 'a local business'} in the ${answers.category.replace(/_/g, ' ')} industry.
${topic ? `Topic: ${topic}` : ''}

Include:
- 2 curiosity/mistake hooks
- 2 transformation/benefit hooks
- 1 local community hook

Keep each hook under 12 words, punchy, and formatted as a numbered list with a 1-sentence explanation of why it works.`;

  const response = await askAdvisor({
    userMessage: prompt,
    answers,
    conversationHistory: [],
  });

  return response.text;
}

/**
 * 4. Generates a strategic campaign concept for local business.
 */
export async function suggestCampaignConceptAI(
  answers: AssessmentAnswers,
  campaignTheme?: string
): Promise<string> {
  const prompt = `Create a high-impact local marketing campaign concept for ${answers.businessName || 'our business'} (${answers.category.replace(/_/g, ' ')} in ${answers.cityArea || 'our city'}).
${campaignTheme ? `Theme or Occasion: ${campaignTheme}` : ''}

Please outline:
- **Campaign Name**: Catchy, local-friendly title
- **Core Objective**: (e.g., attract 20 new local clients, increase weekday foot traffic)
- **Target Audience**: Who this speaks to
- **The Core Offer / Story**: What makes it compelling
- **Recommended Channels**: (e.g., Google Business Profile, Instagram, In-Store Signage)
- **3-Week Execution Roadmap**: Step-by-step weekly focus
- **Suggested Budget**: Realistic low/zero budget recommendations`;

  const response = await askAdvisor({
    userMessage: prompt,
    answers,
    conversationHistory: [],
  });

  return response.text;
}

/**
 * 5. Generates high-converting promotional copy.
 */
export async function generatePromotionalCopyAI(
  answers: AssessmentAnswers,
  offerDetails: string
): Promise<string> {
  const prompt = `Write promotional copy for ${answers.businessName || 'our local business'} based on this offer or event:
"${offerDetails}"

Please provide 2 options:
- **Option 1: Short Social Post (Instagram/Facebook)**: Punchy, urgent, emoji-spaced, includes CTA & hashtags.
- **Option 2: Google Business Profile Update / Email Blurb**: Professional, informative, emphasizing dates, location, and how to claim.`;

  const response = await askAdvisor({
    userMessage: prompt,
    answers,
    conversationHistory: [],
  });

  return response.text;
}
