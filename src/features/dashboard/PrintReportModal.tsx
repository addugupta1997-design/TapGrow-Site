import React, { useState } from 'react';
import { SavedPlanState } from '../../types/storage';
import { generatePdfReport } from '../../lib/generatePdf';
import { formatDate } from '../../locales/i18n';
import { TapGrowLogo, TapGrowSymbol } from '../../components/brand/TapGrowLogo';
import {
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Check,
} from 'lucide-react';

interface PrintReportModalProps {
  isOpen: boolean;
  plan: SavedPlanState;
  onClose: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  plan,
  onClose,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const businessDisplayName = plan.answers.businessName?.trim() || 'Your Local Business';
  const locationDisplay = [plan.answers.cityArea, plan.answers.country].filter(Boolean).join(', ');
  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const progressPct = plan.tasks.length > 0 ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  const handleDownloadPdfClick = () => {
    try {
      generatePdfReport(plan);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="print-modal-title"
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl bg-white dark:bg-[#1D3039] shadow-2xl border border-slate-200 dark:border-[#304650] overflow-hidden">
        {/* Modal Header (No Print) */}
        <div className="no-print relative flex items-center justify-between border-b border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#172830] px-6 py-4 pr-14">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16866F] text-white shrink-0">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 id="print-modal-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                Download PDF Report
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Preview and download your growth plan as a clean, formatted PDF
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdfClick}
              className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            >
              {downloadSuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>PDF Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PDF Document</span>
                </>
              )}
            </button>
          </div>

          {/* Close button fixed to the top right of the modal */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 dark:text-[#91A5A9] hover:text-slate-700 dark:hover:text-[#F2F7F5] hover:bg-slate-200/60 dark:hover:bg-[#223640] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Guidance Tip for PDF Export (No Print) */}
        <div className="no-print flex items-start gap-2.5 bg-emerald-50/80 dark:bg-emerald-950/40 border-b border-emerald-100 dark:border-emerald-800/40 px-6 py-3 text-xs text-emerald-900 dark:text-[#65D6B2]">
          <Info className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0 mt-0.5" />
          <div className="flex-1 leading-relaxed">
            <strong>Download Your Plan as PDF:</strong> Click <strong>"Download PDF Document"</strong> to save a clean, formatted <strong>.pdf</strong> file with complete action checklists, readiness score, and step-by-step instructions.
          </div>
        </div>

        {/* Scrollable Printable Document Preview */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-900 bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-[#16866F] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <TapGrowSymbol size="sm" />
                <h1 className="text-2xl font-extrabold text-[#142A36]">
                  {businessDisplayName}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <TapGrowLogo variant="compact" size="sm" />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{locationDisplay || 'Local Service Business'}</span>
              <span aria-hidden="true">·</span>
              <span>Goal: {plan.answers.mainGoal.replace(/_/g, ' ')}</span>
              <span aria-hidden="true">·</span>
              <span>Generated on {formatDate(plan.lastUpdated)}</span>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Readiness Score</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold font-mono text-[#142A36]">{plan.scoreResult.totalScore}</span>
                <span className="text-xs text-slate-400 font-mono">/ 100</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{plan.scoreResult.interpretation}</p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Recommended Actions</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold font-mono text-[#142A36]">{plan.tasks.length}</span>
                <span className="text-xs text-slate-500">tasks</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {plan.tasks.filter((t) => t.priority === 'High').length} High · {plan.tasks.filter((t) => t.priority === 'Medium').length} Medium
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Current Progress</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold font-mono text-[#16866F]">{progressPct}%</span>
                <span className="text-xs text-slate-500">completed</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">{completedCount} of {plan.tasks.length} completed</p>
            </div>
          </div>

          {/* Strengths & Gaps Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#16866F] mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Verified Strengths
              </h4>
              {plan.scoreResult.strengths.length > 0 ? (
                <ul className="space-y-1 text-xs text-slate-600">
                  {plan.scoreResult.strengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#16866F] font-bold">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No established foundations recorded yet.</p>
              )}
            </div>

            <div className="rounded-lg border border-slate-200 p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                Priority Growth Opportunities
              </h4>
              {plan.scoreResult.gaps.length > 0 ? (
                <ul className="space-y-1 text-xs text-slate-600">
                  {plan.scoreResult.gaps.map((g, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">→</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">No critical gaps identified.</p>
              )}
            </div>
          </div>

          {/* Action Tasks Detailed List */}
          <div>
            <h2 className="text-base font-bold text-[#142A36] border-b border-slate-200 pb-2 mb-4">
              Complete Action Plan ({plan.tasks.length} Items)
            </h2>

            <div className="space-y-4">
              {plan.tasks.map((task, idx) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`rounded-lg border p-4 text-xs ${
                      isDone
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            task.priority === 'High'
                              ? 'text-red-700'
                              : task.priority === 'Medium'
                              ? 'text-amber-700'
                              : 'text-slate-600'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500 font-medium">{task.category}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-500">{task.suggestedTimeToComplete}</span>
                      </div>
                      <span
                        className={`font-semibold ${
                          isDone ? 'text-emerald-700' : 'text-slate-500'
                        }`}
                      >
                        {isDone ? '✓ Completed' : task.status === 'in_progress' ? '⏳ In Progress' : '○ Not Started'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 mb-1">
                      {idx + 1}. {task.title}
                    </h3>
                    <p className="text-slate-600 mb-2">{task.summary}</p>

                    <div className="rounded bg-slate-50 p-2.5 text-slate-600 mb-2 border border-slate-100">
                      <strong>Why it matters: </strong>
                      {task.whyItMatters}
                    </div>

                    <div className="mb-2">
                      <strong className="text-slate-800">Action Steps:</strong>
                      <ol className="list-decimal list-inside space-y-1 pl-1 mt-1 text-slate-600">
                        {task.instructions.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="text-slate-500 border-t border-slate-100 pt-1.5 mt-2">
                      <strong>Completion criteria: </strong>
                      {task.completionCriteria}
                    </div>

                    {task.notes && (
                      <div className="mt-2 rounded bg-amber-50 p-2 text-amber-900 border border-amber-200">
                        <strong>Personal Note: </strong>
                        {task.notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Document Footer */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
            <TapGrowLogo variant="compact" size="sm" />
            <span>Plan • Improve • Grow · Confidential Local Business Workspace</span>
          </div>
        </div>

        {/* Modal Bottom Actions (No Print) */}
        <div className="no-print flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <span className="text-xs text-slate-500">
            {plan.tasks.length} total recommendations included in this report
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownloadPdfClick}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#0F5C4D] transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF (.pdf)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
