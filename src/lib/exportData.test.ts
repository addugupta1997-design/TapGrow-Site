import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePrintableHtml } from './exportData';
import { SavedPlanState } from '../types/storage';

const mockPlan: SavedPlanState = {
  schemaVersion: 1,
  lastUpdated: '2026-10-29T00:00:00.000Z',
  answers: {
    businessName: 'Highland Dental Care',
    category: 'health_clinic',
    country: 'United States',
    cityArea: 'Denver, CO',
    businessModel: 'physical',
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
    mainGoal: 'more_bookings',
    weeklyHours: '1_to_3h',
    budgetPreference: 'free_only',
  },
  scoreResult: {
    totalScore: 78,
    interpretation: 'Strong foundation with key assets in place',
    evaluatedQuestionsCount: 7,
    totalApplicableWeight: 100,
    categoryBreakdown: {},
    strengths: ['Google listing claimed', 'Consistent contact details'],
    gaps: ['No weekly marketing routine'],
  },
  tasks: [
    {
      id: 'task_1',
      templateId: 'rec_review_system',
      title: 'Establish a Simple Customer Review Request Routine',
      category: 'Reviews and reputation',
      priority: 'High',
      priorityReason: 'Social proof drives conversions',
      summary: 'Invite satisfied patients to leave an honest Google review',
      whyItMatters: 'Recent reviews increase local trust',
      instructions: ['Generate review link', 'Send to 3 patients'],
      estimatedEffort: '30 mins',
      suggestedTimeToComplete: 'Week 1',
      completionCriteria: 'Link created and sent to patients',
      suggestedNextStep: 'Save the review request link on staff phones',
      tags: ['reviews'],
      status: 'completed',
      completedAt: '2026-10-29T01:00:00.000Z',
      notes: 'Template saved in reception desk notes',
      weeklyScheduleGroup: 1,
    },
  ],
};

test('exportData: generatePrintableHtml creates complete standalone HTML report', () => {
  const html = generatePrintableHtml(mockPlan);
  assert.ok(html.includes('Highland Dental Care'));
  assert.ok(html.includes('Denver, CO, United States'));
  assert.ok(html.includes('78 / 100'));
  assert.ok(html.includes('Establish a Simple Customer Review Request Routine'));
  assert.ok(html.includes('Template saved in reception desk notes'));
  assert.ok(html.includes('window.print()'));
});
