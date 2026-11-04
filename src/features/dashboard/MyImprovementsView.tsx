import React, { useState, useMemo } from 'react';
import { GeneratedTask, TaskStatus } from '../../types/recommendations';
import {
  getPlainEnglishTitle,
  getPlainEnglishSummary,
  getFriendlyDifficultyLabel,
} from './plainEnglishHelper';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Lightbulb,
  Info,
  SlidersHorizontal,
} from 'lucide-react';

interface MyImprovementsViewProps {
  tasks: GeneratedTask[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSaveNote: (taskId: string, note: string) => void;
}

export const MyImprovementsView: React.FC<MyImprovementsViewProps> = ({
  tasks,
  onStatusChange,
  onSaveNote,
}) => {
  const [activeTab, setActiveTab] = useState<'do_first' | 'coming_up' | 'completed'>('do_first');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<Record<string, boolean>>({});

  // Categorize tasks
  const { doFirstTasks, comingUpTasks, completedTasks } = useMemo(() => {
    const uncompleted = tasks.filter((t) => t.status !== 'completed' && t.status !== 'deferred');
    const completed = tasks.filter((t) => t.status === 'completed');

    // Do First: High priority unfinished tasks (or first 3 if none labeled High)
    const high = uncompleted.filter((t) => t.priority === 'High');
    let doFirst: GeneratedTask[];
    let comingUp: GeneratedTask[];

    if (high.length > 0) {
      doFirst = high;
      comingUp = uncompleted.filter((t) => t.priority !== 'High');
    } else {
      doFirst = uncompleted.slice(0, 3);
      comingUp = uncompleted.slice(3);
    }

    return {
      doFirstTasks: doFirst,
      comingUpTasks: comingUp,
      completedTasks: completed,
    };
  }, [tasks]);

  // Apply search query filter
  const filterList = (list: GeneratedTask[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        getPlainEnglishTitle(t).toLowerCase().includes(q)
    );
  };

  const visibleDoFirst = filterList(doFirstTasks);
  const visibleComingUp = filterList(comingUpTasks);
  const visibleCompleted = filterList(completedTasks);

  const toggleTechnical = (taskId: string) => {
    setShowTechnicalDetails((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const renderTaskItem = (task: GeneratedTask, isDoFirst = false) => {
    const isCompleted = task.status === 'completed';
    const isExpanded = expandedTaskId === task.id;
    const plainTitle = getPlainEnglishTitle(task);
    const plainSummary = getPlainEnglishSummary(task);
    const difficulty = getFriendlyDifficultyLabel(task.difficultyLevel, task.estimatedEffort);
    const hasTechnicalOpen = !!showTechnicalDetails[task.id];

    return (
      <div
        key={task.id}
        id={task.id}
        className={`rounded-xl border transition-all ${
          isCompleted
            ? 'border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20'
            : isDoFirst
            ? 'border-emerald-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-xs'
            : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039]'
        }`}
      >
        <div className="p-4 sm:p-5">
          {/* Header row with badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {isDoFirst && !isCompleted && (
                <span className="rounded bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 text-[10px] font-bold text-amber-800 dark:text-[#E9A23B]">
                  ⭐ Priority Action
                </span>
              )}
              <span className={`inline-flex items-center rounded px-2 py-0.5 text-[11px] font-semibold ${difficulty.badgeClass}`}>
                {difficulty.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#91A5A9] font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>{task.estimatedEffort}</span>
            </div>
          </div>

          {/* Title and summary */}
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => onStatusChange(task.id, isCompleted ? 'not_started' : 'completed')}
              className="mt-1 text-slate-400 hover:text-[#16866F] dark:hover:text-[#65D6B2] transition-colors shrink-0"
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </button>

            <div className="flex-1 space-y-1">
              <h3
                className={`text-sm sm:text-base font-bold ${
                  isCompleted
                    ? 'line-through text-slate-400 dark:text-[#91A5A9]'
                    : 'text-slate-900 dark:text-[#F2F7F5]'
                }`}
              >
                {plainTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                {plainSummary}
              </p>

              {task.whyItMatters && !isCompleted && (
                <div className="flex items-start gap-1.5 pt-1 text-xs text-slate-500 dark:text-[#91A5A9]">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Why this matters:</strong> {task.whyItMatters}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action toggle & Mark complete row */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#304650] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                className="inline-flex items-center gap-1 font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
              >
                <span>{isExpanded ? 'Hide Steps' : 'View Step-by-Step Guide'}</span>
                {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => toggleTechnical(task.id)}
                className="text-[11px] text-slate-400 dark:text-[#91A5A9] hover:text-slate-700 dark:hover:text-[#F2F7F5]"
              >
                {hasTechnicalOpen ? 'Hide technical notes' : 'See technical details'}
              </button>
            </div>

            <button
              type="button"
              onClick={() => onStatusChange(task.id, isCompleted ? 'not_started' : 'completed')}
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 font-semibold text-xs transition-colors ${
                isCompleted
                  ? 'border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] text-slate-600 dark:text-[#B5C5C7]'
                  : 'bg-[#16866F] text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80]'
              }`}
            >
              {isCompleted ? (
                <>
                  <Check className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Mark as Done</span>
                </>
              )}
            </button>
          </div>

          {/* Technical Details Progressive Disclosure */}
          {hasTechnicalOpen && (
            <div className="mt-3 rounded-lg bg-slate-50 dark:bg-[#172830] p-3 text-xs text-slate-600 dark:text-[#B5C5C7] space-y-1.5 border border-slate-200/80 dark:border-[#304650] animate-in fade-in duration-100">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="font-bold">Original Technical Category:</span>
                <span className="rounded bg-slate-200 dark:bg-[#223640] px-1.5 py-0.5">{task.category}</span>
              </div>
              {task.title !== plainTitle && (
                <div className="text-[11px]">
                  <span className="font-bold">Technical Title:</span> {task.title}
                </div>
              )}
              {task.tags && task.tags.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] pt-1">
                  <span className="font-bold">Marketing tags:</span>
                  {task.tags.map((tag, idx) => (
                    <span key={idx} className="rounded bg-slate-100 dark:bg-[#223640] px-1 text-[10px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Expanded Step-by-Step Instructions */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#304650] space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5]">
                  How to complete this action:
                </span>
              </div>

              {task.instructions && task.instructions.length > 0 ? (
                <ol className="space-y-2 text-xs text-slate-700 dark:text-[#B5C5C7]">
                  {task.instructions.map((step: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 border border-slate-100 dark:border-[#304650]">
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
                <div className="pt-1">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase tracking-wider block mb-1">
                    Helpful Resource:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <a
                      href={task.referenceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-[#16866F] dark:text-[#65D6B2] hover:underline"
                    >
                      <span>{task.referenceTitle || 'Resource Link'}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Title & Search Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-[#304650] pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#F2F7F5]">
            My Improvements
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#B5C5C7]">
            Work through these practical steps one at a time to strengthen your business visibility.
          </p>
        </div>

        {/* Clean search bar */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search improvements..."
            className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          />
        </div>
      </div>

      {/* 3 Intuitive Category Tabs: Do This First / Coming Up / Completed */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#304650] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('do_first')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'do_first'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <span>Do This First</span>
          <span className="rounded-full bg-white/20 dark:bg-white/20 px-1.5 py-0.2 text-[10px]">
            {doFirstTasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('coming_up')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'coming_up'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <span>Coming Up</span>
          <span className="rounded-full bg-slate-100 dark:bg-[#223640] px-1.5 py-0.2 text-[10px]">
            {comingUpTasks.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors ${
            activeTab === 'completed'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <span>Completed</span>
          <span className="rounded-full bg-slate-100 dark:bg-[#223640] px-1.5 py-0.2 text-[10px]">
            {completedTasks.length}
          </span>
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'do_first' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-3 text-xs text-slate-700 dark:text-[#B5C5C7]">
            <strong>Immediate Focus:</strong> These are your highest-leverage improvements. Completing them gives your local business the fastest boost in discoverability and inquiries.
          </div>

          {visibleDoFirst.length > 0 ? (
            <div className="space-y-3">
              {visibleDoFirst.map((task) => renderTaskItem(task, true))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-8 text-center space-y-2">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#16866F] dark:text-[#65D6B2]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                All Priority Actions Completed!
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] max-w-sm mx-auto">
                You have finished your top priority improvements. Check the "Coming Up" tab to continue building momentum.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('coming_up')}
                className="mt-2 text-xs font-bold text-[#16866F] dark:text-[#65D6B2] hover:underline"
              >
                View Coming Up Steps →
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'coming_up' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-slate-50 dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] p-3 text-xs text-slate-700 dark:text-[#B5C5C7]">
            <strong>Steady Growth Steps:</strong> Keep your business sharp with these secondary actions after completing your priority steps.
          </div>

          {visibleComingUp.length > 0 ? (
            <div className="space-y-3">
              {visibleComingUp.map((task) => renderTaskItem(task, false))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-8 text-center space-y-2">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#16866F] dark:text-[#65D6B2]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                No more upcoming actions pending
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                All recommended foundational actions have been addressed.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="space-y-4">
          <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-3 text-xs text-slate-700 dark:text-[#B5C5C7] flex items-center justify-between">
            <span>
              <strong>Accomplishments:</strong> You have completed {completedTasks.length} of {tasks.length} total improvements.
            </span>
          </div>

          {visibleCompleted.length > 0 ? (
            <div className="space-y-3">
              {visibleCompleted.map((task) => renderTaskItem(task, false))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-8 text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                No improvements marked complete yet. Click "Mark as Done" on any action once finished to see it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
