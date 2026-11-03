import { GeneratedTask } from './recommendations';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_OF_WEEK: { id: DayOfWeek; label: string; short: string }[] = [
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
];

export interface WeeklyPlannerState {
  weekNumber: number;
  startDateIso: string; // ISO date of Monday for this planner week
  schedule: Record<DayOfWeek, string[]>; // Day -> array of taskIds
  loggedMinutes?: Record<string, number>; // TaskId -> user-recorded or estimated minutes
  lastGeneratedAt?: string;
  dayNotes?: Record<DayOfWeek, string>;
}

export interface WeeklyReviewReport {
  weekNumber: number;
  reviewedAt: string;
  completedTasksCount: number;
  remainingTasksCount: number;
  completedTasks: { id: string; title: string; category: string }[];
  remainingTasks: { id: string; title: string; reason: string }[];
  totalMinutesSpent: number;
  mainAchievements: string[];
  suggestedFocusNextWeek: string;
}

export interface MonthlyMilestone {
  weekNumber: number;
  title: string;
  focusArea: string;
  keyGoals: string[];
  taskCount: number;
  completedCount: number;
  isCurrent: boolean;
}
