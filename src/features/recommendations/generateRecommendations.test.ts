import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRecommendations } from './generateRecommendations';
import { AssessmentAnswers } from '../../types/assessment';

const sampleAnswers: AssessmentAnswers = {
  category: 'restaurant_cafe',
  country: 'Canada',
  cityArea: 'Montreal, QC',
  businessModel: 'physical',
  hasWebsite: 'no',
  hasBusinessListing: 'no',
  socialPresence: 'none',
  discoveryMethods: ['word_of_mouth'],
  contactConsistent: 'no',
  askForReviews: 'no',
  websiteDetailsClear: 'not_applicable',
  publishesContent: 'no',
  tracksMarketing: 'no',
  clearConversionAction: 'no',
  mainGoal: 'more_visits',
  weeklyHours: '1_to_3h',
  budgetPreference: 'free_only',
};

test('recommendations: generates website planning instead of website audit when hasWebsite is no', () => {
  const tasks = generateRecommendations(sampleAnswers);
  const websitePlanTask = tasks.find((t) => t.templateId === 'rec_website_planning');
  const websiteClarityTask = tasks.find((t) => t.templateId === 'rec_website_clarity');

  assert.ok(websitePlanTask, 'Website planning task should be recommended');
  assert.equal(websiteClarityTask, undefined, 'Website clarity audit should NOT be recommended if no website');
});

test('recommendations: excludes physical map listings when online-only', () => {
  const onlineAnswers: AssessmentAnswers = {
    ...sampleAnswers,
    businessModel: 'online_only',
    hasWebsite: 'yes',
  };
  const tasks = generateRecommendations(onlineAnswers);
  const gbpTask = tasks.find((t) => t.templateId === 'rec_gbp_setup');
  assert.equal(gbpTask, undefined, 'Physical Google Business Profile should not be recommended for online-only businesses');
});

test('recommendations: sorts high priority tasks first', () => {
  const tasks = generateRecommendations(sampleAnswers);
  assert.ok(tasks.length >= 5);

  let seenMedium = false;
  let seenLow = false;

  for (const t of tasks) {
    if (t.priority === 'High') {
      assert.ok(!seenMedium, 'High priority should not appear after medium');
      assert.ok(!seenLow, 'High priority should not appear after low');
    } else if (t.priority === 'Medium') {
      seenMedium = true;
      assert.ok(!seenLow, 'Medium priority should not appear after low');
    } else if (t.priority === 'Low') {
      seenLow = true;
    }
  }
});
