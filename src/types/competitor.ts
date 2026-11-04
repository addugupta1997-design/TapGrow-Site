export type CompetitorVerificationStatus = 'verified' | 'manually_entered' | 'not_available' | 'not_checked';

export interface CompetitorSocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'youtube' | 'tiktok' | 'twitter' | 'other';
  url: string;
}

export interface CompetitorObservation {
  id: string;
  competitorId: string;
  dateObserved: string;
  sourceUrl?: string;
  sourceType: 'website' | 'social_media' | 'local_listing' | 'in_store' | 'manual_review';
  whatTheyDoWell?: string;
  promotedServices?: string;
  contentThemes?: string;
  publicOffers?: string;
  whatMakesThemDifferent?: string;
  opportunitiesSeen?: string;
  notes?: string;
}

export interface CompetitorProfile {
  id: string;
  businessName: string;
  websiteUrl?: string;
  category: string;
  categoryLabel?: string;
  cityOrArea: string;
  listingUrl?: string; // e.g. Google Business Profile or Yelp link
  socialLinks?: CompetitorSocialLink[];
  shortDescription?: string;
  researchNotes?: string;
  dateAdded: string;
  lastUpdated: string;

  // Comparison Matrix Attributes
  websitePresence: CompetitorVerificationStatus;
  listingPresence: CompetitorVerificationStatus;
  socialPresence: CompetitorVerificationStatus;
  
  // Website signals
  homepageTitle?: string;
  homepageDescription?: string;
  visibleServices?: string[];
  contactMethods?: string[]; // e.g. ['Phone', 'Contact Form', 'Booking Link']
  primaryCta?: string;
  mobileResponsive?: CompetitorVerificationStatus;

  // Public Marketing & Positioning
  contentThemes?: string[];
  promotedOffers?: string;
  targetAudience?: string;
  communicatedValueProp?: string;
  reviewRating?: number; // e.g. 4.8
  reviewCount?: number; // e.g. 142
  reviewSource?: string; // e.g. 'Google Public Listing (Observed)'

  // Observations attached
  observations: CompetitorObservation[];
}

export interface CompetitiveOpportunity {
  id: string;
  category: 'services' | 'calls_to_action' | 'positioning' | 'content_education' | 'local_presence' | 'customer_experience';
  title: string;
  observation: string;
  supportingEvidence: string;
  whyItMatters: string;
  suggestedAction: string;
  priority: 'high' | 'medium' | 'low';
  estimatedEffort: string;
  competitorBenchmark?: string;
}

export interface CompetitorComparisonSession {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  competitorIds: string[];
  notes?: string;
}
