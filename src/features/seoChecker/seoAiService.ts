import { AuditFinding, SeoAuditReport } from '../../types/seoChecker';
import { askAdvisor } from '../advisor/advisorService';
import { AssessmentAnswers } from '../../types/assessment';

export interface SeoAiFixResult {
  actionType: 'meta_description' | 'title' | 'local_service_page' | 'technical_explainer';
  content: string;
}

/**
 * Generates an AI-powered fix tailored to the specific audit finding and business profile.
 */
export async function generateSeoAiFix(
  finding: AuditFinding,
  report: SeoAuditReport,
  answers?: AssessmentAnswers
): Promise<string> {
  const bizName = report.businessProfileUsed?.name || answers?.businessName || 'Our Business';
  const bizCity = report.businessProfileUsed?.cityArea || answers?.cityArea || 'Local Service Area';
  const bizCategory = report.businessProfileUsed?.category || answers?.category || 'Local Business';

  const defaultAnswers: AssessmentAnswers = answers || {
    businessName: bizName,
    country: 'United States',
    cityArea: bizCity,
    category: 'other_local',
    businessModel: 'service_area',
    hasWebsite: 'yes',
    hasBusinessListing: 'yes',
    socialPresence: 'one',
    discoveryMethods: ['word_of_mouth', 'google_search'],
    contactConsistent: 'yes',
    askForReviews: 'yes',
    websiteDetailsClear: 'yes',
    publishesContent: 'not_sure',
    tracksMarketing: 'not_sure',
    clearConversionAction: 'yes',
    mainGoal: 'local_visibility',
    weeklyHours: '1_to_3h',
    budgetPreference: 'free_only',
  };

  let prompt = '';

  if (finding.aiActionType === 'meta_description' || finding.id === 'onpage_description') {
    prompt = `Act as the TapGrow SEO Specialist.
Write 3 optimized, high-converting Google Meta Descriptions for this local business:
- Business Name: ${bizName}
- Target City / Location: ${bizCity}
- Category / Services: ${bizCategory}
- Current Web Page: ${report.normalizedUrl}
${report.rawHighlights.metaDescription ? `- Current Meta Description: "${report.rawHighlights.metaDescription}"` : '- Currently Missing Meta Description.'}

Requirements:
1. Provide 3 distinct options:
   - **Option 1: Direct & Action-Focused** (emphasizing quick response / booking)
   - **Option 2: Trust & Reputation-Focused** (emphasizing experience, quality, or reviews)
   - **Option 3: Local Neighborhood-Focused** (emphasizing local community & exact city)
2. Every option MUST be strictly between 130 and 155 characters (ideal Google display length).
3. Include character count next to each option (e.g., "[142 chars]").
4. Include a clear call to action in each (e.g., "Call today", "Get a free quote", "Book online").`;
  } else if (finding.aiActionType === 'title' || finding.id === 'onpage_title' || finding.id === 'onpage_h1') {
    prompt = `Act as the TapGrow SEO Specialist.
Generate 4 high-impact Google Page Titles (<title>) and matching <h1> headings for:
- Business Name: ${bizName}
- Target City / Market: ${bizCity}
- Industry / Category: ${bizCategory}
- Current Title: "${report.rawHighlights.title || 'None'}"

Requirements:
1. Keep each title strictly under 60 characters so Google does not cut it off with ellipses (...).
2. Show the character count for each title (e.g. "[54 chars]").
3. Format formulas:
   - **Formula A (Service + City + Brand)**: [Primary Service] in [City] | [Brand Name]
   - **Formula B (Brand + Core Benefit + City)**: [Brand Name] - [Benefit] | [City]
   - **Formula C (Emergency / Fast Action)**: 24/7 [Service] in [City] - [Brand Name]
   - **Formula D (Recommended H1 Heading)**: Complementary headline for the top of the homepage
4. Provide a 1-sentence tip on why this title converts local searchers.`;
  } else if (finding.aiActionType === 'local_service_page' || finding.category === 'content') {
    prompt = `Act as the TapGrow SEO Specialist.
Create an outline and high-converting content draft for a high-ranking Local Service section or page for:
- Business: ${bizName}
- City: ${bizCity}
- Category: ${bizCategory}
- Issue Found: Thin content or missing local service keyword depth.

Please provide:
1. **Target Local SEO Keywords**: 5 high-intent local search queries small customers use.
2. **Recommended H1 and H2 Structure**: Clear headings separating services.
3. **Draft Body Content (250–300 words)**: Friendly, professional, locally anchored text describing core offerings, guarantees, and why choose ${bizName}.
4. **Primary Call to Action Section**: Compelling button copy and phone prompt.
5. **Ready-to-Paste LocalBusiness JSON-LD Schema snippet** with placeholder fields for address and phone.`;
  } else {
    // Technical explainer
    prompt = `Act as the TapGrow Technical SEO Specialist.
Explain this technical audit finding in simple, non-intimidating plain English for a small local business owner:
- Finding Title: ${finding.title}
- Category: ${finding.category}
- Observed Signal: ${finding.observed}
- Recommendation: ${finding.recommendation}

Please provide:
1. **What this means in plain English** (no confusing jargon).
2. **Why it directly impacts local search visibility or sales**.
3. **Step-by-step fix instructions for popular platforms**:
   - For **WordPress** (using Yoast or RankMath)
   - For **Squarespace / Wix**
   - For **Shopify** or custom HTML
4. **How long it should take** (e.g. 5–10 minutes) and how to verify it is resolved.`;
  }

  const response = await askAdvisor({
    userMessage: prompt,
    answers: defaultAnswers,
    conversationHistory: [],
  });

  return response.text;
}
