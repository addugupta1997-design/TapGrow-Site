import { AssessmentAnswers, BusinessCategory, MainGoal } from './assessment';

export type RecommendationCategory =
  | 'Local SEO'
  | 'Business listings'
  | 'Google Business Profile'
  | 'Reviews and reputation'
  | 'Website basics'
  | 'Social media'
  | 'Content marketing'
  | 'Conversion improvements'
  | 'Customer acquisition'
  | 'Marketing measurement'
  | 'Measurement and consistency'
  | 'Customer retention';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'deferred';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface PriorityEvaluation {
  priority: PriorityLevel;
  reason: string;
  score?: number;
}

export interface RecommendationTemplate {
  id: string;
  title: string;
  category: RecommendationCategory;
  defaultPriority: PriorityLevel;
  summary: string;
  whyItMatters: string;
  /** What problem this recommendation directly addresses */
  problemAddressed: string;
  /** Concrete expected business benefit */
  expectedBenefit: string;
  /** Estimated time duration to complete */
  estimatedEffort: string; // e.g. "30-45 mins", "1-2 hours"
  /** Skill or difficulty tier */
  difficultyLevel: DifficultyLevel;
  /** Minimum tools, equipment, or assets needed */
  requiredResources: string;
  instructions: string[];
  suggestedTimeToComplete: string; // e.g. "Week 1", "Week 2"
  prerequisites?: string[]; // IDs of templates that should be completed before this
  referenceUrl?: string;
  referenceTitle?: string;
  completionCriteria: string;
  suggestedNextStep?: string;
  tags: string[];
  version: number;
  defaultPriorityReason: string;
  /** Business categories this template specifically targets, or 'all' */
  businessCategories?: BusinessCategory[] | 'all';
  /** Primary goals this template directly helps achieve, or 'all' */
  targetGoals?: MainGoal[] | 'all';
  /** Estimated relative business impact (1-10) */
  baseImpactScore?: number;
  /** Estimated relative effort penalty (1-10) */
  baseEffortScore?: number;
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
  problemAddressed?: string;
  expectedBenefit?: string;
  estimatedEffort: string;
  difficultyLevel?: DifficultyLevel;
  requiredResources?: string;
  instructions: string[];
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
  /** Clear explanation of why this specific recommendation appears for this business */
  whySeeingThis?: string;
  /** Calculated internal multi-factor ranking score */
  rankingScore?: number;
  /** Whether all prerequisite tasks have been completed */
  isUnlocked?: boolean;
}

export interface ScoreCategoryBreakdown {
  name: string;
  earned: number;
  total: number;
  percentage: number;
}

export interface ScoreResult {
  totalScore: number; // 0 - 100 (including confirmed completed actions)
  baseScore?: number; // Initial score from assessment answers
  confirmedBoost?: number; // Meaningful score increase from confirmed completed tasks
  confirmedCompletedTasksCount?: number;
  interpretation: string;
  evaluatedQuestionsCount: number;
  totalApplicableWeight: number;
  categoryBreakdown: Record<string, ScoreCategoryBreakdown>;
  strengths: string[];
  gaps: string[];
}
