import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateReadinessScore } from './scoring';
import { AssessmentAnswers } from '../../types/assessment';

const baseAnswers: AssessmentAnswers = {
  category: 'retail',
  country: 'United States',
  cityArea: 'Denver, CO',
  businessModel: 'physical',
  hasWebsite: 'yes',
  hasBusinessListing: 'yes',
  socialPresence: 'multiple',
  discoveryMethods: ['walk_in', 'word_of_mouth'],
  contactConsistent: 'yes',
  askForReviews: 'yes',
  websiteDetailsClear: 'yes',
  publishesContent: 'yes',
  tracksMarketing: 'yes',
  clearConversionAction: 'yes',
  mainGoal: 'local_visibility',
  weeklyHours: '1_to_3h',
  budgetPreference: 'free_only',
};

test('scoring: all positive answers yield 100 readiness score', () => {
  const result = calculateReadinessScore(baseAnswers);
  assert.equal(result.totalScore, 100);
  assert.ok(result.strengths.length > 0);
  assert.equal(result.gaps.length, 0);
});

test('scoring: all negative answers yield 0 readiness score without error', () => {
  const allNo: AssessmentAnswers = {
    ...baseAnswers,
    hasBusinessListing: 'no',
    contactConsistent: 'no',
    askForReviews: 'no',
    websiteDetailsClear: 'no',
    publishesContent: 'no',
    tracksMarketing: 'no',
    clearConversionAction: 'no',
  };
  const result = calculateReadinessScore(allNo);
  assert.equal(result.totalScore, 0);
  assert.ok(result.gaps.length > 0);
});

test('scoring: online-only business excludes physical listing requirement cleanly', () => {
  const onlineBiz: AssessmentAnswers = {
    ...baseAnswers,
    businessModel: 'online_only',
    hasBusinessListing: 'not_applicable',
  };
  const result = calculateReadinessScore(onlineBiz);
  assert.ok(result.totalScore >= 0 && result.totalScore <= 100);
  assert.ok(!result.categoryBreakdown['Visibility & Listings']?.total || result.categoryBreakdown['Visibility & Listings'].total <= 15);
});

test('scoring: zero division safety when all questions are not applicable', () => {
  const allNa: AssessmentAnswers = {
    ...baseAnswers,
    businessModel: 'online_only',
    hasBusinessListing: 'not_applicable',
    contactConsistent: 'not_applicable',
    askForReviews: 'not_applicable',
    websiteDetailsClear: 'not_applicable',
    clearConversionAction: 'not_applicable',
    publishesContent: 'not_applicable',
    tracksMarketing: 'not_applicable',
  };
  const result = calculateReadinessScore(allNa);
  assert.ok(result.totalScore >= 0 && result.totalScore <= 100);
});
