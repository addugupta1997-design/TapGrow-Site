import React from 'react';
import { SavedPlanState } from '../../types/storage';
import { TaskStatus, GeneratedTask } from '../../types/recommendations';
import { getNextBestAction } from './plainEnglishHelper';
import { NextBestActionHero } from './NextBestActionHero';
import {
  CheckCircle2,
  Globe,
  Bot,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface HomeDashboardViewProps {
  plan: SavedPlanState;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onNavigateToTab: (tab: 'home' | 'improvements' | 'website' | 'ai' | 'progress') => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  plan,
  onStatusChange,
  onNavigateToTab,
}) => {
  const businessDisplayName = plan.answers.businessName?.trim() || 'Your Local Business';
  const totalTasks = plan.tasks.length;
  const completedTasks = plan.tasks.filter((t) => t.status === 'completed').length;
  const remainingTasks = totalTasks - completedTasks;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Single next best action
  const nextAction = getNextBestAction(plan.tasks);

  // Time-based friendly greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Encouraging progress message
  const getProgressMessage = () => {
    if (completedTasks === 0) {
      return 'Ready to get started? Your first win takes less than 15 minutes.';
    }
    if (completedTasks === totalTasks) {
      return 'Fantastic! All recommended foundations are complete.';
    }
    if (progressPercent >= 50) {
      return `More than halfway there! You've completed ${completedTasks} of ${totalTasks} improvements.`;
    }
    return `Great momentum! ${completedTasks} of ${totalTasks} improvements completed so far.`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* A. Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-[#304650] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5]">
            {getGreeting()}, {businessDisplayName} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#B5C5C7]">
            Here is your simple growth focus for today. Complete one action at a time to attract more local customers.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3 py-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Growth Assistant Active</span>
        </div>
      </div>

      {/* B. Next Best Action (Hero Component) */}
      <section aria-label="Next Best Action">
        <NextBestActionHero
          task={nextAction}
          totalCompleted={completedTasks}
          totalTasks={totalTasks}
          onStatusChange={onStatusChange}
          onNavigateToImprovements={() => onNavigateToTab('improvements')}
          onNavigateToAi={() => onNavigateToTab('ai')}
        />
      </section>

      {/* C. Simple Progress Section */}
      <section
        aria-label="Your Progress"
        className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
                Your Plan Progress
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[11px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                {progressPercent}% Complete
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-[#B5C5C7] mt-1">
              {getProgressMessage()}
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-slate-700 dark:text-[#F2F7F5] self-start sm:self-auto">
            {completedTasks} / {totalTasks} improvements done
          </span>
        </div>

        {/* Clean visual progress bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#223640]">
          <div
            className="h-full rounded-full bg-[#16866F] dark:bg-[#65D6B2] transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progressPercent, 4)}%` }}
          />
        </div>
      </section>

      {/* D. Four Main Feature Cards */}
      <section aria-label="Explore Growth Tools">
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
            Explore Your Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. My Improvements */}
          <button
            type="button"
            onClick={() => onNavigateToTab('improvements')}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 text-left shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-[#16866F] dark:text-[#65D6B2]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                  {remainingTasks > 0 ? `${remainingTasks} to do` : 'All done'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] group-hover:text-[#16866F] dark:group-hover:text-[#65D6B2] transition-colors">
                My Improvements
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] line-clamp-2 leading-relaxed">
                Step-by-step action plan to win more local customers.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
              <span>Open Action Plan</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 2. Check My Website */}
          <button
            type="button"
            onClick={() => onNavigateToTab('website')}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 text-left shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-teal-100 dark:bg-teal-950/70 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:text-teal-300">
                  Instant audit
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] group-hover:text-[#16866F] dark:group-hover:text-[#65D6B2] transition-colors">
                Check My Website
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] line-clamp-2 leading-relaxed">
                Find quick fixes to make your site faster and easier to use.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
              <span>Check Website</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 3. Ask TapGrow AI */}
          <button
            type="button"
            onClick={() => onNavigateToTab('ai')}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 text-left shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2]">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 text-[10px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                  24/7 Advisor
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] group-hover:text-[#16866F] dark:group-hover:text-[#65D6B2] transition-colors">
                Ask TapGrow AI
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] line-clamp-2 leading-relaxed">
                Your friendly 24/7 assistant for marketing advice and ideas.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
              <span>Ask a Question</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* 4. My Progress */}
          <button
            type="button"
            onClick={() => onNavigateToTab('progress')}
            className="group flex flex-col justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 text-left shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 px-2 py-0.5 text-[10px] font-bold text-blue-800 dark:text-blue-300">
                  Score & Reports
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5] group-hover:text-[#16866F] dark:group-hover:text-[#65D6B2] transition-colors">
                My Progress
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-[#91A5A9] line-clamp-2 leading-relaxed">
                See your score, completed milestones, and download reports.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
              <span>View Progress</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>
    </div>
  );
};
