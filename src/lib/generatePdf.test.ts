import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePdfReport } from './generatePdf';
import { SavedPlanState } from '../types/storage';

const mockPlan: SavedPlanState = {
  schemaVersion: 1,
  lastUpdated: '2026-10-29T00:00:00.000Z',
  answers: {
    businessName: 'Summit Coffee Roasters',
    category: 'restaurant_cafe',
    country: 'United States',
    cityArea: 'Seattle, WA',
    businessModel: 'physical',
    hasWebsite: 'yes',
    hasBusinessListing: 'yes',
    socialPresence: 'multiple',
    discoveryMethods: ['walk_in', 'word_of_mouth'],
    contactConsistent: 'yes',
    askForReviews: 'yes',
    websiteDetailsClear: 'yes',
    publishesContent: 'no',
    tracksMarketing: 'no',
    clearConversionAction: 'yes',
    mainGoal: 'more_visits',
    weeklyHours: '1_to_3h',
    budgetPreference: 'free_only',
  },
  scoreResult: {
    totalScore: 75,
    interpretation: 'Solid local visibility with opportunities for review growth',
    evaluatedQuestionsCount: 7,
    totalApplicableWeight: 100,
    categoryBreakdown: {},
    strengths: ['Google listing claimed', 'Consistent NAP'],
    gaps: ['No review request routine'],
  },
  tasks: [
    {
      id: 'task_1',
      templateId: 'rec_review_system',
      title: 'Establish a Simple Customer Review Request Routine',
      category: 'Reviews and reputation',
      priority: 'High',
      priorityReason: 'Social proof drives conversions',
      summary: 'Invite satisfied customers to leave an honest review',
      whyItMatters: 'Recent reviews increase local map rankings',
      instructions: ['Generate review link', 'Send to 3 clients per week'],
      estimatedEffort: '30 mins',
      suggestedTimeToComplete: 'Week 1',
      completionCriteria: 'Link created and sent to clients',
      suggestedNextStep: 'Save the review request link on team smartphones',
      tags: ['reviews'],
      status: 'not_started',
      completedAt: null,
      notes: 'Check back with team on Friday',
      weeklyScheduleGroup: 1,
    },
  ],
};

test('generatePdf: generates valid jsPDF instance and document without errors', () => {
  const doc = generatePdfReport(mockPlan, { skipSave: true });
  assert.ok(doc, 'Expected doc to be defined');
  assert.ok(doc.getNumberOfPages() >= 1, 'Expected at least 1 page');
  const buffer = doc.output('arraybuffer');
  assert.ok(buffer.byteLength > 1000, 'Expected non-empty PDF binary output');
});
