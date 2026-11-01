import React from 'react';

export type EmptyStateType = 'no_tasks' | 'all_completed' | 'no_assessment' | 'reset_cleared';

interface EmptyStateIllustrationProps {
  type?: EmptyStateType;
  size?: number;
  className?: string;
}

export const EmptyStateIllustration: React.FC<EmptyStateIllustrationProps> = ({
  type = 'no_tasks',
  size = 120,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soft radial background */}
        <circle
          cx="60"
          cy="60"
          r="50"
          className="fill-slate-50 dark:fill-[#223640] stroke-slate-200 dark:stroke-[#304650]"
          strokeWidth="1.5"
        />

        {type === 'no_tasks' && (
          <g>
            {/* Clipboard with clean task checklist */}
            <rect
              x="36"
              y="28"
              width="48"
              height="64"
              rx="6"
              className="fill-white dark:fill-[#1D3039] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Clipboard Top Clip */}
            <rect x="48" y="22" width="24" height="10" rx="3" className="fill-slate-300 dark:fill-[#3A535D]" />
            <circle cx="60" cy="27" r="2" fill="white" />

            {/* Checklist items */}
            <circle cx="46" cy="44" r="3.5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <line x1="54" y1="44" x2="74" y2="44" className="stroke-slate-300 dark:stroke-[#304650]" strokeWidth="2" strokeLinecap="round" />

            <circle cx="46" cy="58" r="3.5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <line x1="54" y1="58" x2="70" y2="58" className="stroke-slate-300 dark:stroke-[#304650]" strokeWidth="2" strokeLinecap="round" />

            <circle cx="46" cy="72" r="3.5" className="stroke-slate-300 dark:stroke-[#304650] fill-none" strokeWidth="1.5" />
            <line x1="54" y1="72" x2="66" y2="72" className="stroke-slate-300 dark:stroke-[#304650]" strokeWidth="2" strokeLinecap="round" />

            {/* Magnifying Glass */}
            <circle cx="78" cy="76" r="12" className="fill-white dark:fill-[#223640] stroke-[#16866F] dark:stroke-[#65D6B2]" strokeWidth="2" />
            <line x1="86" y1="85" x2="96" y2="95" className="stroke-amber-500 dark:stroke-amber-400" strokeWidth="3" strokeLinecap="round" />
            <circle cx="78" cy="76" r="5" className="fill-[#DFF5EA] dark:fill-[#16866F]/30" />
          </g>
        )}

        {type === 'all_completed' && (
          <g>
            {/* Stepped achievement podium */}
            <rect x="28" y="70" width="20" height="24" rx="2" className="fill-slate-200 dark:fill-[#172830]" />
            <rect x="48" y="58" width="24" height="36" rx="2" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <rect x="72" y="66" width="20" height="28" rx="2" className="fill-slate-200 dark:fill-[#172830]" />

            {/* Laurel Wreath / Golden Star */}
            <circle cx="60" cy="40" r="14" className="fill-amber-50 dark:fill-[#1D3039] stroke-amber-400 dark:stroke-amber-300" strokeWidth="1.5" strokeDasharray="3 2" />
            <polygon
              points="60,31 63,37 70,37 64.5,41 66.5,47 60,43.5 53.5,47 55.5,41 50,37 57,37"
              className="fill-amber-400 dark:fill-amber-300"
            />
            {/* Sparkles */}
            <circle cx="42" cy="30" r="2" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <circle cx="78" cy="28" r="2.5" className="fill-amber-400 dark:fill-amber-300" />
          </g>
        )}

        {type === 'no_assessment' && (
          <g>
            {/* Folded Map Canvas */}
            <polygon
              points="30,42 50,36 70,42 90,36 90,82 70,88 50,82 30,88"
              className="fill-white dark:fill-[#1D3039] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Waypoint path */}
            <path
              d="M38 72 Q52 64 60 62 T78 50"
              fill="none"
              stroke="#16866F"
              strokeWidth="2"
              strokeDasharray="3 3"
              className="dark:stroke-[#65D6B2]"
            />
            {/* Destination Flag */}
            <line x1="78" y1="40" x2="78" y2="54" className="stroke-slate-600 dark:stroke-[#F2F7F5]" strokeWidth="2" strokeLinecap="round" />
            <polygon points="78,40 92,45 78,50" className="fill-[#16866F] dark:fill-[#65D6B2]" />

            {/* Starting Compass Rose */}
            <circle cx="42" cy="72" r="8" className="fill-amber-400 dark:fill-amber-300" />
            <circle cx="42" cy="72" r="3" fill="white" />
          </g>
        )}

        {type === 'reset_cleared' && (
          <g>
            {/* Clean slate board with fresh ruler */}
            <rect
              x="32"
              y="32"
              width="56"
              height="56"
              rx="4"
              className="fill-white dark:fill-[#1D3039] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            <line x1="40" y1="46" x2="80" y2="46" className="stroke-slate-200 dark:stroke-[#304650]" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="60" x2="72" y2="60" className="stroke-slate-200 dark:stroke-[#304650]" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="74" x2="64" y2="74" className="stroke-slate-200 dark:stroke-[#304650]" strokeWidth="2" strokeLinecap="round" />

            {/* Refresh circular indicator */}
            <circle cx="82" cy="40" r="10" className="fill-[#DFF5EA] dark:fill-[#16866F]/30 stroke-[#16866F] dark:stroke-[#65D6B2]" strokeWidth="1.5" />
            <path
              d="M80 37 A4 4 0 1 1 84 43"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
          </g>
        )}
      </svg>
    </div>
  );
};
