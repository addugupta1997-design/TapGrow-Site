import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { TapGrowLogo } from './brand/TapGrowLogo';

interface AppFooterProps {
  onNavigate: (view: 'landing' | 'assessment' | 'dashboard' | 'how-it-works' | 'about' | 'privacy') => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="no-print mt-auto border-t border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] py-10 text-sm text-slate-500 dark:text-[#91A5A9] transition-colors duration-150">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="focus:outline-none transition-opacity hover:opacity-90"
              aria-label="TapGrow - Home"
            >
              <TapGrowLogo variant="full" size="md" />
            </button>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9] max-w-xs sm:pt-1">
              Empowering local businesses with clear diagnostics, high-impact priorities, and momentum tracking.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-[#B5C5C7] sm:text-sm">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="hover:text-slate-900 dark:hover:text-[#F2F7F5] transition-colors"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigate('how-it-works')}
              className="hover:text-slate-900 dark:hover:text-[#F2F7F5] transition-colors"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-slate-900 dark:hover:text-[#F2F7F5] transition-colors"
            >
              About TapGrow
            </button>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-900 dark:hover:text-[#F2F7F5] transition-colors"
            >
              Privacy & Local Storage
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#91A5A9]">
            <ShieldCheck className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0" />
            <span>100% Client-Side · ₹0 Budget · No Account Required</span>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 dark:border-[#304650] pt-6 text-center text-xs text-slate-400 dark:text-[#91A5A9]">
          <p>© 2026 TapGrow. Plan • Improve • Grow. Built for independent businesses and local entrepreneurs worldwide.</p>
        </div>
      </div>
    </footer>
  );
};
