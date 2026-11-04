import { CompetitorProfile, CompetitiveOpportunity } from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';
import { SeoAuditReport } from '../../types/seoChecker';
import { askAdvisor } from '../advisor/advisorService';

export type CompetitorAiAction =
  | 'analyse_competitors'
  | 'find_opportunities'
  | 'compare_messaging'
  | 'suggest_differentiation'
  | 'content_strategy'
  | 'service_presentation_gaps';

export interface GenerateCompetitorAiParams {
  action: CompetitorAiAction;
  answers: AssessmentAnswers;
  competitors: CompetitorProfile[];
  opportunities: CompetitiveOpportunity[];
  latestSeoAudit?: SeoAuditReport | null;
  customPrompt?: string;
}

/**
 * Executes a grounded competitive strategy query through the AI Marketing Advisor.
 */
export async function executeCompetitorAiStrategy(
  params: GenerateCompetitorAiParams
): Promise<string> {
  const { action, answers, competitors, opportunities, latestSeoAudit, customPrompt } = params;

  const bizName = answers.businessName || 'Our Business';
  const category = answers.category;
  const city = answers.cityArea || 'Our Service Area';

  // Format competitor summary
  const competitorSummaries = competitors.map((c, i) => {
    const obsList = (c.observations || [])
      .map((o) => `  - [Observation on ${new Date(o.dateObserved).toLocaleDateString()}]: ${o.whatTheyDoWell || ''} ${o.opportunitiesSeen || ''}`)
      .join('\n');

    return `Competitor #${i + 1}: ${c.businessName} (${c.websiteUrl || 'No website'})
- Stated Value Proposition: "${c.communicatedValueProp || 'None specified'}"
- Promoted Services: ${c.visibleServices?.join(', ') || 'Standard offerings'}
- Primary Call to Action: "${c.primaryCta || 'None'}"
- Public Reviews: ${c.reviewRating ? `${c.reviewRating}★ (${c.reviewCount || 0} reviews)` : 'Not checked'}
- Content Themes: ${c.contentThemes?.join(', ') || 'Minimal'}
${obsList ? `- User Observations:\n${obsList}` : ''}`;
  }).join('\n\n');

  // Format opportunities
  const opportunitiesSummary = opportunities.map((o, i) => (
    `${i + 1}. [${o.category.toUpperCase()}] ${o.title}: ${o.observation} -> Suggested Action: ${o.suggestedAction}`
  )).join('\n');

  let prompt = '';

  switch (action) {
    case 'analyse_competitors':
      prompt = `Act as the TapGrow Senior Marketing Strategist.
Please perform a rigorous, grounded Competitor Analysis for ${bizName} (${category.replace(/_/g, ' ')} in ${city}).

Actual Competitor Data Recorded:
${competitorSummaries || 'No competitors added yet.'}

CRITICAL RULES:
1. Base your analysis STRICTLY on the actual verified and manual observations provided above.
2. Never invent competitor financial figures, search traffic, or internal strategies.
3. Structure your response with:
   - **Executive Summary of the Local Competitive Landscape**
   - **Strengths of the Local Competitors**
   - **Common Weaknesses or Blind Spots Across Competitors**
   - **Key Strategic Takeaways for ${bizName}**`;
      break;

    case 'find_opportunities':
      prompt = `Act as the TapGrow Senior Marketing Strategist.
Identify our top 4 most actionable local market opportunities against these competitors:

Business: ${bizName} in ${city}
Current Audited Opportunities:
${opportunitiesSummary || 'Standard local market baseline'}

Competitor Intelligence:
${competitorSummaries}

Provide:
1. **Opportunity Name & Rationale**: Why this gap exists.
2. **Competitive Advantage**: Why competitors cannot easily copy this immediately.
3. **Execution Steps**: Concrete actions we can take this week.
4. **Expected Impact**: How this helps local customers choose ${bizName}.`;
      break;

    case 'compare_messaging':
      prompt = `Act as the TapGrow Brand Positioning Specialist.
Compare the public website messaging and value propositions between ${bizName} and our local competitors:

Our Business: ${bizName} (${category} in ${city})
Our Main Goal: ${answers.mainGoal.replace(/_/g, ' ')}
Competitors:
${competitorSummaries}

Please evaluate:
1. **Headline & Hero Positioning Comparison**: How clear is the promise?
2. **Trust & Social Proof Comparison**: Guarantees, credentials, and customer reassurance.
3. **Call-to-Action Friction**: Which business makes it easiest to get started?
4. **Recommended Messaging Rewrite for ${bizName}**: Suggest a punchy 1-sentence value proposition and hero headline that stands out distinctly.`;
      break;

    case 'suggest_differentiation':
      prompt = `Act as the TapGrow Differentiation & Growth Strategist.
Recommend 3 distinct angles for ${bizName} to stand out from local competitors in ${city}:

Competitor Context:
${competitorSummaries}

For each differentiation angle, provide:
1. **The Unique Angle** (e.g. speed/convenience, radical pricing transparency, specialized local craftsmanship, or neighborhood commitment).
2. **How to Communicate It**: Exact phrase or badge to put on the homepage and Google Business Profile.
3. **Operational Requirement**: What we need to deliver consistently to back up the claim.`;
      break;

    case 'content_strategy':
      prompt = `Act as the TapGrow Content Strategist.
Generate a competitor-informed local content strategy for ${bizName} in ${city}.

Competitor Content Themes Observed:
${competitors.map((c) => `- ${c.businessName}: ${c.contentThemes?.join(', ') || 'No content'}`).join('\n')}

Deliver:
1. **Content Topics Competitors are Ignoring**: 4 specific questions local customers have that none of the competitors are answering.
2. **Weekly Content Calendar Plan**: 3 high-impact posts or short videos for this week.
3. **Call-to-Action Script**: How to direct viewers to our booking/contact link.`;
      break;

    case 'service_presentation_gaps':
      prompt = `Act as the TapGrow Service Experience Architect.
Review how services are presented across our competitive set:

Competitor Services:
${competitors.map((c) => `- ${c.businessName}: ${c.visibleServices?.join(', ') || 'Not listed'}`).join('\n')}

Identify:
1. **Gaps in Service Clarity**: Where are competitors vague (e.g. "call for details" or missing package names)?
2. **Service Package Ideas**: How ${bizName} can package its offerings into clear, transparent tiers (e.g. Essential, Comprehensive, Emergency).
3. **Action Plan**: Specific updates to make to our website service menu.`;
      break;
  }

  if (customPrompt) {
    prompt += `\n\nAdditional User Request:\n"${customPrompt}"`;
  }

  const response = await askAdvisor({
    userMessage: prompt,
    answers,
    conversationHistory: [],
  });

  return response.text;
}
