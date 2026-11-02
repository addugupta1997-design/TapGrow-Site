import { AssessmentAnswers } from '../../types/assessment';
import {
  RecommendationTemplate,
  PriorityLevel,
  GeneratedTask,
} from '../../types/recommendations';
import { BusinessIntelligenceProfile } from './businessProfile';

export interface RankingResult {
  score: number;
  priority: PriorityLevel;
  priorityReason: string;
  whySeeingThis: string;
}

/**
 * Deterministic multi-factor ranking formula for recommendations:
 *
 * Base Score =
 *   Category Relevance (0 - 25 pts)
 *   + Goal Alignment (0 - 30 pts)
 *   + Weakness Severity Match (0 - 35 pts)
 *   + Potential Impact (0 - 15 pts)
 *   - Effort Penalty relative to Capacity (-15 to 0 pts)
 *   + Budget Compatibility (+5 if free and user requested free, -10 if requires expense)
 *
 * Priority mapping:
 *   >= 70 -> High Priority
 *   40 - 69 -> Medium Priority
 *   < 40 -> Low Priority
 */
export function rankRecommendation(
  template: RecommendationTemplate,
  answers: AssessmentAnswers,
  profile: BusinessIntelligenceProfile,
  completedTaskIds: Set<string> = new Set()
): RankingResult {
  let score = 0;

  // 1. Category Relevance (0 - 25 pts)
  if (template.businessCategories === 'all') {
    score += 15;
  } else if (
    Array.isArray(template.businessCategories) &&
    template.businessCategories.includes(profile.category)
  ) {
    score += 25; // Highly tailored to specific category (e.g., restaurant menu, salon booking, trades area)
  }

  // 2. Goal Alignment (0 - 30 pts)
  const isGoalDirectMatch =
    template.targetGoals === 'all' ||
    (Array.isArray(template.targetGoals) && template.targetGoals.includes(profile.primaryGoal));

  if (isGoalDirectMatch) {
    score += 25;
  }

  // Preferred Focus bonus
  if (answers.preferredFocus && answers.preferredFocus !== 'all') {
    if (
      answers.preferredFocus === 'reviews' &&
      template.category === 'Reviews and reputation'
    ) {
      score += 20;
    } else if (
      answers.preferredFocus === 'website' &&
      (template.category === 'Website basics' ||
        template.category === 'Conversion improvements')
    ) {
      score += 20;
    } else if (
      answers.preferredFocus === 'local_seo' &&
      (template.category === 'Local SEO' ||
        template.category === 'Google Business Profile' ||
        template.category === 'Business listings')
    ) {
      score += 20;
    } else if (
      answers.preferredFocus === 'social_media' &&
      template.category === 'Social media'
    ) {
      score += 20;
    }
  }

  // 3. Weakness Severity Match (0 - 35 pts)
  // Directly award points if this recommendation solves a confirmed deficit in assessment answers
  let addressesWeakness = false;
  let weaknessExplanation = '';

  if (
    (template.id === 'rec_gbp_setup' || template.id === 'rec_gbp_attributes_photos') &&
    profile.isGoogleListingMissingOrUnknown
  ) {
    score += 35;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment indicates your Google Business Profile is not yet claimed or verified.';
  } else if (
    template.id === 'rec_nap_consistency' &&
    profile.isContactConsistent !== 'yes'
  ) {
    score += 30;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment noted that directory contact details may have inconsistent spellings or phone formats.';
  } else if (
    template.id === 'rec_review_system' &&
    !profile.isActivelyCollectingReviews
  ) {
    score += 30;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment indicated no active routine for requesting honest customer reviews.';
  } else if (
    template.id === 'rec_website_planning' &&
    !profile.hasWebsite
  ) {
    score += 35;
    addressesWeakness = true;
    weaknessExplanation =
      'Your business currently operates without an owned website storefront.';
  } else if (
    template.id === 'rec_website_clarity' &&
    profile.hasWebsite &&
    answers.websiteDetailsClear !== 'yes'
  ) {
    score += 30;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment noted that service offerings and geographical coverage on your website need clearer definition.';
  } else if (
    template.id === 'rec_cta_optimization' &&
    answers.clearConversionAction !== 'yes'
  ) {
    score += 30;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment highlighted the absence of an immediate, friction-free conversion call-to-action.';
  } else if (
    template.id === 'rec_lead_tracking' &&
    profile.tracksMarketing !== 'yes'
  ) {
    score += 25;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment indicated that incoming customer discovery sources are not tracked systematically.';
  } else if (
    template.id === 'rec_social_starter' &&
    profile.socialPresence === 'none'
  ) {
    score += 25;
    addressesWeakness = true;
    weaknessExplanation =
      'Your business currently has no active local social media presence.';
  }

  // Category-specific weakness checks:
  if (
    template.id === 'rec_cat_restaurant_menu' &&
    answers.restaurantOnlineMenu !== 'yes'
  ) {
    score += 35;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment indicated your restaurant dining menu is not yet available as mobile-friendly online text.';
  } else if (
    template.id === 'rec_cat_salon_pricelist' &&
    answers.salonServicePriceListOnline !== 'yes'
  ) {
    score += 35;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment noted that treatment service prices and durations are not transparently visible online.';
  } else if (
    template.id === 'rec_cat_homeservice_servicearea' &&
    answers.homeServiceAreaClarified !== 'yes'
  ) {
    score += 35;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment noted that trade service coverage radius and suburbs are not explicitly stated.';
  } else if (
    template.id === 'rec_cat_retail_showcase' &&
    answers.retailProductDiscoveryOnline !== 'yes'
  ) {
    score += 35;
    addressesWeakness = true;
    weaknessExplanation =
      'Your assessment indicated shoppers cannot preview top stocked brands before visiting your store.';
  }

  // 4. Base Impact Potential (0 - 15 pts)
  const impactWeight = template.baseImpactScore || 7;
  score += Math.round((impactWeight / 10) * 15);

  // 5. Effort vs Capacity Penalty
  if (profile.isTimeConstrained) {
    // Under 1 hour per week
    if (template.estimatedEffort.includes('1–2 hours') || template.estimatedEffort.includes('1 hour')) {
      score -= 15; // De-prioritize heavy multi-hour actions when owner has very little time
    } else if (template.estimatedEffort.includes('15 mins') || template.estimatedEffort.includes('20 mins')) {
      score += 10; // Boost quick-win high-leverage actions
    }
  }

  // 6. Budget Preference Compatibility
  if (profile.isZeroBudget) {
    if (template.tags.includes('free') || template.tags.includes('organic')) {
      score += 5;
    }
  }

  // 7. Prerequisite check
  if (template.prerequisites && template.prerequisites.length > 0) {
    const allPrereqsMet = template.prerequisites.every((reqId) =>
      completedTaskIds.has(reqId) || completedTaskIds.has(`task_${reqId}`)
    );
    if (!allPrereqsMet) {
      score -= 20; // Deprioritize advanced tasks until prerequisites are fulfilled
    }
  }

  // Determine priority tier based on calculated score
  let priority: PriorityLevel = 'Medium';
  if (score >= 65) {
    priority = 'High';
  } else if (score < 40) {
    priority = 'Low';
  }

  // Direct preferred focus override ensures focused categories surface as High priority
  if (answers.preferredFocus && answers.preferredFocus !== 'all') {
    if (
      answers.preferredFocus === 'reviews' &&
      template.category === 'Reviews and reputation'
    ) {
      priority = 'High';
    } else if (
      answers.preferredFocus === 'website' &&
      (template.category === 'Website basics' ||
        template.category === 'Conversion improvements')
    ) {
      priority = 'High';
    } else if (
      answers.preferredFocus === 'local_seo' &&
      (template.category === 'Local SEO' ||
        template.category === 'Google Business Profile' ||
        template.category === 'Business listings')
    ) {
      priority = 'High';
    } else if (
      answers.preferredFocus === 'social_media' &&
      template.category === 'Social media'
    ) {
      priority = 'High';
    }
  }

  // Generate dynamic, transparent Priority Reason
  let priorityReason = template.defaultPriorityReason;
  if (template.evaluatePriority) {
    try {
      const evalResult = template.evaluatePriority(answers);
      if (evalResult.priority === 'High') {
        priority = 'High';
      }
      if (evalResult.reason) {
        priorityReason = evalResult.reason;
      }
    } catch {
      // keep default
    }
  }

  // Generate personalized "Why am I seeing this?" explanation
  const goalLabel = answers.mainGoal.replace(/_/g, ' ');
  let whySeeingThis = '';

  if (addressesWeakness && weaknessExplanation) {
    whySeeingThis = `We recommend this because your selected goal is ${goalLabel}, and ${weaknessExplanation}`;
  } else if (isGoalDirectMatch) {
    whySeeingThis = `We recommend this because your primary goal is ${goalLabel}, and this action directly accelerates local client conversion.`;
  } else {
    whySeeingThis = `We recommend this foundational action to maintain steady consistency and trust for ${profile.categoryLabel} businesses.`;
  }

  return {
    score,
    priority,
    priorityReason,
    whySeeingThis,
  };
}
