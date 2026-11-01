import React from 'react';
import { ArrowLeft, CheckCircle2, Shield, Calendar, Target, Award } from 'lucide-react';
import { WorkflowStepIllustration } from '../components/graphics/MarketingWorkflowIllustration';

interface HowItWorksPageProps {
  onBack: () => void;
  onStartAssessment: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onBack, onStartAssessment }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#91A5A9] hover:text-slate-800 dark:hover:text-[#F2F7F5] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9]">Methodology</span>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 dark:border-[#304650] bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3 py-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
          <span className="h-2 w-2 rounded-full bg-[#E9A23B]" />
          <span>Plan • Improve • Grow</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F2F7F5] sm:text-4xl">
          How TapGrow Works
        </h1>
        <p className="text-base text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
          Most small business owners are overwhelmed by contradictory marketing advice and aggressive agency sales pitches. TapGrow provides a grounded, honest alternative to plan, improve, and grow your local presence.
        </p>
      </div>

      {/* Visual 3-Step Journey */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs">
          <div className="mb-3 overflow-hidden rounded-lg bg-[#F6F8F7] dark:bg-[#172830] p-2 border border-slate-100 dark:border-[#304650]/60">
            <WorkflowStepIllustration step={1} className="w-full h-24" />
          </div>
          <span className="text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">Step 1</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] mt-1">4-Minute Assessment</h3>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
            Answer questions tailored exclusively to your trade model and verified storefront or mobile service area.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs">
          <div className="mb-3 overflow-hidden rounded-lg bg-[#F6F8F7] dark:bg-[#172830] p-2 border border-slate-100 dark:border-[#304650]/60">
            <WorkflowStepIllustration step={2} className="w-full h-24" />
          </div>
          <span className="text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">Step 2</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] mt-1">Diagnostic Score</h3>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
            Transparent scoring pinpoints your highest priority gaps in Google presence, review habits, and website clarity.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs">
          <div className="mb-3 overflow-hidden rounded-lg bg-[#F6F8F7] dark:bg-[#172830] p-2 border border-slate-100 dark:border-[#304650]/60">
            <WorkflowStepIllustration step={3} className="w-full h-24" />
          </div>
          <span className="text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">Step 3</span>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] mt-1">Weekly Action Plan</h3>
          <p className="mt-1.5 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
            Work through bite-sized, 30-minute actionable tasks. Check them off, record notes, and print or save as PDF.
          </p>
        </div>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2] mb-3">
            <Target className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">Deterministic Rule Engine</h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            Instead of querying an ungrounded chatbot that invents vague generic tips, our engine evaluates your specific business type, location model, and current assets against a curated catalog of verified local marketing fundamentals.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2] mb-3">
            <Calendar className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">Weekly Pacing Over Panic</h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            Local marketing builds compounded momentum over months. We organize recommendations into manageable 30–60 minute weekly sprints tailored to your stated capacity so you never feel buried under an endless to-do list.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2] mb-3">
            <Shield className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">100% Privacy by Design</h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            Your assessment answers and notes are never sent to a cloud database or marketing ad network. Everything lives right inside your browser's local storage.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2] mb-3">
            <Award className="h-5 w-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">Transparent Scoring</h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            The 0–100 Readiness Score reflects your reported foundational setup. It excludes irrelevant questions from your denominator and highlights exact strengths and gaps without marketing jargon.
          </p>
        </div>
      </div>

      <div className="rounded-xl bg-slate-100 dark:bg-[#172830] border border-transparent dark:border-[#304650] p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-[#F2F7F5]">Ready to build your marketing plan?</h3>
        <p className="text-xs text-slate-600 dark:text-[#B5C5C7] max-w-md mx-auto">
          No signups, no credit cards, and no complex tools required.
        </p>
        <button
          type="button"
          onClick={onStartAssessment}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16866F] px-6 text-xs font-bold text-white shadow-sm hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
        >
          <span>Start 5-Minute Assessment</span>
        </button>
      </div>
    </div>
  );
};
