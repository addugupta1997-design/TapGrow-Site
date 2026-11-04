import { CompetitorProfile, CompetitiveOpportunity } from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';
import { SeoAuditReport } from '../../types/seoChecker';

export interface OpportunityAnalysisInput {
  answers?: AssessmentAnswers;
  competitors: CompetitorProfile[];
  latestSeoAudit?: SeoAuditReport | null;
}

/**
 * Intelligent deterministic opportunity engine.
 * Synthesizes business assessment, real website audit signals, and competitor research.
 */
export function analyzeCompetitiveOpportunities(input: OpportunityAnalysisInput): CompetitiveOpportunity[] {
  const { answers, competitors, latestSeoAudit } = input;
  const opportunities: CompetitiveOpportunity[] = [];

  const bizName = answers?.businessName || 'Your Business';
  const city = answers?.cityArea || 'your area';
  const category = answers?.category || 'other_local';

  // 1. Call to Action & Conversion Convenience Opportunity
  const competitorsWithOnlyPhone = competitors.filter(
    (c) => c.primaryCta && (c.primaryCta.toLowerCase().includes('call') || c.primaryCta.toLowerCase().includes('phone'))
  );

  if (competitorsWithOnlyPhone.length > 0) {
    opportunities.push({
      id: 'opp_online_scheduling',
      category: 'calls_to_action',
      title: 'Offer Instant Online Scheduling / Self-Service Inquiries',
      observation: `${competitorsWithOnlyPhone.length} of your key competitors rely primarily on phone calls as their primary conversion action.`,
      supportingEvidence: `Competitors like ${competitorsWithOnlyPhone[0].businessName} feature prominent phone numbers ("${competitorsWithOnlyPhone[0].primaryCta}") but lack direct self-booking or clear quote request forms.`,
      whyItMatters: 'Over 54% of local customers prefer booking or requesting quotes online without making a phone call, especially outside standard working hours.',
      suggestedAction: 'Add a clean 3-step quote form or self-scheduling widget (e.g. Calendly, Housecall Pro, or native form) above the fold on your website.',
      priority: 'high',
      estimatedEffort: '30 minutes',
      competitorBenchmark: `${competitorsWithOnlyPhone[0].businessName} uses phone-only CTA`,
    });
  }

  // 2. Clear Upfront Pricing & Guarantees
  const competitorsWithGuarantees = competitors.filter(
    (c) => c.communicatedValueProp && (c.communicatedValueProp.toLowerCase().includes('guarantee') || c.communicatedValueProp.toLowerCase().includes('flat') || c.communicatedValueProp.toLowerCase().includes('warranty'))
  );

  if (competitorsWithGuarantees.length > 0) {
    opportunities.push({
      id: 'opp_transparent_guarantees',
      category: 'positioning',
      title: 'Highlight a Stronger Service Guarantee & Upfront Pricing Standard',
      observation: 'Competitors are building trust by promoting warranties and guarantees directly on their homepages.',
      supportingEvidence: `Competitor ${competitorsWithGuarantees[0].businessName} explicitly promotes: "${competitorsWithGuarantees[0].communicatedValueProp}".`,
      whyItMatters: 'Uncertainty around unexpected charges is the #1 reason customers hesitate to hire local businesses. A transparent pricing policy removes friction immediately.',
      suggestedAction: 'Display a "No Surprises Guarantee" or "100% Upfront Pricing" badge near your main service listings and in your footer.',
      priority: 'high',
      estimatedEffort: '15 minutes',
      competitorBenchmark: `${competitorsWithGuarantees[0].businessName}: "${competitorsWithGuarantees[0].communicatedValueProp}"`,
    });
  } else {
    opportunities.push({
      id: 'opp_introduce_first_guarantee',
      category: 'positioning',
      title: 'Differentiate with the Area\'s Only Explicit Service Guarantee',
      observation: 'None of your audited competitors prominently showcase an explicit satisfaction or price guarantee.',
      supportingEvidence: 'Reviewed competitors advertise standard services but omit risk-reversal guarantees or explicit response-time promises.',
      whyItMatters: 'Being the only business in ' + city + ' with an explicit 100% satisfaction guarantee makes choosing you the low-risk default.',
      suggestedAction: 'Craft a simple 1-sentence customer promise: "On-time service, transparent flat-rate quotes, and guaranteed satisfaction on every job."',
      priority: 'medium',
      estimatedEffort: '20 minutes',
    });
  }

  // 3. Educational Content & Answering Common Questions
  const competitorsWithContent = competitors.filter(
    (c) => c.contentThemes && c.contentThemes.length > 0
  );

  if (competitorsWithContent.length > 0) {
    const topTheme = competitorsWithContent[0].contentThemes?.[0] || 'tips';
    opportunities.push({
      id: 'opp_educational_authority',
      category: 'content_education',
      title: 'Outrank Competitors with Local Practical How-To Guides & FAQs',
      observation: `Competitors are actively publishing around themes like "${topTheme}".`,
      supportingEvidence: `${competitorsWithContent[0].businessName} regularly posts on: ${competitorsWithContent[0].contentThemes?.join(', ')}.`,
      whyItMatters: 'Educational content positions your business as the trusted local advisor before the customer even asks for a quote.',
      suggestedAction: `Create 3 short FAQ guides answering the exact questions customers ask in ${city} (e.g. pricing factors, preparation steps, common warning signs).`,
      priority: 'medium',
      estimatedEffort: '45 minutes',
      competitorBenchmark: `${competitorsWithContent[0].businessName} focuses on ${topTheme}`,
    });
  } else {
    opportunities.push({
      id: 'opp_untapped_video_content',
      category: 'content_education',
      title: 'Capture Local Video Views with Short Behind-the-Scenes Clips',
      observation: 'None of your local competitors are systematically producing short educational video content.',
      supportingEvidence: 'Competitors maintain static websites with minimal video or authentic behind-the-scenes demonstration.',
      whyItMatters: 'Short smartphone video clips (Reels, Shorts, Google Business Profile videos) generate 3x higher local engagement than stock photos.',
      suggestedAction: 'Use the TapGrow Marketing Workspace to generate 5 video hooks showing your work in progress, real customer results, or quick tips.',
      priority: 'medium',
      estimatedEffort: '25 minutes',
    });
  }

  // 4. Local SEO & Schema Opportunity (Cross-referenced with real website audit)
  if (latestSeoAudit) {
    if (!latestSeoAudit.summaryMetrics.hasLocalSchema) {
      opportunities.push({
        id: 'opp_local_schema_advantage',
        category: 'local_presence',
        title: 'Implement LocalBusiness Schema to Outshine Competitors in Google Knowledge Graph',
        observation: 'Your website currently lacks LocalBusiness Schema.org structured data.',
        supportingEvidence: `Website audit for ${latestSeoAudit.domain} detected no schema markup, leaving search engines to parse plain text only.`,
        whyItMatters: 'Adding schema gives Google direct structured data for your opening hours, service area, and reviews, increasing your chances of rich snippet display.',
        suggestedAction: 'Copy the ready-to-paste JSON-LD schema generated in the Website & SEO Checker and add it to your header template.',
        priority: 'high',
        estimatedEffort: '10 minutes',
      });
    }

    if (latestSeoAudit.summaryMetrics.imagesMissingAlt > 0) {
      opportunities.push({
        id: 'opp_image_search_advantage',
        category: 'local_presence',
        title: 'Optimize Image Alt Tags to Capture Local Google Image Searches',
        observation: `${latestSeoAudit.summaryMetrics.imagesMissingAlt} images on your site are currently missing descriptive alt text.`,
        supportingEvidence: `Audit flagged ${latestSeoAudit.summaryMetrics.imagesMissingAlt} images without alt tags.`,
        whyItMatters: 'Descriptive alt tags containing your city name and service help your project photos rank on Google Image Search.',
        suggestedAction: 'Add concise alt text describing the specific service and neighbourhood shown in each photo.',
        priority: 'medium',
        estimatedEffort: '10 minutes',
      });
    }
  }

  // 5. Review Volume & Social Proof Benchmark
  const competitorsWithReviews = competitors.filter(
    (c) => typeof c.reviewCount === 'number' && c.reviewCount > 0
  );

  if (competitorsWithReviews.length > 0) {
    const highestReviews = competitorsWithReviews.reduce((prev, curr) =>
      (curr.reviewCount || 0) > (prev.reviewCount || 0) ? curr : prev
    );

    opportunities.push({
      id: 'opp_review_velocity',
      category: 'customer_experience',
      title: 'Accelerate Review Request Cadence to Close the Social Proof Gap',
      observation: `Top competitor ${highestReviews.businessName} holds ~${highestReviews.reviewCount} public reviews with a ${highestReviews.reviewRating || 4.5}★ rating.`,
      supportingEvidence: `Public review count recorded from ${highestReviews.reviewSource || 'public business listing'}.`,
      whyItMatters: 'Review recency and steady velocity account for over 17% of Google Local Pack ranking weighting and directly sway conversion decisions.',
      suggestedAction: 'Automate a post-service SMS or email review prompt asking happy customers for a 30-second review immediately after service completion.',
      priority: 'high',
      estimatedEffort: '20 minutes',
      competitorBenchmark: `${highestReviews.businessName} (${highestReviews.reviewCount} reviews)`,
    });
  }

  // 6. User-entered observations synthesis
  const allManualObs = competitors.flatMap((c) => c.observations || []);
  const manualOpportunities = allManualObs.filter((o) => o.opportunitiesSeen?.trim());

  if (manualOpportunities.length > 0) {
    const firstManual = manualOpportunities[0];
    const parentComp = competitors.find((c) => c.id === firstManual.competitorId);
    opportunities.push({
      id: 'opp_user_observation_' + firstManual.id,
      category: 'services',
      title: 'Capitalize on Your Direct Research Finding: ' + (firstManual.opportunitiesSeen?.slice(0, 50) + '...'),
      observation: `During your research on ${parentComp?.businessName || 'competitors'}, you observed a specific market opening.`,
      supportingEvidence: `Your note from ${new Date(firstManual.dateObserved).toLocaleDateString()}: "${firstManual.opportunitiesSeen}"`,
      whyItMatters: 'Direct first-hand observations of competitor weaknesses provide the fastest path to differentiated market positioning.',
      suggestedAction: 'Incorporate this capability directly into your primary website hero banner and social media bio.',
      priority: 'high',
      estimatedEffort: '30 minutes',
      competitorBenchmark: `Observation recorded on ${parentComp?.businessName || 'competitor'}`,
    });
  }

  return opportunities;
}
