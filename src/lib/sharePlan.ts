import { AssessmentAnswers } from '../types/assessment';
import { SavedPlanState } from '../types/storage';
import { calculateReadinessScore } from '../features/recommendations/scoring';
import { generateRecommendations } from '../features/recommendations/generateRecommendations';
import { sanitizeText } from './validation';

const HASH_PREFIX = '#plan=';

/**
 * Encodes an assessment object or full plan into a compact, URL-safe base64 string.
 */
export function serializePlanToHash(answers: AssessmentAnswers): string {
  try {
    const jsonString = JSON.stringify(answers);
    // Use encodeURIComponent to handle non-ASCII/UTF-8 characters safely before btoa
    const base64 = btoa(
      encodeURIComponent(jsonString).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return `${HASH_PREFIX}${base64}`;
  } catch (error) {
    console.error('Failed to serialize plan to URL hash:', error);
    return '';
  }
}

/**
 * Decodes the assessment data from a URL hash and re-generates the deterministic plan state.
 * Returns null if the hash is missing, invalid, or corrupted.
 */
export function deserializePlanFromHash(hashString?: string): SavedPlanState | null {
  try {
    const rawHash = hashString || (typeof window !== 'undefined' ? window.location.hash : '');
    if (!rawHash || !rawHash.startsWith(HASH_PREFIX)) {
      return null;
    }

    const base64 = rawHash.slice(HASH_PREFIX.length);
    if (!base64) return null;

    // Decode base64 and UTF-8 safely
    const binary = atob(base64);
    const jsonString = decodeURIComponent(
      Array.from(binary)
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const parsed = JSON.parse(jsonString) as AssessmentAnswers;

    // Validate essential fields
    if (!parsed || typeof parsed !== 'object' || !parsed.category || !parsed.mainGoal) {
      return null;
    }

    // Sanitize user text inputs
    const cleanAnswers: AssessmentAnswers = {
      businessName: sanitizeText(parsed.businessName || ''),
      category: parsed.category,
      country: sanitizeText(parsed.country || ''),
      cityArea: sanitizeText(parsed.cityArea || ''),
      businessModel: parsed.businessModel || 'physical',
      targetCustomers: sanitizeText(parsed.targetCustomers || ''),
      hasWebsite: parsed.hasWebsite || 'yes',
      websiteUrl: sanitizeText(parsed.websiteUrl || ''),
      hasBusinessListing: parsed.hasBusinessListing || 'yes',
      socialPresence: parsed.socialPresence || 'one',
      mainSocialPlatforms: Array.isArray(parsed.mainSocialPlatforms) ? parsed.mainSocialPlatforms : [],
      discoveryMethods: Array.isArray(parsed.discoveryMethods) && parsed.discoveryMethods.length > 0 ? parsed.discoveryMethods : ['word_of_mouth'],
      contactConsistent: parsed.contactConsistent || 'yes',
      askForReviews: parsed.askForReviews || 'no',
      websiteDetailsClear: parsed.websiteDetailsClear || 'not_sure',
      publishesContent: parsed.publishesContent || 'no',
      tracksMarketing: parsed.tracksMarketing || 'no',
      clearConversionAction: parsed.clearConversionAction || 'yes',
      mainGoal: parsed.mainGoal || 'local_visibility',
      weeklyHours: parsed.weeklyHours || '1_to_3h',
      budgetPreference: parsed.budgetPreference || 'free_only',
      preferredFocus: parsed.preferredFocus || 'all',

      // Category fields
      restaurantOnlineMenu: parsed.restaurantOnlineMenu,
      restaurantHoursLocationClear: parsed.restaurantHoursLocationClear,
      restaurantDietaryOptionsListed: parsed.restaurantDietaryOptionsListed,
      salonServicePriceListOnline: parsed.salonServicePriceListOnline,
      salonOnlineBookingAvailable: parsed.salonOnlineBookingAvailable,
      clinicAppointmentInfoClear: parsed.clinicAppointmentInfoClear,
      clinicCredentialsInsuranceClear: parsed.clinicCredentialsInsuranceClear,
      homeServiceAreaClarified: parsed.homeServiceAreaClarified,
      homeServiceEmergencyOrQuoteForm: parsed.homeServiceEmergencyOrQuoteForm,
      retailProductDiscoveryOnline: parsed.retailProductDiscoveryOnline,
      retailStoreHoursParkingClear: parsed.retailStoreHoursParkingClear,
      professionalCaseStudiesOrBio: parsed.professionalCaseStudiesOrBio,
      professionalInitialConsultationOffer: parsed.professionalInitialConsultationOffer,

      completedAt: parsed.completedAt || new Date().toISOString(),
    };

    const scoreResult = calculateReadinessScore(cleanAnswers);
    const tasks = generateRecommendations(cleanAnswers);

    return {
      schemaVersion: 1,
      lastUpdated: new Date().toISOString(),
      answers: cleanAnswers,
      scoreResult,
      tasks,
    };
  } catch (error) {
    console.error('Failed to deserialize plan from URL hash:', error);
    return null;
  }
}

/**
 * Constructs the full shareable URL for the current plan.
 */
export function getShareablePlanUrl(answers: AssessmentAnswers): string {
  const hash = serializePlanToHash(answers);
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    return `${origin}/dashboard${hash}`;
  }
  return `/dashboard${hash}`;
}
