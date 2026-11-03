import React, { useState } from 'react';
import { AuditFinding } from '../../types/seoChecker';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  ChevronDown,
  Sparkles,
  Clock,
  ExternalLink,
  Check,
} from 'lucide-react';

interface FindingItemProps {
  finding: AuditFinding;
  onOpenAiFix: (finding: AuditFinding) => void;
  defaultExpanded?: boolean;
}

export const FindingItem: React.FC<FindingItemProps> = ({
  finding,
  onOpenAiFix,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded || finding.status === 'issue');

  const getStatusBadge = () => {
    switch (finding.status) {
      case 'pass':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-[#E0F5EE] dark:bg-[#16866F]/20 px-2 py-0.5 text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Passed</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 dark:bg-amber-950/40 px-2 py-0.5 text-xs font-bold text-amber-800 dark:text-[#E9A23B]">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Warning</span>
          </span>
        );
      case 'issue':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-red-100 dark:bg-red-950/50 px-2 py-0.5 text-xs font-bold text-red-700 dark:text-[#F07171]">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Critical Issue</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-sky-100 dark:bg-sky-950/40 px-2 py-0.5 text-xs font-bold text-sky-800 dark:text-sky-300">
            <Info className="h-3.5 w-3.5" />
            <span>Info</span>
          </span>
        );
    }
  };

  const getImpactBadge = () => {
    if (finding.status === 'pass') return null;
    switch (finding.impact) {
      case 'high':
        return (
          <span className="rounded bg-red-50 dark:bg-red-950/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-[#F07171]">
            High Impact
          </span>
        );
      case 'medium':
        return (
          <span className="rounded bg-amber-50 dark:bg-amber-950/30 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-[#E9A23B]">
            Medium Impact
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-100 dark:bg-[#223640] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
            Low Impact
          </span>
        );
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-150 ${
        finding.status === 'issue'
          ? 'border-red-200/90 dark:border-red-900/50 bg-white dark:bg-[#1D3039]'
          : finding.status === 'warning'
          ? 'border-amber-200/90 dark:border-amber-900/50 bg-white dark:bg-[#1D3039]'
          : 'border-slate-200/80 dark:border-[#304650] bg-white dark:bg-[#1D3039]'
      }`}
    >
      {/* Header Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none focus:ring-2 focus:ring-[#16866F] rounded-xl"
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {getStatusBadge()}
          <span className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] truncate">
            {finding.title}
          </span>
          {getImpactBadge()}
        </div>

        <div className="flex items-center gap-2 shrink-0 text-slate-400">
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-[#91A5A9]">
            <Clock className="h-3 w-3" />
            {finding.effort}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-150 ${
              isExpanded ? 'rotate-180 text-slate-600 dark:text-[#F2F7F5]' : ''
            }`}
          />
        </div>
      </button>

      {/* Expanded Accordion Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-[#304650] space-y-3.5 text-xs animate-in fade-in duration-100">
          {/* Observed Evidence Box */}
          <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-3 border border-slate-200/70 dark:border-[#304650]/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block mb-1">
              Observed Finding
            </span>
            <p className="text-slate-800 dark:text-[#F2F7F5] font-mono leading-relaxed break-all">
              {finding.observed}
            </p>
          </div>

          {/* Explanation */}
          <div>
            <span className="text-[11px] font-bold text-slate-900 dark:text-[#F2F7F5] block mb-1">
              Why It Matters
            </span>
            <p className="text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
              {finding.explanation}
            </p>
          </div>

          {/* Recommendation */}
          <div className="rounded-lg bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 p-3 border border-emerald-100 dark:border-[#304650]">
            <span className="text-[11px] font-bold text-[#0F5C4D] dark:text-[#65D6B2] block mb-1">
              Actionable Recommendation
            </span>
            <p className="text-slate-700 dark:text-[#E0F5EE] leading-relaxed">
              {finding.recommendation}
            </p>
          </div>

          {/* Step-by-Step Fix List */}
          {finding.howToFix && finding.howToFix.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-slate-900 dark:text-[#F2F7F5] block mb-1.5">
                How to Implement This Fix
              </span>
              <ul className="space-y-1.5 pl-1">
                {finding.howToFix.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-600 dark:text-[#B5C5C7]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-[#304650] text-[10px] font-bold text-slate-700 dark:text-[#F2F7F5]">
                      {idx + 1}
                    </span>
                    <span className="leading-snug">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-[#304650]">
            <span className="text-[11px] text-slate-400 dark:text-[#91A5A9] font-mono">
              Estimated effort: {finding.effort}
            </span>

            {finding.status !== 'pass' && (
              <button
                type="button"
                onClick={() => onOpenAiFix(finding)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                <span>Fix with TapGrow AI</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
