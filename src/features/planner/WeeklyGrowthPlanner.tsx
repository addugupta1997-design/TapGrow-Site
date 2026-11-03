import React, { useState, useMemo } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import { GeneratedTask, TaskStatus, PriorityLevel } from '../../types/recommendations';
import {
  DayOfWeek,
  DAYS_OF_WEEK,
  WeeklyPlannerState,
  WeeklyReviewReport,
} from '../../types/planner';
import {
  generateWeeklyPlan,
  parseEffortToMinutes,
  getWeeklyCapacityMinutes,
  rescheduleUnfinishedTasks,
  generateWeeklyReview,
  generateMonthlyMilestones,
} from './planGenerator';
import { TaskDetailModal } from './TaskDetailModal';
import { WeeklyReviewModal } from './WeeklyReviewModal';
import { SmartRescheduleModal } from './SmartRescheduleModal';
import { MonthlyOverviewModal } from './MonthlyOverviewModal';
import { TaskCategoryIllustration } from '../../components/graphics/TaskCategoryIllustration';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Plus,
  ChevronRight,
  Layers,
  AlertCircle,
  HelpCircle,
  Eye,
  MoreVertical,
  PauseCircle,
  TrendingUp,
} from 'lucide-react';

interface WeeklyGrowthPlannerProps {
  answers: AssessmentAnswers;
  tasks: GeneratedTask[];
  plannerState?: WeeklyPlannerState;
  onUpdatePlannerState: (newPlannerState: WeeklyPlannerState) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSaveNote: (taskId: string, note: string) => void;
}

export const WeeklyGrowthPlanner: React.FC<WeeklyGrowthPlannerProps> = ({
  answers,
  tasks,
  plannerState,
  onUpdatePlannerState,
  onStatusChange,
  onSaveNote,
}) => {
  // Ensure we have a valid weekly planner state (initialize if not present)
  const activePlanner = useMemo(() => {
    if (plannerState && plannerState.schedule) {
      return plannerState;
    }
    return generateWeeklyPlan(answers, tasks);
  }, [plannerState, answers, tasks]);

  // Modals state
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<{
    task: GeneratedTask;
    day?: DayOfWeek;
  } | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);
  const [taskToRemovePrompt, setTaskToRemovePrompt] = useState<{ taskId: string; title: string } | null>(null);

  // Mobile selected day tab (on < 768px screens)
  const [mobileSelectedDay, setMobileSelectedDay] = useState<DayOfWeek>('monday');

  // Map tasks by ID for fast lookup
  const taskMap = useMemo(() => {
    const map = new Map<string, GeneratedTask>();
    tasks.forEach((t) => map.set(t.id, t));
    return map;
  }, [tasks]);

  // Calculate planned task statistics
  const scheduledTaskIds = useMemo(() => {
    const ids: string[] = [];
    DAYS_OF_WEEK.forEach(({ id }) => {
      (activePlanner.schedule[id] || []).forEach((tId) => ids.push(tId));
    });
    return Array.from(new Set(ids));
  }, [activePlanner]);

  const scheduledTasks = useMemo(() => {
    return scheduledTaskIds.map((id) => taskMap.get(id)).filter(Boolean) as GeneratedTask[];
  }, [scheduledTaskIds, taskMap]);

  const completedCount = scheduledTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = scheduledTasks.filter((t) => t.status === 'in_progress').length;
  const remainingCount = scheduledTasks.length - completedCount;
  const completionPercentage =
    scheduledTasks.length > 0 ? Math.round((completedCount / scheduledTasks.length) * 100) : 0;

  // Time calculations
  const totalAllocatedMinutes = scheduledTasks.reduce(
    (acc, t) => acc + parseEffortToMinutes(t.estimatedEffort),
    0
  );
  const capacityMinutes = getWeeklyCapacityMinutes(answers.weeklyHours);

  // Unscheduled recommendations (eligible tasks in catalog that are not on the 7-day schedule)
  const unscheduledTasks = useMemo(() => {
    const scheduledSet = new Set(scheduledTaskIds);
    return tasks.filter((t) => !scheduledSet.has(t.id) && t.status !== 'completed' && t.status !== 'deferred');
  }, [tasks, scheduledTaskIds]);

  // Handlers for schedule modifications
  const handleMoveTaskDay = (taskId: string, targetDay: DayOfWeek) => {
    const newSchedule = { ...activePlanner.schedule };
    // Remove from all days
    DAYS_OF_WEEK.forEach(({ id }) => {
      newSchedule[id] = (newSchedule[id] || []).filter((id) => id !== taskId);
    });
    // Add to target day
    newSchedule[targetDay] = [...(newSchedule[targetDay] || []), taskId];

    const updated: WeeklyPlannerState = {
      ...activePlanner,
      schedule: newSchedule,
      lastGeneratedAt: new Date().toISOString(),
    };
    onUpdatePlannerState(updated);
  };

  const handleRemoveTaskFromSchedule = (taskId: string) => {
    const newSchedule = { ...activePlanner.schedule };
    DAYS_OF_WEEK.forEach(({ id }) => {
      newSchedule[id] = (newSchedule[id] || []).filter((id) => id !== taskId);
    });

    const updated: WeeklyPlannerState = {
      ...activePlanner,
      schedule: newSchedule,
      lastGeneratedAt: new Date().toISOString(),
    };
    onUpdatePlannerState(updated);
    setTaskToRemovePrompt(null);
  };

  const handleAddTaskToDay = (taskId: string, targetDay: DayOfWeek) => {
    const newSchedule = { ...activePlanner.schedule };
    if (!newSchedule[targetDay].includes(taskId)) {
      newSchedule[targetDay] = [...newSchedule[targetDay], taskId];
    }
    const updated: WeeklyPlannerState = {
      ...activePlanner,
      schedule: newSchedule,
      lastGeneratedAt: new Date().toISOString(),
    };
    onUpdatePlannerState(updated);
  };

  const handleRegeneratePlan = () => {
    const freshPlan = generateWeeklyPlan(answers, tasks, {
      weekNumber: activePlanner.weekNumber,
    });
    onUpdatePlannerState(freshPlan);
  };

  const handleConfirmReschedule = () => {
    const nextPlan = rescheduleUnfinishedTasks(activePlanner, tasks, answers);
    onUpdatePlannerState(nextPlan);
  };

  // Generate weekly review report data
  const reviewReport: WeeklyReviewReport = useMemo(() => {
    return generateWeeklyReview(activePlanner, tasks, answers);
  }, [activePlanner, tasks, answers]);

  // Generate monthly milestones data
  const monthlyMilestones = useMemo(() => {
    return generateMonthlyMilestones(answers, tasks, activePlanner.weekNumber);
  }, [answers, tasks, activePlanner.weekNumber]);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Bar */}
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs space-y-5 transition-colors duration-150">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-[#304650] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2] bg-[#E0F5EE] dark:bg-[#16866F]/20 px-2 py-0.5 rounded">
                <Calendar className="h-3 w-3" />
                Week {activePlanner.weekNumber} Execution Plan
              </span>
              <span className="text-xs text-slate-400 dark:text-[#91A5A9] font-mono">
                Starting {activePlanner.startDateIso}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-[#142A36] dark:text-[#F2F7F5] sm:text-2xl">
              Weekly Growth Planner
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-[#91A5A9]">
              Converts your prioritized recommendations into an achievable 7-day schedule calibrated to your capacity.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsRescheduleModalOpen(true)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
              title="Re-balance unfinished tasks into a fresh schedule"
            >
              <RotateCcw className="h-3.5 w-3.5 text-amber-500" />
              <span>Smart Reschedule</span>
            </button>

            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
              title="Review this week's achievements and reflection"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              <span>Weekly Review</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMonthlyModalOpen(true)}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
              title="View 30-day milestone roadmap"
            >
              <TrendingUp className="h-3.5 w-3.5 text-teal-600 dark:text-[#65D6B2]" />
              <span>Monthly Roadmap</span>
            </button>

            <button
              type="button"
              onClick={handleRegeneratePlan}
              className="h-8 px-3 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] text-xs font-bold text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors shadow-2xs"
              title="Re-balance recommendations across the 7 days"
            >
              <span>Regenerate Plan</span>
            </button>
          </div>
        </div>

        {/* 2. Overview KPI Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* A. Planned Actions */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-[#172830] border border-slate-100 dark:border-[#304650]">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Planned Actions</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
                {scheduledTasks.length}
              </span>
              <span className="text-xs text-slate-400">tasks</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {scheduledTasks.filter((t) => t.priority === 'High').length} High priority
            </span>
          </div>

          {/* B. Completion Progress */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-[#172830] border border-slate-100 dark:border-[#304650]">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Weekly Completion</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-extrabold text-[#16866F] dark:text-[#65D6B2]">
                {completionPercentage}%
              </span>
              <span className="text-xs text-slate-400">({completedCount}/{scheduledTasks.length})</span>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-[#304650] overflow-hidden">
              <div
                className="h-full bg-[#16866F] dark:bg-[#65D6B2] rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* C. Time Allocated vs Capacity */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-[#172830] border border-slate-100 dark:border-[#304650]">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Time Investment</span>
            <div className="mt-1 flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
                {totalAllocatedMinutes}
              </span>
              <span className="text-xs text-slate-500 font-mono">/ ~{capacityMinutes} mins</span>
            </div>
            <span className="text-[11px] text-emerald-700 dark:text-[#65D6B2] mt-1 block font-medium">
              Within your {answers.weeklyHours.replace(/_/g, ' ')} target
            </span>
          </div>

          {/* D. Backlog & Unscheduled Pool */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-[#172830] border border-slate-100 dark:border-[#304650]">
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#91A5A9] uppercase">Backlog Pool</span>
            <div className="mt-1 flex items-baseline gap-1.5 font-mono">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
                {unscheduledTasks.length}
              </span>
              <span className="text-xs text-slate-400">available</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Waiting for future weekly cycles
            </span>
          </div>
        </div>
      </div>

      {/* 3. Mobile Day Navigation Tabs (< 768px) */}
      <div className="block md:hidden">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#172830] rounded-xl overflow-x-auto scrollbar-none">
          {DAYS_OF_WEEK.map((d) => {
            const dayTaskCount = (activePlanner.schedule[d.id] || []).length;
            const isSelected = mobileSelectedDay === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setMobileSelectedDay(d.id)}
                className={`flex-1 min-w-[70px] py-2 px-1 text-center rounded-lg text-xs transition-colors shrink-0 ${
                  isSelected
                    ? 'bg-white dark:bg-[#223640] text-slate-900 dark:text-[#F2F7F5] font-bold shadow-2xs'
                    : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white/50'
                }`}
              >
                <span className="block font-semibold">{d.short}</span>
                <span className="text-[10px] text-slate-400 font-mono">{dayTaskCount} tasks</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. 7-Day Schedule Grid (Desktop) or Selected Day View (Mobile) */}
      <div className="space-y-4">
        {/* On Mobile: Single Day Card */}
        <div className="block md:hidden">
          {(() => {
            const dayMeta = DAYS_OF_WEEK.find((d) => d.id === mobileSelectedDay)!;
            const dayTaskIds = activePlanner.schedule[mobileSelectedDay] || [];
            const dayTasks = dayTaskIds.map((id) => taskMap.get(id)).filter(Boolean) as GeneratedTask[];
            const dayMinutes = dayTasks.reduce(
              (acc, t) => acc + parseEffortToMinutes(t.estimatedEffort),
              0
            );

            return (
              <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                      {dayMeta.label}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-[#91A5A9]">
                      {dayTasks.length} {dayTasks.length === 1 ? 'task' : 'tasks'} scheduled · ~{dayMinutes} mins
                    </span>
                  </div>
                  {unscheduledTasks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleAddTaskToDay(unscheduledTasks[0].id, mobileSelectedDay)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#16866F] dark:text-[#65D6B2] hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Task
                    </button>
                  )}
                </div>

                {dayTasks.length > 0 ? (
                  <div className="space-y-3">
                    {dayTasks.map((task) => (
                      <PlannerTaskCard
                        key={task.id}
                        task={task}
                        day={mobileSelectedDay}
                        onStatusChange={onStatusChange}
                        onViewDetail={() => setSelectedTaskForDetail({ task, day: mobileSelectedDay })}
                        onMoveDay={(newDay) => handleMoveTaskDay(task.id, newDay)}
                        onRemove={() => setTaskToRemovePrompt({ taskId: task.id, title: task.title })}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-[#304650] text-center text-xs text-slate-500 dark:text-[#91A5A9]">
                    <Clock className="h-6 w-6 mx-auto mb-1 text-slate-400 opacity-60" />
                    <p className="font-semibold text-slate-700 dark:text-[#B5C5C7]">Focus on Operations</p>
                    <p className="text-[11px] mt-0.5">No marketing tasks scheduled for this day.</p>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* On Desktop: 7-Day Responsive Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-7 gap-3 items-start">
          {DAYS_OF_WEEK.map((d) => {
            const dayTaskIds = activePlanner.schedule[d.id] || [];
            const dayTasks = dayTaskIds.map((id) => taskMap.get(id)).filter(Boolean) as GeneratedTask[];
            const dayMinutes = dayTasks.reduce(
              (acc, t) => acc + parseEffortToMinutes(t.estimatedEffort),
              0
            );

            return (
              <div
                key={d.id}
                className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3.5 flex flex-col justify-between min-h-[320px] shadow-xs"
              >
                <div>
                  {/* Day Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] pb-2 mb-3">
                    <div>
                      <span className="block text-xs font-bold text-slate-900 dark:text-[#F2F7F5]">
                        {d.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dayTasks.length > 0 ? `${dayMinutes}m · ${dayTasks.length} task` : 'Rest day'}
                      </span>
                    </div>
                  </div>

                  {/* Tasks in this day */}
                  {dayTasks.length > 0 ? (
                    <div className="space-y-2.5">
                      {dayTasks.map((task) => (
                        <PlannerTaskCard
                          key={task.id}
                          task={task}
                          day={d.id}
                          compact
                          onStatusChange={onStatusChange}
                          onViewDetail={() => setSelectedTaskForDetail({ task, day: d.id })}
                          onMoveDay={(newDay) => handleMoveTaskDay(task.id, newDay)}
                          onRemove={() => setTaskToRemovePrompt({ taskId: task.id, title: task.title })}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-[11px] text-slate-400 dark:text-[#91A5A9]">
                      <span className="block font-medium">Operations</span>
                      <span className="text-[10px] opacity-75">No tasks</span>
                    </div>
                  )}
                </div>

                {/* Day Footer with Quick Add */}
                {unscheduledTasks.length > 0 && (
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-[#304650]">
                    <button
                      type="button"
                      onClick={() => handleAddTaskToDay(unscheduledTasks[0].id, d.id)}
                      className="w-full text-center py-1 text-[11px] font-semibold text-[#16866F] dark:text-[#65D6B2] hover:bg-slate-50 dark:hover:bg-[#223640] rounded transition-colors"
                      title={`Assign top backlog action to ${d.label}`}
                    >
                      + Add Task
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Unscheduled Backlog Drawer / Pool */}
      {unscheduledTasks.length > 0 && (
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#1D3039] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500 dark:text-[#91A5A9]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5]">
                Available Recommendations Pool ({unscheduledTasks.length} unscheduled)
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Not currently assigned to this 7-day plan
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
            To protect your focus, these actions are held in reserve. You can pull any of them into a specific day below:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {unscheduledTasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] flex flex-col justify-between gap-2 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-600 dark:text-[#B5C5C7] truncate">
                      {task.category}
                    </span>
                    <span
                      className={`font-bold ${
                        task.priority === 'High'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] line-clamp-2">
                    {task.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    Est. {task.estimatedEffort}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskForDetail({ task })}
                    className="text-[11px] font-semibold text-slate-500 dark:text-[#91A5A9] hover:underline"
                  >
                    View Details
                  </button>

                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddTaskToDay(task.id, e.target.value as DayOfWeek);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="h-7 rounded border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] px-2 text-[11px] font-semibold text-[#16866F] dark:text-[#65D6B2] focus:outline-none"
                  >
                    <option value="" disabled>
                      + Add to Day...
                    </option>
                    {DAYS_OF_WEEK.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Modals */}
      {selectedTaskForDetail && (
        <TaskDetailModal
          isOpen={true}
          task={selectedTaskForDetail.task}
          scheduledDay={selectedTaskForDetail.day}
          onClose={() => setSelectedTaskForDetail(null)}
          onStatusChange={(taskId, newStatus) => {
            onStatusChange(taskId, newStatus);
            // Refresh task object in modal view
            const updated = taskMap.get(taskId);
            if (updated) setSelectedTaskForDetail({ task: { ...updated, status: newStatus }, day: selectedTaskForDetail.day });
          }}
          onMoveDay={(taskId, newDay) => {
            handleMoveTaskDay(taskId, newDay);
            setSelectedTaskForDetail({ ...selectedTaskForDetail, day: newDay });
          }}
          onRemoveFromSchedule={handleRemoveTaskFromSchedule}
        />
      )}

      {isReviewModalOpen && (
        <WeeklyReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          report={reviewReport}
          onStartNextWeek={handleConfirmReschedule}
        />
      )}

      {isRescheduleModalOpen && (
        <SmartRescheduleModal
          isOpen={isRescheduleModalOpen}
          onClose={() => setIsRescheduleModalOpen(false)}
          planner={activePlanner}
          tasks={tasks}
          weeklyHoursPreference={answers.weeklyHours}
          onConfirmReschedule={handleConfirmReschedule}
        />
      )}

      {isMonthlyModalOpen && (
        <MonthlyOverviewModal
          isOpen={isMonthlyModalOpen}
          onClose={() => setIsMonthlyModalOpen(false)}
          milestones={monthlyMilestones}
          businessName={answers.businessName}
          categoryLabel={answers.category.replace(/_/g, ' ')}
        />
      )}

      {/* Confirmation Dialog before removing a task from the weekly schedule */}
      {taskToRemovePrompt && (
        <ConfirmDialog
          isOpen={true}
          title="Remove from This Week's Schedule?"
          message={`"${taskToRemovePrompt.title}" will be moved back to your unscheduled recommendations pool. It will NOT be deleted from your marketing plan.`}
          confirmLabel="Remove from Week"
          isDestructive={false}
          onConfirm={() => handleRemoveTaskFromSchedule(taskToRemovePrompt.taskId)}
          onCancel={() => setTaskToRemovePrompt(null)}
        />
      )}
    </div>
  );
};

/**
 * Clean Task Card item used inside each day column
 */
interface PlannerTaskCardProps {
  task: GeneratedTask;
  day: DayOfWeek;
  compact?: boolean;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onViewDetail: () => void;
  onMoveDay: (targetDay: DayOfWeek) => void;
  onRemove: () => void;
}

const PlannerTaskCard: React.FC<PlannerTaskCardProps> = ({
  task,
  day,
  compact = false,
  onStatusChange,
  onViewDetail,
  onMoveDay,
  onRemove,
}) => {
  const isCompleted = task.status === 'completed';
  const isInProgress = task.status === 'in_progress';
  const isDeferred = task.status === 'deferred';

  return (
    <div
      className={`rounded-lg border p-2.5 transition-all text-xs ${
        isCompleted
          ? 'border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/20 dark:bg-emerald-950/20'
          : isInProgress
          ? 'border-amber-200 dark:border-amber-800/60 bg-amber-50/20 dark:bg-amber-950/20'
          : isDeferred
          ? 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 opacity-75'
          : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onStatusChange(task.id, isCompleted ? 'not_started' : 'completed')}
          className="mt-0.5 text-slate-400 hover:text-[#16866F] dark:hover:text-[#65D6B2] shrink-0"
          title={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
          ) : isInProgress ? (
            <Clock className="h-4 w-4 text-amber-500" />
          ) : isDeferred ? (
            <PauseCircle className="h-4 w-4 text-slate-400" />
          ) : (
            <Circle className="h-4 w-4 text-slate-300 dark:text-[#3A535D]" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <span
              className={`text-[10px] font-bold ${
                task.priority === 'High'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {task.priority}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {task.estimatedEffort.split(' ')[0]}
            </span>
          </div>

          <h4
            onClick={onViewDetail}
            className={`font-semibold cursor-pointer hover:text-[#16866F] dark:hover:text-[#65D6B2] line-clamp-2 leading-tight ${
              isCompleted ? 'line-through text-slate-400' : 'text-slate-900 dark:text-[#F2F7F5]'
            }`}
          >
            {task.title}
          </h4>

          {/* Card footer controls */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={onViewDetail}
              className="text-[#16866F] dark:text-[#65D6B2] font-semibold hover:underline"
            >
              Details
            </button>

            <select
              value={day}
              onChange={(e) => onMoveDay(e.target.value as DayOfWeek)}
              className="h-6 rounded border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] px-1 text-[10px] text-slate-600 dark:text-[#B5C5C7] focus:outline-none"
              title="Move to another day"
            >
              {DAYS_OF_WEEK.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.short}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
