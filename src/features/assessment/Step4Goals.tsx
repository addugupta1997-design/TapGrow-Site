import React from 'react';
import {
  AssessmentAnswers,
  MainGoal,
  WeeklyTimeAvailable,
  BudgetPreference,
  PreferredFocus,
  ValidationError,
} from '../../types/assessment';
import { Target, Clock, Banknote, Compass } from 'lucide-react';

interface Step4GoalsProps {
  data: Partial<AssessmentAnswers>;
  errors: ValidationError[];
  onChange: (field: keyof AssessmentAnswers, value: any) => void;
}

const GOALS: { id: MainGoal; label: string; desc: string }[] = [
  { id: 'local_visibility', label: 'Local Visibility', desc: 'Get found easily by people searching for your services nearby.' },
  { id: 'more_visits', label: 'More Foot Traffic & Visits', desc: 'Attract more local walk-ins to your store or salon.' },
  { id: 'more_enquiries', label: 'More Inquiries & Phone Calls', desc: 'Increase quote requests, calls, and email inquiries.' },
  { id: 'more_bookings', label: 'More Appointments & Bookings', desc: 'Fill your schedule with qualified local clients.' },
  { id: 'trust_reviews', label: 'Build Trust & 5-Star Reviews', desc: 'Earn credible social proof that makes choosing you an easy choice.' },
  { id: 'website_improvement', label: 'Website Clarity & Conversions', desc: 'Make your website convert more visitors into real clients.' },
  { id: 'marketing_consistency', label: 'Better Weekly Routine', desc: 'Stop sporadic marketing panic and build a manageable weekly habit.' },
];

const TIME_OPTIONS: { id: WeeklyTimeAvailable; label: string; desc: string }[] = [
  { id: 'under_1h', label: 'Under 1 hour / week', desc: 'Keep it to absolute highest-leverage essentials only.' },
  { id: '1_to_3h', label: '1 to 3 hours / week', desc: 'Balanced focus to make steady progress without burnout.' },
  { id: '3_to_5h', label: '3 to 5 hours / week', desc: 'Active growth phase with content and listing expansion.' },
  { id: 'over_5h', label: 'More than 5 hours / week', desc: 'Full marketing push with thorough foundational improvements.' },
];

const BUDGET_OPTIONS: { id: BudgetPreference; label: string; desc: string }[] = [
  { id: 'free_only', label: '100% Free Methods Only', desc: 'Zero software subscriptions or ad spend required. Pure organic focus.' },
  { id: 'mostly_free', label: 'Mostly Free (Low Cost)', desc: 'Willing to consider optional low-cost supplies or domain registrations.' },
  { id: 'some_paid', label: 'Open to Paid Methods Later', desc: 'Primarily organic foundations, open to local ads when foundations are solid.' },
];

const FOCUS_AREAS: { id: PreferredFocus; label: string }[] = [
  { id: 'all', label: 'Balanced (Recommended)' },
  { id: 'local_seo', label: 'Local SEO & Maps' },
  { id: 'reviews', label: 'Reviews & Reputation' },
  { id: 'website', label: 'Website & Conversions' },
  { id: 'social_media', label: 'Social & Content' },
  { id: 'consistency', label: 'Routine & Tracking' },
];

export const Step4Goals: React.FC<Step4GoalsProps> = ({ data, errors, onChange }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5] sm:text-2xl">
          Goals & Capacity
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#B5C5C7]">
          We will adjust task priority and weekly workloads to fit your real-world time availability and budget.
        </p>
      </div>

      {/* Main Goal */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-[#F2F7F5] mb-1">
          <Target className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
          <label className="text-sm font-semibold">
            What is your #1 primary growth goal right now? <span className="text-red-500">*</span>
          </label>
        </div>
        <div className="mt-3 space-y-2">
          {GOALS.map((goal) => {
            const isSelected = data.mainGoal === goal.id;
            return (
              <label
                key={goal.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                  isSelected
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-emerald-950/40 ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] hover:border-slate-300 dark:hover:border-[#3A535D]'
                }`}
              >
                <input
                  type="radio"
                  name="mainGoal"
                  value={goal.id}
                  checked={isSelected}
                  onChange={() => onChange('mainGoal', goal.id)}
                  className="mt-0.5 h-4 w-4 text-[#16866F] dark:text-[#65D6B2] focus:ring-[#16866F]"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">{goal.label}</span>
                  <span className="text-xs text-slate-500 dark:text-[#B5C5C7]">{goal.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
        {getFieldError('mainGoal') && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('mainGoal')}</p>
        )}
      </div>

      {/* Available Time Per Week */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-[#F2F7F5] mb-1">
          <Clock className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
          <label className="text-sm font-semibold">
            How much time can you realistically spend on marketing per week? <span className="text-red-500">*</span>
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-[#91A5A9] mb-3">
          We will schedule manageable weekly workloads so tasks don’t pile up.
        </p>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TIME_OPTIONS.map((opt) => {
            const isSelected = data.weeklyHours === opt.id;
            return (
              <label
                key={opt.id}
                className={`flex cursor-pointer flex-col rounded-lg border p-3.5 transition-all ${
                  isSelected
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-emerald-950/40 ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] hover:border-slate-300 dark:hover:border-[#3A535D]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="weeklyHours"
                    value={opt.id}
                    checked={isSelected}
                    onChange={() => onChange('weeklyHours', opt.id)}
                    className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] focus:ring-[#16866F]"
                  />
                  <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] sm:text-sm">{opt.label}</span>
                </div>
                <span className="mt-1 text-xs text-slate-500 dark:text-[#B5C5C7] pl-6">{opt.desc}</span>
              </label>
            );
          })}
        </div>
        {getFieldError('weeklyHours') && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('weeklyHours')}</p>
        )}
      </div>

      {/* Budget Preference */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-[#F2F7F5] mb-1">
          <Banknote className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
          <label className="text-sm font-semibold">
            What is your budget preference? <span className="text-red-500">*</span>
          </label>
        </div>
        <div className="mt-3 space-y-2">
          {BUDGET_OPTIONS.map((b) => {
            const isSelected = data.budgetPreference === b.id;
            return (
              <label
                key={b.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                  isSelected
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-emerald-950/40 ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] hover:border-slate-300 dark:hover:border-[#3A535D]'
                }`}
              >
                <input
                  type="radio"
                  name="budgetPreference"
                  value={b.id}
                  checked={isSelected}
                  onChange={() => onChange('budgetPreference', b.id)}
                  className="mt-0.5 h-4 w-4 text-[#16866F] dark:text-[#65D6B2] focus:ring-[#16866F]"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">{b.label}</span>
                  <span className="text-xs text-slate-500 dark:text-[#B5C5C7]">{b.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
        {getFieldError('budgetPreference') && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('budgetPreference')}</p>
        )}
      </div>

      {/* Preferred Focus Area (Optional) */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 dark:text-[#F2F7F5] mb-1">
          <Compass className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
          <label className="text-sm font-semibold">
            Preferred Focus Area <span className="text-xs font-normal text-slate-500 dark:text-[#91A5A9]">(Optional)</span>
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-[#91A5A9] mb-3">
          Want the planner to emphasize a specific topic first?
        </p>

        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map((focus) => {
            const isSelected = (data.preferredFocus || 'all') === focus.id;
            return (
              <button
                key={focus.id}
                type="button"
                onClick={() => onChange('preferredFocus', focus.id)}
                className={`rounded-lg border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'border-[#16866F] bg-[#16866F] text-white'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                }`}
              >
                {focus.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
