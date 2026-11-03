import React from 'react';
import { MonthlyMilestone } from '../../types/planner';
import {
  X,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Target,
  Sparkles,
} from 'lucide-react';

interface MonthlyOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestones: MonthlyMilestone[];
  businessName?: string;
  categoryLabel?: string;
}

export const MonthlyOverviewModal: React.FC<MonthlyOverviewModalProps> = ({
  isOpen,
  onClose,
  milestones,
  businessName,
  categoryLabel,
}) => {
  if (!isOpen) return null;

  const totalTargetTasks = milestones.reduce((acc, m) => acc + m.taskCount, 0);
  const totalCompleted = milestones.reduce((acc, m) => acc + m.completedCount, 0);
  const monthlyProgressPct =
    totalTargetTasks > 0 ? Math.round((totalCompleted / totalTargetTasks) * 100) : 0;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="monthly-overview-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto transition-colors duration-150">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-[#304650] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#16866F] text-white shadow-2xs">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2]">
                Monthly 4-Week Strategic Trajectory
              </span>
              <h2 id="monthly-overview-title" className="text-xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
                {businessName || 'Your Business'} Monthly Roadmap
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

        {/* Monthly Summary Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-[#172830] border border-slate-200/80 dark:border-[#304650]">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
              30-Day Growth Cadence
            </span>
            <p className="text-xs text-slate-600 dark:text-[#B5C5C7] mt-0.5">
              4 manageable weekly milestones designed for {categoryLabel || 'local business'} growth.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-white dark:bg-[#1D3039] px-3.5 py-2 rounded-lg border border-slate-200 dark:border-[#304650]">
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#91A5A9] uppercase">Month Done</span>
              <div className="flex items-baseline gap-1 font-mono">
                <span className="text-lg font-extrabold text-[#16866F] dark:text-[#65D6B2]">
                  {monthlyProgressPct}%
                </span>
                <span className="text-xs text-slate-500">
                  ({totalCompleted}/{totalTargetTasks})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Weekly Milestones */}
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.weekNumber}
              className={`rounded-xl border p-4.5 transition-all ${
                milestone.isCurrent
                  ? 'border-[#16866F] dark:border-[#65D6B2] bg-emerald-50/20 dark:bg-[#16866F]/10 shadow-xs'
                  : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-[#304650] pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      milestone.completedCount >= milestone.taskCount && milestone.taskCount > 0
                        ? 'bg-[#16866F] text-white'
                        : milestone.isCurrent
                        ? 'bg-[#16866F] text-white ring-2 ring-emerald-200 dark:ring-emerald-800'
                        : 'bg-slate-100 dark:bg-[#223640] text-slate-600 dark:text-[#B5C5C7]'
                    }`}
                  >
                    {milestone.weekNumber}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                    {milestone.title}
                  </h3>
                  {milestone.isCurrent && (
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                      Active Week
                    </span>
                  )}
                </div>

                <div className="text-xs font-mono text-slate-500 dark:text-[#91A5A9]">
                  {milestone.completedCount} of {milestone.taskCount} targets done
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="text-slate-600 dark:text-[#B5C5C7]">
                  <strong className="text-slate-800 dark:text-[#F2F7F5]">Focus Area: </strong>
                  {milestone.focusArea}
                </div>

                <div className="bg-slate-50 dark:bg-[#172830] p-3 rounded-lg border border-slate-100 dark:border-[#304650]">
                  <span className="font-semibold text-slate-700 dark:text-[#F2F7F5] block mb-1">
                    Key Outcomes:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-[#B5C5C7]">
                    {milestone.keyGoals.map((goal, gIdx) => (
                      <li key={gIdx} className="flex items-center gap-1.5">
                        <span className="text-[#16866F] dark:text-[#65D6B2]">✦</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-[#304650]">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-lg bg-[#16866F] text-xs font-bold text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
          >
            Back to Weekly Planner
          </button>
        </div>
      </div>
    </div>
  );
};
