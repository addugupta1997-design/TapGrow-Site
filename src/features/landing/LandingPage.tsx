import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Star,
  Globe,
  Share2,
  TrendingUp,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { HeroGrowthIllustration } from '../../components/graphics/HeroGrowthIllustration';
import { WorkflowStepIllustration } from '../../components/graphics/MarketingWorkflowIllustration';
import { CategoryIllustration } from '../../components/graphics/CategoryIllustration';
import { TaskCategoryIllustration } from '../../components/graphics/TaskCategoryIllustration';
import { DotGridPattern, AmbientGlow } from '../../components/graphics/DecorativeShapes';
import { TapGrowSymbol } from '../../components/brand/TapGrowLogo';
import { BusinessCategory } from '../../types/assessment';

interface LandingPageProps {
  onStartAssessment: () => void;
  onNavigate: (view: 'landing' | 'assessment' | 'dashboard' | 'how-it-works' | 'about' | 'privacy') => void;
  hasExistingPlan: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAssessment,
  onNavigate,
  hasExistingPlan,
}) => {
  return (
    <div className="space-y-16 py-8 sm:py-16 transition-colors duration-150">
      {/* 1. HERO SECTION */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200/80 dark:border-[#304650] bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3.5 py-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
              <TapGrowSymbol size="sm" className="h-4 w-4" />
              <span>TapGrow · Plan • Improve • Grow</span>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F2F7F5] sm:text-4xl lg:text-5xl leading-tight">
              Make Your Business Growth More Intentional.
            </h1>

            <p className="max-w-2xl text-base text-slate-600 dark:text-[#B5C5C7] sm:text-lg leading-relaxed">
              Understand where your business stands, discover what needs improvement, and follow a practical marketing plan built around your goals.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onStartAssessment}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16866F] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16866F]"
              >
                {hasExistingPlan ? 'Continue My Growth Plan' : 'Start Your Free Assessment'}
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('how-it-works')}
                className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-5 py-3.5 text-sm font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
              >
                See How It Works
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-slate-500 dark:text-[#91A5A9]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                100% Free (₹0)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                No Account or Email Needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                Private (Stays in Browser)
              </span>
            </div>
          </div>

          {/* Product Dashboard Visual Preview -> Hero Growth Editorial Illustration */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <AmbientGlow size="lg" className="-top-12 -right-8 opacity-70 pointer-events-none" />
            <HeroGrowthIllustration />
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="bg-white dark:bg-[#172830] py-16 border-y border-slate-200/80 dark:border-[#304650] transition-colors duration-150">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] uppercase tracking-wider">Simple 3-Step Process</span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#17252B] dark:text-[#F2F7F5] sm:text-3xl">
              How TapGrow Works
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#B5C5C7] sm:text-base">
              A transparent, 3-step system designed for busy business owners with zero marketing background.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-6 bg-[#F5F8F6] dark:bg-[#1D3039] flex flex-col justify-between">
              <div>
                <div className="mb-4 overflow-hidden rounded-lg bg-white/70 dark:bg-[#172830]/80 p-2 border border-slate-200/60 dark:border-[#304650]/60">
                  <WorkflowStepIllustration step={1} className="w-full h-28" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white border border-white/20 font-bold text-xs mb-3 shadow-xs">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">1. Assess Your Business</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed sm:text-sm">
                  Share your business setup, current online presence, and available weekly time in 4 quick, jargon-free steps.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-6 bg-[#F5F8F6] dark:bg-[#1D3039] flex flex-col justify-between">
              <div>
                <div className="mb-4 overflow-hidden rounded-lg bg-white/70 dark:bg-[#172830]/80 p-2 border border-slate-200/60 dark:border-[#304650]/60">
                  <WorkflowStepIllustration step={2} className="w-full h-28" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0FAF91] text-white font-bold text-xs mb-3 shadow-xs">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">2. Discover Growth Opportunities</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed sm:text-sm">
                  Get clear, prioritized recommendations targeting local visibility, customer trust, and conversions with zero guesswork.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-6 bg-[#F5F8F6] dark:bg-[#1D3039] flex flex-col justify-between">
              <div>
                <div className="mb-4 overflow-hidden rounded-lg bg-white/70 dark:bg-[#172830]/80 p-2 border border-slate-200/60 dark:border-[#304650]/60">
                  <WorkflowStepIllustration step={3} className="w-full h-28" />
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white font-bold text-xs mb-3 shadow-xs">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">3. Follow Your Action Plan</h3>
                <p className="mt-2 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed sm:text-sm">
                  Take action with step-by-step guidance, track task completion, log notes, and build lasting marketing momentum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT THE PLANNER HELPS WITH */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-[#142A36] dark:text-[#F2F7F5] sm:text-3xl">
            What the Planner Helps With
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-[#B5C5C7] sm:text-base">
            Focused on the real foundations that bring local customers through your door or onto your phone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] mb-3">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Local SEO & Map Pack</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
              Google Business Profile completeness, Apple Maps, Bing Places, and NAP consistency.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] mb-3">
              <Star className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Reviews & Reputation</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
              Standardized customer review invite routines and professional response guidelines.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] mb-3">
              <Globe className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Website Basics & Clarity</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
              Above-the-fold service clarity, clickable phone numbers, and mobile page performance.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] mb-3">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Tracking & Consistency</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] leading-relaxed">
              Simple 1-question inquiry source logs and 30-minute recurring weekly marketing habits.
            </p>
          </div>
        </div>
      </section>

      {/* 4. BUSINESS CATEGORIES SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] uppercase tracking-wider">Tailored Assessments</span>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#142A36] dark:text-[#F2F7F5] sm:text-3xl">
            Custom Diagnostic Rules for Every Local Trade
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-[#B5C5C7]">
            We don't ask a plumber about lunch menus or a cafe about service radius. Select your trade and get questions that matter.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {[
            { id: 'restaurant_cafe', name: 'Restaurants & Cafes' },
            { id: 'retail', name: 'Retail Shops' },
            { id: 'salon_wellness', name: 'Salons & Spas' },
            { id: 'health_clinic', name: 'Clinics & Care' },
            { id: 'home_trades', name: 'Home Services' },
            { id: 'professional_services', name: 'Professional' },
            { id: 'fitness', name: 'Fitness & Gyms' },
            { id: 'other_local', name: 'Local Trades' },
          ].map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-3.5 rounded-xl border border-slate-200/80 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xs hover:border-[#16866F]/50 dark:hover:border-[#65D6B2]/50 transition-all group"
            >
              <div className="mb-2 p-1 transition-transform group-hover:scale-105">
                <CategoryIllustration category={item.id} size="md" />
              </div>
              <span className="text-xs font-medium text-slate-800 dark:text-[#F2F7F5] leading-tight">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. SAMPLE TASK CARD */}
      <section className="bg-white dark:bg-[#172830] py-16 border-y border-slate-200/80 dark:border-[#304650] transition-colors duration-150">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] uppercase tracking-wider">Concrete Guidance</span>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#142A36] dark:text-[#F2F7F5]">
              Real Sample Action Card
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] sm:text-sm">
              Every recommendation includes why it matters, estimated effort, and explicit steps.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-[#F6F8F7] dark:bg-[#1D3039] p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-3">
              <div className="flex items-center gap-2">
                <TaskCategoryIllustration category="Local SEO" size="sm" />
                <span className="font-semibold text-slate-700 dark:text-[#B5C5C7]">Local SEO · Est. 45 mins · Week 1</span>
              </div>
              <span className="inline-flex items-center gap-1 font-semibold text-red-700 dark:text-[#F07171]">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                High Priority
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-[#F2F7F5]">Audit Name, Address, and Phone (NAP) Consistency</h3>
            <p className="mt-1 text-xs text-slate-600 dark:text-[#B5C5C7] sm:text-sm">
              Ensure your official business name, phone number, and address are identical across all directories and listings.
            </p>

            <div className="mt-3 rounded-lg bg-white dark:bg-[#223640] p-3 text-xs text-slate-600 dark:text-[#B5C5C7] border border-slate-200 dark:border-[#304650]">
              <strong className="text-slate-800 dark:text-[#F2F7F5]">Why it matters: </strong>
              Conflicting phone numbers or address variations dilute search engine trust and misdirect customers.
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-700 dark:text-[#B5C5C7]">
              <p className="font-bold text-slate-900 dark:text-[#F2F7F5]">Step-by-Step Instructions:</p>
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-[#B5C5C7]">
                <li>Document your master record: official business name, phone, and street address.</li>
                <li>Check your Google Business Profile, Apple Maps, Bing Places, and Facebook.</li>
                <li>Correct any slight abbreviations or old suite numbers to match identically.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRIVACY REASSURANCE */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2]">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-[#142A36] dark:text-[#F2F7F5]">
          Your Data Stays on Your Device
        </h2>
        <p className="text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed max-w-xl mx-auto">
          We believe small business tools should respect your privacy. No account signup, no email collection, no tracking cookies, and no third-party marketing pixels. All answers and task notes are stored strictly in your browser's local storage.
        </p>
      </section>

      {/* 6. TRANSPARENT FAQ */}
      <section className="bg-white dark:bg-[#172830] py-16 border-y border-slate-200/80 dark:border-[#304650] transition-colors duration-150">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[#142A36] dark:text-[#F2F7F5]">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] sm:text-sm">
              Clear, honest answers about what this planner does and does not do.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-5 bg-[#F6F8F7] dark:bg-[#1D3039]">
              <h3 className="font-bold text-slate-900 dark:text-[#F2F7F5]">Is this really 100% free with no hidden fees?</h3>
              <p className="mt-1.5 text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                Yes, completely free. There are no premium upsells, paid APIs, or subscription tiers. The project was built to provide an open, accessible marketing workspace for independent business owners.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-5 bg-[#F6F8F7] dark:bg-[#1D3039]">
              <h3 className="font-bold text-slate-900 dark:text-[#F2F7F5]">Do I need to sign up or provide an email address?</h3>
              <p className="mt-1.5 text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                No. You do not need an account, password, or email. You can begin the assessment immediately and generate your plan without any registration gate.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-5 bg-[#F6F8F7] dark:bg-[#1D3039]">
              <h3 className="font-bold text-slate-900 dark:text-[#F2F7F5]">How are recommendations generated?</h3>
              <p className="mt-1.5 text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                Recommendations are generated via transparent, deterministic TypeScript logic and a curated library of battle-tested local marketing best practices. We do not use hallucinated AI output or black-box predictions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-5 bg-[#F6F8F7] dark:bg-[#1D3039]">
              <h3 className="font-bold text-slate-900 dark:text-[#F2F7F5]">Does this guarantee #1 rankings on Google?</h3>
              <p className="mt-1.5 text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                No tool can honestly guarantee specific search engine rankings, and anyone claiming to do so is misleading you. What this planner does is ensure your foundational presence, review flow, and contact consistency are optimized so you earn legitimate local authority.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-[#304650] p-5 bg-[#F6F8F7] dark:bg-[#1D3039]">
              <h3 className="font-bold text-slate-900 dark:text-[#F2F7F5]">How is my data preserved across visits?</h3>
              <p className="mt-1.5 text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                Your progress is saved in your web browser's local storage. You can refresh or revisit anytime from the same device. You can also click "Export JSON" to save an offline backup file or "Print / Save PDF" to generate a physical report.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA BANNER */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#101D24] dark:bg-[#172830] dark:border dark:border-[#304650] p-8 text-center text-white sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-block text-xs font-bold tracking-widest text-[#65D6B2] uppercase mb-2">
              Plan • Improve • Grow
            </span>
            <h2 className="text-2xl font-bold sm:text-3xl text-white dark:text-[#F2F7F5]">
              Ready to find your highest-impact marketing priorities?
            </h2>
            <p className="mt-2 text-xs text-slate-300 dark:text-[#B5C5C7] sm:text-sm max-w-xl mx-auto">
              Take 4 minutes to complete the guided diagnostic and receive your personalized TapGrow action plan today.
            </p>
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={onStartAssessment}
                className="inline-flex items-center gap-2 rounded-xl bg-[#16866F] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {hasExistingPlan ? 'Open My Growth Plan' : 'Start Your Free Assessment'}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
