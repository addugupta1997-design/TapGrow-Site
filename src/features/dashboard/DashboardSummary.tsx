import React from 'react';
import { ScoreResult, GeneratedTask } from '../../types/recommendations';
import { Info, CheckCircle2, ListTodo } from 'lucide-react';
import { CompletionDonutChart } from './CompletionDonutChart';

interface DashboardSummaryProps {
  scoreResult: ScoreResult;
  tasks: GeneratedTask[];
  onOpenScoreExplainer: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  scoreResult,
  tasks,
  onOpenScoreExplainer,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const remainingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 transition-colors duration-150">
      {/* 1. Readiness Score Card */}
      <div className="rounded-xl border border-slate-200/90 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs transition-colors duration-150">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-600 dark:text-[#B5C5C7]">Readiness Score</span>
          <button
            onClick={onOpenScoreExplainer}
            className="flex items-center gap-1 text-[#16866F] dark:text-[#65D6B2] hover:text-[#0F5C4D] transition-colors"
            title="How this score works"
          >
            <Info className="h-3.5 w-3.5" />
            <span>How it works</span>
          </button>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-[#142A36] dark:text-[#F2F7F5] font-mono tabular-nums">
            {scoreResult.totalScore}
          </span>
          <span className="text-sm font-medium text-slate-400 dark:text-[#91A5A9] font-mono">/ 100</span>
          {(scoreResult.confirmedBoost ?? 0) > 0 && (
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 dark:text-[#65D6B2] bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              +{scoreResult.confirmedBoost} confirmed
            </span>
          )}
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-[#91A5A9] line-clamp-2 leading-relaxed">
          {scoreResult.interpretation}
        </p>
      </div>

      {/* 2. Total Recommended Tasks */}
      <div className="rounded-xl border border-slate-200/90 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs transition-colors duration-150">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-600 dark:text-[#B5C5C7]">Total Actions</span>
          <ListTodo className="h-4 w-4 text-slate-400 dark:text-[#91A5A9]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-[#142A36] dark:text-[#F2F7F5] font-mono tabular-nums">
            {totalTasks}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#91A5A9]">prioritized tasks</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-[#91A5A9]">
          <span>{tasks.filter((t) => t.priority === 'High').length} High</span>
          <span aria-hidden="true">·</span>
          <span>{tasks.filter((t) => t.priority === 'Medium').length} Medium</span>
          <span aria-hidden="true">·</span>
          <span>{tasks.filter((t) => t.priority === 'Low').length} Low</span>
        </div>
      </div>

      {/* 3. Completed Actions */}
      <div className="rounded-xl border border-slate-200/90 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs transition-colors duration-150">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-2">
          <span className="font-semibold uppercase tracking-wider text-slate-600 dark:text-[#B5C5C7]">Completed</span>
          <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-[#16866F] dark:text-[#65D6B2] font-mono tabular-nums">
            {completedTasks}
          </span>
          <span className="text-xs text-slate-500 dark:text-[#91A5A9]">of {totalTasks} done</span>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-[#91A5A9]">
          <span>{inProgressTasks} currently in progress</span>
        </div>
      </div>

      {/* 4. Plan Completion Progress with Recharts Donut Chart */}
      <div className="rounded-xl border border-slate-200/90 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-xs flex flex-col justify-between transition-colors duration-150">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-1">
          <span className="font-semibold uppercase tracking-wider text-slate-600 dark:text-[#B5C5C7]">Progress</span>
          <span className="font-mono text-xs font-bold text-[#16866f] dark:text-[#65D6B2]">{completionPercentage}% done</span>
        </div>
        <div className="flex items-center justify-between gap-1 my-auto">
          <CompletionDonutChart tasks={tasks} size="compact" />
          <div className="flex-1 space-y-1 text-[11px] pl-2 border-l border-slate-100 dark:border-[#304650]">
            <div className="flex items-center justify-between text-slate-600 dark:text-[#B5C5C7]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#16866f]" />
                Done
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-[#F2F7F5]">{completedTasks}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-[#B5C5C7]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#E9A23B]" />
                Active
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-[#F2F7F5]">{inProgressTasks}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-[#B5C5C7]">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-[#3A535D]" />
                To Do
              </span>
              <span className="font-mono font-bold text-slate-900 dark:text-[#F2F7F5]">{remainingTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
