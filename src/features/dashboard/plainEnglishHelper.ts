import { GeneratedTask } from '../../types/recommendations';

/**
 * Plain-English translation dictionary for non-technical business owners.
 * Converts marketing buzzwords into clear, friendly shopkeeper language.
 */
const TITLE_TRANSLATIONS: Record<string, string> = {
  'Optimize Google Business Profile core info': 'Make sure customers can find your shop on Google Maps',
  'Improve conversion optimization': 'Make your phone number and contact button easier to find',
  'Implement LocalBusiness Schema': 'Help Google show your opening hours and address cleanly',
  'NAP consistency audit across local directories': 'Keep your business name, address, and phone number consistent everywhere',
  'Review acquisition cadence': 'Ask happy customers for a quick Google review',
  'Social media engagement rhythm': 'Share photos of your real work and happy customers each week',
  'Website mobile responsiveness check': 'Make sure your website is fast and easy to read on smartphones',
  'Local citation building': 'Get listed on trusted local community directories',
  'Menu and pricing clarity': 'Make your prices and services clear and easy to browse online',
  'Inquiry response time reduction': 'Reply to customer inquiries within 15 minutes to win more jobs',
};

/**
 * Returns a friendly, plain-English title for a task.
 */
export function getPlainEnglishTitle(task: GeneratedTask): string {
  if (TITLE_TRANSLATIONS[task.title]) {
    return TITLE_TRANSLATIONS[task.title];
  }

  let title = task.title;

  // Pattern replacements for common jargon
  title = title.replace(/Optimize|Optimise/gi, 'Improve');
  title = title.replace(/Local SEO signals/gi, 'Google Maps visibility');
  title = title.replace(/Conversion rate optimization|CRO/gi, 'Turning visitors into paying customers');
  title = title.replace(/LocalBusiness Schema\.org/gi, 'Google business info format');
  title = title.replace(/Citation building/gi, 'Local directory listings');
  title = title.replace(/Acquisition/gi, 'Getting new customers');
  title = title.replace(/Cadence/gi, 'Routine');

  return title;
}

/**
 * Returns a friendly, plain-English summary for a task.
 */
export function getPlainEnglishSummary(task: GeneratedTask): string {
  let summary = task.summary;

  summary = summary.replace(/SERP/gi, 'Google search results');
  summary = summary.replace(/CTR/gi, 'click rate');
  summary = summary.replace(/NAP consistency/gi, 'consistent name, address, and phone number');
  summary = summary.replace(/CTA/gi, 'contact button');
  summary = summary.replace(/schema\.org/gi, 'structured business info');

  return summary;
}

/**
 * Returns a friendly difficulty badge label.
 */
export function getFriendlyDifficultyLabel(difficulty?: string, effort?: string): {
  label: string;
  badgeClass: string;
} {
  const isShortTime = Boolean(effort && /(?:^|\D)(?:5|10|15)\s*min/i.test(effort));

  if (difficulty === 'Beginner' || isShortTime) {
    return {
      label: 'Quick Win',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-[#65D6B2]',
    };
  }

  if (difficulty === 'Advanced') {
    return {
      label: 'Thorough Step',
      badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300',
    };
  }

  return {
    label: 'Standard Step',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300',
  };
}

/**
 * Selects the single "Next Best Action" from a list of tasks.
 * Prioritizes:
 * 1. Unfinished tasks with 'High' priority.
 * 2. If none, the first unfinished task with 'Medium' priority.
 * 3. Fallback to any unfinished task.
 */
export function getNextBestAction(tasks: GeneratedTask[]): GeneratedTask | null {
  const unfinishedTasks = tasks.filter((t) => t.status !== 'completed' && t.status !== 'deferred');

  if (unfinishedTasks.length === 0) {
    return null;
  }

  // Find first High priority
  const highPriority = unfinishedTasks.find((t) => t.priority === 'High');
  if (highPriority) return highPriority;

  // Find first Medium priority
  const mediumPriority = unfinishedTasks.find((t) => t.priority === 'Medium');
  if (mediumPriority) return mediumPriority;

  return unfinishedTasks[0];
}
