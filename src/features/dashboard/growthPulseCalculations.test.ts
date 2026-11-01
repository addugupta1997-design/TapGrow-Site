import test from 'node:test';
import assert from 'node:assert';
import { calculateGrowthPulse } from './growthPulseCalculations';
import { GeneratedTask } from '../../types/recommendations';

function createMockTask(
  id: string,
  category: GeneratedTask['category'],
  status: GeneratedTask['status']
): GeneratedTask {
  return {
    id,
    templateId: `tpl_${id}`,
    title: `Task ${id}`,
    category,
    priority: 'High',
    priorityReason: 'Important',
    summary: 'Summary',
    whyItMatters: 'Matters',
    instructions: ['Step 1'],
    estimatedEffort: '30 mins',
    suggestedTimeToComplete: 'Week 1',
    completionCriteria: 'Done',
    suggestedNextStep: 'Next',
    tags: ['local'],
    status,
    weeklyScheduleGroup: 1,
  };
}

test('growth pulse: handles empty task list safely', () => {
  const pulse = calculateGrowthPulse([]);
  assert.strictEqual(pulse.overallPercentage, 0);
  assert.strictEqual(pulse.totalTasks, 0);
  assert.strictEqual(pulse.completedTasks, 0);
  assert.strictEqual(pulse.categories.length, 0);
  assert.strictEqual(pulse.momentumLevel, 'ready');
});

test('growth pulse: accurately computes per-category completion percentages', () => {
  const tasks: GeneratedTask[] = [
    createMockTask('1', 'Local SEO', 'completed'),
    createMockTask('2', 'Local SEO', 'not_started'),
    createMockTask('3', 'Reviews and reputation', 'completed'),
    createMockTask('4', 'Reviews and reputation', 'completed'),
    createMockTask('5', 'Business listings', 'in_progress'),
  ];

  const pulse = calculateGrowthPulse(tasks);

  assert.strictEqual(pulse.totalTasks, 5);
  assert.strictEqual(pulse.completedTasks, 3);
  assert.strictEqual(pulse.inProgressTasks, 1);
  assert.strictEqual(pulse.overallPercentage, 60); // 3/5 = 60%
  assert.strictEqual(pulse.momentumLevel, 'building');

  const seo = pulse.categories.find((c) => c.category === 'Local SEO');
  assert.ok(seo);
  assert.strictEqual(seo.total, 2);
  assert.strictEqual(seo.completed, 1);
  assert.strictEqual(seo.percentage, 50);

  const reviews = pulse.categories.find((c) => c.category === 'Reviews and reputation');
  assert.ok(reviews);
  assert.strictEqual(reviews.total, 2);
  assert.strictEqual(reviews.completed, 2);
  assert.strictEqual(reviews.percentage, 100);

  const listings = pulse.categories.find((c) => c.category === 'Business listings');
  assert.ok(listings);
  assert.strictEqual(listings.total, 1);
  assert.strictEqual(listings.completed, 0);
  assert.strictEqual(listings.inProgress, 1);
  assert.strictEqual(listings.percentage, 0);

  assert.strictEqual(pulse.activeCategoriesCount, 3);
});

test('growth pulse: recognizes peak momentum when all tasks complete', () => {
  const tasks: GeneratedTask[] = [
    createMockTask('1', 'Local SEO', 'completed'),
    createMockTask('2', 'Website basics', 'completed'),
  ];

  const pulse = calculateGrowthPulse(tasks);
  assert.strictEqual(pulse.overallPercentage, 100);
  assert.strictEqual(pulse.momentumLevel, 'peak');
  assert.strictEqual(pulse.momentumLabel, 'Full Momentum');
});
