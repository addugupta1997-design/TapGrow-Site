import React, { useState } from 'react';
import { GeneratedTask } from '../../types/recommendations';
import { WeeklyPlannerState, DAYS_OF_WEEK } from '../../types/planner';
import { parseEffortToMinutes, getWeeklyCapacityMinutes } from './planGenerator';
import {
  X,
  RotateCcw,
  Clock,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface SmartRescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  planner: WeeklyPlannerState;
  tasks: GeneratedTask[];
  weeklyHoursPreference?: string;
  onConfirmReschedule: () => void;
}

export const SmartRescheduleModal: React.FC<SmartRescheduleModalProps> = ({
  isOpen,
  onClose,
  planner,
  tasks,
  weeklyHoursPreference,
  onConfirmReschedule,
}) => {
  if (!isOpen) return null;

  const taskMap = new Map<string, GeneratedTask>();
  tasks.forEach((t) => taskMap.set(t.id, t));

  // Extract scheduled unfinished tasks
  const scheduledTaskIds: string[] = [];
  DAYS_OF_WEEK.forEach(({ id }) => {
    (planner.schedule[id] || []).forEach((tId) => scheduledTaskIds.push(tId));
  });

  const uniqueScheduledIds = Array.from(new Set(scheduledTaskIds));
  const unfinishedTasks: GeneratedTask[] = [];

  uniqueScheduledIds.forEach((id) => {
    const task = taskMap.get(id);
    if (task && task.status !== 'completed') {
      unfinishedTasks.push(task);
    }
  });

  const capacityMinutes = getWeeklyCapacityMinutes(weeklyHoursPreference as any);
  const unfinishedMinutes = unfinishedTasks.reduce(
    (acc, t) => acc + parseEffortToMinutes(t.estimatedEffort),
    0
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-reschedule-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto transition-colors duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#304650] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white shadow-2xs">
              <RotateCcw className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#E9A23B]">
                Intelligent Plan Adjustment
              </span>
              <h2 id="smart-reschedule-title" className="text-xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
                Smart Task Rescheduling
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

        <p className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
          TapGrow protects you from marketing burnout. Rather than letting unfinished actions pile up, Smart Rescheduling carries them forward into your next weekly cycle while respecting your available time limit.
        </p>

        {/* Capacity vs Rollover stats */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#172830] border border-slate-200/80 dark:border-[#304650] text-xs">
          <div>
            <span className="text-slate-500 dark:text-[#91A5A9] block">Unfinished Actions:</span>
            <span className="font-bold text-slate-800 dark:text-[#F2F7F5] font-mono text-sm">
              {unfinishedTasks.length} tasks ({unfinishedMinutes} mins)
            </span>
          </div>
          <div className="text-right">
            <span className="text-slate-500 dark:text-[#91A5A9] block">Weekly Time Budget:</span>
            <span className="font-bold text-[#16866F] dark:text-[#65D6B2] font-mono text-sm">
              ~{capacityMinutes} mins/week
            </span>
          </div>
        </div>

        {/* Unfinished Task List */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F2F7F5]">
            Tasks to Roll Over into Week {planner.weekNumber + 1}:
          </h3>

          {unfinishedTasks.length > 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] divide-y divide-slate-100 dark:divide-[#304650] max-h-48 overflow-y-auto">
              {unfinishedTasks.map((t) => (
                <div key={t.id} className="p-3 text-xs flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <span className="font-semibold text-slate-900 dark:text-[#F2F7F5] block truncate">
                      {t.title}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-[#91A5A9]">
                      {t.category} · Est. {t.estimatedEffort} · Status: {t.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.priority === 'High'
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 dark:border-[#304650] bg-emerald-50/30 dark:bg-emerald-950/20 p-4 text-xs text-center text-emerald-800 dark:text-[#65D6B2]">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-emerald-600 dark:text-[#65D6B2]" />
              <strong>All scheduled tasks are completed!</strong>
              <p className="mt-1 text-slate-600 dark:text-[#B5C5C7]">
                Smart Rescheduling will draw the next batch of top-priority recommendations into Week {planner.weekNumber + 1}.
              </p>
            </div>
          )}
        </div>

        {/* Reassurance Disclaimer */}
        <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 p-3 text-xs text-amber-900 dark:text-amber-200 border border-amber-200/50 dark:border-amber-800/40">
          <strong className="block mb-0.5">Integrity Guarantee:</strong>
          Unfinished tasks are never deleted or marked completed automatically. Their progress notes and history remain fully preserved.
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#304650]">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-slate-200 dark:border-[#304650] text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmReschedule();
              onClose();
            }}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <span>Re-balance & Roll Over Tasks</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
