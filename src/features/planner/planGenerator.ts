import { AssessmentAnswers, WeeklyTimeAvailable } from '../../types/assessment';
import { GeneratedTask, TaskStatus } from '../../types/recommendations';
import {
  DayOfWeek,
  DAYS_OF_WEEK,
  WeeklyPlannerState,
  WeeklyReviewReport,
  MonthlyMilestone,
} from '../../types/planner';

/**
 * Returns available weekly minutes threshold based on user's assessment answer.
 */
export function getWeeklyCapacityMinutes(weeklyHours?: WeeklyTimeAvailable): number {
  switch (weeklyHours) {
    case 'under_1h':
      return 50; // max ~50 mins
    case '1_to_3h':
      return 140; // ~2.3 hours
    case '3_to_5h':
      return 240; // ~4 hours
    case 'over_5h':
      return 360; // ~6 hours
    default:
      return 140;
  }
}

/**
 * Parses an effort string like "30 mins", "45–60 mins", "1–2 hours" into approximate minutes.
 */
export function parseEffortToMinutes(effortStr: string): number {
  if (!effortStr) return 30;
  const lower = effortStr.toLowerCase();

  if (lower.includes('1–2 hours') || lower.includes('1-2 hours')) return 90;
  if (lower.includes('1–2 hr') || lower.includes('1-2 hr')) return 90;
  if (lower.includes('1 hour') || lower.includes('1 hr')) return 60;
  if (lower.includes('45–60') || lower.includes('45-60')) return 50;
  if (lower.includes('30–45') || lower.includes('30-45')) return 35;
  if (lower.includes('45 mins') || lower.includes('45 min')) return 45;
  if (lower.includes('40 mins') || lower.includes('40 min')) return 40;
  if (lower.includes('35 mins') || lower.includes('35 min')) return 35;
  if (lower.includes('30 mins') || lower.includes('30 min')) return 30;
  if (lower.includes('25 mins') || lower.includes('25 min')) return 25;
  if (lower.includes('20 mins') || lower.includes('20 min')) return 20;
  if (lower.includes('15 mins') || lower.includes('15 min')) return 15;
  if (lower.includes('10 mins') || lower.includes('10 min')) return 10;

  const match = lower.match(/(\d+)\s*min/);
  if (match) return parseInt(match[1], 10);

  return 30;
}

/**
 * Gets the current ISO date of Monday for the active week.
 */
export function getMondayOfCurrentWeek(date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split('T')[0];
}

/**
 * Deterministically generates a balanced 7-day weekly growth plan.
 * Respects available time, task priorities, and dependencies.
 */
export function generateWeeklyPlan(
  answers: AssessmentAnswers,
  tasks: GeneratedTask[],
  options?: {
    weekNumber?: number;
    startDateIso?: string;
    existingSchedule?: Record<DayOfWeek, string[]>;
    preserveCompleted?: boolean;
  }
): WeeklyPlannerState {
  const capacityMinutes = getWeeklyCapacityMinutes(answers.weeklyHours);
  const weekNumber = options?.weekNumber || 1;
  const startDateIso = options?.startDateIso || getMondayOfCurrentWeek();

  // Create clean empty 7-day schedule
  const schedule: Record<DayOfWeek, string[]> = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  };

  // 1. Separate eligible candidate tasks:
  // Must NOT be deferred; prefer incomplete tasks (or completed if user asked to preserve)
  const candidateTasks = tasks.filter((t) => {
    if (t.status === 'deferred') return false;
    if (options?.preserveCompleted) return true;
    return t.status !== 'completed';
  });

  // Sort candidate tasks: High priority first, then by internal ranking score or effort
  const sortedCandidates = [...candidateTasks].sort((a, b) => {
    const priorityWeight: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
    const pDiff = (priorityWeight[a.priority] || 2) - (priorityWeight[b.priority] || 2);
    if (pDiff !== 0) return pDiff;

    if (b.rankingScore !== undefined && a.rankingScore !== undefined) {
      return b.rankingScore - a.rankingScore;
    }
    return 0;
  });

  // 2. Select tasks that fit inside weekly capacity
  let allocatedMinutes = 0;
  const selectedTasks: GeneratedTask[] = [];

  for (const task of sortedCandidates) {
    const taskMinutes = parseEffortToMinutes(task.estimatedEffort);

    // If adding this task doesn't blow past capacity, or if it's the very first high-priority task
    if (allocatedMinutes + taskMinutes <= capacityMinutes || selectedTasks.length === 0) {
      selectedTasks.push(task);
      allocatedMinutes += taskMinutes;
    } else {
      // If we are under 1h capacity and already have 1-2 tasks, break
      if (answers.weeklyHours === 'under_1h' && selectedTasks.length >= 2) {
        break;
      }
    }
  }

  // 3. Distribute selected tasks across days naturally:
  // Day sequence preference: Monday, Wednesday, Friday, Tuesday, Thursday, Saturday
  // Sunday is preserved as review / rest day by default unless task volume is high
  const preferredDaySequence: DayOfWeek[] =
    answers.weeklyHours === 'under_1h'
      ? ['tuesday', 'thursday'] // light schedule on mid-week days
      : answers.weeklyHours === '1_to_3h'
      ? ['monday', 'wednesday', 'friday'] // standard 3 days
      : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  let dayIdx = 0;
  for (const task of selectedTasks) {
    const day = preferredDaySequence[dayIdx % preferredDaySequence.length];
    schedule[day].push(task.id);
    dayIdx += 1;
  }

  return {
    weekNumber,
    startDateIso,
    schedule,
    loggedMinutes: {},
    lastGeneratedAt: new Date().toISOString(),
  };
}

/**
 * Reschedules unfinished tasks into a fresh weekly plan.
 * Takes uncompleted tasks from existing schedule and re-allocates them.
 */
export function rescheduleUnfinishedTasks(
  currentPlan: WeeklyPlannerState,
  allTasks: GeneratedTask[],
  answers: AssessmentAnswers
): WeeklyPlannerState {
  const taskMap = new Map<string, GeneratedTask>();
  allTasks.forEach((t) => taskMap.set(t.id, t));

  // Find all scheduled tasks that are not yet completed
  const unfinishedTaskIds: string[] = [];
  const completedTaskIds: string[] = [];

  DAYS_OF_WEEK.forEach(({ id }) => {
    (currentPlan.schedule[id] || []).forEach((taskId) => {
      const task = taskMap.get(taskId);
      if (task) {
        if (task.status === 'completed') {
          completedTaskIds.push(taskId);
        } else {
          unfinishedTaskIds.push(taskId);
        }
      }
    });
  });

  // Re-generate fresh plan for next week incorporating unfinished tasks
  const nextWeekNumber = currentPlan.weekNumber + 1;
  const newStartDate = getMondayOfCurrentWeek(new Date(Date.now() + 7 * 86400000));

  return generateWeeklyPlan(answers, allTasks, {
    weekNumber: nextWeekNumber,
    startDateIso: newStartDate,
    preserveCompleted: false,
  });
}

/**
 * Generates an end-of-week reflection review based on recorded task statuses and logs.
 */
export function generateWeeklyReview(
  planner: WeeklyPlannerState,
  tasks: GeneratedTask[],
  answers: AssessmentAnswers
): WeeklyReviewReport {
  const taskMap = new Map<string, GeneratedTask>();
  tasks.forEach((t) => taskMap.set(t.id, t));

  const scheduledTaskIds: string[] = [];
  DAYS_OF_WEEK.forEach(({ id }) => {
    (planner.schedule[id] || []).forEach((tId) => scheduledTaskIds.push(tId));
  });

  const uniqueScheduledIds = Array.from(new Set(scheduledTaskIds));
  const completedTasks: { id: string; title: string; category: string }[] = [];
  const remainingTasks: { id: string; title: string; reason: string }[] = [];

  let totalMinutesSpent = 0;

  uniqueScheduledIds.forEach((taskId) => {
    const task = taskMap.get(taskId);
    if (!task) return;

    const estMinutes = parseEffortToMinutes(task.estimatedEffort);
    const logged = planner.loggedMinutes?.[taskId] ?? (task.status === 'completed' ? estMinutes : 0);

    if (task.status === 'completed') {
      completedTasks.push({ id: task.id, title: task.title, category: task.category });
      totalMinutesSpent += logged;
    } else {
      const reason =
        task.status === 'in_progress'
          ? 'In Progress (partially completed)'
          : task.status === 'deferred'
          ? 'Postponed for later'
          : 'Pending next available action slot';
      remainingTasks.push({ id: task.id, title: task.title, reason });
    }
  });

  // Synthesize factual achievements
  const mainAchievements: string[] = [];
  if (completedTasks.length > 0) {
    const categoriesDone = Array.from(new Set(completedTasks.map((t) => t.category)));
    mainAchievements.push(`Completed ${completedTasks.length} growth actions across ${categoriesDone.join(', ')}.`);
    completedTasks.slice(0, 2).forEach((t) => {
      mainAchievements.push(`Established: "${t.title}".`);
    });
  } else {
    mainAchievements.push('Reviewed weekly growth foundations and prioritized upcoming actions.');
  }

  // Next week focus suggestion based on remaining priorities
  let suggestedFocusNextWeek = 'Maintain weekly consistency by executing your top 2 scheduled actions.';
  if (remainingTasks.length > 0) {
    suggestedFocusNextWeek = `Complete outstanding action "${remainingTasks[0].title}" before taking on new marketing initiatives.`;
  } else if (answers.mainGoal === 'local_visibility') {
    suggestedFocusNextWeek = 'Focus on capturing new Google reviews and checking directory address consistency.';
  } else if (answers.mainGoal === 'more_enquiries') {
    suggestedFocusNextWeek = 'Focus on website call-to-action prominence and response speed for inquiries.';
  }

  return {
    weekNumber: planner.weekNumber,
    reviewedAt: new Date().toISOString(),
    completedTasksCount: completedTasks.length,
    remainingTasksCount: remainingTasks.length,
    completedTasks,
    remainingTasks,
    totalMinutesSpent,
    mainAchievements,
    suggestedFocusNextWeek,
  };
}

/**
 * Generates simple 4-week monthly milestone roadmap based on business category and goals.
 */
export function generateMonthlyMilestones(
  answers: AssessmentAnswers,
  tasks: GeneratedTask[],
  currentWeekNumber = 1
): MonthlyMilestone[] {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  return [
    {
      weekNumber: 1,
      title: 'Week 1: Core Foundations & Search Discovery',
      focusArea: 'Google Business Profile, NAP Consistency & Hours',
      keyGoals: ['Claim and complete Google Business Profile', 'Verify exact business hours and location'],
      taskCount: Math.min(3, Math.ceil(totalTasks * 0.3)),
      completedCount: Math.min(3, completedTasks),
      isCurrent: currentWeekNumber === 1,
    },
    {
      weekNumber: 2,
      title: 'Week 2: Conversion Actions & Inquiries',
      focusArea: 'Clear Calls to Action, Direct Booking & Contact Clarity',
      keyGoals: ['Make phone/contact buttons 1-tap accessible', 'Address visit and inquiry objections'],
      taskCount: Math.min(3, Math.ceil(totalTasks * 0.3)),
      completedCount: Math.max(0, Math.min(3, completedTasks - 2)),
      isCurrent: currentWeekNumber === 2,
    },
    {
      weekNumber: 3,
      title: 'Week 3: Reputation & Social Rhythm',
      focusArea: 'Review Request Routine & Authentic Content',
      keyGoals: ['Send review requests to 3 satisfied clients', 'Batch month of authentic photos/updates'],
      taskCount: Math.min(2, Math.ceil(totalTasks * 0.2)),
      completedCount: Math.max(0, Math.min(2, completedTasks - 4)),
      isCurrent: currentWeekNumber === 3,
    },
    {
      weekNumber: 4,
      title: 'Week 4: Measurement, Consistency & Retention',
      focusArea: 'Lead Source Logging & Recurring 30-Min Habit',
      keyGoals: ['Track where new inquiries originate', 'Set recurring 30-minute weekly marketing check-in'],
      taskCount: Math.min(2, Math.ceil(totalTasks * 0.2)),
      completedCount: Math.max(0, Math.min(2, completedTasks - 6)),
      isCurrent: currentWeekNumber >= 4,
    },
  ];
}
