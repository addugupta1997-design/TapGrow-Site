import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRecommendations } from './generateRecommendations';
import { calculateReadinessScore } from './scoring';
import { AssessmentAnswers } from '../../types/assessment';

const baseAnswers: AssessmentAnswers = {
  category: 'other_local',
  country: 'United States',
  cityArea: 'Chicago, IL',
  businessModel: 'physical',
  hasWebsite: 'yes',
  websiteUrl: 'https://example.com',
  hasBusinessListing: 'yes',
  socialPresence: 'one',
  discoveryMethods: ['word_of_mouth'],
  contactConsistent: 'yes',
  askForReviews: 'no',
  websiteDetailsClear: 'yes',
  publishesContent: 'no',
  tracksMarketing: 'no',
  clearConversionAction: 'yes',
  mainGoal: 'local_visibility',
  weeklyHours: '1_to_3h',
  budgetPreference: 'free_only',
};

test('category engine: restaurant gets dining and menu specific tasks', () => {
  const restaurantAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Trattoria Bella',
    category: 'restaurant_cafe',
    restaurantOnlineMenu: 'no',
    restaurantHoursLocationClear: 'no',
  };

  const tasks = generateRecommendations(restaurantAnswers);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_restaurant_menu'), 'Restaurant should get online menu task');
  assert.ok(taskIds.includes('rec_cat_restaurant_hours_location'), 'Restaurant should get hours and parking task');

  // Verify non-restaurant tasks are NOT present
  assert.ok(!taskIds.includes('rec_cat_salon_pricelist'), 'Restaurant must not get salon tasks');
  assert.ok(!taskIds.includes('rec_cat_homeservice_servicearea'), 'Restaurant must not get home service tasks');
});

test('category engine: salon gets price menu and booking tasks', () => {
  const salonAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Glow Hair Studio',
    category: 'salon_wellness',
    salonServicePriceListOnline: 'no',
    salonOnlineBookingAvailable: 'no',
  };

  const tasks = generateRecommendations(salonAnswers);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_salon_pricelist'), 'Salon should get transparent pricing task');
  assert.ok(taskIds.includes('rec_cat_salon_booking'), 'Salon should get online booking task');
  assert.ok(!taskIds.includes('rec_cat_restaurant_menu'), 'Salon must not get restaurant menu task');
});

test('category engine: clinic gets patient intake and credentials tasks', () => {
  const clinicAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Apex Physical Therapy',
    category: 'health_clinic',
    clinicAppointmentInfoClear: 'no',
    clinicCredentialsInsuranceClear: 'no',
  };

  const tasks = generateRecommendations(clinicAnswers);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_clinic_appointments'), 'Clinic should get appointment intake task');
  assert.ok(taskIds.includes('rec_cat_clinic_credentials'), 'Clinic should get credentials & insurance task');
});

test('category engine: home trades gets service area and quote form tasks', () => {
  const tradeAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'ProFlow Plumbing',
    category: 'home_trades',
    businessModel: 'service_area',
    homeServiceAreaClarified: 'no',
    homeServiceEmergencyOrQuoteForm: 'no',
  };

  const tasks = generateRecommendations(tradeAnswers);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_homeservice_servicearea'), 'Trades should get service area task');
  assert.ok(taskIds.includes('rec_cat_homeservice_quoteform'), 'Trades should get quote form task');
  assert.ok(!taskIds.includes('rec_cat_retail_showcase'), 'Trades must not get retail product task');
});

test('category engine: retail shop gets inventory showcase and parking tasks', () => {
  const retailAnswers: AssessmentAnswers = {
    ...baseAnswers,
    businessName: 'Vintage Vinyl & Books',
    category: 'retail',
    retailProductDiscoveryOnline: 'no',
    retailStoreHoursParkingClear: 'no',
  };

  const tasks = generateRecommendations(retailAnswers);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(taskIds.includes('rec_cat_retail_showcase'), 'Retail should get product showcase task');
  assert.ok(taskIds.includes('rec_cat_retail_hours_parking'), 'Retail should get store hours and parking task');
});

test('conditional logic: business that already does a task well does not receive it again', () => {
  const compliantRestaurant: AssessmentAnswers = {
    ...baseAnswers,
    category: 'restaurant_cafe',
    restaurantOnlineMenu: 'yes', // already has good online menu
    restaurantHoursLocationClear: 'yes', // already clear
  };

  const tasks = generateRecommendations(compliantRestaurant);
  const taskIds = tasks.map((t) => t.templateId);

  assert.ok(!taskIds.includes('rec_cat_restaurant_menu'), 'Should not re-recommend menu task if already yes');
  assert.ok(!taskIds.includes('rec_cat_restaurant_hours_location'), 'Should not re-recommend hours task if already yes');
});

test('capacity logic: low weekly time prioritizes fewer high-leverage tasks', () => {
  const busyAnswers: AssessmentAnswers = {
    ...baseAnswers,
    weeklyHours: 'under_1h',
    hasWebsite: 'no',
    hasBusinessListing: 'no',
    askForReviews: 'no',
    tracksMarketing: 'no',
  };

  const tasks = generateRecommendations(busyAnswers);
  assert.ok(tasks.length <= 7, 'Should throttle total tasks for under_1h capacity to avoid burnout');
  assert.ok(tasks[0].priority === 'High', 'Top action must be High priority');
});

test('duplicate prevention: no task ID is duplicated in output', () => {
  const answers: AssessmentAnswers = {
    ...baseAnswers,
    category: 'retail',
    hasWebsite: 'no',
    hasBusinessListing: 'no',
  };

  const tasks = generateRecommendations(answers);
  const ids = tasks.map((t) => t.id);
  const uniqueIds = new Set(ids);
  assert.equal(ids.length, uniqueIds.size, 'Task list must have zero duplicate IDs');
});
