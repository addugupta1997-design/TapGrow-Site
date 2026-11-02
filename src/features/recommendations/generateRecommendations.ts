import { AssessmentAnswers } from '../../types/assessment';
import { GeneratedTask, PriorityLevel, TaskStatus } from '../../types/recommendations';
import { RECOMMENDATION_CATALOG } from './recommendationCatalog';
import { buildBusinessIntelligenceProfile } from './businessProfile';
import { rankRecommendation } from './recommendationRanker';

const PRIORITY_ORDER: Record<PriorityLevel, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};

/**
 * Generates deterministic, business-specific marketing recommendations (V2).
 * Integrates structured business intelligence profiling, multi-factor ranking,
 * prerequisite dependency tracking, and dynamic explanation generation.
 */
export function generateRecommendations(
  answers: AssessmentAnswers,
  existingTasks?: GeneratedTask[]
): GeneratedTask[] {
  // 1. Build business intelligence profile without assuming unstated information
  const profile = buildBusinessIntelligenceProfile(answers);

  // Set of completed task IDs to evaluate prerequisites and preserve history
  const completedTaskIds = new Set<string>();
  const existingTaskMap = new Map<string, GeneratedTask>();

  if (existingTasks && existingTasks.length > 0) {
    existingTasks.forEach((t) => {
      existingTaskMap.set(t.templateId, t);
      existingTaskMap.set(t.id, t);
      if (t.status === 'completed') {
        completedTaskIds.add(t.templateId);
        completedTaskIds.add(t.id);
      }
    });
  }

  // 2. Filter applicable templates based on business model and intelligence rules
  const applicableTemplates = RECOMMENDATION_CATALOG.filter((template) => {
    try {
      // Rule A: If no website, do NOT recommend website conversion/clarity/schema audits
      if (profile.hasWebsite === false) {
        if (
          template.id === 'rec_website_clarity' ||
          template.id === 'rec_local_schema' ||
          template.id === 'rec_mobile_speed'
        ) {
          return false;
        }
      }

      // If online-only business, exclude physical map pack setups
      if (profile.businessModel === 'online_only') {
        if (
          template.id === 'rec_gbp_setup' ||
          template.id === 'rec_apple_bing_listings' ||
          template.id === 'rec_gbp_attributes_photos'
        ) {
          return false;
        }
      }

      return template.isApplicable(answers);
    } catch (err) {
      console.error(`Error checking applicability for template ${template.id}:`, err);
      return false;
    }
  });

  // 3. Prevent duplicate template IDs
  const seenTemplateIds = new Set<string>();
  const uniqueTemplates = applicableTemplates.filter((tpl) => {
    if (seenTemplateIds.has(tpl.id)) return false;
    seenTemplateIds.add(tpl.id);
    return true;
  });

  // 4. Map into full GeneratedTask items with intelligent multi-factor ranking
  let generatedTasks: GeneratedTask[] = uniqueTemplates.map((tpl) => {
    const ranking = rankRecommendation(tpl, answers, profile, completedTaskIds);

    // Check if task previously existed in storage
    const existing = existingTaskMap.get(tpl.id) || existingTaskMap.get(`task_${tpl.id}`);

    // Check prerequisite unlocking
    let isUnlocked = true;
    if (tpl.prerequisites && tpl.prerequisites.length > 0) {
      isUnlocked = tpl.prerequisites.every((req) => completedTaskIds.has(req) || completedTaskIds.has(`task_${req}`));
    }

    // Suggested schedule grouping based on priority and week
    let weeklyGroup = 1;
    if (tpl.suggestedTimeToComplete === 'Week 2') weeklyGroup = 2;
    else if (tpl.suggestedTimeToComplete === 'Week 3') weeklyGroup = 3;
    else if (tpl.suggestedTimeToComplete === 'Week 4') weeklyGroup = 4;

    if (ranking.priority === 'High' && weeklyGroup > 2) {
      weeklyGroup = 2;
    }

    const taskStatus: TaskStatus = existing ? existing.status : 'not_started';
    const completedAt = existing ? existing.completedAt : null;
    const notes = existing ? existing.notes || '' : '';

    return {
      id: `task_${tpl.id}`,
      templateId: tpl.id,
      title: tpl.title,
      category: tpl.category,
      priority: ranking.priority,
      priorityReason: ranking.priorityReason,
      summary: tpl.summary,
      whyItMatters: tpl.whyItMatters,
      problemAddressed: tpl.problemAddressed,
      expectedBenefit: tpl.expectedBenefit,
      estimatedEffort: tpl.estimatedEffort,
      difficultyLevel: tpl.difficultyLevel,
      requiredResources: tpl.requiredResources,
      instructions: [...tpl.instructions],
      suggestedTimeToComplete: tpl.suggestedTimeToComplete,
      prerequisites: tpl.prerequisites ? [...tpl.prerequisites] : undefined,
      referenceUrl: tpl.referenceUrl,
      referenceTitle: tpl.referenceTitle,
      completionCriteria: tpl.completionCriteria,
      suggestedNextStep:
        tpl.suggestedNextStep ||
        'Review the step-by-step instructions and schedule time this week.',
      tags: [...tpl.tags],
      status: taskStatus,
      completedAt,
      notes,
      weeklyScheduleGroup: weeklyGroup,
      whySeeingThis: ranking.whySeeingThis,
      rankingScore: ranking.score,
      isUnlocked,
    };
  });

  // 5. Deterministic sorting:
  // High priority first, then Medium, then Low; then by internal rankingScore descending; then by weekly group
  generatedTasks.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;

    if (b.rankingScore !== undefined && a.rankingScore !== undefined) {
      const scoreDiff = b.rankingScore - a.rankingScore;
      if (scoreDiff !== 0) return scoreDiff;
    }

    return a.weeklyScheduleGroup - b.weeklyScheduleGroup;
  });

  // 6. Capacity Throttling for very limited weekly time (under 1 hour per week):
  // Preserve all High priority tasks and throttle lower-priority actions to avoid owner overwhelm
  if (profile.isTimeConstrained && generatedTasks.length > 7) {
    const highTasks = generatedTasks.filter((t) => t.priority === 'High');
    const otherTasks = generatedTasks.filter((t) => t.priority !== 'High');
    // Ensure we keep all high priority tasks plus up to 2 top-ranked medium tasks
    generatedTasks = [...highTasks, ...otherTasks.slice(0, 2)];
  }

  return generatedTasks;
}
