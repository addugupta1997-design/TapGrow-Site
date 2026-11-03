import React from 'react';
import { GeneratedTask, TaskStatus } from '../../types/recommendations';
import { DayOfWeek, DAYS_OF_WEEK } from '../../types/planner';
import {
  X,
  Clock,
  Gauge,
  Calendar,
  AlertTriangle,
  Sparkles,
  Wrench,
  CheckCircle2,
  ExternalLink,
  PauseCircle,
  HelpCircle,
} from 'lucide-react';
import { TaskCategoryIllustration } from '../../components/graphics/TaskCategoryIllustration';

interface TaskDetailModalProps {
  task: GeneratedTask | null;
  scheduledDay?: DayOfWeek;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onMoveDay: (taskId: string, targetDay: DayOfWeek) => void;
  onRemoveFromSchedule?: (taskId: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  scheduledDay,
  isOpen,
  onClose,
  onStatusChange,
  onMoveDay,
  onRemoveFromSchedule,
}) => {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';
  const isDeferred = task.status === 'deferred';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto transition-colors duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#304650] pb-4">
          <div className="flex items-start gap-3">
            <TaskCategoryIllustration category={task.category} size="md" className="shrink-0 mt-0.5" />
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-[#91A5A9] mb-1">
                <span className="font-semibold text-slate-700 dark:text-[#F2F7F5]">{task.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono">{task.estimatedEffort}</span>
                {task.difficultyLevel && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-teal-700 dark:text-[#65D6B2]">
                      <Gauge className="h-3 w-3" />
                      {task.difficultyLevel}
                    </span>
                  </>
                )}
              </div>
              <h2 id="task-detail-title" className="text-lg font-bold text-slate-900 dark:text-[#F2F7F5] leading-snug">
                {task.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Schedule & Status Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#172830] border border-slate-200/80 dark:border-[#304650]">
          {/* Day assignment dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
            <span className="font-medium text-slate-700 dark:text-[#B5C5C7]">Scheduled for:</span>
            <select
              value={scheduledDay || 'monday'}
              onChange={(e) => onMoveDay(task.id, e.target.value as DayOfWeek)}
              className="h-8 rounded-md border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs font-semibold text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-1 focus:ring-[#16866F]"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick status actions */}
          <div className="flex items-center gap-1.5">
            {!isCompleted && (
              <button
                type="button"
                onClick={() => onStatusChange(task.id, isInProgress ? 'not_started' : 'in_progress')}
                className={`h-8 px-3 rounded-md text-xs font-semibold border transition-colors ${
                  isInProgress
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    : 'border-slate-200 dark:border-[#304650] text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
                }`}
              >
                {isInProgress ? 'In Progress' : 'Start Task'}
              </button>
            )}

            <button
              type="button"
              onClick={() => onStatusChange(task.id, isCompleted ? 'not_started' : 'completed')}
              className={`h-8 px-3 rounded-md text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100'
                  : 'bg-[#16866F] text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80]'
              }`}
            >
              {isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
            </button>
          </div>
        </div>

        {/* Structured Insights: Problem & Expected Benefit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {task.problemAddressed && (
            <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 p-3 border border-amber-200/50 dark:border-amber-800/40">
              <span className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300 mb-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                What Problem It Addresses:
              </span>
              <p className="text-slate-700 dark:text-[#B5C5C7] leading-relaxed">
                {task.problemAddressed}
              </p>
            </div>
          )}

          <div className="rounded-lg bg-[#E0F5EE]/60 dark:bg-[#16866F]/15 p-3 border border-emerald-200/60 dark:border-[#304650]">
            <span className="font-bold flex items-center gap-1 text-[#0F5C4D] dark:text-[#65D6B2] mb-1">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Expected Business Benefit:
            </span>
            <p className="text-slate-700 dark:text-[#B5C5C7] leading-relaxed">
              {task.expectedBenefit || task.whyItMatters}
            </p>
          </div>
        </div>

        {/* "Why am I seeing this?" explanation */}
        {task.whySeeingThis && (
          <div className="rounded-lg bg-slate-50 dark:bg-[#172830] p-3 text-xs text-slate-600 dark:text-[#B5C5C7] border border-slate-200/80 dark:border-[#304650]">
            <span className="font-bold flex items-center gap-1 text-slate-800 dark:text-[#F2F7F5] mb-1">
              <HelpCircle className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              Why This Task Is Recommended:
            </span>
            <p className="leading-relaxed">{task.whySeeingThis}</p>
          </div>
        )}

        {/* Required Resources */}
        {task.requiredResources && (
          <div className="rounded-lg bg-slate-50 dark:bg-[#172830] p-3 text-xs text-slate-700 dark:text-[#B5C5C7] border border-slate-200/80 dark:border-[#304650]">
            <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-[#F2F7F5] mb-1">
              <Wrench className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              Required Tools & Resources:
            </span>
            <p className="leading-relaxed">{task.requiredResources}</p>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5]">
            Step-by-Step Implementation Instructions ({task.instructions.length} steps):
          </h4>
          <ol className="list-decimal list-inside space-y-2 text-xs text-slate-700 dark:text-[#B5C5C7] bg-slate-50/50 dark:bg-[#172830]/50 p-3.5 rounded-xl border border-slate-100 dark:border-[#304650] leading-relaxed">
            {task.instructions.map((step, idx) => (
              <li key={idx} className="pl-1">
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Completion Criteria */}
        <div className="rounded-lg border border-slate-200 dark:border-[#304650] p-3 text-xs">
          <span className="font-bold text-slate-900 dark:text-[#F2F7F5] block mb-0.5">
            Completion Criteria:
          </span>
          <p className="text-slate-600 dark:text-[#B5C5C7]">{task.completionCriteria}</p>
        </div>

        {/* Suggested Next Step */}
        {task.suggestedNextStep && (
          <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/25 p-3 text-xs border border-emerald-100 dark:border-emerald-800/40">
            <span className="font-bold text-[#0F5C4D] dark:text-[#65D6B2] block mb-0.5">
              Suggested Next Step:
            </span>
            <p className="text-slate-700 dark:text-[#F2F7F5] font-medium">{task.suggestedNextStep}</p>
          </div>
        )}

        {/* Reference link */}
        {task.referenceUrl && (
          <div className="text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-[#304650]">
            <a
              href={task.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
            >
              <span>{task.referenceTitle || 'Read Official Guidelines'}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-[#304650]">
          {onRemoveFromSchedule && (
            <button
              type="button"
              onClick={() => {
                onRemoveFromSchedule(task.id);
                onClose();
              }}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Remove from This Week's Plan
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto h-9 px-4 rounded-lg bg-slate-100 dark:bg-[#223640] text-xs font-bold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-200 dark:hover:bg-[#2c4450] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
