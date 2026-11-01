import React from 'react';
import { AssessmentAnswers, YesNoNotSure, ValidationError } from '../../types/assessment';
import { UtensilsCrossed, Sparkles, Stethoscope, Wrench, Store, Briefcase } from 'lucide-react';

interface Step3FoundationsProps {
  data: Partial<AssessmentAnswers>;
  errors: ValidationError[];
  onChange: (field: keyof AssessmentAnswers, value: any) => void;
}

const DISCOVERY_OPTIONS = [
  { id: 'word_of_mouth', label: 'Word of mouth / Friend referral' },
  { id: 'walk_in', label: 'Walk-ins / Street visibility' },
  { id: 'google_search', label: 'Google Search / Maps' },
  { id: 'social_media', label: 'Social media (Instagram, Facebook, etc.)' },
  { id: 'directories', label: 'Local business directories or Yelp' },
  { id: 'flyers_print', label: 'Flyers, print or local paper' },
  { id: 'repeat_clients', label: 'Past repeat customers' },
  { id: 'other', label: 'Other source' },
];

interface QuestionDef {
  field: keyof AssessmentAnswers;
  title: string;
  explanation: string;
  showCondition?: (data: Partial<AssessmentAnswers>) => boolean;
}

const GENERAL_QUESTIONS: QuestionDef[] = [
  {
    field: 'contactConsistent',
    title: 'Are your business contact details consistent online?',
    explanation: 'Check if your exact phone number, street address (or service area), and opening hours match on Google, Facebook, and your website.',
  },
  {
    field: 'askForReviews',
    title: 'Do you routinely invite satisfied customers to leave honest reviews?',
    explanation: 'Having an easy, compliant routine to ask for reviews creates trustworthy social proof that boosts local rank and conversions.',
  },
  {
    field: 'websiteDetailsClear',
    title: 'Does your website clearly explain your services, location/coverage, and contact options?',
    explanation: 'Can a first-time mobile visitor verify within 5 seconds what you do, where you operate, and how to reach you?',
    showCondition: (d) => d.hasWebsite === 'yes',
  },
  {
    field: 'clearConversionAction',
    title: 'Do you have a clear primary call to action for prospective customers?',
    explanation: 'Such as a direct "Call Now", "Book Appointment", "View Today’s Menu", or "Request a Quote" button on your profiles and site.',
  },
  {
    field: 'publishesContent',
    title: 'Do you regularly publish helpful answers, updates, or educational content?',
    explanation: 'Examples: seasonal tips, answers to top customer questions, or photos of recent work that demonstrate your expertise.',
  },
  {
    field: 'tracksMarketing',
    title: 'Do you track how new customers find you and which marketing efforts work?',
    explanation: 'Such as noting customer referral sources in a logbook or tally sheet to understand where your best inquiries originate.',
  },
];

interface CategorySpecificSection {
  category: string;
  title: string;
  badge: string;
  icon: any;
  questions: QuestionDef[];
}

const CATEGORY_SECTIONS: CategorySpecificSection[] = [
  {
    category: 'restaurant_cafe',
    title: 'Dining, Menu & Visit Details',
    badge: 'Restaurant & Cafe Specific',
    icon: UtensilsCrossed,
    questions: [
      {
        field: 'restaurantOnlineMenu',
        title: 'Is your full menu easily readable as plain text on mobile with accurate pricing?',
        explanation: 'Avoid low-res PDF or blurry chalkboard photos; hungry mobile searchers need to scan items and prices instantly.',
      },
      {
        field: 'restaurantHoursLocationClear',
        title: 'Can customers easily find your kitchen hours, parking options, and reservation or pickup links?',
        explanation: 'Clarifies kitchen closing times, parking instructions, and whether reservations or takeout orders can be placed online.',
      },
    ],
  },
  {
    category: 'salon_wellness',
    title: 'Service Menu, Pricing & Booking',
    badge: 'Salon & Spa Specific',
    icon: Sparkles,
    questions: [
      {
        field: 'salonServicePriceListOnline',
        title: 'Can customers find an upfront service list with starting prices and expected durations online?',
        explanation: 'Clients hesitate to book when service pricing or treatment durations are hidden or vague.',
      },
      {
        field: 'salonOnlineBookingAvailable',
        title: 'Can clients easily book appointments online or initiate a 1-tap direct messaging inquiry?',
        explanation: 'Allows scheduling outside normal working hours without playing phone tag while you are serving clients.',
      },
    ],
  },
  {
    category: 'health_clinic',
    title: 'Patient Intake, Credentials & Insurance',
    badge: 'Clinic & Healthcare Specific',
    icon: Stethoscope,
    questions: [
      {
        field: 'clinicAppointmentInfoClear',
        title: 'Are new patient booking instructions, consultation options, and emergency details clearly available?',
        explanation: 'Reassures patients on whether you accept new patients and how intake is scheduled.',
      },
      {
        field: 'clinicCredentialsInsuranceClear',
        title: 'Are practitioner qualifications, medical licenses, and accepted insurance networks listed upfront?',
        explanation: 'Trust and insurance coverage compatibility are decisive factors before a patient schedules.',
      },
    ],
  },
  {
    category: 'home_trades',
    title: 'Service Areas, Travel Policies & Estimates',
    badge: 'Home Services & Trades Specific',
    icon: Wrench,
    questions: [
      {
        field: 'homeServiceAreaClarified',
        title: 'Are your exact service areas, traveling radius, and call-out terms clearly explained?',
        explanation: 'Homeowners need immediate confirmation that you travel to their specific suburb or postal code.',
      },
      {
        field: 'homeServiceEmergencyOrQuoteForm',
        title: 'Can homeowners request a quick quote with photos or easily tap to call for emergency repairs?',
        explanation: 'Letting clients send a photo of the repair saves diagnostics time and speeds up job estimates.',
      },
    ],
  },
  {
    category: 'retail',
    title: 'Product Discovery, Store Hours & Parking',
    badge: 'Retail & Store Specific',
    icon: Store,
    questions: [
      {
        field: 'retailProductDiscoveryOnline',
        title: 'Can customers discover your top in-store product brands, categories, or featured inventory online?',
        explanation: 'Shoppers check nearby stores online before making a physical trip to verify product availability.',
      },
      {
        field: 'retailStoreHoursParkingClear',
        title: 'Are current store hours, holiday schedules, and parking directions clearly highlighted?',
        explanation: 'Eliminates friction so shoppers know when doors are open and where to park conveniently.',
      },
    ],
  },
  {
    category: 'professional_services',
    title: 'Consultations, Credentials & Client Results',
    badge: 'Professional & Office Specific',
    icon: Briefcase,
    questions: [
      {
        field: 'professionalInitialConsultationOffer',
        title: 'Do you offer a clear introductory consultation overview and client engagement process?',
        explanation: 'De-risks the first step by explaining consultation format, duration, and what clients should prepare.',
      },
    ],
  },
];

export const Step3Foundations: React.FC<Step3FoundationsProps> = ({ data, errors, onChange }) => {
  const getFieldError = (field: string) => errors.find((e) => e.field === field)?.message;

  const handleDiscoveryToggle = (id: string) => {
    const current = data.discoveryMethods || [];
    if (current.includes(id)) {
      onChange(
        'discoveryMethods',
        current.filter((item) => item !== id)
      );
    } else {
      onChange('discoveryMethods', [...current, id]);
    }
  };

  const activeCategorySection = CATEGORY_SECTIONS.find((sec) => sec.category === data.category);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5] sm:text-2xl">
          Marketing Foundations
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-[#B5C5C7]">
          These questions assess the core visibility, trust, and conversion habits of your business.
        </p>
      </div>

      {/* Discovery Channels */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <label className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">
          How do customers currently find or hear about your business? <span className="text-red-500">*</span>
        </label>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">
          Select all that apply. This helps us identify untapped discovery channels.
        </p>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {DISCOVERY_OPTIONS.map((opt) => {
            const isChecked = (data.discoveryMethods || []).includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex cursor-pointer items-center gap-2.5 rounded-lg border p-3 text-xs font-medium transition-all ${
                  isChecked
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-emerald-950/40 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleDiscoveryToggle(opt.id)}
                  className="h-4 w-4 rounded border-slate-300 dark:border-[#304650] text-[#16866F] focus:ring-[#16866F]"
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
        {getFieldError('discoveryMethods') && (
          <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{getFieldError('discoveryMethods')}</p>
        )}
      </div>

      {/* Conditional Category-Specific Section */}
      {activeCategorySection && (
        <div className="rounded-xl border border-emerald-200/90 dark:border-emerald-800/60 bg-[#DFF5EA]/20 dark:bg-emerald-950/20 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16866F] text-white">
              <activeCategorySection.icon className="h-4 w-4" />
            </div>
            <div>
              <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[10px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                {activeCategorySection.badge}
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] mt-0.5">
                {activeCategorySection.title}
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-[#B5C5C7]">
            Tailored questions for your business type. Only answer what applies to you.
          </p>

          <div className="space-y-4 pt-1">
            {activeCategorySection.questions.map((q) => {
              const currentVal = (data[q.field] as YesNoNotSure) || '';
              const fieldError = getFieldError(q.field);

              return (
                <div key={q.field} className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs">
                  <label className="block text-xs font-bold text-slate-900 dark:text-[#F2F7F5] sm:text-sm">
                    {q.title}
                  </label>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">{q.explanation}</p>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(
                      [
                        { value: 'yes', label: 'Yes' },
                        { value: 'no', label: 'No' },
                        { value: 'not_sure', label: 'Not sure' },
                        { value: 'not_applicable', label: 'Not applicable' },
                      ] as { value: YesNoNotSure; label: string }[]
                    ).map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex cursor-pointer items-center justify-center rounded-lg border p-2 text-center text-xs font-medium transition-all ${
                          currentVal === opt.value
                            ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/40 dark:bg-emerald-950/50 text-slate-900 dark:text-white ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                            : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.field}
                          value={opt.value}
                          checked={currentVal === opt.value}
                          onChange={() => onChange(q.field, opt.value)}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  {fieldError && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{fieldError}</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* General Foundations Questions */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">General Foundations</h3>
        {GENERAL_QUESTIONS.map((q) => {
          if (q.showCondition && !q.showCondition(data)) {
            return null;
          }

          const currentVal = (data[q.field] as YesNoNotSure) || '';
          const fieldError = getFieldError(q.field);

          return (
            <div key={q.field} className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
              <label className="block text-sm font-semibold text-slate-900 dark:text-[#F2F7F5]">
                {q.title} <span className="text-red-500">*</span>
              </label>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">{q.explanation}</p>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {(
                  [
                    { value: 'yes', label: 'Yes' },
                    { value: 'no', label: 'No' },
                    { value: 'not_sure', label: 'Not sure' },
                    { value: 'not_applicable', label: 'Not applicable' },
                  ] as { value: YesNoNotSure; label: string }[]
                ).map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border p-2.5 text-center text-xs font-medium transition-all ${
                      currentVal === opt.value
                        ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/40 dark:bg-emerald-950/50 text-slate-900 dark:text-white ring-1 ring-[#16866F] dark:ring-[#65D6B2]'
                        : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={q.field}
                      value={opt.value}
                      checked={currentVal === opt.value}
                      onChange={() => onChange(q.field, opt.value)}
                      className="sr-only"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {fieldError && <p className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{fieldError}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
