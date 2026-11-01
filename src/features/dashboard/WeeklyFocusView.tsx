import React from 'react';
import { GeneratedTask, TaskStatus } from '../../types/recommendations';
import { TaskCard } from './TaskCard';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface WeeklyFocusViewProps {
  tasks: GeneratedTask[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSaveNote: (taskId: string, note: string) => void;
}

export const WeeklyFocusView: React.FC<WeeklyFocusViewProps> = ({
  tasks,
  onStatusChange,
  onSaveNote,
}) => {
  const weeks = [
    {
      group: 1,
      title: 'Week 1: Core Foundations & Discovery',
      desc: 'High-impact setup to establish basic presence and capture active nearby searchers.',
    },
    {
      group: 2,
      title: 'Week 2: Conversion Actions & Directories',
      desc: 'Make sure interested prospects can clearly understand your location and contact you without friction.',
    },
    {
      group: 3,
      title: 'Week 3: Social & Content Rhythms',
      desc: 'Answer common questions and build an authentic, low-stress local posting routine.',
    },
    {
      group: 4,
      title: 'Week 4 & Beyond: Measurement & Growth Habits',
      desc: 'Track inquiry sources and establish a simple 30-minute recurring marketing habit.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-[#16866F] dark:text-[#65D6B2]">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Suggested Weekly Focus Sequence</h3>
            <p className="mt-0.5 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
              Instead of trying to tackle everything at once, focus on 2–3 tasks per week. This schedule is a recommended sequence to prevent burnout; it is not an automated background reminder.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {weeks.map((week) => {
          const weekTasks = tasks.filter((t) => t.weeklyScheduleGroup === week.group);
          if (weekTasks.length === 0) return null;

          const completedCount = weekTasks.filter((t) => t.status === 'completed').length;
          const isAllDone = completedCount === weekTasks.length && weekTasks.length > 0;

          return (
            <div key={week.group} className="space-y-4">
              <div className="flex flex-col justify-between gap-1 border-b border-slate-200 dark:border-[#304650] pb-3 sm:flex-row sm:items-center">
                <div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
                    {week.title}
                    {isAllDone && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2]">
                        <CheckCircle2 className="h-4 w-4" />
                        Week Completed
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-[#91A5A9]">{week.desc}</p>
                </div>
                <div className="text-xs font-mono tabular-nums text-slate-500 dark:text-[#91A5A9]">
                  {completedCount} of {weekTasks.length} tasks done
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {weekTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={onStatusChange}
                    onSaveNote={onSaveNote}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
