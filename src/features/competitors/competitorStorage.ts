import {
  CompetitorProfile,
  CompetitorObservation,
  CompetitorComparisonSession,
} from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';

export const COMPETITORS_STORAGE_KEY = 'tapgrow_competitors_v1';
export const COMPETITOR_SESSIONS_STORAGE_KEY = 'tapgrow_competitor_sessions_v1';

let inMemoryCompetitors: CompetitorProfile[] = [];
let inMemorySessions: CompetitorComparisonSession[] = [];

function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__tapgrow_comp_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns default starter competitor templates based on category for demonstration.
 */
export function getStarterCompetitorTemplates(answers?: AssessmentAnswers): CompetitorProfile[] {
  const city = answers?.cityArea || 'Local Area';
  const category = answers?.category || 'other_local';

  if (category === 'restaurant_cafe') {
    return [
      {
        id: 'comp_sample_cafe_1',
        businessName: 'The Roasted Bean & Kitchen',
        websiteUrl: 'https://roastedbean.example.com',
        category: 'restaurant_cafe',
        categoryLabel: 'Cafe & Restaurant',
        cityOrArea: city,
        listingUrl: 'https://maps.google.com/?q=The+Roasted+Bean',
        socialLinks: [
          { platform: 'instagram', url: 'https://instagram.com/roastedbeankitchen' },
          { platform: 'facebook', url: 'https://facebook.com/roastedbeankitchen' },
        ],
        shortDescription: 'Popular brunch and artisanal coffee shop known for weekend sourdough toasts and seasonal lattes.',
        researchNotes: 'Strong community engagement on Instagram, active seasonal promotions.',
        dateAdded: new Date(Date.now() - 86400000 * 4).toISOString(),
        lastUpdated: new Date().toISOString(),
        websitePresence: 'verified',
        listingPresence: 'verified',
        socialPresence: 'verified',
        homepageTitle: 'The Roasted Bean | Organic Coffee & Brunch in ' + city,
        homepageDescription: 'Craft espresso, organic breakfast bowls, and fresh baked pastries served daily.',
        visibleServices: ['Breakfast & Brunch', 'Specialty Coffee', 'Catering Platter Orders', 'Private Evening Events'],
        contactMethods: ['Phone', 'Online Menu', 'Instagram DMs'],
        primaryCta: 'View Menu & Order Ahead',
        mobileResponsive: 'verified',
        contentThemes: ['Latte Art Videos', 'Meet the Barista', 'Weekly Muffin Specials', 'Local Art Spotlights'],
        promotedOffers: '10% off online orders before 9 AM on weekdays',
        targetAudience: 'Remote workers, morning commuters, weekend brunch lovers',
        communicatedValueProp: '100% fair-trade locally roasted beans and scratch-made farm-to-table bakery items.',
        reviewRating: 4.7,
        reviewCount: 230,
        reviewSource: 'Google Public Listing (Observed)',
        observations: [
          {
            id: 'obs_cafe_1',
            competitorId: 'comp_sample_cafe_1',
            dateObserved: new Date().toISOString(),
            sourceType: 'social_media',
            sourceUrl: 'https://instagram.com/roastedbeankitchen',
            whatTheyDoWell: 'High visual consistency on Instagram, showcasing mouth-watering closeups of daily specials.',
            promotedServices: 'Online pickup ordering for morning commuters.',
            contentThemes: 'Behind the scenes baking, recipe origins.',
            whatMakesThemDifferent: 'Emphasize local organic dairy and gluten-free pastry varieties.',
            opportunitiesSeen: 'They have no loyalty program or evening menu promotions—an opportunity for our business to capture evening dinners.',
          },
        ],
      },
      {
        id: 'comp_sample_cafe_2',
        businessName: 'Corner Table Bistro',
        websiteUrl: 'https://cornertablebistro.example.com',
        category: 'restaurant_cafe',
        categoryLabel: 'Restaurant & Cafe',
        cityOrArea: city,
        listingUrl: 'https://maps.google.com/?q=Corner+Table+Bistro',
        shortDescription: 'Cozy neighbourhood bistro offering Mediterranean small plates and wine pairings.',
        dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
        lastUpdated: new Date().toISOString(),
        websitePresence: 'verified',
        listingPresence: 'verified',
        socialPresence: 'manually_entered',
        homepageTitle: 'Corner Table Bistro - Casual Dining & Fine Wine',
        homepageDescription: 'Enjoy authentic handmade pasta and Mediterranean shared plates in ' + city + '.',
        visibleServices: ['Dine-in Dinner', 'Wine Tasting Flights', 'Group Reservations'],
        contactMethods: ['Phone', 'Resy Reservation Widget'],
        primaryCta: 'Reserve a Table Online',
        mobileResponsive: 'verified',
        contentThemes: ['Wine of the Week', 'Chef Special Preparations'],
        targetAudience: 'Couples on date nights, dinner gatherings',
        communicatedValueProp: 'Warm intimate atmosphere with sommelier-curated European wines.',
        reviewRating: 4.5,
        reviewCount: 165,
        reviewSource: 'Google Public Listing (Observed)',
        observations: [],
      },
    ];
  }

  // Home Trades & Contractors or General Default
  return [
    {
      id: 'comp_sample_trades_1',
      businessName: 'Blue Ridge Heating & Air',
      websiteUrl: 'https://blueridgehvac.example.com',
      category: 'home_trades',
      categoryLabel: 'Home Services & Trades',
      cityOrArea: city,
      listingUrl: 'https://maps.google.com/?q=Blue+Ridge+HVAC',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/blueridgehvac' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/blueridgehvac' },
      ],
      shortDescription: 'Regional HVAC contractor offering 24/7 furnace repair, heat pumps, and AC installations.',
      researchNotes: 'Very prominent emergency phone number in header, but website lacks transparent pricing.',
      dateAdded: new Date(Date.now() - 86400000 * 5).toISOString(),
      lastUpdated: new Date().toISOString(),
      websitePresence: 'verified',
      listingPresence: 'verified',
      socialPresence: 'verified',
      homepageTitle: 'Blue Ridge Heating & Air - 24/7 Emergency AC & Heating in ' + city,
      homepageDescription: 'Certified residential and commercial HVAC service. Fast same-day emergency repairs across ' + city + '.',
      visibleServices: ['Furnace Repair', 'AC Replacement', 'Heat Pump Conversion', 'Seasonal Maintenance Plans'],
      contactMethods: ['24/7 Phone (Click-to-call)', 'Quote Request Form'],
      primaryCta: 'Call (555) 019-2834 for Immediate Dispatch',
      mobileResponsive: 'verified',
      contentThemes: ['Winter Energy Saving Tips', 'Customer Before/After Photos', 'Technician Certification Highlights'],
      promotedOffers: '$79 Furnace Tune-Up with Free Filter Replacement',
      targetAudience: 'Homeowners, property managers, landlords',
      communicatedValueProp: 'Over 15 years local service with 100% satisfaction guarantee.',
      reviewRating: 4.8,
      reviewCount: 310,
      reviewSource: 'Google Public Listing (Observed)',
      observations: [
        {
          id: 'obs_trades_1',
          competitorId: 'comp_sample_trades_1',
          dateObserved: new Date().toISOString(),
          sourceType: 'website',
          sourceUrl: 'https://blueridgehvac.example.com',
          whatTheyDoWell: 'Huge clickable phone number at top of mobile screen with 24/7 guarantee.',
          promotedServices: 'Annual VIP maintenance club membership.',
          contentThemes: 'Preventative care and energy bill savings.',
          whatMakesThemDifferent: 'Offer flexible financing options with 0% interest for 12 months.',
          opportunitiesSeen: 'Their website has no online booking calendar—homeowners must call. We can offer instant online scheduling.',
        },
      ],
    },
    {
      id: 'comp_sample_trades_2',
      businessName: 'Apex Precision Mechanics & Home Solutions',
      websiteUrl: 'https://apexprecision.example.com',
      category: 'home_trades',
      categoryLabel: 'Home Services & Trades',
      cityOrArea: city,
      listingUrl: 'https://maps.google.com/?q=Apex+Precision',
      shortDescription: 'Local independent contractor specializing in high-efficiency heat pumps and ductwork.',
      dateAdded: new Date(Date.now() - 86400000 * 2).toISOString(),
      lastUpdated: new Date().toISOString(),
      websitePresence: 'verified',
      listingPresence: 'manually_entered',
      socialPresence: 'not_checked',
      homepageTitle: 'Apex Precision | Energy Efficient Heat Pumps ' + city,
      homepageDescription: 'Lower your carbon footprint and heating bills with clean heat pump conversions in ' + city + '.',
      visibleServices: ['Heat Pump Installation', 'Ductless Mini-Splits', 'Home Insulation Audits'],
      contactMethods: ['Email Contact Form', 'Phone'],
      primaryCta: 'Request Free Energy Audit',
      mobileResponsive: 'verified',
      targetAudience: 'Eco-conscious homeowners, modern renovations',
      communicatedValueProp: 'Government rebate specialists helping claim up to $2,000 in energy tax credits.',
      reviewRating: 4.6,
      reviewCount: 88,
      reviewSource: 'Google Public Listing (Observed)',
      observations: [],
    },
  ];
}

/**
 * Loads all saved competitors from storage. If empty, initializes with category starter templates.
 */
export function loadSavedCompetitors(answers?: AssessmentAnswers): CompetitorProfile[] {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(COMPETITORS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort(
            (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
          );
        }
      }
    } catch (err) {
      console.warn('Failed to parse competitors from storage:', err);
    }
  }

  // Fallback to in-memory or starter templates
  if (inMemoryCompetitors.length === 0) {
    const starters = getStarterCompetitorTemplates(answers);
    saveAllCompetitors(starters);
    return starters;
  }

  return inMemoryCompetitors.sort(
    (a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
  );
}

/**
 * Saves all competitors to storage
 */
export function saveAllCompetitors(list: CompetitorProfile[]): void {
  inMemoryCompetitors = list;
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(COMPETITORS_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to save competitors list to localStorage:', err);
    }
  }
}

/**
 * Adds or updates a competitor profile
 */
export function saveCompetitor(competitor: CompetitorProfile): void {
  const current = loadSavedCompetitors();
  const existingIdx = current.findIndex((c) => c.id === competitor.id);

  let updatedList: CompetitorProfile[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...competitor,
      lastUpdated: new Date().toISOString(),
    };
  } else {
    updatedList = [
      {
        ...competitor,
        dateAdded: competitor.dateAdded || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      },
      ...current,
    ];
  }

  saveAllCompetitors(updatedList);
}

/**
 * Deletes a competitor profile
 */
export function deleteCompetitor(id: string): void {
  const current = loadSavedCompetitors();
  const filtered = current.filter((c) => c.id !== id);
  saveAllCompetitors(filtered);
}

/**
 * Appends a research observation to a competitor
 */
export function addObservationToCompetitor(
  competitorId: string,
  observation: Omit<CompetitorObservation, 'id' | 'competitorId' | 'dateObserved'>
): CompetitorObservation | null {
  const current = loadSavedCompetitors();
  const comp = current.find((c) => c.id === competitorId);
  if (!comp) return null;

  const newObs: CompetitorObservation = {
    ...observation,
    id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    competitorId,
    dateObserved: new Date().toISOString(),
  };

  const updatedComp: CompetitorProfile = {
    ...comp,
    observations: [newObs, ...(comp.observations || [])],
    lastUpdated: new Date().toISOString(),
  };

  saveCompetitor(updatedComp);
  return newObs;
}

/**
 * Deletes an observation from a competitor
 */
export function deleteObservation(competitorId: string, observationId: string): void {
  const current = loadSavedCompetitors();
  const comp = current.find((c) => c.id === competitorId);
  if (!comp) return;

  const updatedComp: CompetitorProfile = {
    ...comp,
    observations: (comp.observations || []).filter((o) => o.id !== observationId),
    lastUpdated: new Date().toISOString(),
  };

  saveCompetitor(updatedComp);
}

/**
 * Loads saved comparison sessions
 */
export function loadSavedSessions(): CompetitorComparisonSession[] {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(COMPETITOR_SESSIONS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        }
      }
    } catch (err) {
      console.warn('Failed to parse competitor sessions:', err);
    }
  }
  return inMemorySessions;
}

/**
 * Saves a comparison session
 */
export function saveComparisonSession(session: CompetitorComparisonSession): void {
  const current = loadSavedSessions();
  const existingIdx = current.findIndex((s) => s.id === session.id);

  let updatedList: CompetitorComparisonSession[];
  if (existingIdx >= 0) {
    updatedList = [...current];
    updatedList[existingIdx] = {
      ...session,
      updatedAt: new Date().toISOString(),
    };
  } else {
    updatedList = [
      {
        ...session,
        createdAt: session.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      ...current,
    ];
  }

  inMemorySessions = updatedList;
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(COMPETITOR_SESSIONS_STORAGE_KEY, JSON.stringify(updatedList));
    } catch (err) {
      console.warn('Failed to save sessions to localStorage:', err);
    }
  }
}

/**
 * Deletes a comparison session
 */
export function deleteComparisonSession(sessionId: string): void {
  const current = loadSavedSessions();
  const filtered = current.filter((s) => s.id !== sessionId);
  inMemorySessions = filtered;
  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(COMPETITOR_SESSIONS_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Failed to delete session:', err);
    }
  }
}

/**
 * Clears competitor storage
 */
export function clearCompetitorStorage(): void {
  inMemoryCompetitors = [];
  inMemorySessions = [];
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(COMPETITORS_STORAGE_KEY);
      window.localStorage.removeItem(COMPETITOR_SESSIONS_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}
