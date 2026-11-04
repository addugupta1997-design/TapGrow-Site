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

type AppView = 'landing' | 'assessment' | 'dashboard' | 'workspace' | 'seo' | 'competitors' | 'how-it-works' | 'about' | 'privacy' | 'not-found';

function getViewFromPath(pathname: string, hasPlan: boolean): AppView {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/' || clean === '') return hasPlan ? 'dashboard' : 'landing';
  if (clean === '/how-it-works') return 'how-it-works';
  if (clean === '/about') return 'about';
  if (clean === '/privacy') return 'privacy';
  if (clean === '/assessment') return 'assessment';
  if (clean === '/dashboard') return 'dashboard';
  if (clean === '/workspace') return hasPlan ? 'workspace' : 'landing';
  if (clean === '/seo') return hasPlan ? 'seo' : 'landing';
  if (clean === '/competitors') return hasPlan ? 'competitors' : 'landing';
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
    case 'competitors':
      return '/competitors';
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

        {currentView === 'dashboard' && plan && (
          <DashboardPage
            plan={plan}
            onEditAssessment={() => navigateTo('assessment')}
            onClearPlanPrompt={() => setIsResetDialogOpen(true)}
            onPlanUpdated={(updated) => setPlan(updated)}
          />
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

        {currentView === 'seo' && plan && (
          <DashboardPage
            plan={plan}
            onEditAssessment={() => navigateTo('assessment')}
            onClearPlanPrompt={() => setIsResetDialogOpen(true)}
            onPlanUpdated={(updated) => setPlan(updated)}
            initialTab="seo"
          />
        )}

        {currentView === 'competitors' && plan && (
          <DashboardPage
            plan={plan}
            onEditAssessment={() => navigateTo('assessment')}
            onClearPlanPrompt={() => setIsResetDialogOpen(true)}
            onPlanUpdated={(updated) => setPlan(updated)}
            initialTab="competitors"
          />
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
