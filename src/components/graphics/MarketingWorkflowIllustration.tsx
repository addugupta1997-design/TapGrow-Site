import React from 'react';

interface WorkflowStepProps {
  step: 1 | 2 | 3;
  className?: string;
}

export const WorkflowStepIllustration: React.FC<WorkflowStepProps> = ({ step, className = '' }) => {
  switch (step) {
    case 1:
      // STEP 1 — Tell Us About Your Business
      return (
        <div className={`relative w-full max-w-[280px] mx-auto ${className}`}>
          <svg viewBox="0 0 280 180" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background card canvas */}
            <rect
              x="20"
              y="20"
              width="240"
              height="140"
              rx="12"
              className="fill-slate-50 dark:fill-[#223640] stroke-slate-200 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Storefront silhouette background */}
            <path
              d="M36 60 L76 60 L72 45 L40 45 Z"
              className="fill-[#16866F]/20 dark:fill-[#65D6B2]/20"
            />
            <rect x="38" y="60" width="36" height="24" rx="2" className="fill-white dark:fill-[#1D3039]" />
            <circle cx="56" cy="72" r="4" className="fill-amber-400 dark:fill-amber-300" />

            {/* Assessment Questionnaire Sheet */}
            <g transform="translate(90, 36)">
              <rect
                width="154"
                height="108"
                rx="8"
                className="fill-white dark:fill-[#1D3039] stroke-slate-200 dark:stroke-[#304650] shadow-sm"
                strokeWidth="1.25"
              />
              {/* Question 1 Pill */}
              <circle cx="18" cy="24" r="5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
              <path d="M16 24 L17.5 25.5 L20 22.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="28" y="21" width="70" height="6" rx="3" className="fill-slate-700 dark:fill-[#F2F7F5]" />
              <rect x="104" y="19" width="36" height="10" rx="5" className="fill-[#DFF5EA] dark:fill-[#16866F]/40" />

              {/* Question 2 Pill */}
              <circle cx="18" cy="48" r="5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
              <path d="M16 48 L17.5 49.5 L20 46.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
              <rect x="28" y="45" width="85" height="6" rx="3" className="fill-slate-700 dark:fill-[#F2F7F5]" />

              {/* Question 3 Radio Options */}
              <circle cx="18" cy="72" r="5" className="stroke-slate-300 dark:stroke-[#304650] fill-white dark:fill-[#172830]" strokeWidth="1.2" />
              <rect x="28" y="69" width="55" height="6" rx="3" className="fill-slate-400 dark:fill-[#91A5A9]" />

              {/* Active selection cursor */}
              <path
                d="M100 78 L108 84 L104 85 L106 88 L103 89 L101 86 L98 88 Z"
                className="fill-[#16866F] dark:fill-[#65D6B2]"
              />
            </g>
          </svg>
        </div>
      );

    case 2:
      // STEP 2 — Discover Your Opportunities
      return (
        <div className={`relative w-full max-w-[280px] mx-auto ${className}`}>
          <svg viewBox="0 0 280 180" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="20"
              y="20"
              width="240"
              height="140"
              rx="12"
              className="fill-slate-50 dark:fill-[#223640] stroke-slate-200 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Circular Readiness Gauge */}
            <g transform="translate(42, 45)">
              <circle cx="45" cy="45" r="36" fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-[#172830]" />
              <circle
                cx="45"
                cy="45"
                r="36"
                fill="none"
                stroke="#16866F"
                className="dark:stroke-[#65D6B2]"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="226"
                strokeDashoffset="65"
                transform="rotate(-90 45 45)"
              />
              <text x="45" y="44" textAnchor="middle" className="fill-slate-900 dark:fill-[#F2F7F5] font-mono text-lg font-black">
                71
              </text>
              <text x="45" y="58" textAnchor="middle" className="fill-[#16866F] dark:fill-[#65D6B2] font-sans text-[8px] font-bold uppercase">
                Score
              </text>
            </g>

            {/* Opportunity Diagnostic Cards */}
            <g transform="translate(142, 38)">
              {/* High Opportunity item */}
              <rect width="105" height="26" rx="6" className="fill-white dark:fill-[#1D3039] stroke-slate-200 dark:stroke-[#304650]" strokeWidth="1" />
              <circle cx="12" cy="13" r="3.5" className="fill-amber-400 dark:fill-amber-300" />
              <rect x="22" y="10" width="65" height="5" rx="2" className="fill-slate-800 dark:fill-[#F2F7F5]" />

              {/* Strength verified item */}
              <g transform="translate(0, 32)">
                <rect width="105" height="26" rx="6" className="fill-white dark:fill-[#1D3039] stroke-slate-200 dark:stroke-[#304650]" strokeWidth="1" />
                <circle cx="12" cy="13" r="3.5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
                <rect x="22" y="10" width="55" height="5" rx="2" className="fill-slate-800 dark:fill-[#F2F7F5]" />
              </g>

              {/* Opportunity item 2 */}
              <g transform="translate(0, 64)">
                <rect width="105" height="26" rx="6" className="fill-white dark:fill-[#1D3039] stroke-slate-200 dark:stroke-[#304650]" strokeWidth="1" />
                <circle cx="12" cy="13" r="3.5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
                <rect x="22" y="10" width="70" height="5" rx="2" className="fill-slate-800 dark:fill-[#F2F7F5]" />
              </g>
            </g>
          </svg>
        </div>
      );

    case 3:
      // STEP 3 — Grow With A Clear Plan
      return (
        <div className={`relative w-full max-w-[280px] mx-auto ${className}`}>
          <svg viewBox="0 0 280 180" className="w-full h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect
              x="20"
              y="20"
              width="240"
              height="140"
              rx="12"
              className="fill-slate-50 dark:fill-[#223640] stroke-slate-200 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Weekly Sprint Calendar */}
            <g transform="translate(36, 36)">
              <rect
                width="208"
                height="108"
                rx="8"
                className="fill-white dark:fill-[#1D3039] stroke-slate-200 dark:stroke-[#304650]"
                strokeWidth="1.25"
              />
              {/* Header: Week 1 & checkmark */}
              <rect x="12" y="12" width="60" height="8" rx="4" className="fill-[#16866F] dark:fill-[#65D6B2]" />
              <text x="14" y="18" className="fill-white font-sans text-[7px] font-bold">
                WEEK 1 FOCUS
              </text>

              {/* Task Row 1: Completed */}
              <g transform="translate(12, 28)">
                <circle cx="6" cy="6" r="5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
                <path d="M4 6 L5.5 7.5 L8 4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                <rect x="18" y="3" width="115" height="5" rx="2" className="fill-slate-400 dark:fill-[#91A5A9]" />
                <text x="140" y="7" className="fill-[#16866F] dark:fill-[#65D6B2] font-sans text-[7px] font-bold">Done</text>
              </g>

              {/* Task Row 2: In Progress */}
              <g transform="translate(12, 46)">
                <circle cx="6" cy="6" r="5" className="fill-amber-400 dark:fill-amber-300" />
                <circle cx="6" cy="6" r="1.5" fill="white" />
                <rect x="18" y="3" width="130" height="5" rx="2" className="fill-slate-800 dark:fill-[#F2F7F5]" />
              </g>

              {/* Task Row 3: Next Step */}
              <g transform="translate(12, 64)">
                <circle cx="6" cy="6" r="5" className="stroke-slate-300 dark:stroke-[#304650] fill-white dark:fill-[#172830]" strokeWidth="1" />
                <rect x="18" y="3" width="95" height="5" rx="2" className="fill-slate-600 dark:fill-[#B5C5C7]" />
              </g>

              {/* Bottom Progress Bar */}
              <rect x="12" y="86" width="184" height="6" rx="3" className="fill-slate-100 dark:fill-[#172830]" />
              <rect x="12" y="86" width="135" height="6" rx="3" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            </g>
          </svg>
        </div>
      );
  }
};
