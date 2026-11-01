import React from 'react';
import { ArrowLeft, Heart, Check, Building2, Users } from 'lucide-react';
import { TapGrowLogo, TapGrowSymbol } from '../components/brand/TapGrowLogo';

interface AboutPageProps {
  onBack: () => void;
  onStartAssessment: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onBack, onStartAssessment }) => {
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
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9]">About</span>
      </div>

      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 dark:border-[#304650] bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3.5 py-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
          <TapGrowSymbol size="sm" className="h-4 w-4" />
          <span>Plan • Improve • Grow</span>
        </div>
        <div className="flex items-center gap-4">
          <TapGrowLogo variant="full" size="lg" />
        </div>
        <p className="text-base text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
          TapGrow is a Local Business Growth Planner that helps businesses understand their marketing performance, identify areas for improvement, create actionable plans, and track their growth.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
            Why We Built TapGrow
          </h2>
          <p>
            Local business owners frequently get pitched expensive $1,500/month agency retainers or confusing software subscriptions when all they really need are solid local fundamentals: a verified Google Business profile, consistent phone and address listings, a clear mobile homepage, and an honest habit of asking satisfied clients for reviews.
          </p>
          <p>
            We created <strong>TapGrow</strong> as an open, free, client-side utility that levels the playing field for small business owners worldwide.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
            Our Guiding Commitments
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-[#F2F7F5]">No Cost & Zero Paid APIs:</strong> Free to use for every independent business owner.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-[#F2F7F5]">Zero Accounts & Zero Spam:</strong> We will never ask for your email address or send unwanted sales pitches.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-[#F2F7F5]">No Fake Metrics:</strong> We do not show fake visitor counters, fabricated competitor rankings, or exaggerated guarantees.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] mt-0.5 shrink-0" />
              <span><strong className="text-slate-800 dark:text-[#F2F7F5]">Portability:</strong> You can export your plan as JSON or print it as a clean PDF at any time.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onStartAssessment}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16866F] px-6 text-xs font-bold text-white shadow-sm hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
        >
          <span>Create Your Free Plan Now</span>
        </button>
      </div>
    </div>
  );
};
