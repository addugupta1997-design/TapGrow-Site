import React from 'react';
import { RecommendationCategory } from '../../types/recommendations';

interface TaskCategoryIllustrationProps {
  category: RecommendationCategory | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TaskCategoryIllustration: React.FC<TaskCategoryIllustrationProps> = ({
  category,
  size = 'md',
  className = '',
}) => {
  const pixelSizes = {
    sm: 24,
    md: 36,
    lg: 48,
  };

  const px = pixelSizes[size];

  const renderIcon = () => {
    switch (category) {
      case 'Local SEO':
        return (
          <g>
            {/* Map pin with radar waves */}
            <path
              d="M16 8 C11.5 8 8 11.5 8 16 C8 22 16 29 16 29 C16 29 24 22 24 16 C24 11.5 20.5 8 16 8 Z"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            <circle cx="16" cy="15" r="3" fill="white" />
            {/* Pulse ripple rings */}
            <path
              d="M10 6 A8 8 0 0 1 22 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-amber-500 dark:text-amber-400 opacity-80"
            />
            <path
              d="M6 3 A13 13 0 0 1 26 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              className="text-[#16866F] dark:text-[#65D6B2] opacity-60"
            />
          </g>
        );

      case 'Business Listings':
        return (
          <g>
            {/* Directory Listing card badge */}
            <rect
              x="6"
              y="7"
              width="20"
              height="18"
              rx="2.5"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Top header bar */}
            <path
              d="M6 9.5 C6 8.1 7.1 7 8.5 7 L23.5 7 C24.9 7 26 8.1 26 9.5 L26 12 L6 12 Z"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            {/* Information lines */}
            <line x1="9" y1="16" x2="16" y2="16" className="stroke-slate-400 dark:stroke-[#B5C5C7]" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="9" y1="20" x2="14" y2="20" className="stroke-slate-300 dark:stroke-[#3A535D]" strokeWidth="1.5" strokeLinecap="round" />
            {/* Verified badge check */}
            <circle cx="21" cy="20" r="4.5" className="fill-amber-400 dark:fill-amber-300" />
            <path
              d="M19.5 20 L20.5 21 L22.5 19"
              fill="none"
              stroke="white"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case 'Reviews & Reputation':
        return (
          <g>
            {/* Trust shield */}
            <path
              d="M16 6 L24 9.5 C24 16 19.5 22 16 26 C12.5 22 8 16 8 9.5 Z"
              className="fill-slate-100 dark:fill-[#223640] stroke-[#16866F] dark:stroke-[#65D6B2]"
              strokeWidth="1.5"
            />
            {/* Five-star central emblem */}
            <polygon
              points="16,11 17.5,14.5 21,14.5 18.2,16.5 19.3,20 16,17.8 12.7,20 13.8,16.5 11,14.5 14.5,14.5"
              className="fill-amber-400 dark:fill-amber-300"
            />
            {/* Quote speckle */}
            <circle cx="6" cy="18" r="1.5" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <circle cx="26" cy="14" r="1.5" className="fill-amber-500 dark:fill-amber-400" />
          </g>
        );

      case 'Website Basics':
        return (
          <g>
            {/* Browser window */}
            <rect
              x="5"
              y="6"
              width="22"
              height="20"
              rx="3"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Window controls */}
            <circle cx="9" cy="10" r="1" className="fill-red-400" />
            <circle cx="12" cy="10" r="1" className="fill-amber-400" />
            <circle cx="15" cy="10" r="1" className="fill-[#65D6B2]" />
            <line x1="5" y1="13" x2="27" y2="13" className="stroke-slate-200 dark:stroke-[#304650]" strokeWidth="1" />
            {/* Hero banner block */}
            <rect x="8" y="15" width="16" height="5" rx="1" className="fill-[#16866F]/30 dark:fill-[#65D6B2]/40" />
            {/* Cursor click arrow */}
            <path
              d="M19 18 L25 24 L22 24.5 L24 27 L22 28 L20 25.5 L18 27 Z"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
          </g>
        );

      case 'Social Media':
        return (
          <g>
            {/* Mobile feed card */}
            <rect
              x="8"
              y="5"
              width="16"
              height="22"
              rx="3"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Profile avatar & handle */}
            <circle cx="12" cy="10" r="2" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            <line x1="16" y1="10" x2="21" y2="10" className="stroke-slate-400 dark:stroke-[#B5C5C7]" strokeWidth="1.5" strokeLinecap="round" />
            {/* Post image square */}
            <rect x="10" y="14" width="12" height="7" rx="1.5" className="fill-[#16866F]/20 dark:fill-[#65D6B2]/30" />
            {/* Heart badge */}
            <circle cx="21" cy="21" r="3.5" className="fill-rose-500" />
            <path
              d="M20 20.5 Q21 19.5 22 20.5 Q22 21.5 21 22.5 Q20 21.5 20 20.5 Z"
              fill="white"
            />
          </g>
        );

      case 'Content Marketing':
        return (
          <g>
            {/* Article document */}
            <path
              d="M7 6 L20 6 L25 11 L25 26 L7 26 Z"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            {/* Folded corner */}
            <path
              d="M20 6 L20 11 L25 11 Z"
              className="fill-[#16866F] dark:fill-[#65D6B2]"
            />
            {/* Text lines */}
            <line x1="10" y1="12" x2="17" y2="12" className="stroke-[#16866F] dark:stroke-[#65D6B2]" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="16" x2="22" y2="16" className="stroke-slate-400 dark:stroke-[#B5C5C7]" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="10" y1="19" x2="19" y2="19" className="stroke-slate-300 dark:stroke-[#3A535D]" strokeWidth="1.2" strokeLinecap="round" />
            {/* Quill feather pen accent */}
            <path
              d="M22 17 Q25 14 27 10 Q24 16 23 21 Z"
              className="fill-amber-500 dark:fill-amber-400"
            />
          </g>
        );

      case 'Conversion Improvements':
        return (
          <g>
            {/* Funnel container */}
            <path
              d="M7 8 L25 8 L18 18 L18 24 L14 26 L14 18 Z"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            {/* High impact conversion arrow */}
            <line
              x1="16"
              y1="5"
              x2="16"
              y2="15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="text-[#16866F] dark:text-[#65D6B2]"
            />
            <polygon points="16,16 13,12 19,12" className="fill-[#16866F] dark:fill-[#65D6B2]" />
            {/* Gold spark conversion bead */}
            <circle cx="16" cy="27" r="2.5" className="fill-amber-400 dark:fill-amber-300" />
          </g>
        );

      case 'Measurement & Consistency':
      default:
        return (
          <g>
            {/* Weekly cadence calendar */}
            <rect
              x="6"
              y="7"
              width="20"
              height="19"
              rx="2.5"
              className="fill-slate-100 dark:fill-[#223640] stroke-slate-300 dark:stroke-[#304650]"
              strokeWidth="1.5"
            />
            <line x1="6" y1="12" x2="26" y2="12" className="stroke-[#16866F] dark:stroke-[#65D6B2]" strokeWidth="1.5" />
            {/* Calendar spiral rings */}
            <line x1="10" y1="5" x2="10" y2="8" className="stroke-slate-600 dark:stroke-[#B5C5C7]" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="5" x2="22" y2="8" className="stroke-slate-600 dark:stroke-[#B5C5C7]" strokeWidth="1.5" strokeLinecap="round" />
            {/* Upward momentum wave */}
            <path
              d="M9 20 L13 17 L17 19 L23 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-500 dark:text-amber-400"
            />
            <circle cx="23" cy="14" r="1.5" className="fill-amber-500 dark:fill-amber-400" />
          </g>
        );
    }
  };

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: px, height: px }}
      title={category}
    >
      <svg
        viewBox="0 0 32 32"
        width={px}
        height={px}
        className="overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {renderIcon()}
      </svg>
    </div>
  );
};
