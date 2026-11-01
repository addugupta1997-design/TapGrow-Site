import React from 'react';
import { AssessmentAnswers, BusinessCategory, BusinessModel, ValidationError } from '../../types/assessment';
import { CategoryIllustration } from '../../components/graphics/CategoryIllustration';

interface Step1BasicsProps {
  data: Partial<AssessmentAnswers>;
  errors: ValidationError[];
  onChange: (field: keyof AssessmentAnswers, value: any) => void;
}

const CATEGORIES: { id: BusinessCategory; label: string }[] = [
  { id: 'retail', label: 'Retail & Independent Shop' },
  { id: 'restaurant_cafe', label: 'Restaurant, Cafe or Bakery' },
  { id: 'salon_wellness', label: 'Salon, Spa or Personal Care' },
  { id: 'health_clinic', label: 'Clinic or Medical Practice' },
  { id: 'home_trades', label: 'Home Services & Tradesperson' },
  { id: 'professional_services', label: 'Professional / Office Services' },
  { id: 'fitness', label: 'Fitness & Sports Studio' },
  { id: 'other_local', label: 'Other Local Business' },
];

const MODELS: { id: BusinessModel; title: string; desc: string }[] = [
  {
    id: 'physical',
    title: 'Physical Location (Storefront / Office)',
    desc: 'Customers visit your brick-and-mortar address during business hours.',
  },
  {
    id: 'service_area',
    title: 'Service-Area Business (On-site / Mobile)',
    desc: 'You travel to client locations (e.g., plumbers, cleaners, mobile mechanics).',
  },
  {
    id: 'hybrid',
    title: 'Hybrid (Storefront + Travel or Local Delivery)',
    desc: 'You have a physical location and also deliver or travel to customers.',
  },
  {
    id: 'online_only',
    title: 'Online-Only or Remote Service',
    desc: 'You do not serve customers at a physical location or in-person radius.',
  },
];

export const Step1Basics: React.FC<Step1BasicsProps> = ({ data, errors, onChange }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5] sm:text-2xl">
          Business Basics
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#B5C5C7]">
          Tell us about your business type and location model so we can tailor relevant tasks.
        </p>
      </div>

      {/* Business Name (Optional) */}
      <div>
        <label htmlFor="businessName" className="block text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
          Business Name <span className="text-xs font-normal text-slate-500 dark:text-[#91A5A9]">(Optional)</span>
        </label>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">Used only for labeling your exported plan and report.</p>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={data.businessName || ''}
          onChange={(e) => onChange('businessName', e.target.value)}
          placeholder="e.g. Cornerstone Bakery, Apex Electric"
          className="mt-2 block w-full rounded-lg border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#172830] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] shadow-xs focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:ring-1 focus:ring-[#16866F] dark:focus:ring-[#65D6B2] focus:outline-none"
        />
      </div>

      {/* Business Category */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
          Business Category <span className="text-red-500">*</span>
        </label>
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {CATEGORIES.map(({ id, label }) => {
            const isSelected = data.category === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange('category', id)}
                className={`flex items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                  isSelected
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-emerald-950/40 text-slate-900 dark:text-white ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:border-slate-300 dark:hover:border-[#3A535D] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                }`}
              >
                <div className="shrink-0">
                  <CategoryIllustration category={id} size="sm" selected={isSelected} />
                </div>
                <span className="text-xs font-medium sm:text-sm">{label}</span>
              </button>
            );
          })}
        </div>
        {getFieldError('category') && (
          <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('category')}</p>
        )}
      </div>

      {/* Location (Country and City/Area) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="block text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="country"
            name="country"
            value={data.country || ''}
            onChange={(e) => onChange('country', e.target.value)}
            placeholder="e.g. United States, United Kingdom, Canada"
            className={`mt-2 block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] shadow-xs focus:ring-1 focus:outline-none ${
              getFieldError('country')
                ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 dark:border-[#304650] bg-white dark:bg-[#172830] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:ring-[#16866F] dark:focus:ring-[#65D6B2]'
            }`}
          />
          {getFieldError('country') && (
            <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('country')}</p>
          )}
        </div>

        <div>
          <label htmlFor="cityArea" className="block text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
            City, Town or Service Area <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="cityArea"
            name="cityArea"
            value={data.cityArea || ''}
            onChange={(e) => onChange('cityArea', e.target.value)}
            placeholder="e.g. Austin, TX or North London"
            className={`mt-2 block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] shadow-xs focus:ring-1 focus:outline-none ${
              getFieldError('cityArea')
                ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
                : 'border-slate-300 dark:border-[#304650] bg-white dark:bg-[#172830] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:ring-[#16866F] dark:focus:ring-[#65D6B2]'
            }`}
          />
          {getFieldError('cityArea') && (
            <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('cityArea')}</p>
          )}
        </div>
      </div>

      {/* Business Model */}
      <div>
        <label className="block text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
          How do you serve customers? <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">
          This controls whether map pack listings or local service radius tips apply to you.
        </p>
        <div className="mt-3 space-y-2.5">
          {MODELS.map((model) => {
            const isSelected = data.businessModel === model.id;
            return (
              <label
                key={model.id}
                className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3.5 transition-all ${
                  isSelected
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-emerald-950/40 ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] hover:border-slate-300 dark:hover:border-[#3A535D]'
                }`}
              >
                <input
                  type="radio"
                  name="businessModel"
                  value={model.id}
                  checked={isSelected}
                  onChange={() => onChange('businessModel', model.id)}
                  className="mt-1 h-4 w-4 text-[#16866F] dark:text-[#65D6B2] focus:ring-[#16866F]"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">{model.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-[#B5C5C7]">{model.desc}</span>
                </div>
              </label>
            );
          })}
        </div>
        {getFieldError('businessModel') && (
          <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('businessModel')}</p>
        )}
      </div>

      {/* Ideal Customer (Optional) */}
      <div>
        <label htmlFor="targetCustomers" className="block text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
          Target Customers <span className="text-xs font-normal text-slate-500 dark:text-[#91A5A9]">(Optional)</span>
        </label>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">Who is your ideal customer?</p>
        <input
          type="text"
          id="targetCustomers"
          name="targetCustomers"
          value={data.targetCustomers || ''}
          onChange={(e) => onChange('targetCustomers', e.target.value)}
          placeholder="e.g. Local families, busy professionals, homeowners in need of repair"
          className="mt-2 block w-full rounded-lg border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#172830] px-3.5 py-2.5 text-sm text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] shadow-xs focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:ring-1 focus:ring-[#16866F] dark:focus:ring-[#65D6B2] focus:outline-none"
        />
      </div>
    </div>
  );
};
