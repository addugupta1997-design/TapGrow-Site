import React, { useState, useEffect } from 'react';
import { SavedPlanState } from '../../types/storage';
import { TaskStatus } from '../../types/recommendations';
import { ScoreExplainerModal } from './ScoreExplainerModal';
import { PrintReportModal } from './PrintReportModal';
import { WeeklyRemindersModal } from './WeeklyRemindersModal';
import { updateTaskInStorage, savePlanToStorage } from '../../lib/storage';
import { calculateReadinessScore } from '../recommendations/scoring';
import { getShareablePlanUrl } from '../../lib/sharePlan';
import { formatDate } from '../../locales/i18n';
import { TapGrowSymbol } from '../../components/brand/TapGrowLogo';
import { AIMarketingAdvisor } from '../advisor/AIMarketingAdvisor';
import { MarketingWorkspace } from '../workspace/MarketingWorkspace';
import { SeoCheckerTab } from '../seoChecker/SeoCheckerTab';
import { HomeDashboardView } from './HomeDashboardView';
import { MyImprovementsView } from './MyImprovementsView';
import { MyProgressView } from './MyProgressView';
import {
  Home,
  CheckCircle2,
  Globe,
  Bot,
  TrendingUp,
  Download,
  Edit3,
  RotateCcw,
  MoreHorizontal,
  ChevronDown,
  Layers,
  MapPin,
  Building2,
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  restaurant_cafe: 'Restaurant & Cafe',
  retail: 'Retail Shop',
  salon_wellness: 'Salon & Spa',
  health_clinic: 'Clinic & Healthcare',
  home_trades: 'Home Services & Trades',
  professional_services: 'Professional Services',
  fitness: 'Fitness & Sports Studio',
  other_local: 'Local Business',
};

export type DashboardTab =
  | 'home'
  | 'improvements'
  | 'website'
  | 'ai'
  | 'progress'
  | 'workspace'
  | 'checklist'
  | 'weekly'
  | 'advisor'
  | 'seo';

interface DashboardPageProps {
  plan: SavedPlanState;
  onEditAssessment: () => void;
  onClearPlanPrompt: () => void;
  onPlanUpdated: (updatedPlan: SavedPlanState) => void;
  initialTab?: DashboardTab;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  plan,
  onEditAssessment,
  onClearPlanPrompt,
  onPlanUpdated,
  initialTab,
}) => {
  // Normalize initialTab to simplified 5-tab scheme
  const normalizeTab = (tab?: DashboardTab): 'home' | 'improvements' | 'website' | 'ai' | 'progress' | 'workspace' => {
    if (!tab || tab === 'home') return 'home';
    if (tab === 'checklist' || tab === 'weekly' || tab === 'improvements') return 'improvements';
    if (tab === 'seo' || tab === 'website') return 'website';
    if (tab === 'advisor' || tab === 'ai') return 'ai';
    if (tab === 'progress') return 'progress';
    if (tab === 'workspace') return 'workspace';
    return 'home';
  };

  const [activeTab, setActiveTab] = useState<'home' | 'improvements' | 'website' | 'ai' | 'progress' | 'workspace'>(() =>
    normalizeTab(initialTab)
  );

  const [isScoreExplainerOpen, setIsScoreExplainerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(normalizeTab(initialTab));
    }
  }, [initialTab]);

  const businessDisplayName = plan.answers.businessName?.trim() || 'Your Local Business';
  const locationDisplay = [plan.answers.cityArea, plan.answers.country].filter(Boolean).join(', ');
  const categoryLabel = CATEGORY_LABELS[plan.answers.category] || 'Local Business';

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updated = updateTaskInStorage(taskId, (task) => ({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
    }));
    if (updated) {
      const recalculatedScore = calculateReadinessScore(updated.answers, updated.tasks);
      const fullyUpdated = {
        ...updated,
        scoreResult: recalculatedScore,
      };
      savePlanToStorage(fullyUpdated);
      onPlanUpdated(fullyUpdated);
    }
  };

  const handleSaveNote = (taskId: string, note: string) => {
    const updated = updateTaskInStorage(taskId, (task) => ({
      ...task,
      notes: note,
    }));
    if (updated) {
      onPlanUpdated(updated);
    }
  };

  const handleCopyPlanLink = async () => {
    try {
      const shareUrl = getShareablePlanUrl(plan.answers);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', shareUrl);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Failed to copy plan link:', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6 transition-colors duration-150">
      {/* Top Header: Business Identity & Clean Options Menu */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-[#304650] pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16866F] dark:text-[#65D6B2] uppercase tracking-wider">
              <TapGrowSymbol size="sm" className="h-3.5 w-3.5" />
              <span>TapGrow Growth Assistant</span>
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-[#304650]">·</span>
            <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-[#B5C5C7]">
              {categoryLabel}
            </span>
            {locationDisplay && (
              <>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#304650]">·</span>
                <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-[#91A5A9]">
                  <MapPin className="h-3 w-3" />
                  <span>{locationDisplay}</span>
                </span>
              </>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5]">
            {businessDisplayName}
          </h2>
        </div>

        {/* Options Dropdown (Consolidated clean controls) */}
        <div className="relative self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsOptionsMenuOpen(!isOptionsMenuOpen)}
            className="h-8 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            aria-expanded={isOptionsMenuOpen}
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-slate-400" />
            <span>Plan Options</span>
            <ChevronDown className={`h-3 w-3 transition-transform ${isOptionsMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOptionsMenuOpen && (
            <div className="absolute right-0 mt-1 w-52 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-1.5 shadow-lg space-y-1 z-30 animate-in fade-in duration-100">
              <button
                type="button"
                onClick={() => {
                  onEditAssessment();
                  setIsOptionsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]"
              >
                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                <span>Edit Assessment Answers</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsPrintModalOpen(true);
                  setIsOptionsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]"
              >
                <Download className="h-3.5 w-3.5 text-slate-400" />
                <span>Download PDF Report</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClearPlanPrompt();
                  setIsOptionsMenuOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-red-600 dark:text-[#F07171] hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <RotateCcw className="h-3.5 w-3.5 text-red-500" />
                <span>Clear Saved Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Simplified Main Navigation Tabs (5 clean destinations) */}
      <nav
        aria-label="Dashboard Sections"
        className="no-print flex items-center gap-1 sm:gap-2 p-1 bg-slate-100/80 dark:bg-[#172830] rounded-xl overflow-x-auto max-w-full scrollbar-none"
      >
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'home'
              ? 'bg-white dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2] shadow-2xs font-bold'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5]'
          }`}
        >
          <Home className="h-4 w-4" />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('improvements')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'improvements'
              ? 'bg-white dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2] shadow-2xs font-bold'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5]'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          <span>My Improvements</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'website'
              ? 'bg-white dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2] shadow-2xs font-bold'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5]'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Website Checker</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'ai'
              ? 'bg-white dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2] shadow-2xs font-bold'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5]'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>Ask AI</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('progress')}
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
            activeTab === 'progress'
              ? 'bg-white dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2] shadow-2xs font-bold'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5]'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>My Progress</span>
        </button>

        {activeTab === 'workspace' && (
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-bold rounded-lg bg-white dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2] shadow-2xs whitespace-nowrap shrink-0"
          >
            <Layers className="h-4 w-4" />
            <span>Workspace</span>
          </button>
        )}
      </nav>

      {/* Main Content Area based on simplified 5-tab scheme */}
      <main id="dashboard-content" className="min-h-[500px]">
        {activeTab === 'home' && (
          <HomeDashboardView
            plan={plan}
            onStatusChange={handleStatusChange}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'improvements' && (
          <MyImprovementsView
            tasks={plan.tasks}
            onStatusChange={handleStatusChange}
            onSaveNote={handleSaveNote}
          />
        )}

        {activeTab === 'website' && (
          <SeoCheckerTab answers={plan.answers} />
        )}

        {activeTab === 'ai' && (
          <AIMarketingAdvisor answers={plan.answers} />
        )}

        {activeTab === 'progress' && (
          <MyProgressView
            plan={plan}
            onOpenScoreExplainer={() => setIsScoreExplainerOpen(true)}
            onOpenPrintModal={() => setIsPrintModalOpen(true)}
            onOpenRemindersModal={() => setIsRemindersModalOpen(true)}
            onNavigateToTab={setActiveTab}
            onCopyPlanLink={handleCopyPlanLink}
            copiedLink={copiedLink}
          />
        )}

        {activeTab === 'workspace' && (
          <MarketingWorkspace answers={plan.answers} />
        )}
      </main>

      {/* Score Breakdown Modal */}
      <ScoreExplainerModal
        isOpen={isScoreExplainerOpen}
        scoreResult={plan.scoreResult}
        onClose={() => setIsScoreExplainerOpen(false)}
      />

      {/* Print / Save PDF Modal */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        plan={plan}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Weekly Reminders Subscription Modal */}
      <WeeklyRemindersModal
        isOpen={isRemindersModalOpen}
        plan={plan}
        onClose={() => setIsRemindersModalOpen(false)}
        onPlanUpdated={onPlanUpdated}
      />
    </div>
  );
};
