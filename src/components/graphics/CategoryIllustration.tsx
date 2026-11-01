import React from 'react';
import { BusinessCategory } from '../../types/assessment';

interface CategoryIllustrationProps {
  category: BusinessCategory | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  selected?: boolean;
}

export const CategoryIllustration: React.FC<CategoryIllustrationProps> = ({
  category,
  size = 'md',
  className = '',
  selected = false,
}) => {
  const pixelSizes = {
    sm: 36,
    md: 48,
    lg: 72,
  };

  const px = pixelSizes[size];

  // Common SVG wrapper
  const renderCategoryGraphic = () => {
    switch (category) {
      case 'restaurant_cafe':
        return (
          <g>
            {/* Awning / Canopy */}
            <path
              d="M12 26 L52 26 L48 16 L16 16 Z"
              className={selected ? 'fill-[#16866F] dark:fill-[#65D6B2]' : 'fill-[#16866F]/80 dark:fill-[#65D6B2]/80'}
            />
            {/* Scalloped edge */}
            <path
              d="M12 26 Q16 30 20 26 Q24 30 28 26 Q32 30 36 26 Q40 30 44 26 Q48 30 52 26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
            {/* Shopfront frame */}
            <rect
              x="16"
              y="28"
              width="32"
              height="22"
              rx="2"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Warm Coffee Cup / Bistro Cloche */}
            <path
              d="M24 40 L34 40 C34 45 24 45 24 40 Z"
              className="fill-amber-400 dark:fill-amber-300"
            />
            <path
              d="M34 41 C36 41 37 42 37 43 C37 44 36 45 34 45"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-amber-500 dark:text-amber-400"
            />
            {/* Steam curves */}
            <path
              d="M27 36 Q28 34 27 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
            <path
              d="M31 37 Q32 35 31 33"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
            {/* Menu badge */}
            <rect
              x="38"
              y="34"
              width="6"
              height="9"
              rx="1"
              className="fill-white dark:fill-[#172830] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1"
            />
            <line x1="40" y1="36" x2="42" y2="36" className="stroke-[#16866F] dark:stroke-[#65D6B2]" strokeWidth="1" />
            <line x1="40" y1="39" x2="42" y2="39" className="stroke-slate-300 dark:stroke-[#304650]" strokeWidth="1" />
          </g>
        );

      case 'salon_wellness':
        return (
          <g>
            {/* Arched Vanity Mirror */}
            <path
              d="M20 48 L20 28 A12 12 0 0 1 44 28 L44 48 Z"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Mirror reflection gleam */}
            <path
              d="M26 24 L38 36"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              className="text-[#16866F]/50 dark:text-[#65D6B2]/50"
            />
            {/* Botanical spa sprig */}
            <path
              d="M16 46 Q22 36 26 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
            <ellipse cx="20" cy="39" rx="3" ry="1.5" transform="rotate(-30 20 39)" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <ellipse cx="23" cy="33" rx="3" ry="1.5" transform="rotate(-20 23 33)" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            {/* Styling scissors emblem */}
            <circle cx="36" cy="42" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-amber-500 dark:text-amber-400" />
            <circle cx="42" cy="42" r="3" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-amber-500 dark:text-amber-400" />
            <line x1="37" y1="40" x2="45" y2="32" stroke="currentColor" strokeWidth="1.2" className="text-amber-500 dark:text-amber-400" />
            <line x1="41" y1="40" x2="33" y2="32" stroke="currentColor" strokeWidth="1.2" className="text-amber-500 dark:text-amber-400" />
          </g>
        );

      case 'health_clinic':
        return (
          <g>
            {/* Modern Clinic Facade */}
            <rect
              x="16"
              y="18"
              width="32"
              height="32"
              rx="3"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Medical Shield Badge */}
            <rect
              x="26"
              y="24"
              width="12"
              height="12"
              rx="2"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            {/* White cross */}
            <path
              d="M32 27 L32 33 M29 30 L35 30"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Stethoscope curl */}
            <path
              d="M20 40 C20 45 28 47 32 45 C36 43 40 43 44 46"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-amber-500 dark:text-amber-400"
            />
            <circle cx="44" cy="46" r="2" className="fill-amber-500 dark:fill-amber-400" />
            {/* Ground entrance */}
            <rect x="28" y="42" width="8" height="8" className="fill-slate-300 dark:fill-[#172830]" />
          </g>
        );

      case 'home_trades':
        return (
          <g>
            {/* House roof pitch */}
            <path
              d="M14 30 L32 16 L50 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
            {/* House base */}
            <rect
              x="18"
              y="30"
              width="28"
              height="20"
              rx="2"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Crossed Service Tools (Wrench + Ruler) */}
            <line
              x1="26"
              y1="44"
              x2="38"
              y2="32"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-amber-500 dark:text-amber-400"
            />
            <circle cx="26" cy="44" r="2.5" className="fill-amber-500 dark:fill-amber-400" />
            {/* Map pin beacon on roof */}
            <path
              d="M32 20 C30 20 29 21.5 29 23 C29 25 32 28 32 28 C32 28 35 25 35 23 C35 21.5 34 20 32 20 Z"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            <circle cx="32" cy="23" r="1" fill="white" />
          </g>
        );

      case 'professional_services':
        return (
          <g>
            {/* Architectural Office building */}
            <rect
              x="18"
              y="16"
              width="28"
              height="34"
              rx="2"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Grid windows */}
            <rect x="22" y="21" width="5" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            <rect x="30" y="21" width="5" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            <rect x="38" y="21" width="5" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            <rect x="22" y="29" width="5" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            <rect x="30" y="29" width="5" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            <rect x="38" y="29" width="5" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            {/* Briefcase badge floating foreground */}
            <rect
              x="30"
              y="38"
              width="18"
              height="13"
              rx="2"
              className="fill-[#16866F] dark:fill-[#65D6B2] shadow-sm"
            />
            <path
              d="M36 38 L36 36 C36 35 37 34 38 34 L40 34 C41 34 42 35 42 36 L42 38"
              fill="none"
              stroke="white"
              strokeWidth="1.2"
            />
            <circle cx="39" cy="44" r="1" fill="white" />
          </g>
        );

      case 'fitness':
        return (
          <g>
            {/* Dumbbell / Shield Studio */}
            <rect
              x="18"
              y="24"
              width="8"
              height="16"
              rx="3"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            <rect
              x="38"
              y="24"
              width="8"
              height="16"
              rx="3"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            <line
              x1="26"
              y1="32"
              x2="38"
              y2="32"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="text-slate-400 dark:text-[#3A535D]"
            />
            {/* Dynamic Energy Lightning / Momentum ring */}
            <path
              d="M32 16 L28 28 L35 28 L30 46 L37 33 L31 33 Z"
              className="fill-amber-400 dark:fill-amber-300"
            />
            {/* Stopwatch dial outline */}
            <circle
              cx="32"
              cy="32"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="text-slate-300 dark:text-[#304650]"
            />
          </g>
        );

      case 'other_local':
        return (
          <g>
            {/* Historic Local storefront / Landmark */}
            <path
              d="M16 26 L32 16 L48 26 Z"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            <rect
              x="18"
              y="26"
              width="28"
              height="22"
              rx="2"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Columns */}
            <line x1="23" y1="28" x2="23" y2="44" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-[#304650]" />
            <line x1="41" y1="28" x2="41" y2="44" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 dark:text-[#304650]" />
            {/* 5-Star reputation emblem in center */}
            <circle cx="32" cy="35" r="5" className="fill-amber-400 dark:fill-amber-300" />
            <polygon
              points="32,32 33,34 35,34 33.5,35.5 34,37.5 32,36 30,37.5 30.5,35.5 29,34 31,34"
              fill="white"
            />
          </g>
        );

      case 'retail':
      default:
        return (
          <g>
            {/* Retail Store Awning */}
            <path
              d="M14 26 L50 26 L46 16 L18 16 Z"
              className={selected ? 'fill-[#16866F] dark:fill-[#65D6B2]' : 'fill-[#16866F]/80 dark:fill-[#65D6B2]/80'}
            />
            {/* Shopfront body */}
            <rect
              x="16"
              y="26"
              width="32"
              height="24"
              rx="2"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Display window */}
            <rect
              x="20"
              y="30"
              width="14"
              height="15"
              rx="1.5"
              className="fill-white dark:fill-[#172830] stroke-slate-200 dark:stroke-[#304650]"
              strokeWidth="1"
            />
            {/* Shopping Bag with handles */}
            <rect
              x="36"
              y="32"
              width="12"
              height="14"
              rx="2"
              className="fill-amber-400 dark:fill-amber-300"
            />
            <path
              d="M39 32 C39 29 45 29 45 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-amber-600 dark:text-amber-500"
            />
            {/* Price Tag badge */}
            <circle cx="27" cy="37" r="3" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <line x1="27" y1="36" x2="27" y2="38" stroke="white" strokeWidth="1" />
          </g>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 transition-transform duration-200 ${
        selected ? 'scale-105' : 'hover:scale-102'
      } ${className}`}
      style={{ width: px, height: px }}
    >
      <svg
        viewBox="0 0 64 64"
        width={px}
        height={px}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Soft background disk */}
        <circle
          cx="32"
          cy="32"
          r="26"
          className={
            selected
              ? 'fill-[#DFF5EA] dark:fill-[#16866F]/25 stroke-[#16866F] dark:stroke-[#65D6B2]'
              : 'fill-slate-50 dark:fill-[#1D3039] stroke-slate-200 dark:stroke-[#304650]'
          }
          strokeWidth="1.25"
        />

        {/* Detailed vector category illustration */}
        {renderCategoryGraphic()}
      </svg>
    </div>
  );
};
