import React, { useState } from 'react';
import { GeneratedTask, TaskStatus } from '../../types/recommendations';
import {
  getPlainEnglishTitle,
  getPlainEnglishSummary,
  getFriendlyDifficultyLabel,
} from './plainEnglishHelper';
import {
  Sparkles,
  Clock,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Check,
  Award,
  ExternalLink,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface NextBestActionHeroProps {
  task: GeneratedTask | null;
  totalCompleted: number;
  totalTasks: number;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onNavigateToImprovements: () => void;
  onNavigateToAi: () => void;
}

export const NextBestActionHero: React.FC<NextBestActionHeroProps> = ({
  task,
  totalCompleted,
  totalTasks,
  onStatusChange,
  onNavigateToImprovements,
  onNavigateToAi,
}) => {
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [justCompletedFeedback, setJustCompletedFeedback] = useState(false);

  if (!task) {
    // All tasks completed state!
    return (
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 dark:from-emerald-950/30 dark:via-[#1D3039] dark:to-[#172830] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 px-3 py-1 text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
              <Award className="h-4 w-4" />
              <span>All Recommended Actions Complete!</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5]">
              Outstanding job! Your core marketing foundation is in place.
            </h2>
            <p className="text-sm text-slate-600 dark:text-[#B5C5C7] max-w-xl leading-relaxed">
              You have completed all {totalTasks} recommended foundational steps. Keep your information updated, review your website regularly, or ask TapGrow AI for creative promotion ideas.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateToImprovements}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            >
              <span>Review Completed Steps</span>
              <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
            </button>
            <button
              type="button"
              onClick={onNavigateToAi}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
            >
              <span>Ask AI for Next Ideas</span>
              <Sparkles className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const plainTitle = getPlainEnglishTitle(task);
  const plainSummary = getPlainEnglishSummary(task);
  const difficulty = getFriendlyDifficultyLabel(task.difficultyLevel, task.estimatedEffort);

  const handleMarkComplete = () => {
    setJustCompletedFeedback(true);
    onStatusChange(task.id, 'completed');
    setIsGuidanceOpen(false);
    setTimeout(() => {
      setJustCompletedFeedback(false);
    }, 2500);
  };

  return (
    <div className="rounded-2xl border-2 border-[#16866F]/30 dark:border-[#16866F]/40 bg-white dark:bg-[#1D3039] p-6 sm:p-7 shadow-xs relative overflow-hidden transition-all duration-200">
      {/* Decorative accent banner */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#16866F] via-[#65D6B2] to-[#16866F]" />

      {justCompletedFeedback && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-3 text-xs font-semibold text-emerald-800 dark:text-[#65D6B2] animate-in fade-in">
          <Check className="h-4 w-4 text-emerald-600 dark:text-[#65D6B2]" />
          <span>Completed! Loading your next best improvement...</span>
        </div>
      )}

      {/* Top badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F5EE] dark:bg-[#16866F]/25 px-3 py-1 text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
          <Sparkles className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
          <span>Recommended Next Action</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#91A5A9]">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>Est. {task.estimatedEffort}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${difficulty.badgeClass}`}>
            {difficulty.label}
          </span>
        </div>
      </div>

      {/* Action Title & Plain-English Rationale */}
      <div className="space-y-2 mb-5">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F2F7F5] leading-snug">
          {plainTitle}
        </h2>
        <p className="text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed max-w-2xl">
          {plainSummary}
        </p>

        {task.whyItMatters && (
          <div className="flex items-start gap-2 pt-1 text-xs text-slate-500 dark:text-[#91A5A9]">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <span><strong>Why this matters:</strong> {task.whyItMatters}</span>
          </div>
        )}
      </div>

      {/* Action buttons bar */}
      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-[#304650]">
        <button
          type="button"
          onClick={() => setIsGuidanceOpen(!isGuidanceOpen)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16866F] px-4 py-2.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16866F]"
        >
          <span>{isGuidanceOpen ? 'Hide Step Instructions' : 'Show Me How'}</span>
          {isGuidanceOpen ? <ChevronUp className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
        </button>

        <button
          type="button"
          onClick={handleMarkComplete}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
        >
          <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
          <span>Mark as Complete</span>
        </button>

        <button
          type="button"
          onClick={onNavigateToImprovements}
          className="ml-auto text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline whitespace-nowrap"
        >
          View all improvements →
        </button>
      </div>

      {/* Expandable Step-by-Step Instructions */}
      {isGuidanceOpen && (
        <div className="mt-5 pt-5 border-t border-slate-100 dark:border-[#304650] space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5]">
              Step-by-Step Instructions:
            </h3>
            <span className="text-[11px] text-slate-400">Complete each step below</span>
          </div>

          {task.instructions && task.instructions.length > 0 ? (
            <ol className="space-y-2.5 text-xs text-slate-700 dark:text-[#B5C5C7]">
              {task.instructions.map((step: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2.5 rounded-lg bg-slate-50 dark:bg-[#223640] p-3 border border-slate-100 dark:border-[#304650]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16866F] text-[10px] font-bold text-white">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-xs text-slate-600 dark:text-[#B5C5C7]">
              {task.summary}
            </p>
          )}

          {task.referenceUrl && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase tracking-wider block mb-1.5">
                Helpful Resource Link:
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={task.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#16866F] dark:text-[#65D6B2] hover:underline"
                >
                  <span>{task.referenceTitle || 'Official Guide & Instructions'}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={handleMarkComplete}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
            >
              <Check className="h-4 w-4" />
              <span>Finished! Mark as Done</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGuidanceOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-[#91A5A9] dark:hover:text-[#F2F7F5]"
            >
              Close instructions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
