import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getPlainEnglishTitle,
  getPlainEnglishSummary,
  getFriendlyDifficultyLabel,
  getNextBestAction,
} from './plainEnglishHelper';
import { GeneratedTask } from '../../types/recommendations';

function makeTask(overrides: Partial<GeneratedTask>): GeneratedTask {
  return {
    id: 'test-1',
    templateId: 'tpl-1',
    title: 'Test task',
    summary: 'Test summary',
    whyItMatters: 'Helps local customers find your business',
    priority: 'Medium',
    priorityReason: 'Important for visibility',
    status: 'not_started',
    estimatedEffort: '30 mins',
    difficultyLevel: 'Intermediate',
    category: 'Local SEO',
    instructions: ['Step 1'],
    suggestedTimeToComplete: 'Week 1',
    completionCriteria: 'Profile is verified',
    suggestedNextStep: 'Check in Google Maps',
    tags: ['seo', 'maps'],
    weeklyScheduleGroup: 1,
    ...overrides,
  };
}

test('plainEnglishHelper: getNextBestAction selects highest priority unfinished task', () => {
  // Empty
  assert.equal(getNextBestAction([]), null);

  // All completed or deferred
  const allDone = [
    makeTask({ id: '1', status: 'completed', priority: 'High' }),
    makeTask({ id: '2', status: 'deferred', priority: 'High' }),
  ];
  assert.equal(getNextBestAction(allDone), null);

  // High priority chosen first even if later in list
  const mixed = [
    makeTask({ id: 'low-1', priority: 'Low', status: 'not_started' }),
    makeTask({ id: 'med-1', priority: 'Medium', status: 'not_started' }),
    makeTask({ id: 'high-1', priority: 'High', status: 'not_started' }),
  ];
  assert.equal(getNextBestAction(mixed)?.id, 'high-1');

  // Medium chosen if High is completed
  const highDone = [
    makeTask({ id: 'high-done', priority: 'High', status: 'completed' }),
    makeTask({ id: 'low-1', priority: 'Low', status: 'not_started' }),
    makeTask({ id: 'med-1', priority: 'Medium', status: 'not_started' }),
  ];
  assert.equal(getNextBestAction(highDone)?.id, 'med-1');

  // Fallback to whatever unfinished remains
  const onlyLow = [
    makeTask({ id: 'low-1', priority: 'Low', status: 'in_progress' }),
  ];
  assert.equal(getNextBestAction(onlyLow)?.id, 'low-1');
});

test('plainEnglishHelper: getPlainEnglishTitle converts jargon to friendly shopkeeper terms', () => {
  // Dictionary match
  const task1 = makeTask({
    title: 'Optimize Google Business Profile core info',
  });
  assert.equal(
    getPlainEnglishTitle(task1),
    'Make sure customers can find your shop on Google Maps'
  );

  // Dynamic regex fallback
  const task2 = makeTask({
    title: 'Optimize Local SEO signals for better CTR',
  });
  const translated = getPlainEnglishTitle(task2);
  assert.ok(translated.includes('Improve'));
  assert.ok(translated.includes('Google Maps visibility'));
  assert.equal(translated.includes('Local SEO signals'), false);
});

test('plainEnglishHelper: getPlainEnglishSummary removes marketing acronyms', () => {
  const task = makeTask({
    summary: 'Improve your SERP ranking and boost CTR with clear CTA buttons and NAP consistency.',
  });
  const result = getPlainEnglishSummary(task);
  assert.equal(result.includes('SERP'), false);
  assert.equal(result.includes('CTR'), false);
  assert.equal(result.includes('CTA'), false);
  assert.ok(result.includes('Google search results'));
  assert.ok(result.includes('contact button'));
  assert.ok(result.includes('consistent name, address, and phone number'));
});

test('plainEnglishHelper: getFriendlyDifficultyLabel labels tasks accurately', () => {
  // Quick win via beginner
  const quick1 = getFriendlyDifficultyLabel('Beginner', '30 min');
  assert.equal(quick1.label, 'Quick Win');

  // Quick win via short duration
  const quick2 = getFriendlyDifficultyLabel('Intermediate', '10 mins');
  assert.equal(quick2.label, 'Quick Win');

  // Thorough step
  const thorough = getFriendlyDifficultyLabel('Advanced', '2 hours');
  assert.equal(thorough.label, 'Thorough Step');

  // Standard step
  const standard = getFriendlyDifficultyLabel('Intermediate', '45 mins');
  assert.equal(standard.label, 'Standard Step');
});
