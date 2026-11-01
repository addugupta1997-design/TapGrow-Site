import React from 'react';

interface AssessmentStepIllustrationProps {
  step: 1 | 2 | 3 | 4;
  className?: string;
  size?: number;
}

export const AssessmentStepIllustration: React.FC<AssessmentStepIllustrationProps> = ({
  step,
  className = '',
  size = 48,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soft background aura */}
        <circle
          cx="24"
          cy="24"
          r="20"
          className="fill-emerald-50/80 dark:fill-[#223640] stroke-slate-200 dark:stroke-[#304650]"
          strokeWidth="1.25"
        />

        {step === 1 && (
          <g>
            {/* Step 1: Business Basics Storefront */}
            <path d="M12 21 L36 21 L33 13 L15 13 Z" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <rect x="14" y="21" width="20" height="15" rx="1.5" className="fill-white dark:fill-[#1D3039] stroke-slate-300 dark:stroke-[#304650]" strokeWidth="1" />
            <rect x="17" y="25" width="6" height="7" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            <rect x="25" y="25" width="6" height="11" rx="1" className="fill-amber-400 dark:fill-amber-300" />
          </g>
        )}

        {step === 2 && (
          <g>
            {/* Step 2: Online Presence Browser & Beacon */}
            <rect x="11" y="13" width="26" height="20" rx="2.5" className="fill-white dark:fill-[#1D3039] stroke-slate-300 dark:stroke-[#304650]" strokeWidth="1.2" />
            <circle cx="15" cy="17" r="1" className="fill-red-400" />
            <circle cx="18" cy="17" r="1" className="fill-amber-400" />
            <circle cx="21" cy="17" r="1" className="fill-[#65D6B2]" />
            <line x1="11" y1="20" x2="37" y2="20" className="stroke-slate-200 dark:stroke-[#304650]" strokeWidth="1" />
            {/* Connected map pin */}
            <circle cx="28" cy="27" r="5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <circle cx="28" cy="27" r="2" fill="white" />
          </g>
        )}

        {step === 3 && (
          <g>
            {/* Step 3: Marketing Foundations Shield & Stars */}
            <path
              d="M24 12 L34 16.5 C34 24 28.5 29 24 33 C19.5 29 14 24 14 16.5 Z"
              className="fill-white dark:fill-[#1D3039] stroke-[#16866F] dark:stroke-[#65D6B2]"
              strokeWidth="1.5"
            />
            {/* 5-Star center mark */}
            <polygon
              points="24,18 25.5,22 29,22 26.2,24.2 27.3,28 24,25.8 20.7,28 21.8,24.2 19,22 22.5,22"
              className="fill-amber-400 dark:fill-amber-300"
            />
          </g>
        )}

        {step === 4 && (
          <g>
            {/* Step 4: Goals & Capacity Target */}
            <circle cx="24" cy="24" r="13" className="stroke-[#16866F] dark:stroke-[#65D6B2]" strokeWidth="1.5" fill="none" />
            <circle cx="24" cy="24" r="8" className="stroke-amber-400 dark:stroke-amber-300" strokeWidth="1.5" fill="none" />
            <circle cx="24" cy="24" r="3" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            {/* Arrow dart */}
            <line x1="33" y1="15" x2="26" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-slate-700 dark:text-[#F2F7F5]" />
            <polygon points="36,12 30,14 34,18" className="fill-amber-500 dark:fill-amber-400" />
          </g>
        )}
      </svg>
    </div>
  );
};
