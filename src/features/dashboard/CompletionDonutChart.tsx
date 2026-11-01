import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { GeneratedTask } from '../../types/recommendations';
import { CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export interface CompletionDonutData {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  percentage: number;
  chartData: Array<{ name: string; value: number; color: string }>;
  displayData: Array<{ name: string; value: number; color: string }>;
}

export function getCompletionDonutData(
  tasks: GeneratedTask[],
  isDark = false
): CompletionDonutData {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const notStarted = Math.max(0, total - completed - inProgress);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const trackColor = isDark ? '#304650' : '#E2E8F0';

  const chartData = [
    { name: 'Completed', value: completed, color: '#16866f' },
    { name: 'In Progress', value: inProgress, color: '#E9A23B' },
    { name: 'Not Started', value: notStarted, color: trackColor },
  ].filter((d) => d.value > 0);

  const displayData =
    chartData.length > 0
      ? chartData
      : [{ name: 'No Tasks', value: 1, color: trackColor }];

  return {
    total,
    completed,
    inProgress,
    notStarted,
    percentage,
    chartData,
    displayData,
  };
}

interface CompletionDonutChartProps {
  tasks: GeneratedTask[];
  size?: 'compact' | 'full';
  className?: string;
}

export const CompletionDonutChart: React.FC<CompletionDonutChartProps> = ({
  tasks,
  size = 'compact',
  className = '',
}) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const { total, completed, inProgress, notStarted, percentage, chartData, displayData } =
    getCompletionDonutData(tasks, isDark);

  if (size === 'compact') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="h-28 w-28 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0];
                    return (
                      <div className="rounded-md border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2 py-1 shadow-md text-[11px] font-semibold text-slate-800 dark:text-[#F2F7F5]">
                        <span style={{ color: data.payload.color }}>●</span> {data.name}: {data.value}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={32}
                outerRadius={46}
                paddingAngle={chartData.length > 1 ? 3 : 0}
                dataKey="value"
                stroke="none"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered percentage readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5] font-mono tabular-nums leading-none">
              {percentage}%
            </span>
            <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 dark:text-[#91A5A9] mt-0.5">
              Done
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Full / expanded visual card
  return (
    <div className={`rounded-xl border border-slate-200/90 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs transition-colors duration-150 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-2">
        <span className="font-semibold uppercase tracking-wider text-slate-600 dark:text-[#B5C5C7]">
          Task Completion Progress
        </span>
        <div className="flex items-center gap-1 text-[#16866f] dark:text-[#65D6B2] font-semibold">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{percentage}% Complete</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        {/* Recharts Donut Chart */}
        <div className="h-36 w-36 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-2 shadow-md text-xs font-semibold text-slate-900 dark:text-[#F2F7F5]">
                        <span style={{ color: item.payload.color }}>●</span> {item.name}: {item.value} tasks
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={displayData}
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={58}
                paddingAngle={chartData.length > 1 ? 4 : 0}
                dataKey="value"
                stroke="none"
              >
                {displayData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Percentage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-extrabold text-[#142A36] dark:text-[#F2F7F5] font-mono tabular-nums leading-none">
              {percentage}%
            </span>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-[#91A5A9] mt-1">
              Completed
            </span>
          </div>
        </div>

        {/* Legend / Stats breakdown */}
        <div className="flex-1 space-y-2.5 w-full">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16866f]" />
              <span className="font-medium text-slate-700 dark:text-[#B5C5C7]">Completed</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-[#F2F7F5]">
              {completed} <span className="text-slate-400 dark:text-[#91A5A9] font-normal">({total > 0 ? Math.round((completed / total) * 100) : 0}%)</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#E9A23B]" />
              <span className="font-medium text-slate-700 dark:text-[#B5C5C7]">In Progress</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-[#F2F7F5]">
              {inProgress} <span className="text-slate-400 dark:text-[#91A5A9] font-normal">({total > 0 ? Math.round((inProgress / total) * 100) : 0}%)</span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-300 dark:bg-[#3A535D]" />
              <span className="font-medium text-slate-700 dark:text-[#B5C5C7]">Not Started</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-[#F2F7F5]">
              {notStarted} <span className="text-slate-400 dark:text-[#91A5A9] font-normal">({total > 0 ? Math.round((notStarted / total) * 100) : 0}%)</span>
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9]">
            <span>Total Recommendations</span>
            <span className="font-bold text-slate-800 dark:text-[#F2F7F5] font-mono">{total} tasks</span>
          </div>
        </div>
      </div>
    </div>
  );
};
