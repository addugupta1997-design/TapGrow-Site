import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  getWeeklyCapacityMinutes,
  parseEffortToMinutes,
  generateWeeklyPlan,
  rescheduleUnfinishedTasks,
  generateWeeklyReview,
  generateMonthlyMilestones,
  getMondayOfCurrentWeek,
} from './planGenerator';
import { AssessmentAnswers } from '../../types/assessment';
import { GeneratedTask } from '../../types/recommendations';

const mockAnswers: AssessmentAnswers = {
  businessName: 'Green Olive Bistro',
  category: 'restaurant_cafe',
  country: 'United Kingdom',
  cityArea: 'Bristol',
  businessModel: 'physical',
  hasWebsite: 'yes',
  hasBusinessListing: 'not_sure',
  socialPresence: 'one',
  discoveryMethods: ['walk_ins'],
  contactConsistent: 'yes',
  askForReviews: 'no',
  websiteDetailsClear: 'not_sure',
  publishesContent: 'no',
  tracksMarketing: 'no',
  clearConversionAction: 'no',
  mainGoal: 'local_visibility',
  weeklyHours: '1_to_3h',
  budgetPreference: 'mostly_free',
};

const mockTasks: GeneratedTask[] = [
  {
    id: 'gbp_claim_optimize',
    templateId: 'tpl_gbp',
    title: 'Claim and optimize Google Business Profile',
    category: 'Google Business Profile',
    priority: 'High',
    priorityReason: 'Essential for local discovery',
    summary: 'Claim and verify your business on Google',
    whyItMatters: 'Top ranking factor for local maps',
    estimatedEffort: '45 mins',
    suggestedTimeToComplete: '45 mins',
    completionCriteria: 'Profile is claimed and verified',
    suggestedNextStep: 'Add high-resolution photos',
    tags: ['Google', 'Maps', 'Local SEO'],
    weeklyScheduleGroup: 1,
    status: 'not_started',
    whySeeingThis: 'Essential for local discovery in Bristol',
    instructions: ['Step 1: Go to business.google.com', 'Step 2: Claim profile'],
    rankingScore: 95,
  },
  {
    id: 'website_nap_consistency',
    templateId: 'tpl_nap',
    title: 'Align Name, Address, and Phone across website and directories',
    category: 'Website basics',
    priority: 'High',
    priorityReason: 'Ensures citations match',
    summary: 'Verify contact details on your homepage footer',
    whyItMatters: 'Builds citation authority for search algorithms',
    estimatedEffort: '30 mins',
    suggestedTimeToComplete: '30 mins',
    completionCriteria: 'Address and phone match exactly everywhere',
    suggestedNextStep: 'Check social pages for consistency',
    tags: ['Website', 'Contact'],
    weeklyScheduleGroup: 1,
    status: 'not_started',
    whySeeingThis: 'Ensures search engines verify physical presence',
    instructions: ['Step 1: Check website footer', 'Step 2: Verify telephone format'],
    rankingScore: 88,
  },
  {
    id: 'capture_first_reviews',
    templateId: 'tpl_reviews',
    title: 'Establish a direct review request routine',
    category: 'Reviews and reputation',
    priority: 'Medium',
    priorityReason: 'Social proof drives visits',
    summary: 'Ask your happiest customers for feedback',
    whyItMatters: 'Recent reviews increase customer conversion rate',
    estimatedEffort: '30 mins',
    suggestedTimeToComplete: '30 mins',
    completionCriteria: 'First 3 new reviews received',
    suggestedNextStep: 'Respond publicly to each review',
    tags: ['Reviews', 'Reputation'],
    weeklyScheduleGroup: 2,
    status: 'not_started',
    whySeeingThis: 'Builds customer trust before first visit',
    instructions: ['Step 1: Create short review link', 'Step 2: Ask recent happy customers'],
    rankingScore: 75,
  },
  {
    id: 'local_instagram_routine',
    templateId: 'tpl_social',
    title: 'Post behind-the-scenes authentic weekly updates',
    category: 'Social media',
    priority: 'Low',
    priorityReason: 'Maintains active presence',
    summary: 'Share real behind-the-scenes content',
    whyItMatters: 'Keeps business top-of-mind locally',
    estimatedEffort: '30 mins',
    suggestedTimeToComplete: '30 mins',
    completionCriteria: '2 posts published per week',
    suggestedNextStep: 'Engage with local neighbourhood accounts',
    tags: ['Social', 'Community'],
    weeklyScheduleGroup: 3,
    status: 'deferred',
    whySeeingThis: 'Keeps business top-of-mind locally',
    instructions: ['Step 1: Snap photo of daily special', 'Step 2: Tag Bristol location'],
    rankingScore: 50,
  },
];

describe('planGenerator - Capacity & Parsing', () => {
  it('correctly maps weekly hours to realistic minute capacities', () => {
    assert.equal(getWeeklyCapacityMinutes('under_1h'), 50);
    assert.equal(getWeeklyCapacityMinutes('1_to_3h'), 140);
    assert.equal(getWeeklyCapacityMinutes('3_to_5h'), 240);
    assert.equal(getWeeklyCapacityMinutes('over_5h'), 360);
    assert.equal(getWeeklyCapacityMinutes(undefined), 140);
  });

  it('accurately parses effort strings into numeric minutes', () => {
    assert.equal(parseEffortToMinutes('15 mins'), 15);
    assert.equal(parseEffortToMinutes('30 mins'), 30);
    assert.equal(parseEffortToMinutes('45 mins'), 45);
    assert.equal(parseEffortToMinutes('1 hour'), 60);
    assert.equal(parseEffortToMinutes('1–2 hours'), 90);
    assert.equal(parseEffortToMinutes('30–45 mins'), 35);
    assert.equal(parseEffortToMinutes(''), 30);
  });

  it('determines the Monday date for any given date', () => {
    const monday = getMondayOfCurrentWeek(new Date('2026-11-04T12:00:00Z')); // Wednesday
    assert.equal(typeof monday, 'string');
    assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(monday));
  });
});

describe('planGenerator - Weekly Plan Distribution', () => {
  it('generates a deterministic 7-day schedule respecting capacity and priority', () => {
    const plan = generateWeeklyPlan(mockAnswers, mockTasks);

    assert.equal(plan.weekNumber, 1);
    assert.ok(plan.startDateIso);
    assert.ok(plan.schedule);

    // Total scheduled tasks must not include the deferred task
    const allScheduledIds: string[] = [];
    Object.values(plan.schedule).forEach((taskIds) => {
      allScheduledIds.push(...taskIds);
    });

    assert.ok(!allScheduledIds.includes('local_instagram_routine'), 'Deferred task should not be scheduled');
    assert.ok(allScheduledIds.includes('gbp_claim_optimize'), 'High priority task must be scheduled');
  });

  it('restricts schedule to light mid-week days when user has under 1h available', () => {
    const answersUnder1h: AssessmentAnswers = {
      ...mockAnswers,
      weeklyHours: 'under_1h',
    };
    const plan = generateWeeklyPlan(answersUnder1h, mockTasks);

    // Should only allocate to Tuesday/Thursday
    const scheduledDays = Object.entries(plan.schedule)
      .filter(([_, ids]) => ids.length > 0)
      .map(([day]) => day);

    scheduledDays.forEach((day) => {
      assert.ok(['tuesday', 'thursday'].includes(day), `Day ${day} should be tuesday or thursday`);
    });

    const totalScheduled = Object.values(plan.schedule).reduce((acc, ids) => acc + ids.length, 0);
    assert.ok(totalScheduled <= 2, 'Should schedule at most 2 actions for under_1h');
  });
});

describe('planGenerator - Rescheduling & Reviews', () => {
  it('reschedules unfinished tasks into next week', () => {
    const initialPlan = generateWeeklyPlan(mockAnswers, mockTasks);
    // Mark first task as completed
    const tasksWithCompleted = mockTasks.map((t) =>
      t.id === 'gbp_claim_optimize' ? { ...t, status: 'completed' as const } : t
    );

    const rescheduled = rescheduleUnfinishedTasks(initialPlan, tasksWithCompleted, mockAnswers);

    assert.equal(rescheduled.weekNumber, 2);
    // Completed task should not be rescheduled
    const allRescheduledIds = Object.values(rescheduled.schedule).flat();
    assert.ok(!allRescheduledIds.includes('gbp_claim_optimize'), 'Completed task should not appear in new plan');
  });

  it('generates an end-of-week reflection report with factual accomplishments', () => {
    const planner = generateWeeklyPlan(mockAnswers, mockTasks);
    const tasksWithCompleted = mockTasks.map((t) =>
      t.id === 'gbp_claim_optimize' ? { ...t, status: 'completed' as const } : t
    );

    const review = generateWeeklyReview(planner, tasksWithCompleted, mockAnswers);

    assert.equal(review.weekNumber, 1);
    assert.equal(review.completedTasksCount, 1);
    assert.equal(review.completedTasks[0].id, 'gbp_claim_optimize');
    assert.ok(review.totalMinutesSpent > 0);
    assert.ok(review.mainAchievements.length > 0);
    assert.ok(review.suggestedFocusNextWeek.length > 0);
  });

  it('generates 4-week monthly milestones roadmap', () => {
    const milestones = generateMonthlyMilestones(mockAnswers, mockTasks, 1);

    assert.equal(milestones.length, 4);
    assert.equal(milestones[0].weekNumber, 1);
    assert.equal(milestones[0].isCurrent, true);
    assert.equal(milestones[1].isCurrent, false);
    assert.ok(milestones[0].keyGoals.length > 0);
  });
});
