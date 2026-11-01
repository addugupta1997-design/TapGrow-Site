import test from 'node:test';
import assert from 'node:assert';
import { getCompletionDonutData } from './CompletionDonutChart';
import { GeneratedTask } from '../../types/recommendations';

function createMockTask(id: string, status: GeneratedTask['status']): GeneratedTask {
  return {
    id,
    templateId: `tpl_${id}`,
    title: `Task ${id}`,
    category: 'Local SEO',
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

test('CompletionDonutChart: handles empty task list safely', () => {
  const data = getCompletionDonutData([]);
  assert.strictEqual(data.total, 0);
  assert.strictEqual(data.completed, 0);
  assert.strictEqual(data.percentage, 0);
  assert.strictEqual(data.displayData[0].name, 'No Tasks');
});

test('CompletionDonutChart: calculates accurate completion percentage and slices', () => {
  const tasks: GeneratedTask[] = [
    createMockTask('1', 'completed'),
    createMockTask('2', 'completed'),
    createMockTask('3', 'in_progress'),
    createMockTask('4', 'not_started'),
  ];

  const data = getCompletionDonutData(tasks);
  assert.strictEqual(data.total, 4);
  assert.strictEqual(data.completed, 2);
  assert.strictEqual(data.inProgress, 1);
  assert.strictEqual(data.notStarted, 1);
  assert.strictEqual(data.percentage, 50); // 2/4 = 50%

  assert.strictEqual(data.chartData.length, 3);
  const completedSlice = data.chartData.find((d) => d.name === 'Completed');
  assert.ok(completedSlice);
  assert.strictEqual(completedSlice.value, 2);
  assert.strictEqual(completedSlice.color, '#16866f');
});

test('CompletionDonutChart: handles 100% completed tasks', () => {
  const tasks: GeneratedTask[] = [
    createMockTask('1', 'completed'),
    createMockTask('2', 'completed'),
  ];

  const data = getCompletionDonutData(tasks);
  assert.strictEqual(data.percentage, 100);
  assert.strictEqual(data.chartData.length, 1);
  assert.strictEqual(data.chartData[0].name, 'Completed');
});
