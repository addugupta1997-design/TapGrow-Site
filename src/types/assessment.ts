/**
 * Types for the guided questionnaire assessment.
 */

export type BusinessModel = 'physical' | 'service_area' | 'online_only' | 'hybrid';

export type BusinessCategory =
  | 'retail'
  | 'restaurant_cafe'
  | 'salon_wellness'
  | 'health_clinic'
  | 'home_trades'
  | 'professional_services'
  | 'fitness'
  | 'other_local';

export type YesNoNotSure = 'yes' | 'no' | 'not_sure' | 'not_applicable';

export type SocialPresence = 'none' | 'one' | 'multiple';

export type WeeklyTimeAvailable = 'under_1h' | '1_to_3h' | '3_to_5h' | 'over_5h';

export type BudgetPreference = 'free_only' | 'mostly_free' | 'some_paid';

export type MainGoal =
  | 'local_visibility'
  | 'more_enquiries'
  | 'more_visits'
  | 'more_bookings'
  | 'trust_reviews'
  | 'website_improvement'
  | 'marketing_consistency'
  | 'customer_retention';

export type PreferredFocus =
  | 'all'
  | 'local_seo'
  | 'reviews'
  | 'website'
  | 'social_media'
  | 'consistency';

export interface AssessmentAnswers {
  // Step 1: Business Basics
  businessName?: string;
  category: BusinessCategory;
  country: string;
  cityArea: string;
  businessModel: BusinessModel;
  targetCustomers?: string;

  // Step 2: Online Presence
  hasWebsite: 'yes' | 'no';
  websiteUrl?: string;
  hasBusinessListing: YesNoNotSure;
  socialPresence: SocialPresence;
  mainSocialPlatforms?: string[];

  // Step 3: Marketing Foundations (General)
  discoveryMethods: string[];
  contactConsistent: YesNoNotSure;
  askForReviews: YesNoNotSure;
  websiteDetailsClear: YesNoNotSure;
  publishesContent: YesNoNotSure;
  tracksMarketing: YesNoNotSure;
  clearConversionAction: YesNoNotSure;

  // Step 3 (Conditional / Category-Specific Extensions)
  // Restaurants & Cafes:
  restaurantOnlineMenu?: YesNoNotSure;
  restaurantHoursLocationClear?: YesNoNotSure;
  restaurantDietaryOptionsListed?: YesNoNotSure;

  // Salons, Spas & Personal Care:
  salonServicePriceListOnline?: YesNoNotSure;
  salonOnlineBookingAvailable?: YesNoNotSure;

  // Health Clinics & Medical Practices:
  clinicAppointmentInfoClear?: YesNoNotSure;
  clinicCredentialsInsuranceClear?: YesNoNotSure;

  // Home Services & Trades:
  homeServiceAreaClarified?: YesNoNotSure;
  homeServiceEmergencyOrQuoteForm?: YesNoNotSure;

  // Retail & Independent Shops:
  retailProductDiscoveryOnline?: YesNoNotSure;
  retailStoreHoursParkingClear?: YesNoNotSure;

  // Professional Services & Office:
  professionalCaseStudiesOrBio?: YesNoNotSure;
  professionalInitialConsultationOffer?: YesNoNotSure;

  // Step 4: Goals and Capacity
  mainGoal: MainGoal;
  weeklyHours: WeeklyTimeAvailable;
  budgetPreference: BudgetPreference;
  preferredFocus?: PreferredFocus;

  // Metadata
  completedAt?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
