import test from 'node:test';
import assert from 'node:assert';
import { generateWeeklyDigest, createMailtoLink } from './weeklyDigest';
import { SavedPlanState } from '../types/storage';

const mockPlan: SavedPlanState = {
  schemaVersion: 1,
  lastUpdated: '2026-10-31T08:00:00.000Z',
  answers: {
    businessName: 'Sunrise Bakery',
    category: 'restaurant_cafe',
    businessModel: 'physical',
    country: 'United States',
    cityArea: 'Portland',
    hasWebsite: 'yes',
    hasBusinessListing: 'yes',
    socialPresence: 'one',
    discoveryMethods: ['word_of_mouth'],
    contactConsistent: 'yes',
    askForReviews: 'yes',
    websiteDetailsClear: 'yes',
    publishesContent: 'no',
    tracksMarketing: 'no',
    clearConversionAction: 'yes',
    mainGoal: 'trust_reviews',
    weeklyHours: '1_to_3h',
    budgetPreference: 'free_only',
  },
  scoreResult: {
    totalScore: 82,
    interpretation: 'Strong momentum',
    evaluatedQuestionsCount: 8,
    totalApplicableWeight: 100,
    categoryBreakdown: {},
    strengths: ['Menu online'],
    gaps: ['No review routine'],
  },
  tasks: [
    {
      id: 'task_1',
      templateId: 'tpl_1',
      title: 'Set up Google Review Link',
      category: 'Reviews and reputation',
      priority: 'High',
      priorityReason: 'Vital for local discovery',
      summary: 'Generate review shortcut',
      whyItMatters: 'Builds social proof',
      instructions: ['Step A', 'Step B'],
      estimatedEffort: '20 mins',
      suggestedTimeToComplete: 'Week 1',
      completionCriteria: 'Link created',
      suggestedNextStep: 'Save link to phone',
      tags: ['reviews'],
      status: 'not_started',
      weeklyScheduleGroup: 1,
    },
    {
      id: 'task_2',
      templateId: 'tpl_2',
      title: 'Update Menu on Website',
      category: 'Website basics',
      priority: 'Medium',
      priorityReason: 'Helps customers order',
      summary: 'Upload current seasonal items',
      whyItMatters: 'Conversions',
      instructions: ['Step 1'],
      estimatedEffort: '30 mins',
      suggestedTimeToComplete: 'Week 1',
      completionCriteria: 'Menu live',
      suggestedNextStep: 'Check mobile view',
      tags: ['menu'],
      status: 'completed',
      weeklyScheduleGroup: 1,
    },
  ],
};

test('weeklyDigest: generates structured digest with priority tasks and momentum', () => {
  const digest = generateWeeklyDigest(mockPlan);

  assert.ok(digest.subject.includes('Sunrise Bakery'));
  assert.strictEqual(digest.stats.totalTasks, 2);
  assert.strictEqual(digest.stats.completedTasks, 1);
  assert.strictEqual(digest.stats.remainingTasks, 1);
  assert.strictEqual(digest.stats.completionPercentage, 50);

  // Top tasks should include the incomplete task
  assert.strictEqual(digest.topTasks.length, 1);
  assert.strictEqual(digest.topTasks[0].title, 'Set up Google Review Link');
  assert.strictEqual(digest.topTasks[0].suggestedNextStep, 'Save link to phone');

  // Verify markdown content contains essential sections
  assert.ok(digest.markdownContent.includes("This Week's Priority Focus Actions"));
  assert.ok(digest.markdownContent.includes('Category Progress'));
});

test('weeklyDigest: creates valid mailto link with encoded subject and body', () => {
  const digest = generateWeeklyDigest(mockPlan);
  const link = createMailtoLink('test@example.com', digest);

  assert.ok(link.startsWith('mailto:test%40example.com?subject='));
  assert.ok(link.includes('&body='));
});
