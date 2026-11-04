import React, { useState, useEffect } from 'react';
import { SavedPlanState } from './types/storage';
import { loadPlanFromStorage, clearPlanStorage, savePlanToStorage } from './lib/storage';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { ConfirmDialog } from './components/ConfirmDialog';
import { LandingPage } from './features/landing/LandingPage';
import { AssessmentWizard } from './features/assessment/AssessmentWizard';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ThemeProvider } from './lib/theme';
import { deserializePlanFromHash } from './lib/sharePlan';
import { SeoCheckerTab } from './features/seoChecker/SeoCheckerTab';
import { Globe, ArrowUpRight, Target, Sparkles, CheckCircle2 } from 'lucide-react';

type AppView = 'landing' | 'assessment' | 'dashboard' | 'workspace' | 'seo' | 'how-it-works' | 'about' | 'privacy' | 'not-found';

function getViewFromPath(pathname: string, hasPlan: boolean): AppView {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/' || clean === '') return hasPlan ? 'dashboard' : 'landing';
  if (clean === '/how-it-works') return 'how-it-works';
  if (clean === '/about') return 'about';
  if (clean === '/privacy') return 'privacy';
  if (clean === '/assessment') return 'assessment';
  if (clean === '/dashboard') return 'dashboard';
  if (clean === '/workspace') return hasPlan ? 'workspace' : 'landing';
  if (clean === '/seo') return 'seo';
  return 'not-found';
}

function getPathFromView(view: AppView): string {
  switch (view) {
    case 'landing':
      return '/';
    case 'how-it-works':
      return '/how-it-works';
    case 'about':
      return '/about';
    case 'privacy':
      return '/privacy';
    case 'assessment':
      return '/assessment';
    case 'dashboard':
      return '/dashboard';
    case 'workspace':
      return '/workspace';
    case 'seo':
      return '/seo';
    default:
      return '/';
  }
}

function AppContent() {
  const [plan, setPlan] = useState<SavedPlanState | null>(() => {
    // Check if shared via URL hash first
    const sharedPlan = deserializePlanFromHash();
    if (sharedPlan) {
      savePlanToStorage(sharedPlan);
      return sharedPlan;
    }
    return loadPlanFromStorage();
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    if (typeof window !== 'undefined') {
      const sharedPlan = deserializePlanFromHash();
      if (sharedPlan) {
        return 'dashboard';
      }
      const initialPlan = loadPlanFromStorage();
      return getViewFromPath(window.location.pathname, !!initialPlan);
    }
    return 'landing';
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  // Sync browser back/forward buttons and hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const sharedPlan = deserializePlanFromHash();
      if (sharedPlan) {
        setPlan(sharedPlan);
        savePlanToStorage(sharedPlan);
        setCurrentView('dashboard');
        return;
      }
      const nextView = getViewFromPath(window.location.pathname, !!plan);
      setCurrentView(nextView);
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, [plan]);

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    const path = getPathFromView(view);
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlanComplete = (newPlan: SavedPlanState) => {
    setPlan(newPlan);
    navigateTo('dashboard');
  };

  const handleClearPlanConfirm = () => {
    clearPlanStorage();
    setPlan(null);
    setIsResetDialogOpen(false);
    navigateTo('landing');
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-150">
      {/* Accessible skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-[#16866F] focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-white focus:shadow-md"
      >
        Skip to main content
      </a>

      {/* Top Bar Header */}
      <AppHeader
        currentView={currentView === 'not-found' ? 'landing' : currentView}
        onNavigate={navigateTo}
        hasExistingPlan={!!plan}
        onClearPlanPrompt={() => setIsResetDialogOpen(true)}
      />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartAssessment={() => navigateTo('assessment')}
            onNavigate={navigateTo}
            hasExistingPlan={!!plan}
          />
        )}

        {currentView === 'assessment' && (
          <AssessmentWizard
            initialAnswers={plan?.answers}
            onComplete={handlePlanComplete}
            onCancel={() => navigateTo(plan ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'dashboard' && (
          plan ? (
            <DashboardPage
              plan={plan}
              onEditAssessment={() => navigateTo('assessment')}
              onClearPlanPrompt={() => setIsResetDialogOpen(true)}
              onPlanUpdated={(updated) => setPlan(updated)}
            />
          ) : (
            <div className="mx-auto max-w-2xl px-4 py-16 sm:py-24 text-center sm:px-6">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] shadow-xs mb-5">
                <Target className="h-7 w-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-[#F2F7F5]">
                No Saved Growth Plan Found
              </h2>
              <p className="mt-2.5 text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed max-w-md mx-auto">
                You have not completed an assessment yet on this device. Complete our quick, 3-minute assessment to unlock your personalized readiness score, tailored action checklist, and weekly marketing roadmap.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo('assessment')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#16866F] px-5 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16866F]"
                >
                  <span>Start Free Assessment</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigateTo('seo')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
                >
                  <Globe className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                  <span>Try Website & SEO Checker</span>
                </button>
              </div>
            </div>
          )
        )}

        {currentView === 'workspace' && plan && (
          <DashboardPage
            plan={plan}
            onEditAssessment={() => navigateTo('assessment')}
            onClearPlanPrompt={() => setIsResetDialogOpen(true)}
            onPlanUpdated={(updated) => setPlan(updated)}
            initialTab="workspace"
          />
        )}

        {currentView === 'seo' && (
          plan ? (
            <DashboardPage
              plan={plan}
              onEditAssessment={() => navigateTo('assessment')}
              onClearPlanPrompt={() => setIsResetDialogOpen(true)}
              onPlanUpdated={(updated) => setPlan(updated)}
              initialTab="seo"
            />
          ) : (
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
              {/* Standalone SEO Checker Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F5EE] dark:bg-[#16866F]/20 px-2.5 py-0.5 text-xs font-bold text-[#16866F] dark:text-[#65D6B2] mb-1.5">
                    <Globe className="h-3.5 w-3.5" />
                    <span>Free Technical Website Audit</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5]">
                    Website & SEO Checker
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#B5C5C7]">
                    Audit any local business website for technical SEO, mobile readiness, LocalBusiness Schema, and conversion factors.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('assessment')}
                  className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg border border-[#16866F]/40 bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 px-3.5 py-2 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:bg-[#E0F5EE] dark:hover:bg-[#16866F]/25 transition-colors whitespace-nowrap"
                >
                  <span>Build Full Marketing Plan</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Directly Accessible SEO Checker Tool */}
              <SeoCheckerTab />
            </div>
          )
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onStartAssessment={() => navigateTo('assessment')}
            onBack={() => navigateTo(plan ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'about' && (
          <AboutPage
            onStartAssessment={() => navigateTo('assessment')}
            onBack={() => navigateTo(plan ? 'dashboard' : 'landing')}
          />
        )}

        {currentView === 'privacy' && (
          <PrivacyPage onBack={() => navigateTo(plan ? 'dashboard' : 'landing')} />
        )}

        {currentView === 'not-found' && (
          <NotFoundPage onGoHome={() => navigateTo('landing')} />
        )}
      </main>

      {/* Footer */}
      <AppFooter onNavigate={navigateTo} />

      {/* Confirmation Dialog for Resetting Data */}
      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="Clear Saved Plan Data?"
        message="This will permanently remove your marketing answers, task checklist completion status, and personal notes stored in this browser. Are you sure you want to start fresh?"
        confirmLabel="Yes, Clear Data"
        cancelLabel="Keep My Plan"
        isDestructive={true}
        onConfirm={handleClearPlanConfirm}
        onCancel={() => setIsResetDialogOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
