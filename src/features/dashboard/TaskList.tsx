import React, { useState, useMemo } from 'react';
import { GeneratedTask, TaskStatus, PriorityLevel, RecommendationCategory } from '../../types/recommendations';
import { TaskCard } from './TaskCard';
import { EmptyState } from '../../components/EmptyState';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface TaskListProps {
  tasks: GeneratedTask[];
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onSaveNote: (taskId: string, note: string) => void;
  activeCategoryFilter?: string;
  onCategoryFilterChange?: (category: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onStatusChange,
  onSaveNote,
  activeCategoryFilter,
  onCategoryFilterChange,
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'all' | PriorityLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [internalCategoryFilter, setInternalCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categoryFilter = activeCategoryFilter !== undefined ? activeCategoryFilter : internalCategoryFilter;
  const setCategoryFilter = (cat: string) => {
    if (onCategoryFilterChange) {
      onCategoryFilterChange(cat);
    } else {
      setInternalCategoryFilter(cat);
    }
  };

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.category));
    return Array.from(set).sort();
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesSummary = task.summary.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        const matchesTags = task.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesSummary && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, priorityFilter, statusFilter, categoryFilter, searchQuery]);

  const handleResetFilters = () => {
    setPriorityFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  const hasActiveFilters =
    priorityFilter !== 'all' ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Interactive Filter Bar */}
      <div className="no-print rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-xs space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#91A5A9]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recommendations by title, category, or keyword..."
              className="h-9 w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] pl-9 pr-3 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:bg-white dark:focus:bg-[#172830] focus:ring-1 focus:ring-[#16866F] dark:focus:ring-[#65D6B2] focus:outline-none"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400 dark:text-[#91A5A9] shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 text-xs font-medium text-slate-700 dark:text-[#F2F7F5] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:ring-1 focus:ring-[#16866F] dark:focus:ring-[#65D6B2] focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority and Status Segmented Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#304650] text-xs">
          {/* Priority Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#172830] rounded-lg">
            {(
              [
                { id: 'all', label: 'All Priorities' },
                { id: 'High', label: 'High Priority' },
                { id: 'Medium', label: 'Medium' },
                { id: 'Low', label: 'Low' },
              ] as { id: 'all' | PriorityLevel; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPriorityFilter(tab.id)}
                className={`h-7 inline-flex items-center justify-center px-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  priorityFilter === tab.id
                    ? 'bg-white dark:bg-[#223640] text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#172830] rounded-lg">
            {(
              [
                { id: 'all', label: 'All Statuses' },
                { id: 'not_started', label: 'Not Started' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'completed', label: 'Completed' },
              ] as { id: 'all' | TaskStatus; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`h-7 inline-flex items-center justify-center px-2.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-white dark:bg-[#223640] text-slate-900 dark:text-white shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="h-7 inline-flex items-center gap-1 text-slate-500 dark:text-[#91A5A9] hover:text-slate-800 dark:hover:text-[#F2F7F5] transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Task Count Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#91A5A9] px-1 font-mono tabular-nums">
        <span>
          Showing {filteredTasks.length} of {tasks.length} recommended actions
        </span>
      </div>

      {/* Task Cards or Empty State */}
      {filteredTasks.length > 0 ? (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onSaveNote={onSaveNote}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          illustrationType="no_tasks"
          title="No recommendations match your current filter"
          description="Try selecting 'All Priorities' or clearing your search term to see your full plan."
          actionLabel="Reset all filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
