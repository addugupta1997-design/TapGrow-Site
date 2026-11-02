import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRecommendations } from './generateRecommendations';
import { calculateReadinessScore } from './scoring';
import { buildBusinessIntelligenceProfile } from './businessProfile';
import { AssessmentAnswers } from '../../types/assessment';
import { GeneratedTask } from '../../types/recommendations';

const baseAnswers: AssessmentAnswers = {
  category: 'other_local',
  country: 'United States',
  cityArea: 'Denver, CO',
  businessModel: 'physical',
  hasWebsite: 'yes',
  websiteUrl: 'https://example.com',
  hasBusinessListing: 'yes',
  socialPresence: 'one',
  discoveryMethods: ['word_of_mouth'],
  contactConsistent: 'yes',
  askForReviews: 'yes',
  websiteDetailsClear: 'yes',
  publishesContent: 'yes',
  tracksMarketing: 'yes',
  clearConversionAction: 'yes',
  mainGoal: 'local_visibility',
  weeklyHours: '3_to_5h',
  budgetPreference: 'mostly_free',
};

// Scenario 1: A restaurant with no website
test('Scenario 1: Restaurant with no website prioritizes website planning and dining menu, excludes website clarity audit', () => {
  const restaurantNoSite: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Trattoria Roma',
    category: 'restaurant_cafe',
    hasWebsite: 'no',
    restaurantOnlineMenu: 'no',
    restaurantHoursLocationClear: 'no',
    mainGoal: 'more_visits',
  };

  const tasks = generateRecommendations(restaurantNoSite);
  const taskIds = tasks.map((t) => t.templateId);

  // Must include website planning
  assert.ok(taskIds.includes('rec_website_planning'), 'Must recommend planning a website');
  // Must NOT include advanced website audits because no website exists
  assert.ok(!taskIds.includes('rec_website_clarity'), 'Must NOT recommend website clarity audit when no site exists');
  assert.ok(!taskIds.includes('rec_local_schema'), 'Must NOT recommend JSON-LD schema when no site exists');
  // Must include restaurant menu and dining hours tasks
  assert.ok(taskIds.includes('rec_cat_restaurant_menu'), 'Must include restaurant menu task');
  assert.ok(taskIds.includes('rec_cat_restaurant_hours_location'), 'Must include kitchen hours & reservation task');

  // Verify all tasks have required V2 fields
  tasks.forEach((t) => {
    assert.ok(t.problemAddressed, `Task ${t.id} must define problemAddressed`);
    assert.ok(t.expectedBenefit, `Task ${t.id} must define expectedBenefit`);
    assert.ok(t.difficultyLevel, `Task ${t.id} must define difficultyLevel`);
    assert.ok(t.requiredResources, `Task ${t.id} must define requiredResources`);
    assert.ok(t.whySeeingThis, `Task ${t.id} must define whySeeingThis`);
  });
});

// Scenario 2: A retail shop with an existing website
test('Scenario 2: Retail shop with existing website receives product showcase and parking guidance', () => {
  const retailWithSite: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Modern Botanicals',
    category: 'retail',
    hasWebsite: 'yes',
    retailProductDiscoveryOnline: 'no',
    retailStoreHoursParkingClear: 'no',
    websiteDetailsClear: 'no',
    mainGoal: 'more_visits',
  };

  const tasks = generateRecommendations(retailWithSite);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_retail_showcase'), 'Must recommend retail product showcase');
  assert.ok(taskIds.includes('rec_cat_retail_hours_parking'), 'Must recommend retail store hours & parking');
  assert.ok(taskIds.includes('rec_website_clarity'), 'Must recommend website clarity audit for existing site');
  assert.ok(!taskIds.includes('rec_website_planning'), 'Must NOT recommend website planning when website already exists');
});

// Scenario 3: A clinic focused on local visibility
test('Scenario 3: Healthcare clinic focused on local visibility prioritizes credentials and appointment intake', () => {
  const clinicAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Apex Family Chiropractic',
    category: 'health_clinic',
    hasBusinessListing: 'no', // missing GBP
    clinicAppointmentInfoClear: 'no',
    clinicCredentialsInsuranceClear: 'no',
    mainGoal: 'local_visibility',
  };

  const tasks = generateRecommendations(clinicAnswers);
  const topTask = tasks[0];

  assert.ok(topTask.priority === 'High', 'Top task must be High priority');
  const taskIds = tasks.map((t) => t.templateId);
  assert.ok(taskIds.includes('rec_gbp_setup'), 'Must recommend Google Business Profile setup');
  assert.ok(taskIds.includes('rec_cat_clinic_appointments'), 'Must recommend clinic appointment clarity');
  assert.ok(taskIds.includes('rec_cat_clinic_credentials'), 'Must recommend practitioner credentials');

  // Verify "Why am I seeing this?" references the actual deficit
  const gbpTask = tasks.find((t) => t.templateId === 'rec_gbp_setup');
  assert.ok(gbpTask?.whySeeingThis && gbpTask.whySeeingThis.includes('Google Business Profile'), 'Explanation must cite GBP gap');
});

// Scenario 4: A salon focused on social media
test('Scenario 4: Salon focused on social media receives transparent pricing and visual social rhythm', () => {
  const salonAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Luxe Hair & Brow',
    category: 'salon_wellness',
    socialPresence: 'one',
    salonServicePriceListOnline: 'no',
    salonOnlineBookingAvailable: 'no',
    mainGoal: 'marketing_consistency',
    preferredFocus: 'social_media',
  };

  const tasks = generateRecommendations(salonAnswers);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_salon_pricelist'), 'Must recommend salon pricing list');
  assert.ok(taskIds.includes('rec_cat_salon_booking'), 'Must recommend salon booking');
  assert.ok(taskIds.includes('rec_social_batching'), 'Must recommend social batching');

  // Social media task should be boosted by preferred focus
  const socialTask = tasks.find((t) => t.templateId === 'rec_social_batching');
  assert.equal(socialTask?.priority, 'High', 'Social task should be High priority when preferred focus is social');
});

// Scenario 5: A home-service business with limited marketing time
test('Scenario 5: Home-service business with limited time (under 1h) throttles tasks to high-leverage quick-wins', () => {
  const tradeBusy: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Rapid Response Plumbers',
    category: 'home_trades',
    businessModel: 'service_area',
    weeklyHours: 'under_1h',
    homeServiceAreaClarified: 'no',
    homeServiceEmergencyOrQuoteForm: 'no',
    mainGoal: 'more_enquiries',
  };

  const tasks = generateRecommendations(tradeBusy);
  assert.ok(tasks.length <= 7, 'Must throttle total tasks to prevent overwhelming owner');
  assert.equal(tasks[0].priority, 'High', 'Top task must be High priority');
  const taskIds = tasks.map((t) => t.templateId);
  assert.ok(taskIds.includes('rec_cat_homeservice_servicearea'), 'Must include service area definition');
});

// Scenario 6: Professional service business with established online presence
test('Scenario 6: Professional service business with established presence gets consultation and referral refinement', () => {
  const professionalAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Vanguard Tax & Wealth Advisory',
    category: 'professional_services',
    hasWebsite: 'yes',
    hasBusinessListing: 'yes',
    professionalInitialConsultationOffer: 'no',
    mainGoal: 'more_enquiries',
  };

  const profile = buildBusinessIntelligenceProfile(professionalAnswers);
  assert.ok(
    profile.maturityStage === 'optimizing' || profile.maturityStage === 'growing',
    'Maturity stage should be optimizing or growing for an established business'
  );

  const tasks = generateRecommendations(professionalAnswers);
  const taskIds = tasks.map((t) => t.templateId);
  assert.ok(taskIds.includes('rec_cat_professional_consultation'), 'Must include professional consultation offer');
});

// Scenario 7: Business with very little marketing budget (free_only)
test('Scenario 7: Business with free_only budget prioritizes zero-cost organic marketing', () => {
  const zeroBudgetAnswers: AssessmentAnswers = {
    ...baseAnswers,
    budgetPreference: 'free_only',
    askForReviews: 'no',
    contactConsistent: 'no',
    mainGoal: 'local_visibility',
  };

  const tasks = generateRecommendations(zeroBudgetAnswers);
  // High priority tasks should be organic free actions
  const highTasks = tasks.filter((t) => t.priority === 'High');
  assert.ok(highTasks.length > 0);
  assert.ok(highTasks.every((t) => t.tags.includes('free') || t.tags.includes('organic') || t.tags.includes('reviews')));
});

// Scenario 8: Business that has already completed several tasks
test('Scenario 8: Completing tasks updates readiness score meaningfully and preserves task history', () => {
  const initialAnswers: AssessmentAnswers = {
    ...baseAnswers,
    hasBusinessListing: 'no', // gap (-20)
    askForReviews: 'no', // gap (-15)
    contactConsistent: 'no', // gap (-15)
  };

  const initialScore = calculateReadinessScore(initialAnswers);
  const initialTasks = generateRecommendations(initialAnswers);

  assert.ok(initialScore.totalScore < 60, 'Initial score should reflect deficits');
  assert.equal(initialScore.confirmedBoost, 0, 'Initial score has 0 confirmed boost');

  // User completes the Google Business Profile setup task
  const updatedTasks: GeneratedTask[] = initialTasks.map((t) => {
    if (t.templateId === 'rec_gbp_setup') {
      return {
        ...t,
        status: 'completed' as const,
        completedAt: new Date().toISOString(),
      };
    }
    return t;
  });

  const updatedScore = calculateReadinessScore(initialAnswers, updatedTasks);

  // Score should meaningfully increase due to confirmed remediation
  assert.ok(updatedScore.totalScore > initialScore.totalScore, 'Score must increase after completing GBP task');
  assert.ok((updatedScore.confirmedBoost ?? 0) > 0, 'confirmedBoost should reflect remediated points');
  assert.equal(updatedScore.confirmedCompletedTasksCount, 1, 'Should report 1 confirmed completed task');

  // Regenerate recommendations with existing tasks passed
  const refreshedTasks = generateRecommendations(initialAnswers, updatedTasks);
  const gbpRefreshed = refreshedTasks.find((t) => t.templateId === 'rec_gbp_setup');
  assert.equal(gbpRefreshed?.status, 'completed', 'Completed task status must be preserved in refreshed plan');
});
