import {
  AssessmentAnswers,
  BusinessCategory,
  BusinessModel,
  MainGoal,
  WeeklyTimeAvailable,
  BudgetPreference,
} from '../../types/assessment';

export type MaturityStage = 'launching' | 'establishing' | 'growing' | 'optimizing';

export interface BusinessIntelligenceProfile {
  businessName: string;
  category: BusinessCategory;
  categoryLabel: string;
  country: string;
  cityArea: string;
  locationDisplay: string;
  businessModel: BusinessModel;

  // Assets & Foundational Channels
  hasWebsite: boolean;
  websiteKnown: boolean;
  websiteUrl?: string;

  hasGoogleListing: 'yes' | 'no' | 'not_sure' | 'not_applicable';
  isGoogleListingVerified: boolean;
  isGoogleListingMissingOrUnknown: boolean;

  socialPresence: 'none' | 'one' | 'multiple';
  socialChannels: string[];

  // Review & Reputation situation
  askForReviews: 'yes' | 'no' | 'not_sure' | 'not_applicable';
  isActivelyCollectingReviews: boolean;

  // Marketing foundations
  isContactConsistent: 'yes' | 'no' | 'not_sure' | 'not_applicable';
  isWebsiteClear: 'yes' | 'no' | 'not_sure' | 'not_applicable';
  publishesContent: 'yes' | 'no' | 'not_sure' | 'not_applicable';
  tracksMarketing: 'yes' | 'no' | 'not_sure' | 'not_applicable';
  hasClearConversionAction: 'yes' | 'no' | 'not_sure' | 'not_applicable';

  // Goals & constraints
  primaryGoal: MainGoal;
  weeklyTime: WeeklyTimeAvailable;
  isTimeConstrained: boolean; // under_1h or 1_to_3h
  budgetPreference: BudgetPreference;
  isZeroBudget: boolean; // free_only

  // Diagnostic synthesis
  maturityStage: MaturityStage;
  identifiedWeaknesses: string[];
  verifiedStrengths: string[];
  unknownFactors: string[];
}

const CATEGORY_NAMES: Record<BusinessCategory, string> = {
  restaurant_cafe: 'Restaurant & Cafe',
  retail: 'Retail Shop',
  salon_wellness: 'Salon, Spa & Wellness',
  health_clinic: 'Clinic & Medical Practice',
  home_trades: 'Home Services & Trades',
  professional_services: 'Professional & Office Services',
  fitness: 'Fitness & Sports Studio',
  other_local: 'Local Business',
};

/**
 * Creates a structured business intelligence profile based strictly on assessment answers.
 * Never invents unsupported weaknesses or assumes unknown facts are true.
 */
export function buildBusinessIntelligenceProfile(answers: AssessmentAnswers): BusinessIntelligenceProfile {
  const businessName = answers.businessName?.trim() || 'Your Local Business';
  const country = answers.country?.trim() || 'Local Area';
  const cityArea = answers.cityArea?.trim() || '';
  const locationDisplay = [cityArea, country].filter(Boolean).join(', ');

  const hasWebsite = answers.hasWebsite === 'yes';
  const websiteKnown = answers.hasWebsite === 'yes' || answers.hasWebsite === 'no';

  const isGoogleListingVerified = answers.hasBusinessListing === 'yes';
  const isGoogleListingMissingOrUnknown =
    answers.hasBusinessListing === 'no' || answers.hasBusinessListing === 'not_sure';

  const isActivelyCollectingReviews = answers.askForReviews === 'yes';

  const isTimeConstrained = answers.weeklyHours === 'under_1h';
  const isZeroBudget = answers.budgetPreference === 'free_only';

  const identifiedWeaknesses: string[] = [];
  const verifiedStrengths: string[] = [];
  const unknownFactors: string[] = [];

  // Factual assessment of listings
  if (answers.businessModel !== 'online_only') {
    if (answers.hasBusinessListing === 'no') {
      identifiedWeaknesses.push('No verified Google Business Profile to capture nearby local map searches');
    } else if (answers.hasBusinessListing === 'not_sure') {
      unknownFactors.push('Unconfirmed Google Business Profile ownership and verification status');
    } else if (answers.hasBusinessListing === 'yes') {
      verifiedStrengths.push('Active local business listing established');
    }
  }

  // Factual assessment of contact consistency
  if (answers.contactConsistent === 'no') {
    identifiedWeaknesses.push('Inconsistent address or phone number across online directories');
  } else if (answers.contactConsistent === 'not_sure') {
    unknownFactors.push('Directory NAP (Name, Address, Phone) consistency unconfirmed');
  } else if (answers.contactConsistent === 'yes') {
    verifiedStrengths.push('Consistent contact information across directories');
  }

  // Factual assessment of reviews
  if (answers.askForReviews === 'no') {
    identifiedWeaknesses.push('No proactive routine for asking satisfied customers for online reviews');
  } else if (answers.askForReviews === 'not_sure') {
    unknownFactors.push('Customer review collection process unverified');
  } else if (answers.askForReviews === 'yes') {
    verifiedStrengths.push('Regular habit of requesting genuine customer reviews');
  }

  // Factual assessment of website & conversions
  if (answers.hasWebsite === 'no') {
    identifiedWeaknesses.push('No dedicated website to present full services and capture direct inquiries');
  } else if (answers.hasWebsite === 'yes') {
    verifiedStrengths.push('Active business website available');
    if (answers.websiteDetailsClear === 'no') {
      identifiedWeaknesses.push('Website homepage does not clearly explain service radius or core offerings');
    } else if (answers.websiteDetailsClear === 'yes') {
      verifiedStrengths.push('Clear services and coverage area highlighted on website');
    }

    if (answers.clearConversionAction === 'no') {
      identifiedWeaknesses.push('Missing prominent primary call-to-action button (call/book/quote)');
    } else if (answers.clearConversionAction === 'yes') {
      verifiedStrengths.push('Prominent conversion button guides interested prospects');
    }
  }

  // Factual assessment of marketing tracking & publishing
  if (answers.tracksMarketing === 'no') {
    identifiedWeaknesses.push('Inquiries and lead sources are not systematically recorded');
  } else if (answers.tracksMarketing === 'yes') {
    verifiedStrengths.push('Systematically records where new clients discover the business');
  }

  if (answers.publishesContent === 'no') {
    identifiedWeaknesses.push('Infrequent customer updates and answers to common buyer questions');
  } else if (answers.publishesContent === 'yes') {
    verifiedStrengths.push('Regularly publishes helpful updates and educational content');
  }

  // Determine business maturity stage
  let maturityStage: MaturityStage = 'launching';
  if (!hasWebsite && isGoogleListingMissingOrUnknown) {
    maturityStage = 'launching';
  } else if (isGoogleListingVerified && hasWebsite && isActivelyCollectingReviews) {
    maturityStage = identifiedWeaknesses.length <= 1 ? 'optimizing' : 'growing';
  } else if (isGoogleListingVerified || hasWebsite) {
    maturityStage = 'establishing';
  }

  return {
    businessName,
    category: answers.category,
    categoryLabel: CATEGORY_NAMES[answers.category] || 'Local Business',
    country,
    cityArea,
    locationDisplay,
    businessModel: answers.businessModel,

    hasWebsite,
    websiteKnown,
    websiteUrl: answers.websiteUrl,

    hasGoogleListing: answers.hasBusinessListing,
    isGoogleListingVerified,
    isGoogleListingMissingOrUnknown,

    socialPresence: answers.socialPresence,
    socialChannels: answers.mainSocialPlatforms || [],

    askForReviews: answers.askForReviews,
    isActivelyCollectingReviews,

    isContactConsistent: answers.contactConsistent,
    isWebsiteClear: answers.websiteDetailsClear,
    publishesContent: answers.publishesContent,
    tracksMarketing: answers.tracksMarketing,
    hasClearConversionAction: answers.clearConversionAction,

    primaryGoal: answers.mainGoal,
    weeklyTime: answers.weeklyHours,
    isTimeConstrained,
    budgetPreference: answers.budgetPreference,
    isZeroBudget,

    maturityStage,
    identifiedWeaknesses,
    verifiedStrengths,
    unknownFactors,
  };
}
