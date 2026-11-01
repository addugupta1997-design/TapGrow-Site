import React from 'react';
import { useTheme } from '../lib/theme';
import { Sun, Moon, Laptop } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  showLabel = false,
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  const tooltipText = isDark
    ? 'Switch to Light Mode (currently Dark)'
    : 'Switch to Dark Mode (currently Light)';

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={tooltipText}
        title={tooltipText}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 dark:border-[#304650] dark:bg-[#1D3039] dark:text-[#F2F7F5] dark:hover:bg-[#223640] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16866F]"
      >
        {isDark ? (
          <Sun className="h-4 w-4 text-[#E9A23B] transition-transform duration-200 rotate-0 hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-slate-600 transition-transform duration-200 rotate-0 hover:-rotate-12" />
        )}
      </button>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-[#B5C5C7]">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </div>
  );
};
