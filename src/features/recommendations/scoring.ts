import { AssessmentAnswers } from '../../types/assessment';
import { ScoreResult, ScoreCategoryBreakdown, GeneratedTask } from '../../types/recommendations';

interface ScoringRule {
  key: keyof AssessmentAnswers;
  categoryName: string;
  weight: number;
  label: string;
  isApplicable: (answers: AssessmentAnswers) => boolean;
  evaluate: (value: any) => number; // returns earned points (0 to weight)
  gapMessage: string;
  strengthMessage: string;
  associatedTemplateIds?: string[]; // Tasks that directly remediate this gap when confirmed completed
}

export const SCORING_RULES: ScoringRule[] = [
  // Core visibility rules
  {
    key: 'hasBusinessListing',
    categoryName: 'Visibility & Listings',
    weight: 20,
    label: 'Local Business Listing',
    isApplicable: (a) => a.businessModel !== 'online_only' && a.hasBusinessListing !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 20 : 0),
    gapMessage: 'No verified Google Business Profile or map listing to capture nearby searches.',
    strengthMessage: 'Claimed and active local business listing setup.',
    associatedTemplateIds: ['rec_gbp_setup'],
  },
  {
    key: 'contactConsistent',
    categoryName: 'Visibility & Listings',
    weight: 15,
    label: 'Contact Info Consistency',
    isApplicable: (a) => a.contactConsistent !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 15 : 0),
    gapMessage: 'Contact details (name, phone, address) may be inconsistent across online directories.',
    strengthMessage: 'Consistent contact and location information maintained across directories.',
    associatedTemplateIds: ['rec_nap_consistency'],
  },
  {
    key: 'askForReviews',
    categoryName: 'Reputation & Trust',
    weight: 15,
    label: 'Customer Review Process',
    isApplicable: (a) => a.askForReviews !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 15 : 0),
    gapMessage: 'No active habit of requesting honest customer feedback or online reviews.',
    strengthMessage: 'Regularly inviting satisfied customers to leave genuine reviews.',
    associatedTemplateIds: ['rec_review_system'],
  },
  {
    key: 'websiteDetailsClear',
    categoryName: 'Website & Conversion',
    weight: 15,
    label: 'Website Service & Area Clarity',
    isApplicable: (a) => a.hasWebsite === 'yes' && a.websiteDetailsClear !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 15 : 0),
    gapMessage: 'Website does not clearly highlight services, exact location/service radius, and contact options.',
    strengthMessage: 'Website clearly communicates services, coverage area, and ways to get in touch.',
    associatedTemplateIds: ['rec_website_clarity'],
  },
  {
    key: 'clearConversionAction',
    categoryName: 'Website & Conversion',
    weight: 15,
    label: 'Primary Call to Action',
    isApplicable: (a) => a.clearConversionAction !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 15 : 0),
    gapMessage: 'Lacks a prominent, friction-free action for prospects (e.g. Call Now, Book Appointment, or Request Quote).',
    strengthMessage: 'Clear, obvious primary conversion action guides prospective customers.',
    associatedTemplateIds: ['rec_cta_optimization'],
  },
  {
    key: 'publishesContent',
    categoryName: 'Tracking & Consistency',
    weight: 10,
    label: 'Helpful Content & Updates',
    isApplicable: (a) => a.publishesContent !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Rarely publishes updates, answers to common questions, or local guides.',
    strengthMessage: 'Regularly shares helpful answers, updates, or educational tips for customers.',
    associatedTemplateIds: ['rec_faq_content', 'rec_social_batching'],
  },
  {
    key: 'tracksMarketing',
    categoryName: 'Tracking & Consistency',
    weight: 10,
    label: 'Inquiry & Lead Tracking',
    isApplicable: (a) => a.tracksMarketing !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Customer inquiries and discovery sources are not tracked systematically.',
    strengthMessage: 'Tracks how new customers discover the business and which marketing efforts generate leads.',
    associatedTemplateIds: ['rec_lead_tracking'],
  },

  // Category-specific bonus / evaluated foundations:
  {
    key: 'restaurantOnlineMenu',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Online Dining Menu',
    isApplicable: (a) =>
      a.category === 'restaurant_cafe' &&
      a.restaurantOnlineMenu !== undefined &&
      a.restaurantOnlineMenu !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Menu is not easily viewable as mobile-friendly text with clear pricing online.',
    strengthMessage: 'Mobile-friendly menu and dish offerings clearly available online.',
    associatedTemplateIds: ['rec_cat_restaurant_menu'],
  },
  {
    key: 'salonServicePriceListOnline',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Transparent Service Menu & Pricing',
    isApplicable: (a) =>
      a.category === 'salon_wellness' &&
      a.salonServicePriceListOnline !== undefined &&
      a.salonServicePriceListOnline !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Service menu and starting prices are not easily discoverable upfront.',
    strengthMessage: 'Transparent service descriptions and pricing displayed online.',
    associatedTemplateIds: ['rec_cat_salon_pricelist'],
  },
  {
    key: 'clinicAppointmentInfoClear',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Patient Appointment Clarity',
    isApplicable: (a) =>
      a.category === 'health_clinic' &&
      a.clinicAppointmentInfoClear !== undefined &&
      a.clinicAppointmentInfoClear !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Appointment booking process and patient onboarding details are not explicitly clear.',
    strengthMessage: 'Clear patient appointment instructions and clinical details available.',
    associatedTemplateIds: ['rec_cat_clinic_appointments'],
  },
  {
    key: 'homeServiceAreaClarified',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Trade Service Area Coverage',
    isApplicable: (a) =>
      a.category === 'home_trades' &&
      a.homeServiceAreaClarified !== undefined &&
      a.homeServiceAreaClarified !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Specific suburbs and service radius boundaries are not explicitly defined.',
    strengthMessage: 'Explicit service radius and coverage zones stated for trade services.',
    associatedTemplateIds: ['rec_cat_homeservice_servicearea'],
  },
  {
    key: 'retailProductDiscoveryOnline',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Retail Inventory Showcase',
    isApplicable: (a) =>
      a.category === 'retail' &&
      a.retailProductDiscoveryOnline !== undefined &&
      a.retailProductDiscoveryOnline !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Shoppers cannot preview top stocked brands or product lines before visiting store.',
    strengthMessage: 'In-store merchandise lines and top brands discoverable online.',
    associatedTemplateIds: ['rec_cat_retail_showcase'],
  },
  {
    key: 'professionalInitialConsultationOffer',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Initial Consultation Clarity',
    isApplicable: (a) =>
      a.category === 'professional_services' &&
      a.professionalInitialConsultationOffer !== undefined &&
      a.professionalInitialConsultationOffer !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Introductory consultation scope and engagement process are not clearly outlined.',
    strengthMessage: 'Clear initial consultation process and credentials outlined.',
    associatedTemplateIds: ['rec_cat_professional_consultation'],
  },
];

/**
 * Calculates a normalized 0-100 marketing readiness score based on answered applicable questions.
 * When tasks that remediate confirmed assessment gaps are marked completed, awards verified
 * score improvements while preserving transparency and non-guarantee principles.
 */
export function calculateReadinessScore(
  answers: AssessmentAnswers,
  completedTasks: GeneratedTask[] = []
): ScoreResult {
  let earnedTotal = 0;
  let applicableTotalWeight = 0;
  let evaluatedQuestionsCount = 0;

  const categoryMap: Record<string, { earned: number; total: number }> = {};
  const strengths: string[] = [];
  const gaps: string[] = [];

  // Track completed template IDs for confirmed remediation
  const completedTemplateIds = new Set<string>();
  completedTasks.forEach((t) => {
    if (t.status === 'completed') {
      completedTemplateIds.add(t.templateId);
      completedTemplateIds.add(t.id);
    }
  });

  let confirmedRemediatedPoints = 0;

  for (const rule of SCORING_RULES) {
    if (!rule.isApplicable(answers)) {
      continue;
    }

    const value = answers[rule.key];

    // If answer is 'not_applicable', skip completely
    if (value === 'not_applicable') {
      continue;
    }

    evaluatedQuestionsCount += 1;
    applicableTotalWeight += rule.weight;

    let earned = rule.evaluate(value);

    // If this was an identified gap in assessment, check if user confirmed completion of the remediating task
    if (earned < rule.weight && rule.associatedTemplateIds) {
      const isRemediated = rule.associatedTemplateIds.some((id) =>
        completedTemplateIds.has(id) || completedTemplateIds.has(`task_${id}`)
      );
      if (isRemediated) {
        const remediatedGain = rule.weight - earned;
        earned = rule.weight;
        confirmedRemediatedPoints += remediatedGain;
      }
    }

    earnedTotal += earned;

    if (!categoryMap[rule.categoryName]) {
      categoryMap[rule.categoryName] = { earned: 0, total: 0 };
    }
    categoryMap[rule.categoryName].earned += earned;
    categoryMap[rule.categoryName].total += rule.weight;

    if (earned === rule.weight) {
      strengths.push(rule.strengthMessage);
    } else {
      gaps.push(rule.gapMessage);
    }
  }

  // Calculate base score (without task completions)
  const baseEarned = earnedTotal - confirmedRemediatedPoints;
  const baseScore = applicableTotalWeight > 0 ? Math.round((baseEarned / applicableTotalWeight) * 100) : 50;

  // Normalized final score including confirmed completed actions
  const totalScore = applicableTotalWeight > 0 ? Math.min(100, Math.round((earnedTotal / applicableTotalWeight) * 100)) : 50;

  const confirmedBoost = Math.max(0, totalScore - baseScore);
  const confirmedCompletedTasksCount = completedTasks.filter((t) => t.status === 'completed').length;

  // Build category breakdown
  const categoryBreakdown: Record<string, ScoreCategoryBreakdown> = {};
  for (const [catName, data] of Object.entries(categoryMap)) {
    const percentage = data.total > 0 ? Math.round((data.earned / data.total) * 100) : 0;
    categoryBreakdown[catName] = {
      name: catName,
      earned: data.earned,
      total: data.total,
      percentage,
    };
  }

  // Interpret score in plain language
  let interpretation = '';
  if (totalScore >= 80) {
    interpretation =
      'Strong foundation: Your key visibility and trust assets are established. Maintain weekly review responses and content consistency.';
  } else if (totalScore >= 50) {
    interpretation =
      'Emerging foundation: Essential local listings, review workflows, or conversion details need immediate attention to avoid lost leads.';
  } else {
    interpretation =
      'Early stages: Fundamental discovery signals (Google listing, address consistency, contact options) should be established first.';
  }

  return {
    totalScore,
    baseScore,
    confirmedBoost,
    confirmedCompletedTasksCount,
    interpretation,
    evaluatedQuestionsCount,
    totalApplicableWeight: applicableTotalWeight,
    categoryBreakdown,
    strengths,
    gaps,
  };
}
