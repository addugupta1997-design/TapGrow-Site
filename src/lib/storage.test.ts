import test from 'node:test';
import assert from 'node:assert/strict';
import { savePlanToStorage, loadPlanFromStorage, clearPlanStorage, updateTaskInStorage } from './storage';
import { SavedPlanState } from '../types/storage';

const mockPlan: SavedPlanState = {
  schemaVersion: 1,
  lastUpdated: new Date().toISOString(),
  answers: {
    category: 'retail',
    country: 'United States',
    cityArea: 'Portland, OR',
    businessModel: 'physical',
    hasWebsite: 'yes',
    hasBusinessListing: 'yes',
    socialPresence: 'one',
    discoveryMethods: ['walk_in'],
    contactConsistent: 'yes',
    askForReviews: 'yes',
    websiteDetailsClear: 'yes',
    publishesContent: 'no',
    tracksMarketing: 'no',
    clearConversionAction: 'yes',
    mainGoal: 'local_visibility',
    weeklyHours: '1_to_3h',
    budgetPreference: 'free_only',
  },
  scoreResult: {
    totalScore: 70,
    interpretation: 'Good momentum',
    evaluatedQuestionsCount: 7,
    totalApplicableWeight: 100,
    categoryBreakdown: {},
    strengths: ['Listing active'],
    gaps: ['No content published'],
  },
  tasks: [
    {
      id: 'task_rec_gbp_setup',
      templateId: 'rec_gbp_setup',
      title: 'Claim and Complete Your Google Business Profile',
      category: 'Business listings',
      priority: 'High',
      priorityReason: 'Foundational step',
      summary: 'Claim profile',
      whyItMatters: 'Discovery',
      instructions: ['Step 1', 'Step 2'],
      estimatedEffort: '45 mins',
      suggestedTimeToComplete: 'Week 1',
      completionCriteria: 'Verified',
      suggestedNextStep: 'Log in and confirm phone and address match your documentation',
      tags: ['google'],
      status: 'not_started',
      completedAt: null,
      notes: '',
      weeklyScheduleGroup: 1,
    },
  ],
};

test('storage: saves, updates and loads in-memory fallback smoothly', () => {
  const saveRes = savePlanToStorage(mockPlan);
  assert.equal(saveRes.success, true);

  const loaded = loadPlanFromStorage();
  assert.ok(loaded);
  assert.equal(loaded?.answers.category, 'retail');
  assert.equal(loaded?.tasks.length, 1);

  // Update task
  const updated = updateTaskInStorage('task_rec_gbp_setup', (t) => ({
    ...t,
    status: 'completed',
    notes: 'Verified via postcard',
  }));
  assert.ok(updated);
  assert.equal(updated?.tasks[0].status, 'completed');
  assert.equal(updated?.tasks[0].notes, 'Verified via postcard');

  // Clear
  clearPlanStorage();
  const empty = loadPlanFromStorage();
  assert.equal(empty, null);
});
