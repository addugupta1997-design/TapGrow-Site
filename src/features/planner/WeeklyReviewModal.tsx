import React from 'react';
import { WeeklyReviewReport } from '../../types/planner';
import {
  X,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface WeeklyReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: WeeklyReviewReport;
  onStartNextWeek: () => void;
}

export const WeeklyReviewModal: React.FC<WeeklyReviewModalProps> = ({
  isOpen,
  onClose,
  report,
  onStartNextWeek,
}) => {
  if (!isOpen) return null;

  const hoursSpent = Math.floor(report.totalMinutesSpent / 60);
  const minsRemainder = report.totalMinutesSpent % 60;
  const timeFormatted =
    hoursSpent > 0 ? `${hoursSpent}h ${minsRemainder > 0 ? `${minsRemainder}m` : ''}` : `${minsRemainder} mins`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="weekly-review-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto transition-colors duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#304650] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16866F] text-white shadow-2xs">
              <Award className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2]">
                Weekly Reflection & Check-in
              </span>
              <h2 id="weekly-review-title" className="text-xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
                Week {report.weekNumber} Growth Summary
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

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#172830] border border-slate-200/80 dark:border-[#304650] text-center">
          <div>
            <span className="block text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Completed</span>
            <span className="text-2xl font-extrabold font-mono text-[#16866F] dark:text-[#65D6B2]">
              {report.completedTasksCount}
            </span>
          </div>
          <div className="border-x border-slate-200/60 dark:border-[#304650]">
            <span className="block text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Pending</span>
            <span className="text-2xl font-extrabold font-mono text-amber-600 dark:text-[#E9A23B]">
              {report.remainingTasksCount}
            </span>
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Time Invested</span>
            <span className="text-lg font-bold font-mono text-slate-800 dark:text-[#F2F7F5]">
              {timeFormatted}
            </span>
          </div>
        </div>

        {/* Main Achievements (Factual based on completed tasks) */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F2F7F5] flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
            What You Accomplished This Week:
          </h3>
          <div className="rounded-xl border border-emerald-100 dark:border-[#304650] bg-[#DFF5EA]/20 dark:bg-[#16866F]/10 p-3.5 space-y-2">
            {report.mainAchievements.map((ach, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-[#B5C5C7]">
                <span className="text-[#16866F] dark:text-[#65D6B2] font-bold mt-0.5">✓</span>
                <span>{ach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unfinished Priorities (If any) */}
        {report.remainingTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-[#F2F7F5] flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-[#E9A23B]" />
              Unfinished Actions to Roll Over:
            </h3>
            <div className="rounded-xl border border-amber-200 dark:border-[#304650] bg-amber-50/30 dark:bg-amber-950/20 p-3.5 space-y-2">
              {report.remainingTasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">{task.title}</span>
                  <span className="text-amber-700 dark:text-[#E9A23B] shrink-0 font-medium">({task.reason})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Focus for Next Week */}
        <div className="rounded-xl border border-teal-100 dark:border-[#304650] bg-teal-50/50 dark:bg-teal-950/20 p-4 space-y-1">
          <span className="text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2] flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" />
            Recommended Focus for Week {report.weekNumber + 1}:
          </span>
          <p className="text-xs text-slate-700 dark:text-[#B5C5C7] leading-relaxed">
            {report.suggestedFocusNextWeek}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 pt-4 border-t border-slate-100 dark:border-[#304650]">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg border border-slate-200 dark:border-[#304650] text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
          >
            Keep Current Week
          </button>
          <button
            type="button"
            onClick={() => {
              onStartNextWeek();
              onClose();
            }}
            className="h-9 px-4 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <span>Roll Over & Generate Week {report.weekNumber + 1} Plan</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
