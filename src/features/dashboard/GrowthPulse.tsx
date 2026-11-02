import React from 'react';
import { GeneratedTask, RecommendationCategory } from '../../types/recommendations';
import { calculateGrowthPulse, CategoryGrowthStats } from './growthPulseCalculations';
import {
  Activity,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  Star,
  Globe,
  Share2,
  FileText,
  Target,
  BarChart3,
  Layers,
  ArrowUpRight,
  Users,
  Repeat,
} from 'lucide-react';

interface GrowthPulseProps {
  tasks: GeneratedTask[];
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
  onStartTask?: (taskId: string) => void;
  onViewAllTasks?: () => void;
}

const CATEGORY_ICONS: Record<RecommendationCategory, React.ComponentType<{ className?: string }>> = {
  'Local SEO': Compass,
  'Business listings': MapPin,
  'Google Business Profile': MapPin,
  'Reviews and reputation': Star,
  'Website basics': Globe,
  'Social media': Share2,
  'Content marketing': FileText,
  'Conversion improvements': Target,
  'Customer acquisition': Users,
  'Marketing measurement': BarChart3,
  'Measurement and consistency': BarChart3,
  'Customer retention': Repeat,
};

export const GrowthPulse: React.FC<GrowthPulseProps> = ({
  tasks,
  selectedCategory = 'all',
  onSelectCategory,
  onStartTask,
  onViewAllTasks,
}) => {
  const pulse = calculateGrowthPulse(tasks);

  // Identify the single highest-leverage next best action (in-progress first, or top active to-do, ignoring deferred)
  const nextBestAction =
    tasks.find((t) => t.status === 'in_progress') ||
    tasks.find((t) => t.status !== 'completed' && t.status !== 'deferred');

  // Momentum badge styling based on velocity level
  const getMomentumBadge = () => {
    switch (pulse.momentumLevel) {
      case 'peak':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-[#65D6B2]',
          dot: 'bg-emerald-600 dark:bg-[#65D6B2]',
        };
      case 'accelerating':
        return {
          bg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200 dark:border-teal-700 text-teal-900 dark:text-[#65D6B2]',
          dot: 'bg-[#16866F] dark:bg-[#65D6B2]',
        };
      case 'building':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-700 text-sky-900 dark:text-[#79B8F5]',
          dot: 'bg-sky-600 dark:bg-[#79B8F5]',
        };
      case 'starting':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-700 text-amber-900 dark:text-[#E9A23B]',
          dot: 'bg-amber-500 dark:bg-[#E9A23B]',
        };
      case 'ready':
      default:
        return {
          bg: 'bg-slate-100 dark:bg-[#223640] border-slate-200 dark:border-[#304650] text-slate-700 dark:text-[#B5C5C7]',
          dot: 'bg-slate-400 dark:bg-[#91A5A9]',
        };
    }
  };

  const badgeStyle = getMomentumBadge();

  return (
    <div className="no-print rounded-xl border border-slate-200/90 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs space-y-5 transition-colors duration-150">
      {/* Header section with momentum badge & overall progress */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-[#304650] pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16866f] text-white shadow-2xs">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold tracking-tight text-[#142A36] dark:text-[#F2F7F5]">
                Growth Pulse
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badgeStyle.bg}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
                {pulse.momentumLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-0.5">
              {pulse.momentumDescription}
            </p>
          </div>
        </div>

        {/* Global completion stat */}
        <div className="flex items-center gap-4 self-start sm:self-auto bg-slate-50/80 dark:bg-[#172830] rounded-lg px-3.5 py-2 border border-slate-200/70 dark:border-[#304650]">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9]">
              Overall Momentum
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold font-mono tabular-nums text-[#142A36] dark:text-[#F2F7F5]">
                {pulse.overallPercentage}%
              </span>
              <span className="text-xs text-slate-500 dark:text-[#91A5A9] font-medium">
                ({pulse.completedTasks}/{pulse.totalTasks} tasks)
              </span>
            </div>
          </div>
          <div className="h-8 w-1.5 rounded-full bg-slate-200 dark:bg-[#304650] overflow-hidden">
            <div
              className="w-full bg-[#16866F] dark:bg-[#65D6B2] transition-all duration-500 rounded-full"
              style={{
                height: `${pulse.overallPercentage}%`,
                marginTop: `${100 - pulse.overallPercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. Personalised "Your Next Best Action" Spotlight */}
      <div className="rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-gradient-to-br from-[#E0F5EE]/40 via-white to-transparent dark:from-[#16866F]/15 dark:via-[#1D3039] dark:to-[#172830] p-4.5 sm:p-5 shadow-2xs">
        {nextBestAction ? (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-[#16866F] px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  <Target className="h-3 w-3" />
                  Your Next Best Action
                </span>
                <span
                  className={`inline-flex items-center gap-1 font-semibold text-xs ${
                    nextBestAction.priority === 'High'
                      ? 'text-red-700 dark:text-[#F07171]'
                      : 'text-amber-700 dark:text-[#E9A23B]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      nextBestAction.priority === 'High' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                  {nextBestAction.priority} Priority
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#304650]">·</span>
                <span className="text-xs text-slate-500 dark:text-[#91A5A9] flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Est. {nextBestAction.estimatedEffort}
                </span>
                <span aria-hidden="true" className="text-slate-300 dark:text-[#304650]">·</span>
                <span className="text-xs text-slate-500 dark:text-[#91A5A9] font-medium">
                  {nextBestAction.category}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F2F7F5] line-clamp-2">
                {nextBestAction.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-[#B5C5C7] line-clamp-2 leading-relaxed">
                <strong className="text-slate-800 dark:text-[#F2F7F5]">Why it matters: </strong>
                {nextBestAction.whyItMatters}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 md:pt-0">
              <button
                type="button"
                onClick={() => onStartTask?.(nextBestAction.id)}
                className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              >
                <ArrowUpRight className="h-3.5 w-3.5" />
                <span>{nextBestAction.status === 'in_progress' ? 'Continue Task' : 'Start Task'}</span>
              </button>

              <button
                type="button"
                onClick={onViewAllTasks}
                className="h-9 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              >
                View All Recommendations
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-[#16866F] dark:text-[#65D6B2]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                  All Recommended Actions Completed!
                </h4>
                <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                  Excellent momentum. Continue tracking inquiries and inviting customer reviews.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onViewAllTasks}
              className="h-9 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            >
              Review Completed Tasks
            </button>
          </div>
        )}
      </div>

      {/* Category breakdown visual cards */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-2.5">
          <span className="font-semibold text-slate-700 dark:text-[#B5C5C7] flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-slate-400 dark:text-[#91A5A9]" />
            Category Execution Breakdown
          </span>
          {onSelectCategory && (
            <span className="text-[11px] text-slate-400 dark:text-[#91A5A9] hidden sm:inline">
              Click any category card to filter action items
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          {pulse.categories.map((cat: CategoryGrowthStats) => {
            const Icon = CATEGORY_ICONS[cat.category] || Layers;
            const isSelected = selectedCategory === cat.category;
            const isComplete = cat.percentage === 100;

            return (
              <button
                key={cat.category}
                type="button"
                onClick={() => onSelectCategory?.(isSelected ? 'all' : cat.category)}
                className={`flex flex-col justify-between rounded-lg border p-3 text-left transition-all relative ${
                  isSelected
                    ? 'border-[#16866F] dark:border-[#65D6B2] bg-[#DFF5EA]/30 dark:bg-[#16866F]/25 ring-1 ring-[#16866F] dark:ring-[#65D6B2] shadow-2xs'
                    : 'border-slate-200 dark:border-[#304650] bg-slate-50/40 dark:bg-[#223640] hover:bg-slate-50 dark:hover:bg-[#29404A] hover:border-slate-300 dark:hover:border-[#3A535D]'
                }`}
                title={`Filter by ${cat.category} (${cat.percentage}% complete)`}
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded ${
                          isComplete
                            ? 'bg-[#16866F] text-white'
                            : 'bg-white dark:bg-[#172830] border border-slate-200 dark:border-[#304650] text-slate-600 dark:text-[#B5C5C7]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-slate-800 dark:text-[#F2F7F5] line-clamp-1">
                        {cat.category}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-xs font-bold tabular-nums ${
                        isComplete ? 'text-[#16866F] dark:text-[#65D6B2]' : 'text-slate-700 dark:text-[#F2F7F5]'
                      }`}
                    >
                      {cat.percentage}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-[#304650]">
                    <div
                      className={`h-full transition-all duration-300 rounded-full ${
                        isComplete ? 'bg-[#16866F] dark:bg-[#65D6B2]' : 'bg-[#16866F] dark:bg-[#65D6B2]'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>

                {/* Bottom stats row */}
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9] pt-1.5 border-t border-slate-200/60 dark:border-[#304650]">
                  <span>
                    {cat.completed} of {cat.total} done
                  </span>
                  {cat.inProgress > 0 && (
                    <span className="font-medium text-amber-700 dark:text-[#E9A23B]">
                      {cat.inProgress} in progress
                    </span>
                  )}
                  {isComplete && (
                    <span className="inline-flex items-center gap-0.5 font-bold text-[#16866F] dark:text-[#65D6B2]">
                      <CheckCircle2 className="h-3 w-3" /> Complete
                    </span>
                  )}
                  {!isComplete && cat.inProgress === 0 && (
                    <span className="text-slate-400 dark:text-[#91A5A9] flex items-center gap-0.5">
                      View <ArrowUpRight className="h-3 w-3" />
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
