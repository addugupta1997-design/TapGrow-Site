import { AssessmentAnswers } from '../../types/assessment';
import { ScoreResult, ScoreCategoryBreakdown } from '../../types/recommendations';

interface ScoringRule {
  key: keyof AssessmentAnswers;
  categoryName: string;
  weight: number;
  label: string;
  isApplicable: (answers: AssessmentAnswers) => boolean;
  evaluate: (value: any) => number; // returns earned points (0 to weight)
  gapMessage: string;
  strengthMessage: string;
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
  },

  // Category-specific bonus / evaluated foundations:
  {
    key: 'restaurantOnlineMenu',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Online Dining Menu',
    isApplicable: (a) => a.category === 'restaurant_cafe' && a.restaurantOnlineMenu !== undefined && a.restaurantOnlineMenu !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Menu is not easily viewable as mobile-friendly text with clear pricing online.',
    strengthMessage: 'Mobile-friendly menu and dish offerings clearly available online.',
  },
  {
    key: 'salonServicePriceListOnline',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Transparent Service Menu & Pricing',
    isApplicable: (a) => a.category === 'salon_wellness' && a.salonServicePriceListOnline !== undefined && a.salonServicePriceListOnline !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Service menu and starting prices are not easily discoverable upfront.',
    strengthMessage: 'Transparent service descriptions and pricing displayed online.',
  },
  {
    key: 'clinicAppointmentInfoClear',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Patient Appointment Clarity',
    isApplicable: (a) => a.category === 'health_clinic' && a.clinicAppointmentInfoClear !== undefined && a.clinicAppointmentInfoClear !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Appointment booking process and patient onboarding details are not explicitly clear.',
    strengthMessage: 'Clear patient appointment instructions and clinical details available.',
  },
  {
    key: 'homeServiceAreaClarified',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Trade Service Area Coverage',
    isApplicable: (a) => a.category === 'home_trades' && a.homeServiceAreaClarified !== undefined && a.homeServiceAreaClarified !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Specific suburbs and service radius boundaries are not explicitly defined.',
    strengthMessage: 'Explicit service radius and coverage zones stated for trade services.',
  },
  {
    key: 'retailProductDiscoveryOnline',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Retail Inventory Showcase',
    isApplicable: (a) => a.category === 'retail' && a.retailProductDiscoveryOnline !== undefined && a.retailProductDiscoveryOnline !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Shoppers cannot preview top stocked brands or product lines before visiting store.',
    strengthMessage: 'In-store merchandise lines and top brands discoverable online.',
  },
  {
    key: 'professionalInitialConsultationOffer',
    categoryName: 'Category Essentials',
    weight: 10,
    label: 'Initial Consultation Clarity',
    isApplicable: (a) => a.category === 'professional_services' && a.professionalInitialConsultationOffer !== undefined && a.professionalInitialConsultationOffer !== 'not_applicable',
    evaluate: (val) => (val === 'yes' ? 10 : 0),
    gapMessage: 'Introductory consultation scope and engagement process are not clearly outlined.',
    strengthMessage: 'Clear initial consultation process and credentials outlined.',
  },
];

/**
 * Calculates a normalized 0-100 marketing readiness score based solely on answered, applicable questions.
 * Unknown ('not_sure') answers are included in the denominator as growth gaps to highlight improvement areas,
 * while 'not_applicable' answers are gracefully excluded from the denominator.
 */
export function calculateReadinessScore(answers: AssessmentAnswers): ScoreResult {
  let earnedTotal = 0;
  let applicableTotalWeight = 0;
  let evaluatedQuestionsCount = 0;

  const categoryMap: Record<string, { earned: number; total: number }> = {};
  const strengths: string[] = [];
  const gaps: string[] = [];

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

    const earned = rule.evaluate(value);
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

  // Normalize score to 0 - 100 based on applicable weight
  const normalizedScore = applicableTotalWeight > 0 ? Math.round((earnedTotal / applicableTotalWeight) * 100) : 50;

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
  if (normalizedScore >= 80) {
    interpretation = 'Strong foundation: Your key visibility and trust assets are in place. Focus on consistency and conversion polish.';
  } else if (normalizedScore >= 50) {
    interpretation = 'Emerging foundation: Essential local listings, review workflows, or conversion details need immediate attention to avoid lost leads.';
  } else {
    interpretation = 'Early stages: Fundamental discovery signals (Google listing, address consistency, contact options) should be established first.';
  }

  return {
    totalScore: normalizedScore,
    interpretation,
    evaluatedQuestionsCount,
    totalApplicableWeight: applicableTotalWeight,
    categoryBreakdown,
    strengths,
    gaps,
  };
}
