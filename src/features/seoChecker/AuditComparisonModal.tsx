import React from 'react';
import { SeoAuditReport, AuditComparison } from '../../types/seoChecker';
import { compareAudits } from './seoStorage';
import { formatDate } from '../../locales/i18n';
import {
  X,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Minus,
} from 'lucide-react';

interface AuditComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  previousReport: SeoAuditReport;
  currentReport: SeoAuditReport;
}

export const AuditComparisonModal: React.FC<AuditComparisonModalProps> = ({
  isOpen,
  onClose,
  previousReport,
  currentReport,
}) => {
  if (!isOpen) return null;

  const comparison: AuditComparison = compareAudits(previousReport, currentReport);
  const isPositive = comparison.scoreDelta > 0;
  const isNeutral = comparison.scoreDelta === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="flex flex-col w-full max-w-3xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="audit-comparison-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/60 dark:bg-[#172830]">
          <div>
            <h2 id="audit-comparison-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
              Audit Progress & Comparison
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
              Comparing results for {currentReport.domain}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Overview Scoreboard */}
        <div className="p-6 border-b border-slate-200 dark:border-[#304650] bg-[#E0F5EE]/20 dark:bg-[#16866F]/10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            {/* Previous Run */}
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 text-center">
              <span className="text-xs font-medium text-slate-500 dark:text-[#91A5A9]">
                Previous Audit
              </span>
              <p className="text-[11px] text-slate-400 dark:text-[#91A5A9] mb-1">
                {formatDate(previousReport.timestamp)}
              </p>
              <div className="text-2xl font-extrabold text-slate-800 dark:text-[#F2F7F5]">
                {previousReport.overallScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <span className="inline-block mt-1 rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-xs font-bold text-slate-700 dark:text-[#F2F7F5]">
                Grade {previousReport.grade}
              </span>
            </div>

            {/* Score Delta Indicator */}
            <div className="flex flex-col items-center justify-center text-center py-2">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md ${
                  isPositive
                    ? 'bg-[#16866F]'
                    : isNeutral
                    ? 'bg-slate-400'
                    : 'bg-red-500'
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-6 w-6" />
                ) : isNeutral ? (
                  <Minus className="h-6 w-6" />
                ) : (
                  <TrendingDown className="h-6 w-6" />
                )}
              </div>
              <div
                className={`mt-2 text-sm font-extrabold ${
                  isPositive
                    ? 'text-[#16866F] dark:text-[#65D6B2]'
                    : isNeutral
                    ? 'text-slate-500 dark:text-[#91A5A9]'
                    : 'text-red-600 dark:text-[#F07171]'
                }`}
              >
                {comparison.scoreDelta > 0 ? `+${comparison.scoreDelta}` : comparison.scoreDelta} Points
              </div>
              <span className="text-[11px] text-slate-500 dark:text-[#91A5A9]">
                {isPositive
                  ? 'Measurable optimization progress!'
                  : isNeutral
                  ? 'No score change'
                  : 'Score decreased slightly'}
              </span>
            </div>

            {/* Current Run */}
            <div className="rounded-xl border border-emerald-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 text-center">
              <span className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
                Current Audit
              </span>
              <p className="text-[11px] text-slate-400 dark:text-[#91A5A9] mb-1">
                {formatDate(currentReport.timestamp)}
              </p>
              <div className="text-2xl font-extrabold text-[#16866F] dark:text-[#65D6B2]">
                {currentReport.overallScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <span className="inline-block mt-1 rounded bg-[#E0F5EE] dark:bg-[#16866F]/30 px-2 py-0.5 text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">
                Grade {currentReport.grade}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Findings Comparison */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 1. Resolved / Fixed Issues */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              <span>Resolved Optimizations ({comparison.fixedFindings.length})</span>
            </h3>

            {comparison.fixedFindings.length > 0 ? (
              <div className="space-y-2">
                {comparison.fixedFindings.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 dark:bg-[#16866F]/10 dark:border-[#304650] p-3 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16866F] text-white text-[10px] font-bold">
                        ✓
                      </span>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-[#F2F7F5]">{f.title}</span>
                        <p className="text-slate-500 dark:text-[#91A5A9] text-[11px]">{f.observed}</p>
                      </div>
                    </div>
                    <span className="rounded bg-[#E0F5EE] dark:bg-[#16866F]/30 px-2 py-0.5 text-[10px] font-bold text-[#16866F] dark:text-[#65D6B2]">
                      Fixed
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] italic">
                No previously flagged issues were marked resolved in this run.
              </p>
            )}
          </div>

          {/* 2. New Issues / Regressions */}
          {comparison.newFindings.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-[#F07171] mb-3 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                <span>New Issues or Regressions ({comparison.newFindings.length})</span>
              </h3>
              <div className="space-y-2">
                {comparison.newFindings.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50/50 dark:bg-red-950/20 dark:border-red-900/50 p-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-red-900 dark:text-red-300">{f.title}</span>
                      <p className="text-slate-600 dark:text-[#B5C5C7] text-[11px]">{f.observed}</p>
                    </div>
                    <span className="rounded bg-red-100 dark:bg-red-950/40 px-2 py-0.5 text-[10px] font-bold text-red-700 dark:text-[#F07171]">
                      New
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Remaining Improvement Opportunities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Remaining Opportunities ({comparison.remainingIssues.length})</span>
            </h3>

            {comparison.remainingIssues.length > 0 ? (
              <div className="space-y-2">
                {comparison.remainingIssues.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/60 dark:bg-[#223640] p-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 dark:text-[#F2F7F5]">{f.title}</span>
                      <p className="text-slate-500 dark:text-[#91A5A9] text-[11px]">{f.recommendation}</p>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                      Est. {f.effort}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] italic">
                All high-priority issues have been cleared!
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 dark:border-[#304650] px-6 py-3 bg-slate-50/50 dark:bg-[#172830]">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[#16866F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0F5C4D] transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
