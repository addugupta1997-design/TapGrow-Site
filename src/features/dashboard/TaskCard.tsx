import React, { useState } from 'react';
import { GeneratedTask, TaskStatus } from '../../types/recommendations';
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Sparkles,
  HelpCircle,
  Wrench,
  Gauge,
  Calendar,
  AlertTriangle,
  PauseCircle,
} from 'lucide-react';
import { TaskCategoryIllustration } from '../../components/graphics/TaskCategoryIllustration';

interface TaskCardProps {
  task: GeneratedTask;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSaveNote: (taskId: string, note: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onSaveNote }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWhyOpen, setIsWhyOpen] = useState(false);
  const [noteText, setNoteText] = useState(task.notes || '');
  const [isNoteDirty, setIsNoteDirty] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';
  const isDeferred = task.status === 'deferred';

  const handleToggleComplete = () => {
    onStatusChange(task.id, isCompleted ? 'not_started' : 'completed');
  };

  const handleSaveNote = () => {
    onSaveNote(task.id, noteText);
    setIsNoteDirty(false);
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  // Difficulty badge colors
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Advanced':
        return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800';
      case 'Intermediate':
        return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
      case 'Beginner':
      default:
        return 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800';
    }
  };

  return (
    <div
      className={`card-print rounded-xl border bg-white dark:bg-[#1D3039] transition-all shadow-xs ${
        isCompleted
          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20'
          : isInProgress
          ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/10 dark:bg-amber-950/20'
          : isDeferred
          ? 'border-slate-300 dark:border-slate-700 opacity-75 bg-slate-50/50 dark:bg-[#172830]'
          : 'border-slate-200 dark:border-[#304650]'
      }`}
    >
      <div className="p-5 sm:p-6">
        {/* Top Header: Category, Priority, Effort & Target Window */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
          <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-[#B5C5C7] font-medium">
            <TaskCategoryIllustration category={task.category} size="sm" />
            <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">{task.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="h-3 w-3 text-slate-400" />
              {task.estimatedEffort}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-slate-400" />
              {task.suggestedTimeToComplete}
            </span>
            {task.difficultyLevel && (
              <>
                <span aria-hidden="true">·</span>
                <span
                  className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-semibold border ${getDifficultyColor(
                    task.difficultyLevel
                  )}`}
                >
                  <Gauge className="h-3 w-3" />
                  {task.difficultyLevel}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Status Indicator */}
            {isDeferred && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-[#91A5A9] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                <PauseCircle className="h-3 w-3" />
                Deferred
              </span>
            )}

            {/* Priority Indicator */}
            <span
              className={`inline-flex items-center gap-1 font-semibold text-xs ${
                task.priority === 'High'
                  ? 'text-red-700 dark:text-red-400'
                  : task.priority === 'Medium'
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-slate-600 dark:text-[#B5C5C7]'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  task.priority === 'High'
                    ? 'bg-red-500'
                    : task.priority === 'Medium'
                    ? 'bg-amber-500'
                    : 'bg-slate-400 dark:bg-slate-500'
                }`}
              />
              {task.priority} Priority
            </span>
          </div>
        </div>

        {/* Title and Quick Completion Checkbox */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={handleToggleComplete}
            className="mt-0.5 shrink-0 rounded-md p-1 text-slate-400 dark:text-[#91A5A9] hover:text-[#16866F] dark:hover:text-[#65D6B2] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            aria-label={
              isCompleted
                ? `Mark '${task.title}' as incomplete`
                : `Mark '${task.title}' as complete`
            }
          >
            {isCompleted ? (
              <CheckCircle2 className="h-6 w-6 text-[#16866F] dark:text-[#65D6B2]" />
            ) : isInProgress ? (
              <Clock className="h-6 w-6 text-amber-500 dark:text-amber-400" />
            ) : isDeferred ? (
              <PauseCircle className="h-6 w-6 text-slate-400 dark:text-[#91A5A9]" />
            ) : (
              <Circle className="h-6 w-6 text-slate-300 dark:text-[#3A535D] hover:text-slate-400 dark:hover:text-[#91A5A9]" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h3
              className={`text-base font-bold text-slate-900 dark:text-[#F2F7F5] leading-snug ${
                isCompleted ? 'line-through text-slate-500 dark:text-[#91A5A9]' : ''
              }`}
            >
              {task.title}
            </h3>

            <p className="mt-1 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed sm:text-sm">
              {task.summary}
            </p>

            {/* Structured Insights: What Problem it Addresses & Expected Benefit */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {task.problemAddressed && (
                <div className="rounded-lg bg-amber-50/50 dark:bg-amber-950/20 p-2.5 border border-amber-200/50 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
                  <span className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300 mb-0.5">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    What Problem it Addresses:
                  </span>
                  <span className="text-slate-700 dark:text-[#B5C5C7] leading-normal block">
                    {task.problemAddressed}
                  </span>
                </div>
              )}

              <div className="rounded-lg bg-[#E0F5EE]/60 dark:bg-[#16866F]/15 p-2.5 border border-emerald-200/60 dark:border-[#304650] text-[#0F5C4D] dark:text-[#65D6B2]">
                <span className="font-bold flex items-center gap-1 text-[#0F5C4D] dark:text-[#65D6B2] mb-0.5">
                  <Sparkles className="h-3 w-3 shrink-0" />
                  Expected Business Benefit:
                </span>
                <span className="text-slate-700 dark:text-[#B5C5C7] leading-normal block">
                  {task.expectedBenefit || task.whyItMatters}
                </span>
              </div>
            </div>

            {/* "Why am I seeing this?" collapsible explanation */}
            {task.whySeeingThis && (
              <div className="mt-2.5">
                <button
                  type="button"
                  onClick={() => setIsWhyOpen(!isWhyOpen)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-[#91A5A9] hover:text-[#16866F] dark:hover:text-[#65D6B2] transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Why am I seeing this recommendation?</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${isWhyOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isWhyOpen && (
                  <div className="mt-1.5 rounded-lg bg-slate-50 dark:bg-[#172830] p-2.5 text-xs text-slate-600 dark:text-[#B5C5C7] border border-slate-200/80 dark:border-[#304650] animate-in fade-in duration-100">
                    <strong className="text-slate-800 dark:text-[#F2F7F5]">Personalized Assessment Match: </strong>
                    {task.whySeeingThis}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="no-print mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-[#304650] pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:text-[#0F5C4D] dark:hover:text-[#65D6B2]/80"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Action Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  View Step-by-Step Instructions ({task.instructions.length})
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Start Task / In Progress toggle */}
            {!isCompleted && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(task.id, isInProgress ? 'not_started' : 'in_progress')
                }
                className={`h-8 inline-flex items-center justify-center rounded-md px-3 text-xs font-semibold border transition-colors ${
                  isInProgress
                    ? 'border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                    : 'border-slate-200 dark:border-[#304650] text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-50 dark:hover:bg-[#223640]'
                }`}
              >
                {isInProgress ? 'In Progress' : 'Start Task'}
              </button>
            )}

            {/* Defer toggle */}
            {!isCompleted && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(task.id, isDeferred ? 'not_started' : 'deferred')
                }
                className={`h-8 inline-flex items-center justify-center rounded-md px-2.5 text-xs font-medium border transition-colors ${
                  isDeferred
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'border-slate-200 dark:border-[#304650] text-slate-500 dark:text-[#91A5A9] hover:bg-slate-50 dark:hover:bg-[#223640]'
                }`}
                title={isDeferred ? 'Move back to active recommendations' : 'Postpone this task for later'}
              >
                {isDeferred ? 'Resume' : 'Defer'}
              </button>
            )}

            {/* Complete toggle */}
            <button
              type="button"
              onClick={handleToggleComplete}
              className={`h-8 inline-flex items-center justify-center rounded-md px-3 text-xs font-semibold transition-colors ${
                isCompleted
                  ? 'border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-50 dark:hover:bg-[#223640]'
                  : 'bg-[#16866F] text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80]'
              }`}
            >
              {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
          </div>
        </div>

        {/* Expandable Step-by-Step Instructions & Resources */}
        {isExpanded && (
          <div className="mt-4 rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#172830] p-4 text-xs text-slate-700 dark:text-[#B5C5C7] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pb-2 border-b border-slate-200/60 dark:border-[#304650]">
              <div>
                <span className="font-semibold text-slate-700 dark:text-[#F2F7F5] block">
                  Estimated Effort:
                </span>
                <span className="font-mono text-slate-600 dark:text-[#B5C5C7]">
                  {task.estimatedEffort}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-[#F2F7F5] block">
                  Difficulty Level:
                </span>
                <span className="font-medium text-slate-600 dark:text-[#B5C5C7]">
                  {task.difficultyLevel || 'Beginner'}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-700 dark:text-[#F2F7F5] block">
                  Target Window:
                </span>
                <span className="font-mono text-slate-600 dark:text-[#B5C5C7]">
                  {task.suggestedTimeToComplete}
                </span>
              </div>
            </div>

            {task.requiredResources && (
              <div className="rounded-lg bg-white dark:bg-[#1D3039] p-2.5 border border-slate-200 dark:border-[#304650]">
                <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-[#F2F7F5] mb-0.5">
                  <Wrench className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
                  Required Resources:
                </span>
                <p className="text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                  {task.requiredResources}
                </p>
              </div>
            )}

            <div>
              <h4 className="font-bold text-slate-900 dark:text-[#F2F7F5] mb-2">
                Step-by-Step Instructions:
              </h4>
              <ol className="list-decimal list-inside space-y-2 pl-1 leading-relaxed">
                {task.instructions.map((step, idx) => (
                  <li key={idx} className="text-slate-700 dark:text-[#B5C5C7]">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="border-t border-slate-200 dark:border-[#304650] pt-3">
              <span className="font-bold text-slate-900 dark:text-[#F2F7F5]">
                Completion Criteria:
              </span>
              <p className="mt-0.5 text-slate-600 dark:text-[#B5C5C7]">
                {task.completionCriteria}
              </p>
            </div>

            {task.suggestedNextStep && (
              <div className="border-t border-slate-200 dark:border-[#304650] pt-3 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-800/40">
                <span className="font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                  Suggested Next Action:
                </span>
                <p className="mt-0.5 text-slate-700 dark:text-[#F2F7F5] font-medium">
                  {task.suggestedNextStep}
                </p>
              </div>
            )}

            {task.referenceUrl && (
              <div className="border-t border-slate-200 dark:border-[#304650] pt-3">
                <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] mr-2">
                  Official Reference Guide:
                </span>
                <a
                  href={task.referenceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-medium text-[#16866F] dark:text-[#65D6B2] hover:underline"
                >
                  {task.referenceTitle || 'Read Official Guidelines'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Personal Notes Section */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#304650]">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] mb-1.5">
            <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-[#B5C5C7]">
              <MessageSquare className="h-3.5 w-3.5" />
              My Personal Notes & Progress Logs
            </span>
            {savedFeedback && (
              <span className="text-emerald-700 dark:text-[#65D6B2] font-semibold animate-in fade-in">
                Saved!
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                setIsNoteDirty(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveNote();
              }}
              placeholder="Record account details, next steps, or confirmation dates..."
              className="h-8 flex-1 rounded-md border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] px-3 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:bg-white dark:focus:bg-[#172830] focus:outline-none"
            />
            {isNoteDirty && (
              <button
                type="button"
                onClick={handleSaveNote}
                className="h-8 rounded-md bg-[#16866F] px-3 text-xs font-semibold text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
