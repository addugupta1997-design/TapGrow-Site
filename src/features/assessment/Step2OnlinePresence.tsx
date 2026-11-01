import React from 'react';
import { AssessmentAnswers, SocialPresence, YesNoNotSure, ValidationError } from '../../types/assessment';
import { Globe, MapPin, Share2 } from 'lucide-react';

interface Step2OnlinePresenceProps {
  data: Partial<AssessmentAnswers>;
  errors: ValidationError[];
  onChange: (field: keyof AssessmentAnswers, value: any) => void;
}

const SOCIAL_PLATFORMS = [
  'Instagram',
  'Facebook',
  'LinkedIn',
  'TikTok',
  'YouTube',
  'X (Twitter)',
  'Pinterest',
  'Other',
];

export const Step2OnlinePresence: React.FC<Step2OnlinePresenceProps> = ({ data, errors, onChange }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  const handlePlatformToggle = (platform: string) => {
    const current = data.mainSocialPlatforms || [];
    if (current.includes(platform)) {
      onChange(
        'mainSocialPlatforms',
        current.filter((p) => p !== platform)
      );
    } else {
      onChange('mainSocialPlatforms', [...current, platform]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5] sm:text-2xl">
          Online Presence
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#B5C5C7]">
          Tell us where potential customers can discover information about your business online.
        </p>
      </div>

      {/* Website question */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2]">
            <Globe className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">
              Do you have an active business website? <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">
              Even a simple 1-page site counts. If you only have a Facebook page, select No.
            </p>

            <div className="mt-3 flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-[#B5C5C7]">
                <input
                  type="radio"
                  name="hasWebsite"
                  value="yes"
                  checked={data.hasWebsite === 'yes'}
                  onChange={() => onChange('hasWebsite', 'yes')}
                  className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] focus:ring-[#16866F]"
                />
                Yes
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-[#B5C5C7]">
                <input
                  type="radio"
                  name="hasWebsite"
                  value="no"
                  checked={data.hasWebsite === 'no'}
                  onChange={() => {
                    onChange('hasWebsite', 'no');
                    onChange('websiteUrl', '');
                  }}
                  className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] focus:ring-[#16866F]"
                />
                No (or currently under construction)
              </label>
            </div>
            {getFieldError('hasWebsite') && (
              <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('hasWebsite')}</p>
            )}

            {data.hasWebsite === 'yes' && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#304650]">
                <label htmlFor="websiteUrl" className="block text-xs font-semibold text-slate-700 dark:text-[#B5C5C7]">
                  Website URL <span className="font-normal text-slate-400 dark:text-[#91A5A9]">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={data.websiteUrl || ''}
                  onChange={(e) => onChange('websiteUrl', e.target.value)}
                  placeholder="e.g. cornerstonebakery.com"
                  className={`mt-1.5 block w-full rounded-lg border px-3 py-2 text-sm text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] shadow-xs focus:ring-1 focus:outline-none ${
                    getFieldError('websiteUrl')
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500'
                      : 'border-slate-300 dark:border-[#304650] bg-white dark:bg-[#172830] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:ring-[#16866F] dark:focus:ring-[#65D6B2]'
                  }`}
                />
                {getFieldError('websiteUrl') && (
                  <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('websiteUrl')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Business Listing / Map Profile */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2]">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">
              Do you have a claimed Google Business Profile or map listing? <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">
              This is the listing that appears on Google Maps when someone searches for your business or category nearby.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(
                [
                  { value: 'yes', label: 'Yes, claimed' },
                  { value: 'no', label: 'No' },
                  { value: 'not_sure', label: 'Not sure' },
                  { value: 'not_applicable', label: 'Not applicable' },
                ] as { value: YesNoNotSure; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${
                    data.hasBusinessListing === opt.value
                      ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/40 dark:bg-emerald-950/50 text-slate-900 dark:text-white ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                      : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                  }`}
                >
                  <input
                    type="radio"
                    name="hasBusinessListing"
                    value={opt.value}
                    checked={data.hasBusinessListing === opt.value}
                    onChange={() => onChange('hasBusinessListing', opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {getFieldError('hasBusinessListing') && (
              <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('hasBusinessListing')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Presence */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2]">
            <Share2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">
              What is your current social media presence? <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">
              How actively do you maintain social channels for your business?
            </p>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {(
                [
                  { value: 'none', label: 'No active accounts' },
                  { value: 'one', label: 'One primary platform' },
                  { value: 'multiple', label: 'Multiple platforms' },
                ] as { value: SocialPresence; label: string }[]
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-center text-xs font-medium transition-all ${
                    data.socialPresence === opt.value
                      ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/40 dark:bg-emerald-950/50 text-slate-900 dark:text-white ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                      : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                  }`}
                >
                  <input
                    type="radio"
                    name="socialPresence"
                    value={opt.value}
                    checked={data.socialPresence === opt.value}
                    onChange={() => onChange('socialPresence', opt.value)}
                    className="sr-only"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
            {getFieldError('socialPresence') && (
              <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('socialPresence')}</p>
            )}

            {data.socialPresence && data.socialPresence !== 'none' && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#304650]">
                <span className="block text-xs font-semibold text-slate-700 dark:text-[#B5C5C7] mb-2">
                  Which platforms do you use? <span className="font-normal text-slate-400 dark:text-[#91A5A9]">(Optional)</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isChecked = (data.mainSocialPlatforms || []).includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handlePlatformToggle(platform)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                          isChecked
                            ? 'border-[#16866F] bg-[#16866F] text-white'
                            : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                        }`}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
