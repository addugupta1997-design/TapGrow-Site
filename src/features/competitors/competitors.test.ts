import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  loadSavedCompetitors,
  saveCompetitor,
  deleteCompetitor,
  addObservationToCompetitor,
  deleteObservation,
  clearCompetitorStorage,
} from './competitorStorage';
import { analyzeCompetitiveOpportunities } from './opportunityEngine';
import { generateCompetitorPdfReport } from './generateCompetitorPdf';
import { CompetitorProfile } from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';

const mockAnswers: AssessmentAnswers = {
  businessName: 'Highland Dental Care',
  category: 'health_clinic',
  cityArea: 'North Inverness',
  country: 'United Kingdom',
  businessModel: 'physical',
  hasWebsite: 'yes',
  websiteUrl: 'https://highlanddental.example.com',
  hasBusinessListing: 'yes',
  socialPresence: 'multiple',
  mainSocialPlatforms: ['instagram', 'facebook'],
  discoveryMethods: ['google_search', 'word_of_mouth'],
  contactConsistent: 'yes',
  askForReviews: 'yes',
  websiteDetailsClear: 'yes',
  publishesContent: 'yes',
  tracksMarketing: 'no',
  clearConversionAction: 'yes',
  targetCustomers: 'local_residents',
  clinicAppointmentInfoClear: 'yes',
  clinicCredentialsInsuranceClear: 'yes',
  weeklyHours: '1_to_3h',
  budgetPreference: 'mostly_free',
  mainGoal: 'more_enquiries',
};

describe('Competitor Storage', () => {
  it('loads starter competitors when storage is empty', () => {
    clearCompetitorStorage();
    const list = loadSavedCompetitors(mockAnswers);
    assert.ok(list.length >= 1);
    assert.ok(list[0].id);
    assert.ok(list[0].businessName);
  });

  it('saves and updates a competitor profile', () => {
    const newComp: CompetitorProfile = {
      id: 'test-comp-1',
      businessName: 'Apex Dental Studio',
      websiteUrl: 'https://apexdental.example.com',
      category: 'health_clinic',
      cityOrArea: 'North Inverness',
      websitePresence: 'verified',
      listingPresence: 'verified',
      socialPresence: 'verified',
      visibleServices: ['Cosmetic Dentistry', 'Family Checkups'],
      primaryCta: 'Book online in 60s',
      reviewRating: 4.9,
      reviewCount: 142,
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      observations: [],
    };

    saveCompetitor(newComp);
    const list = loadSavedCompetitors();
    assert.strictEqual(list.some((c) => c.id === 'test-comp-1'), true);

    // Update existing
    const modified = { ...newComp, reviewCount: 150 };
    saveCompetitor(modified);
    const updatedList = loadSavedCompetitors();
    const found = updatedList.find((c) => c.id === 'test-comp-1');
    assert.strictEqual(found?.reviewCount, 150);
  });

  it('deletes a competitor profile', () => {
    const newComp: CompetitorProfile = {
      id: 'temp-comp-del',
      businessName: 'Temp Clinic',
      category: 'health_clinic',
      cityOrArea: 'Inverness',
      websitePresence: 'not_checked',
      listingPresence: 'not_checked',
      socialPresence: 'not_checked',
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      observations: [],
    };
    saveCompetitor(newComp);
    deleteCompetitor('temp-comp-del');
    const afterDelete = loadSavedCompetitors();
    assert.strictEqual(afterDelete.some((c) => c.id === 'temp-comp-del'), false);
  });

  it('adds and removes observations on a competitor', () => {
    const newComp: CompetitorProfile = {
      id: 'obs-comp-test',
      businessName: 'Observation Target',
      category: 'health_clinic',
      cityOrArea: 'Inverness',
      websitePresence: 'verified',
      listingPresence: 'verified',
      socialPresence: 'not_checked',
      dateAdded: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      observations: [],
    };
    saveCompetitor(newComp);

    const obs = addObservationToCompetitor('obs-comp-test', {
      sourceType: 'website',
      sourceUrl: 'https://example.com/promo',
      whatTheyDoWell: 'Offering 15% discount for first-time emergency visits',
      publicOffers: '15% Off New Patients',
    });

    assert.ok(obs);
    const current = loadSavedCompetitors();
    const target = current.find((c) => c.id === 'obs-comp-test');
    assert.strictEqual(target?.observations.length, 1);
    assert.ok(target?.observations[0].whatTheyDoWell?.includes('15% discount'));

    deleteObservation('obs-comp-test', obs!.id);
    const afterRemoval = loadSavedCompetitors();
    const updatedTarget = afterRemoval.find((c) => c.id === 'obs-comp-test');
    assert.strictEqual(updatedTarget?.observations.length, 0);
  });
});

describe('Opportunity Finder Engine', () => {
  it('detects call-to-action friction when competitors rely on phone calls', () => {
    const competitors: CompetitorProfile[] = [
      {
        id: 'comp-phone',
        businessName: 'Traditional Clinic',
        category: 'health_clinic',
        cityOrArea: 'Inverness',
        websitePresence: 'verified',
        listingPresence: 'verified',
        socialPresence: 'verified',
        primaryCta: 'Call (555) 234-5678 for appointments',
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        observations: [],
      },
    ];

    const opportunities = analyzeCompetitiveOpportunities({
      answers: mockAnswers,
      competitors,
    });
    assert.ok(opportunities.length > 0);
    const ctaOpp = opportunities.find((o) => o.category === 'calls_to_action');
    assert.ok(ctaOpp);
    assert.ok(ctaOpp?.supportingEvidence.includes('Call'));
  });

  it('detects trust and guarantee opportunities when competitors lack guarantees', () => {
    const competitors: CompetitorProfile[] = [
      {
        id: 'comp-noguarantee',
        businessName: 'Standard Clinic',
        category: 'health_clinic',
        cityOrArea: 'Inverness',
        websitePresence: 'verified',
        listingPresence: 'verified',
        socialPresence: 'not_checked',
        promotedOffers: 'Standard consultation',
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        observations: [],
      },
    ];

    const opportunities = analyzeCompetitiveOpportunities({
      answers: mockAnswers,
      competitors,
    });
    const guaranteeOpp = opportunities.find((o) => o.id === 'opp_introduce_first_guarantee');
    assert.ok(guaranteeOpp);
    assert.ok(guaranteeOpp?.title.includes('Guarantee'));
  });

  it('cross-references SEO audit findings to flag speed and schema advantages', () => {
    const competitors: CompetitorProfile[] = [
      {
        id: 'comp-1',
        businessName: 'Peer Clinic',
        category: 'health_clinic',
        cityOrArea: 'Inverness',
        websitePresence: 'verified',
        listingPresence: 'verified',
        socialPresence: 'not_checked',
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        observations: [],
      },
    ];

    const mockAudit: any = {
      id: 'audit_test_1',
      url: 'https://highlanddental.example.com',
      domain: 'highlanddental.example.com',
      auditedAt: new Date().toISOString(),
      overallScore: 68,
      grade: 'C',
      loadDurationMs: 450,
      statusCode: 200,
      summaryMetrics: {
        hasLocalSchema: false,
        hasOpenGraph: true,
        hasTwitterCard: false,
        imagesMissingAlt: 3,
        headingsCorrect: true,
        hasPhone: true,
        hasAddress: false,
        isHttps: true,
      },
      categories: [],
      prioritizedRecommendations: [],
    };

    const opportunities = analyzeCompetitiveOpportunities({
      answers: mockAnswers,
      competitors,
      latestSeoAudit: mockAudit,
    });
    const schemaOpp = opportunities.find((o) => o.id === 'opp_local_schema_advantage');
    assert.ok(schemaOpp);
    assert.ok(schemaOpp?.title.includes('Schema'));
  });
});

describe('Competitor PDF Export', () => {
  it('generates a valid jsPDF document without throwing', () => {
    const competitors = loadSavedCompetitors(mockAnswers);
    const opportunities = analyzeCompetitiveOpportunities({
      answers: mockAnswers,
      competitors,
    });

    const doc = generateCompetitorPdfReport(mockAnswers, competitors, opportunities, { skipSave: true });

    assert.ok(doc);
    assert.ok(doc.internal.pages.length >= 1);
  });
});
