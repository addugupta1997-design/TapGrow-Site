import React from 'react';
import { CompetitiveOpportunity } from '../../types/competitor';
import {
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface OpportunityFinderCardProps {
  opportunity: CompetitiveOpportunity;
  onExploreWithAi: (opportunity: CompetitiveOpportunity) => void;
}

export const OpportunityFinderCard: React.FC<OpportunityFinderCardProps> = ({
  opportunity,
  onExploreWithAi,
}) => {
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return (
          <span className="rounded bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-[#F07171] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            High Priority Opportunity
          </span>
        );
      case 'medium':
        return (
          <span className="rounded bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-[#E9A23B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-100 text-slate-700 dark:bg-[#223640] dark:text-[#B5C5C7] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
            Standard Opportunity
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-[#3A535D] space-y-4">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {getPriorityBadge(opportunity.priority)}
            <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-[#B5C5C7]">
              {opportunity.category.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Est. {opportunity.estimatedEffort}
          </span>
        </div>

        <h4 className="text-sm font-extrabold text-slate-900 dark:text-[#F2F7F5] leading-snug">
          {opportunity.title}
        </h4>

        {/* Observation & Evidence */}
        <div className="mt-3 rounded-xl bg-slate-50 dark:bg-[#223640] p-3 border border-slate-200/70 dark:border-[#304650]/80 space-y-1.5 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9] block">
              Market Observation
            </span>
            <p className="text-slate-800 dark:text-[#F2F7F5] leading-relaxed">
              {opportunity.observation}
            </p>
          </div>
          <div className="pt-1.5 border-t border-slate-200/60 dark:border-[#304650]/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9] block">
              Supporting Evidence
            </span>
            <p className="text-slate-600 dark:text-[#B5C5C7] text-[11px] font-mono">
              {opportunity.supportingEvidence}
            </p>
          </div>
        </div>

        {/* Why It Matters */}
        <div className="mt-3 text-xs">
          <span className="text-[11px] font-bold text-slate-900 dark:text-[#F2F7F5] block mb-1">
            Why It Matters
          </span>
          <p className="text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            {opportunity.whyItMatters}
          </p>
        </div>

        {/* Suggested Action */}
        <div className="mt-3 rounded-xl bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 p-3 border border-emerald-100 dark:border-[#304650] text-xs">
          <span className="text-[11px] font-bold text-[#0F5C4D] dark:text-[#65D6B2] block mb-1 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Suggested Strategic Action
          </span>
          <p className="text-slate-700 dark:text-[#E0F5EE] leading-relaxed font-medium">
            {opportunity.suggestedAction}
          </p>
        </div>
      </div>

      {/* Card Action */}
      <div className="pt-3 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-xs">
        {opportunity.competitorBenchmark ? (
          <span className="text-[11px] text-slate-400 dark:text-[#91A5A9] truncate max-w-[200px]">
            Benchmark: {opportunity.competitorBenchmark}
          </span>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-[#91A5A9]">
            Local Market Opportunity
          </span>
        )}

        <button
          type="button"
          onClick={() => onExploreWithAi(opportunity)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0F5C4D] shadow-2xs transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          <span>Formulate Strategy</span>
        </button>
      </div>
    </div>
  );
};
