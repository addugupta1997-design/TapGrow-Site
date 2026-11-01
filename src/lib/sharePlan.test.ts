import test from 'node:test';
import assert from 'node:assert/strict';
import { serializePlanToHash, deserializePlanFromHash, getShareablePlanUrl } from './sharePlan';
import { AssessmentAnswers } from '../types/assessment';

const sampleAnswers: AssessmentAnswers = {
  businessName: 'Lotus Ayurvedic Clinic',
  category: 'health_clinic',
  country: 'India',
  cityArea: 'South Delhi',
  businessModel: 'physical',
  hasWebsite: 'yes',
  websiteUrl: 'https://lotusayurveda.example.com',
  hasBusinessListing: 'yes',
  socialPresence: 'multiple',
  discoveryMethods: ['word_of_mouth', 'google_search'],
  contactConsistent: 'yes',
  askForReviews: 'yes',
  websiteDetailsClear: 'yes',
  publishesContent: 'no',
  tracksMarketing: 'no',
  clearConversionAction: 'yes',
  mainGoal: 'more_bookings',
  weeklyHours: '3_to_5h',
  budgetPreference: 'mostly_free',
  preferredFocus: 'reviews',
};

test('sharePlan: serialize and deserialize plan accurately via URL hash', () => {
  const hash = serializePlanToHash(sampleAnswers);
  assert.ok(hash.startsWith('#plan='));

  const restoredPlan = deserializePlanFromHash(hash);
  assert.ok(restoredPlan !== null);
  assert.equal(restoredPlan.answers.businessName, 'Lotus Ayurvedic Clinic');
  assert.equal(restoredPlan.answers.category, 'health_clinic');
  assert.equal(restoredPlan.answers.country, 'India');
  assert.equal(restoredPlan.answers.mainGoal, 'more_bookings');
  assert.ok(restoredPlan.tasks.length > 0);
  assert.ok(restoredPlan.scoreResult.totalScore > 0);
});

test('sharePlan: handles invalid or missing hash gracefully', () => {
  assert.equal(deserializePlanFromHash(''), null);
  assert.equal(deserializePlanFromHash('#invalid-hash'), null);
  assert.equal(deserializePlanFromHash('#plan=invalidBase64!!!'), null);
});

test('sharePlan: getShareablePlanUrl produces complete dashboard URL with hash', () => {
  const url = getShareablePlanUrl(sampleAnswers);
  assert.ok(url.includes('/dashboard#plan='));
});
