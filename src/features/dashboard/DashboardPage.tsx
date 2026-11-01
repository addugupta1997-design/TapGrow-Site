import React, { useState } from 'react';
import { SavedPlanState } from '../../types/storage';
import { TaskStatus } from '../../types/recommendations';
import { DashboardSummary } from './DashboardSummary';
import { CompletionDonutChart } from './CompletionDonutChart';
import { GrowthPulse } from './GrowthPulse';
import { TaskList } from './TaskList';
import { WeeklyFocusView } from './WeeklyFocusView';
import { ScoreExplainerModal } from './ScoreExplainerModal';
import { PrintReportModal } from './PrintReportModal';
import { WeeklyRemindersModal } from './WeeklyRemindersModal';
import { exportPlanToJson, printPlanReport } from '../../lib/exportData';
import { getShareablePlanUrl } from '../../lib/sharePlan';
import { updateTaskInStorage } from '../../lib/storage';
import { formatDate } from '../../locales/i18n';
import { TapGrowSymbol } from '../../components/brand/TapGrowLogo';
import {
  Download,
  Printer,
  Edit3,
  RotateCcw,
  ListTodo,
  Calendar,
  CheckCircle2,
  Shield,
  MapPin,
  Building2,
  Share2,
  Check,
  Link,
  Sparkles,
  Target,
  Compass,
  Tag,
  Bell,
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

interface DashboardPageProps {
  plan: SavedPlanState;
  onEditAssessment: () => void;
  onClearPlanPrompt: () => void;
  onPlanUpdated: (updatedPlan: SavedPlanState) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  plan,
  onEditAssessment,
  onClearPlanPrompt,
  onPlanUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'checklist' | 'weekly'>('checklist');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isScoreExplainerOpen, setIsScoreExplainerOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isRemindersModalOpen, setIsRemindersModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSelectCategoryFromPulse = (category: string) => {
    setSelectedCategoryFilter(category);
    setActiveTab('checklist');
    const tasksSection = document.getElementById('tasks-view-section');
    if (tasksSection) {
      tasksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const businessDisplayName = plan.answers.businessName?.trim() || 'Your Local Business';
  const locationDisplay = [plan.answers.cityArea, plan.answers.country].filter(Boolean).join(', ');
  const categoryLabel = CATEGORY_LABELS[plan.answers.category] || 'Local Business';

  // Extract top 3 highest-leverage incomplete tasks
  const topThreeTasks = plan.tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 3);

  const handleCopyPlanLink = async () => {
    try {
      const shareUrl = getShareablePlanUrl(plan.answers);
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', shareUrl);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const tempInput = document.createElement('textarea');
        tempInput.value = shareUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Failed to copy plan link:', err);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const updated = updateTaskInStorage(taskId, (task) => ({
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : null,
    }));
    if (updated) {
      onPlanUpdated(updated);
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

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 transition-colors duration-150">
      {/* Printable Report Header (only visible when printing) */}
      <div className="hidden print-only mb-6 border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">{businessDisplayName} – TapGrow Marketing Plan</h1>
        <p className="text-xs text-slate-500 mt-1">
          Location: {locationDisplay} · Readiness Score: {plan.scoreResult.totalScore}/100 · Generated on {formatDate(plan.lastUpdated)}
        </p>
      </div>

      {/* Screen Header & Action Toolbar */}
      <div className="no-print flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between border-b border-slate-200/80 dark:border-[#304650] pb-6 transition-colors duration-150">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] uppercase tracking-wider">
              <TapGrowSymbol size="sm" className="h-4 w-4" />
              <span>TapGrow Plan Workspace</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 dark:text-[#304650]">·</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-[#E0F5EE] dark:bg-[#16866F]/20 border border-emerald-200/80 dark:border-[#304650] px-2 py-0.5 text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">
              <Tag className="h-3 w-3 text-[#16866F] dark:text-[#65D6B2]" />
              {categoryLabel}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#142A36] dark:text-[#F2F7F5] sm:text-3xl">
            {businessDisplayName}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-[#91A5A9]">
            {locationDisplay && (
              <>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {locationDisplay}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span>Goal: {plan.answers.mainGoal.replace(/_/g, ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>Capacity: {plan.answers.weeklyHours.replace(/_/g, ' ')}</span>
            <span aria-hidden="true">·</span>
            <span>Saved in browser ({formatDate(plan.lastUpdated)})</span>
          </div>
        </div>

        {/* Action Buttons Toolbar - Aligned in a straight line */}
        <div className="flex items-center gap-2 flex-nowrap overflow-x-auto max-w-full py-0.5 scrollbar-none shrink-0">
          <button
            type="button"
            onClick={onEditAssessment}
            className="h-9 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
            <span>Edit Answers</span>
          </button>

          <button
            type="button"
            onClick={handleCopyPlanLink}
            className={`h-9 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border px-3.5 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-[#16866F] ${
              copiedLink
                ? 'border-emerald-500 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-[#65D6B2]'
                : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640]'
            }`}
            title="Serialize plan into URL hash and copy shareable link"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-[#65D6B2]" />
                <span className="font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
                <span>Share / Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsRemindersModalOpen(true)}
            className={`h-9 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border px-3.5 text-xs font-semibold shadow-2xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F] ${
              plan.remindersSubscription?.enabled
                ? 'border-emerald-300 dark:border-emerald-700 bg-[#DFF5EA]/60 dark:bg-[#16866F]/25 text-[#0F5C4D] dark:text-[#65D6B2] hover:bg-[#DFF5EA]'
                : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]'
            }`}
            title="Subscribe to weekly email task digests"
          >
            <Bell className={`h-3.5 w-3.5 ${plan.remindersSubscription?.enabled ? 'text-[#16866f] dark:text-[#65D6B2]' : 'text-slate-500 dark:text-[#91A5A9]'}`} />
            <span>{plan.remindersSubscription?.enabled ? 'Reminders: Active' : 'Get Weekly Reminders'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-9 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg bg-[#16866F] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            title="Download Plan as PDF"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onClearPlanPrompt}
            className="h-9 inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 rounded-lg border border-red-200 dark:border-red-900/60 bg-white dark:bg-[#1D3039] px-3.5 text-xs font-semibold text-red-600 dark:text-[#F07171] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            title="Reset and clear all plan data"
          >
            <RotateCcw className="h-3.5 w-3.5 text-red-500 dark:text-[#F07171]" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <DashboardSummary
        scoreResult={plan.scoreResult}
        tasks={plan.tasks}
        onOpenScoreExplainer={() => setIsScoreExplainerOpen(true)}
      />

      {/* Growth Pulse: Momentum & Visual Category Task Completion */}
      <GrowthPulse
        tasks={plan.tasks}
        selectedCategory={selectedCategoryFilter}
        onSelectCategory={handleSelectCategoryFromPulse}
      />

      {/* Personalized Assessment Summary & Insights */}
      <div className="no-print rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs space-y-4 transition-colors duration-150">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-[#304650] pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16866F] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Personalized Assessment Summary</h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Tailored for {CATEGORY_LABELS[plan.answers.category] || 'Local Business'} in {locationDisplay || 'your area'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onEditAssessment}
            className="self-start sm:self-auto text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
          >
            Review & Adjust Answers →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Verified Strengths */}
          <div className="rounded-lg border border-emerald-100 dark:border-[#304650] bg-[#DFF5EA]/25 dark:bg-[#16866F]/15 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2] mb-2">
              <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              <span>Verified Strengths & Assets</span>
            </div>
            {plan.scoreResult.strengths.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#B5C5C7]">
                {plan.scoreResult.strengths.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#16866F] dark:text-[#65D6B2] font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">No established foundations recorded yet.</p>
            )}
          </div>

          {/* Priority Growth Gaps */}
          <div className="rounded-lg border border-amber-200 dark:border-[#304650] bg-amber-50/40 dark:bg-amber-950/20 p-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-[#E9A23B] mb-2">
              <Compass className="h-4 w-4 text-amber-700 dark:text-[#E9A23B]" />
              <span>Priority Improvement Opportunities</span>
            </div>
            {plan.scoreResult.gaps.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#B5C5C7]">
                {plan.scoreResult.gaps.slice(0, 4).map((gap, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-700 dark:text-[#E9A23B] font-bold">→</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">All core foundations currently verified.</p>
            )}
          </div>
        </div>
      </div>

      {/* Top 3 Highest-Leverage Recommended Actions */}
      {topThreeTasks.length > 0 && (
        <div className="no-print rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs space-y-4 transition-colors duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#16866f] text-white">
                <Target className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Top 3 Recommended Actions</h3>
                <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                  Start here for the fastest local discovery and conversion impact
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {topThreeTasks.map((t, index) => (
              <div
                key={t.id}
                className="flex flex-col justify-between rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#223640] p-4 transition-all hover:bg-slate-50 dark:hover:bg-[#29404A] hover:border-slate-300 dark:hover:border-[#3A535D]"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-medium">
                    <span className="rounded bg-red-100 dark:bg-red-950/50 px-1.5 py-0.5 font-bold text-red-800 dark:text-[#F07171]">
                      #{index + 1} Priority
                    </span>
                    <span className="text-slate-500 dark:text-[#91A5A9] font-mono">Est. {t.estimatedEffort}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] line-clamp-2 leading-snug">
                    {t.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-[#B5C5C7] line-clamp-3 leading-relaxed">
                    {t.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-[#304650] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-[#91A5A9]">
                    {t.status === 'completed' ? (
                      <span className="text-[#16866F] dark:text-[#65D6B2] font-bold flex items-center gap-1">
                        <Check className="h-3 w-3" /> Done
                      </span>
                    ) : (
                      t.suggestedTimeToComplete
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('checklist');
                      const el = document.getElementById(t.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold text-[#16866F] dark:text-[#65D6B2] hover:underline"
                  >
                    View Steps →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Local Storage & Privacy Notice Banner */}
      <div className="no-print flex items-center justify-between gap-3 rounded-lg border border-emerald-100 dark:border-[#304650] bg-[#DFF5EA]/20 dark:bg-[#16866F]/15 px-4 py-2.5 text-xs text-slate-600 dark:text-[#B5C5C7] transition-colors duration-150">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0" />
          <span>
            <strong>Offline & Local:</strong> Your plan is securely saved in this browser. No personal data was uploaded to any remote server.
          </span>
        </div>
        <span className="hidden sm:inline text-slate-400 dark:text-[#91A5A9] font-mono text-[11px]">
          v{plan.schemaVersion} Storage
        </span>
      </div>

      {/* Weekly Reminders Quick-Action Banner */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs transition-colors duration-150">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16866f]/10 dark:bg-[#16866f]/25 text-[#16866f] dark:text-[#65D6B2] shrink-0">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5]">
                {plan.remindersSubscription?.enabled ? 'Weekly Reminders Active' : 'Get Weekly Growth Reminders'}
              </span>
              {plan.remindersSubscription?.enabled && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                  <Check className="h-2.5 w-2.5" /> Subscribed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-0.5">
              {plan.remindersSubscription?.enabled
                ? `Sending task summaries every ${plan.remindersSubscription.dayOfWeek} at ${plan.remindersSubscription.timeOfDay} to ${plan.remindersSubscription.email}`
                : 'Receive a weekly email digest summarizing your remaining tasks and upcoming priorities.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsRemindersModalOpen(true)}
          className={`self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
            plan.remindersSubscription?.enabled
              ? 'border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#29404A]'
              : 'bg-[#16866f] text-white hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] shadow-2xs'
          }`}
        >
          <Bell className="h-3.5 w-3.5" />
          {plan.remindersSubscription?.enabled ? 'Manage Preferences' : 'Subscribe to Weekly Reminders'}
        </button>
      </div>

      {/* View Switcher Tabs */}
      <div id="tasks-view-section" className="no-print flex items-center gap-2 border-b border-slate-200 dark:border-[#304650] pb-2 transition-colors duration-150">
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'checklist'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <ListTodo className="h-4 w-4" />
          Action Checklist ({plan.tasks.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('weekly')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'weekly'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Weekly Focus Sequence
        </button>
      </div>

      {/* Content View */}
      {activeTab === 'checklist' ? (
        <TaskList
          tasks={plan.tasks}
          onStatusChange={handleStatusChange}
          onSaveNote={handleSaveNote}
          activeCategoryFilter={selectedCategoryFilter}
          onCategoryFilterChange={setSelectedCategoryFilter}
        />
      ) : (
        <WeeklyFocusView
          tasks={plan.tasks}
          onStatusChange={handleStatusChange}
          onSaveNote={handleSaveNote}
        />
      )}

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
