import { AssessmentAnswers } from './assessment';
import { GeneratedTask, ScoreResult } from './recommendations';

export const CURRENT_STORAGE_SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'local_biz_growth_planner_data_v1';

export interface ReminderSubscription {
  enabled: boolean;
  email: string;
  frequency: 'weekly';
  dayOfWeek: 'monday' | 'friday' | 'sunday';
  timeOfDay: string; // e.g. "09:00"
  includeGrowthPulse: boolean;
  includeTopPriorities: boolean;
  subscribedAt: string;
  lastDigestSent?: string;
}

export interface SavedPlanState {
  schemaVersion: number;
  lastUpdated: string;
  answers: AssessmentAnswers;
  scoreResult: ScoreResult;
  tasks: GeneratedTask[];
  remindersSubscription?: ReminderSubscription;
}
