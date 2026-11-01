import { AssessmentAnswers } from '../../types/assessment';
import { GeneratedTask, PriorityLevel } from '../../types/recommendations';
import { RECOMMENDATION_CATALOG } from './recommendationCatalog';

const PRIORITY_ORDER: Record<PriorityLevel, number> = {
  High: 1,
  Medium: 2,
  Low: 3,
};

/**
 * Generates deterministic, prioritized recommendations matching the user's assessment answers.
 * Implements category personalization, capacity throttling, duplicate prevention, and suggested next steps.
 */
export function generateRecommendations(answers: AssessmentAnswers): GeneratedTask[] {
  // 1. Filter applicable templates based on conditions and category rules
  const applicableTemplates = RECOMMENDATION_CATALOG.filter((template) => {
    try {
      return template.isApplicable(answers);
    } catch (err) {
      console.error(`Error evaluating condition for template ${template.id}:`, err);
      return false;
    }
  });

  // 2. Prevent duplicate templates by ID
  const seenTemplateIds = new Set<string>();
  const uniqueTemplates = applicableTemplates.filter((tpl) => {
    if (seenTemplateIds.has(tpl.id)) return false;
    seenTemplateIds.add(tpl.id);
    return true;
  });

  // 3. Map into full GeneratedTask items with evaluated priority
  let generatedTasks: GeneratedTask[] = uniqueTemplates.map((tpl) => {
    let priority: PriorityLevel = tpl.defaultPriority;
    let priorityReason: string = tpl.defaultPriorityReason;

    if (tpl.evaluatePriority) {
      try {
        const evalResult = tpl.evaluatePriority(answers);
        priority = evalResult.priority;
        priorityReason = evalResult.reason;
      } catch (err) {
        console.error(`Error evaluating priority for ${tpl.id}:`, err);
      }
    }

    // Dynamic adjustment based on user preferred focus
    if (answers.preferredFocus && answers.preferredFocus !== 'all') {
      if (answers.preferredFocus === 'reviews' && tpl.category === 'Reviews and reputation') {
        priority = 'High';
      } else if (answers.preferredFocus === 'website' && (tpl.category === 'Website basics' || tpl.category === 'Conversion improvements')) {
        priority = 'High';
      } else if (answers.preferredFocus === 'local_seo' && (tpl.category === 'Local SEO' || tpl.category === 'Business listings')) {
        priority = 'High';
      } else if (answers.preferredFocus === 'social_media' && tpl.category === 'Social media') {
        priority = 'High';
      }
    }

    // Dynamic adjustment for free-only budget preferences
    if (answers.budgetPreference === 'free_only') {
      if (tpl.tags.includes('free') || tpl.tags.includes('organic') || tpl.tags.includes('google-reviews') || tpl.tags.includes('nap')) {
        // preserve high
      }
    }

    // Time-based weekly grouping
    let weeklyGroup = 1;
    if (tpl.suggestedTimeToComplete === 'Week 2') weeklyGroup = 2;
    else if (tpl.suggestedTimeToComplete === 'Week 3') weeklyGroup = 3;
    else if (tpl.suggestedTimeToComplete === 'Week 4') weeklyGroup = 4;

    // Adjust high priority items into earlier weeks
    if (priority === 'High' && weeklyGroup > 2) {
      weeklyGroup = 2;
    }

    return {
      id: `task_${tpl.id}`,
      templateId: tpl.id,
      title: tpl.title,
      category: tpl.category,
      priority,
      priorityReason,
      summary: tpl.summary,
      whyItMatters: tpl.whyItMatters,
      instructions: [...tpl.instructions],
      estimatedEffort: tpl.estimatedEffort,
      suggestedTimeToComplete: tpl.suggestedTimeToComplete,
      prerequisites: tpl.prerequisites ? [...tpl.prerequisites] : undefined,
      referenceUrl: tpl.referenceUrl,
      referenceTitle: tpl.referenceTitle,
      completionCriteria: tpl.completionCriteria,
      suggestedNextStep: tpl.suggestedNextStep || 'Review the step-by-step instructions and schedule time this week.',
      tags: [...tpl.tags],
      status: 'not_started',
      completedAt: null,
      notes: '',
      weeklyScheduleGroup: weeklyGroup,
    };
  });

  // 4. Sort tasks: High priority first, then Medium, then Low; then by weekly group
  generatedTasks.sort((a, b) => {
    const pDiff = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (pDiff !== 0) return pDiff;
    return a.weeklyScheduleGroup - b.weeklyScheduleGroup;
  });

  // 5. Throttling for low capacity (under 1 hour per week):
  // Prioritize the top highest-leverage actions to prevent overwhelming the user
  if (answers.weeklyHours === 'under_1h' && generatedTasks.length > 7) {
    const highTasks = generatedTasks.filter((t) => t.priority === 'High');
    const otherTasks = generatedTasks.filter((t) => t.priority !== 'High');
    // Ensure we keep all high priority tasks plus up to 2 essential others
    generatedTasks = [...highTasks, ...otherTasks.slice(0, 2)];
  }

  return generatedTasks;
}
