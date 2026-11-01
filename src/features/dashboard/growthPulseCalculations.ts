import { GeneratedTask, RecommendationCategory } from '../../types/recommendations';

export interface CategoryGrowthStats {
  category: RecommendationCategory;
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  percentage: number;
}

export type MomentumLevel = 'ready' | 'starting' | 'building' | 'accelerating' | 'peak';

export interface GrowthPulseSummary {
  overallPercentage: number;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  categories: CategoryGrowthStats[];
  activeCategoriesCount: number;
  totalCategoriesCount: number;
  momentumLevel: MomentumLevel;
  momentumLabel: string;
  momentumDescription: string;
}

/**
 * Calculates category-specific and overall growth velocity metrics
 * across all generated recommendations.
 */
export function calculateGrowthPulse(tasks: GeneratedTask[]): GrowthPulseSummary {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const overallPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group tasks by recommendation category
  const categoryMap = new Map<
    RecommendationCategory,
    { total: number; completed: number; inProgress: number; notStarted: number }
  >();

  tasks.forEach((task) => {
    const existing = categoryMap.get(task.category) || {
      total: 0,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };
    existing.total += 1;
    if (task.status === 'completed') {
      existing.completed += 1;
    } else if (task.status === 'in_progress') {
      existing.inProgress += 1;
    } else {
      existing.notStarted += 1;
    }
    categoryMap.set(task.category, existing);
  });

  const categories: CategoryGrowthStats[] = Array.from(categoryMap.entries())
    .map(([category, stats]) => ({
      category,
      total: stats.total,
      completed: stats.completed,
      inProgress: stats.inProgress,
      notStarted: stats.notStarted,
      percentage: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
    }))
    .sort((a, b) => {
      // Sort by highest task volume first, then alphabetical by category name
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      return a.category.localeCompare(b.category);
    });

  const activeCategoriesCount = categories.filter((c) => c.completed > 0 || c.inProgress > 0).length;
  const totalCategoriesCount = categories.length;

  let momentumLevel: MomentumLevel = 'ready';
  let momentumLabel = 'Ready to Launch';
  let momentumDescription = 'Select your first high-leverage action from the recommendations below to build momentum.';

  if (overallPercentage === 100 && totalTasks > 0) {
    momentumLevel = 'peak';
    momentumLabel = 'Full Momentum';
    momentumDescription = 'Outstanding work! All recommended growth foundations and tasks are currently complete.';
  } else if (overallPercentage >= 65) {
    momentumLevel = 'accelerating';
    momentumLabel = 'High Velocity';
    momentumDescription = 'Strong execution across categories. Finish remaining actions to dominate local discovery.';
  } else if (overallPercentage >= 30) {
    momentumLevel = 'building';
    momentumLabel = 'Building Momentum';
    momentumDescription = 'Steady progress underway across key business channels. Keep up the weekly rhythm.';
  } else if (completedTasks > 0 || inProgressTasks > 0) {
    momentumLevel = 'starting';
    momentumLabel = 'Gaining Traction';
    momentumDescription = 'First actions initiated! Completing early foundations produces compounding local visibility.';
  }

  return {
    overallPercentage,
    totalTasks,
    completedTasks,
    inProgressTasks,
    categories,
    activeCategoriesCount,
    totalCategoriesCount,
    momentumLevel,
    momentumLabel,
    momentumDescription,
  };
}
