import React, { useState } from 'react';
import { ArrowUpRight, CheckCircle2, Menu, X, Compass, HelpCircle, Info, ShieldCheck, FileText, Layers, Globe } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { TapGrowLogo } from './brand/TapGrowLogo';

interface AppHeaderProps {
  currentView: 'landing' | 'assessment' | 'dashboard' | 'workspace' | 'seo' | 'how-it-works' | 'about' | 'privacy';
  onNavigate: (view: 'landing' | 'assessment' | 'dashboard' | 'workspace' | 'seo' | 'how-it-works' | 'about' | 'privacy') => void;
  hasExistingPlan: boolean;
  onClearPlanPrompt?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentView,
  onNavigate,
  hasExistingPlan,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'landing' | 'assessment' | 'dashboard' | 'workspace' | 'seo' | 'how-it-works' | 'about' | 'privacy') => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="no-print relative w-full border-b border-slate-200/80 bg-white dark:bg-[#172830] dark:border-[#304650] transition-colors duration-150 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => handleNavClick('landing')}
          className="flex items-center text-left transition-opacity hover:opacity-90 focus:outline-none"
          aria-label="TapGrow - Plan • Improve • Grow"
        >
          <TapGrowLogo variant="full" size="md" />
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#B5C5C7]"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            onClick={() => handleNavClick('landing')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
              currentView === 'landing' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('how-it-works')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
              currentView === 'how-it-works' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
            }`}
          >
            How It Works
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('about')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
              currentView === 'about' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
            }`}
          >
            About
          </button>
          <button
            type="button"
            onClick={() => handleNavClick('privacy')}
            className={`transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
              currentView === 'privacy' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
            }`}
          >
            Privacy
          </button>
          {hasExistingPlan && (
            <>
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
                  currentView === 'dashboard' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
                }`}
              >
                <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                <span>My Plan</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('workspace')}
                className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
                  currentView === 'workspace' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
                }`}
              >
                <Layers className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                <span>Workspace</span>
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('seo')}
                className={`flex items-center gap-1.5 transition-colors hover:text-slate-900 dark:hover:text-[#F2F7F5] whitespace-nowrap ${
                  currentView === 'seo' ? 'font-semibold text-[#16866F] dark:text-[#65D6B2]' : ''
                }`}
              >
                <Globe className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                <span>SEO Checker</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions (Theme Toggle & CTA & Mobile Menu Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Global Theme Toggle */}
          <ThemeToggle />

          {hasExistingPlan ? (
            <button
              type="button"
              onClick={() => handleNavClick(currentView === 'dashboard' || currentView === 'workspace' ? 'assessment' : 'dashboard')}
              className="h-9 inline-flex items-center justify-center rounded-lg bg-[#16866F] px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16866F] whitespace-nowrap"
            >
              {currentView === 'dashboard' || currentView === 'workspace' ? 'Edit Assessment' : 'View My Plan'}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('assessment')}
              className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16866F] whitespace-nowrap"
            >
              <span className="hidden sm:inline">Start Free Assessment</span>
              <span className="sm:hidden">Start Plan</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-[#304650] bg-white dark:bg-[#172830] px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col space-y-1" aria-label="Mobile Navigation">
            <button
              type="button"
              onClick={() => handleNavClick('landing')}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                currentView === 'landing'
                  ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                  : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>Overview</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('how-it-works')}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                currentView === 'how-it-works'
                  ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                  : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>How It Works</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                currentView === 'about'
                  ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                  : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>About TapGrow</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('privacy')}
              className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                currentView === 'privacy'
                  ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                  : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Privacy & Storage</span>
            </button>

            {hasExistingPlan && (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    currentView === 'dashboard'
                      ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                      : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                  <span>My Active Plan</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('workspace')}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    currentView === 'workspace'
                      ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                      : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
                  }`}
                >
                  <Layers className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                  <span>Marketing Workspace</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('seo')}
                  className={`flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                    currentView === 'seo'
                      ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] font-semibold'
                      : 'text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#1D3039]'
                  }`}
                >
                  <Globe className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                  <span>Website & SEO Checker</span>
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
