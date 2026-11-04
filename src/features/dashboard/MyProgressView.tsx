import React, { useState, useEffect } from 'react';
import { SavedPlanState } from '../../types/storage';
import { SeoAuditReport } from '../../types/seoChecker';
import { loadSavedAudits } from '../seoChecker/seoStorage';
import {
  TrendingUp,
  CheckCircle2,
  Download,
  Printer,
  Bell,
  Info,
  Clock,
  Sparkles,
  Shield,
  Globe,
  ArrowRight,
  Share2,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MyProgressViewProps {
  plan: SavedPlanState;
  onOpenScoreExplainer: () => void;
  onOpenPrintModal: () => void;
  onOpenRemindersModal: () => void;
  onNavigateToTab: (tab: 'home' | 'improvements' | 'website' | 'ai' | 'progress') => void;
  onCopyPlanLink: () => Promise<void>;
  copiedLink: boolean;
}

export const MyProgressView: React.FC<MyProgressViewProps> = ({
  plan,
  onOpenScoreExplainer,
  onOpenPrintModal,
  onOpenRemindersModal,
  onNavigateToTab,
  onCopyPlanLink,
  copiedLink,
}) => {
  const [savedAudits, setSavedAudits] = useState<SeoAuditReport[]>([]);
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);

  useEffect(() => {
    const audits = loadSavedAudits();
    setSavedAudits(audits);
  }, []);

  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((t) => t.status === 'completed');
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const latestAudit = savedAudits.length > 0 ? savedAudits[0] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-[#304650] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5]">
            My Progress & Growth Reports
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#B5C5C7]">
            Track your business readiness score, completed milestones, and download shareable growth reports.
          </p>
        </div>

        {/* Action button to download report */}
        <button
          type="button"
          onClick={onOpenPrintModal}
          className="inline-flex items-center gap-2 rounded-lg bg-[#16866F] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors self-start sm:self-auto shrink-0"
        >
          <Download className="h-4 w-4" />
          <span>Download PDF Plan</span>
        </button>
      </div>

      {/* Top 2 Key Metric Cards: Readiness Score & Action Progress */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Readiness Score Card */}
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
              Business Readiness Score
            </span>
            <button
              type="button"
              onClick={onOpenScoreExplainer}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
            >
              <Info className="h-3.5 w-3.5" />
              <span>How score works</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F2F7F5] font-mono">
              {plan.scoreResult.totalScore}
            </span>
            <span className="text-base font-semibold text-slate-400 font-mono">/ 100</span>
            {(plan.scoreResult.confirmedBoost ?? 0) > 0 && (
              <span className="rounded bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                +{plan.scoreResult.confirmedBoost} from completed actions
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            {plan.scoreResult.interpretation}
          </p>
        </div>

        {/* Action Progress Card */}
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
              Improvements Completed
            </span>
            <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
              {completionPercent}%
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-[#F2F7F5] font-mono">
              {completedTasks.length}
            </span>
            <span className="text-base font-semibold text-slate-400 font-mono">/ {totalTasks} actions</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#223640]">
            <div
              className="h-full rounded-full bg-[#16866F] dark:bg-[#65D6B2] transition-all duration-300"
              style={{ width: `${Math.max(completionPercent, 4)}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
            {totalTasks - completedTasks.length} actions remaining in your current plan.
          </p>
        </div>
      </div>

      {/* Verified Foundations & Priority Opportunities */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Core foundations */}
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-[#65D6B2]">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-[#65D6B2]" />
            <span>Foundations You Already Have In Place</span>
          </div>
          {plan.scoreResult.strengths && plan.scoreResult.strengths.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-700 dark:text-[#B5C5C7]">
              {plan.scoreResult.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-[#65D6B2] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">Completing actions will establish your core foundations.</p>
          )}
        </div>

        {/* Priority growth gaps */}
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-[#E9A23B]">
            <Sparkles className="h-4 w-4 text-amber-600 dark:text-[#E9A23B]" />
            <span>Key Areas to Improve Next</span>
          </div>
          {plan.scoreResult.gaps && plan.scoreResult.gaps.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-700 dark:text-[#B5C5C7]">
              {plan.scoreResult.gaps.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 dark:text-[#E9A23B] font-bold">→</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">All primary gaps addressed.</p>
          )}
        </div>
      </div>

      {/* Website Audit Snapshot Summary */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5]">
            <Globe className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
            <span>Latest Website Audit</span>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('website')}
            className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
          >
            {latestAudit ? 'Run New Audit →' : 'Audit Your Site Now →'}
          </button>
        </div>

        {latestAudit ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg bg-slate-50 dark:bg-[#223640] p-4">
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] block">
                {latestAudit.url}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-[#91A5A9]">
                Audited on {new Date(latestAudit.timestamp).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-slate-900 dark:text-[#F2F7F5]">
                  {latestAudit.overallScore}/100
                </span>
                <span className="text-[11px] text-slate-500 block">Grade {latestAudit.grade}</span>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('website')}
                className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50"
              >
                View Audit Details
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
            No website audit run yet on this browser. Click "Audit Your Site Now" to check page title, mobile speed, contact visibility, and LocalBusiness schema.
          </p>
        )}
      </div>

      {/* Completed Milestones List */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5]">
          Completed Improvements ({completedTasks.length})
        </h3>
        {completedTasks.length > 0 ? (
          <div className="space-y-2">
            {completedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-[#223640] px-3 py-2 text-xs"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0" />
                  <span className="font-medium text-slate-800 dark:text-[#F2F7F5]">{task.title}</span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{task.estimatedEffort}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
            No tasks marked complete yet. As you mark items done in "My Improvements", they appear here.
          </p>
        )}
      </div>

      {/* Weekly Reminders & Progressive Disclosure of Advanced Tools */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2] shrink-0">
              <Bell className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] block">
                Weekly Email Growth Digest & Reminders
              </span>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Prepare a personalized weekly briefing of your next tasks to stay on track.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenRemindersModal}
            className="rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-100 transition-colors self-start sm:self-auto"
          >
            Manage Digest
          </button>
        </div>

        {/* Progressive Disclosure Toggle */}
        <div className="pt-3 border-t border-slate-100 dark:border-[#304650]">
          <button
            type="button"
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className="flex items-center justify-between w-full text-xs font-semibold text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-white"
          >
            <span>Advanced Tools & Data Sharing</span>
            {showAdvancedTools ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showAdvancedTools && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-[#304650] flex flex-wrap items-center gap-3 animate-in fade-in">
              <button
                type="button"
                onClick={onCopyPlanLink}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>Copy Shareable Plan Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenPrintModal}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50"
              >
                <Printer className="h-3.5 w-3.5 text-slate-500" />
                <span>Print Growth Report</span>
              </button>

              <span className="text-[11px] text-slate-400 font-mono">
                Storage: v{plan.schemaVersion} (All data stored locally in browser)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
