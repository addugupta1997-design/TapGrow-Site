import React from 'react';
import { ScoreResult } from '../../types/recommendations';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ScoreExplainerModalProps {
  isOpen: boolean;
  scoreResult: ScoreResult;
  onClose: () => void;
}

export const ScoreExplainerModal: React.FC<ScoreExplainerModalProps> = ({
  isOpen,
  scoreResult,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="score-modal-title"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#1D3039] p-6 shadow-xl border border-slate-200 dark:border-[#304650] sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 dark:text-[#91A5A9] hover:text-slate-600 dark:hover:text-[#F2F7F5] transition-colors p-1"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2]">
            <Info className="h-5 w-5" />
          </div>
          <div>
            <h3 id="score-modal-title" className="text-lg font-bold text-slate-900 dark:text-[#F2F7F5]">
              How Your Readiness Score Works
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9]">Transparent, deterministic self-assessment scoring</p>
          </div>
        </div>

        <div className="rounded-xl bg-slate-50 dark:bg-[#172830] p-4 border border-slate-100 dark:border-[#304650] text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed space-y-2 mb-6">
          <p>
            <strong className="text-slate-800 dark:text-[#F2F7F5]">Self-Assessment Principle:</strong> Your score ({scoreResult.totalScore}/100) reflects the marketing habits and visibility foundations you reported in the assessment. It is <em>not</em> an automated audit of your website, a competitor ranking guarantee, or a prediction of search positions.
          </p>
          <p>
            <strong className="text-slate-800 dark:text-[#F2F7F5]">Fair Denominator Logic:</strong> Questions marked as "Not Applicable" or skipped for your business model (such as map listings for online-only businesses) are safely excluded from the denominator rather than penalizing your score.
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">Category Breakdown</h4>
          <div className="space-y-3">
            {Object.values(scoreResult.categoryBreakdown).map((cat) => (
              <div key={cat.name} className="rounded-lg border border-slate-100 dark:border-[#304650] p-3 bg-white dark:bg-[#223640]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">{cat.name}</span>
                  <span className="font-mono tabular-nums text-slate-600 dark:text-[#B5C5C7]">
                    {cat.earned} / {cat.total} pts ({cat.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#172830]">
                  <div
                    className="h-full bg-[#16866F] dark:bg-[#65D6B2] transition-all duration-300"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths and Gaps */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 dark:text-[#65D6B2] mb-2">
              <CheckCircle className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              Strengths Identified ({scoreResult.strengths.length})
            </div>
            {scoreResult.strengths.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-[#B5C5C7]">
                {scoreResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#16866F] dark:text-[#65D6B2] font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 dark:text-[#91A5A9] italic">No established foundations recorded yet.</p>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-400 mb-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              Primary Growth Opportunities ({scoreResult.gaps.length})
            </div>
            {scoreResult.gaps.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-[#B5C5C7]">
                {scoreResult.gaps.map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">→</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 dark:text-[#91A5A9] italic">No critical gaps identified.</p>
            )}
          </div>
        </div>

        {/* How Completing Specific Actions Affects the Score */}
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] p-4.5 mb-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <span>How Completing Actions Affects Your Score</span>
          </h4>
          <p className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            Completing tasks in your TapGrow plan directly addresses the identified gaps above. Here is how progress correlates with your readiness:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-lg bg-slate-50 dark:bg-[#172830] p-2.5 border border-slate-100 dark:border-[#304650]">
              <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] block">Listing & NAP Verification:</span>
              <span className="text-slate-500 dark:text-[#91A5A9]">Resolves visibility gaps, adding up to <strong>+20 to +35 pts</strong> to your profile setup.</span>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-[#172830] p-2.5 border border-slate-100 dark:border-[#304650]">
              <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] block">Customer Review Routine:</span>
              <span className="text-slate-500 dark:text-[#91A5A9]">Activates continuous social proof, contributing up to <strong>+15 pts</strong> in trust.</span>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-[#172830] p-2.5 border border-slate-100 dark:border-[#304650]">
              <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] block">Conversion & Clarity:</span>
              <span className="text-slate-500 dark:text-[#91A5A9]">Adding friction-free CTAs and transparent pricing recovers up to <strong>+15 to +30 pts</strong>.</span>
            </div>
            <div className="rounded-lg bg-slate-50 dark:bg-[#172830] p-2.5 border border-slate-100 dark:border-[#304650]">
              <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] block">Inquiry Tracking & Habits:</span>
              <span className="text-slate-500 dark:text-[#91A5A9]">Documenting weekly lead sources establishes <strong>+10 to +20 pts</strong> in consistency.</span>
            </div>
          </div>
        </div>

        {/* Explicit Non-Guarantee Disclaimer */}
        <div className="rounded-lg bg-amber-50/60 dark:bg-amber-950/25 p-3.5 border border-amber-200/80 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-[#E9A23B] leading-relaxed mb-6">
          <strong>Non-Guarantee & Transparency Notice:</strong> The TapGrow Readiness Score is a deterministic diagnostic benchmark of your self-reported marketing foundations and operational setup. It does not represent an actual Google Maps or Search algorithm ranking, and does not guarantee specific visitor numbers or business revenue.
        </div>

        <div className="border-t border-slate-100 dark:border-[#304650] pt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-9 inline-flex items-center justify-center rounded-lg bg-[#16866F] px-4 text-xs font-semibold text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};
