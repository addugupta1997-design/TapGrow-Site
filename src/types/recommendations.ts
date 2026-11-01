import { AssessmentAnswers } from './assessment';

export type RecommendationCategory =
  | 'Local SEO'
  | 'Business listings'
  | 'Reviews and reputation'
  | 'Website basics'
  | 'Social media'
  | 'Content marketing'
  | 'Conversion improvements'
  | 'Measurement and consistency';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface PriorityEvaluation {
  priority: PriorityLevel;
  reason: string;
}

export interface RecommendationTemplate {
  id: string;
  title: string;
  category: RecommendationCategory;
  defaultPriority: PriorityLevel;
  summary: string;
  whyItMatters: string;
  instructions: string[];
  estimatedEffort: string; // e.g. "30-45 mins", "1-2 hours"
  suggestedTimeToComplete: string; // e.g. "Week 1", "Week 2"
  prerequisites?: string[];
  referenceUrl?: string;
  referenceTitle?: string;
  completionCriteria: string;
  suggestedNextStep?: string;
  tags: string[];
  version: number;
  defaultPriorityReason: string;
  /** Function determining whether this task is relevant for the business */
  isApplicable: (answers: AssessmentAnswers) => boolean;
  /** Evaluates dynamic priority and plain-language reason based on business profile */
  evaluatePriority?: (answers: AssessmentAnswers) => PriorityEvaluation;
}

export interface GeneratedTask {
  id: string;
  templateId: string;
  title: string;
  category: RecommendationCategory;
  priority: PriorityLevel;
  priorityReason: string;
  summary: string;
  whyItMatters: string;
  instructions: string[];
  estimatedEffort: string;
  suggestedTimeToComplete: string;
  prerequisites?: string[];
  referenceUrl?: string;
  referenceTitle?: string;
  completionCriteria: string;
  suggestedNextStep: string;
  tags: string[];
  status: TaskStatus;
  completedAt?: string | null;
  notes?: string;
  weeklyScheduleGroup: number; // 1 = Week 1, 2 = Week 2, 3 = Week 3, 4 = Ongoing
}

export interface ScoreCategoryBreakdown {
  name: string;
  earned: number;
  total: number;
  percentage: number;
}

export interface ScoreResult {
  totalScore: number; // 0 - 100
  interpretation: string;
  evaluatedQuestionsCount: number;
  totalApplicableWeight: number;
  categoryBreakdown: Record<string, ScoreCategoryBreakdown>;
  strengths: string[];
  gaps: string[];
}
