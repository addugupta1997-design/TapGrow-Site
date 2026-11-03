import React from 'react';
import { WorkspaceData, WorkspaceSubTab, ContentItem, Campaign } from '../../types/workspace';
import { AssessmentAnswers } from '../../types/assessment';
import {
  FileText,
  Calendar,
  Sparkles,
  Bookmark,
  StickyNote,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  Share2,
  Tag,
  Pin,
  ExternalLink,
} from 'lucide-react';

interface WorkspaceOverviewProps {
  data: WorkspaceData;
  answers: AssessmentAnswers;
  onNavigateTab: (tab: WorkspaceSubTab) => void;
  onOpenCreateContent: () => void;
  onOpenCreateCampaign: () => void;
  onOpenCreateIdea: () => void;
  onOpenCreateNote: () => void;
  onOpenAIAssistant: () => void;
}

export const WorkspaceOverview: React.FC<WorkspaceOverviewProps> = ({
  data,
  answers,
  onNavigateTab,
  onOpenCreateContent,
  onOpenCreateCampaign,
  onOpenCreateIdea,
  onOpenCreateNote,
  onOpenAIAssistant,
}) => {
  const bizName = answers.businessName || 'Your Business';

  // Calculate real metrics
  const totalContent = data.contents.length;
  const activeCampaigns = data.campaigns.filter((c) => c.status === 'active');
  const savedIdeasCount = data.ideas.length;
  const notesCount = data.notes.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingContent = data.contents.filter(
    (c) => c.scheduledDate && c.scheduledDate >= todayStr && c.status !== 'published'
  ).sort((a, b) => (a.scheduledDate || '').localeCompare(b.scheduledDate || ''));

  const recentNotes = [...data.notes]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const pinnedNotes = data.notes.filter((n) => n.isPinned);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner with Quick Actions */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-[#E0F5EE] dark:bg-[#16866F]/20 px-2 py-0.5 text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">
                Marketing Command Centre
              </span>
              <span className="text-xs text-slate-400 dark:text-[#91A5A9]">·</span>
              <span className="text-xs text-slate-500 dark:text-[#91A5A9]">{answers.category.replace(/_/g, ' ')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#142A36] dark:text-[#F2F7F5]">
              Welcome back to {bizName}'s Marketing Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#B5C5C7] max-w-2xl">
              Plan social posts, run focused campaigns, capture creative ideas, and keep strategy notes organized in one central place.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenAIAssistant}
              className="h-9 inline-flex items-center gap-1.5 rounded-lg border border-[#16866F]/30 bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3.5 text-xs font-bold text-[#0F5C4D] dark:text-[#65D6B2] shadow-2xs hover:bg-[#D4EFE6] dark:hover:bg-[#16866F]/30 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              <span>AI Content Assistant</span>
            </button>
            <button
              type="button"
              onClick={onOpenCreateContent}
              className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Content</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Content */}
        <div
          onClick={() => onNavigateTab('content')}
          className="group cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#91A5A9]">Total Content</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2]">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-[#F2F7F5]">{totalContent}</div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9]">
            <span>{upcomingContent.length} upcoming</span>
            <span className="text-[#16866F] dark:text-[#65D6B2] group-hover:translate-x-0.5 transition-transform">View →</span>
          </div>
        </div>

        {/* Card 2: Active Campaigns */}
        <div
          onClick={() => onNavigateTab('campaigns')}
          className="group cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#91A5A9]">Active Campaigns</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-[#F2F7F5]">{activeCampaigns.length}</div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9]">
            <span>{data.campaigns.length} total campaigns</span>
            <span className="text-[#16866F] dark:text-[#65D6B2] group-hover:translate-x-0.5 transition-transform">Manage →</span>
          </div>
        </div>

        {/* Card 3: Saved Ideas */}
        <div
          onClick={() => onNavigateTab('ideas')}
          className="group cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#91A5A9]">Saved Ideas</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Bookmark className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-[#F2F7F5]">{savedIdeasCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9]">
            <span>{data.ideas.filter((i) => i.isFavourite).length} starred</span>
            <span className="text-[#16866F] dark:text-[#65D6B2] group-hover:translate-x-0.5 transition-transform">Explore →</span>
          </div>
        </div>

        {/* Card 4: Marketing Notes */}
        <div
          onClick={() => onNavigateTab('notes')}
          className="group cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#91A5A9]">Marketing Notes</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              <StickyNote className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-[#F2F7F5]">{notesCount}</div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9]">
            <span>{pinnedNotes.length} pinned</span>
            <span className="text-[#16866F] dark:text-[#65D6B2] group-hover:translate-x-0.5 transition-transform">Open →</span>
          </div>
        </div>
      </div>

      {/* Grid: Upcoming Content + Active Campaigns & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Scheduled Content (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#304650] pb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Upcoming Content</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('content')}
              className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
            >
              View All Content ({data.contents.length}) →
            </button>
          </div>

          {upcomingContent.length > 0 ? (
            <div className="space-y-2.5">
              {upcomingContent.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigateTab('content')}
                  className="cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3.5 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700 dark:text-[#F2F7F5]">
                        {item.platform}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] truncate">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#91A5A9] line-clamp-1">
                      {item.caption || item.description || 'No caption set'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-[#304650] px-2 py-0.5 text-[11px] font-medium text-emerald-800 dark:text-[#65D6B2]">
                      <Clock className="h-3 w-3" />
                      {item.scheduledDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#304650] p-8 text-center bg-slate-50/50 dark:bg-[#172830]">
              <Calendar className="h-8 w-8 text-slate-400 dark:text-[#91A5A9] mx-auto mb-2 opacity-60" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-[#F2F7F5]">No scheduled upcoming content</h4>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-1 max-w-sm mx-auto">
                Schedule your next social post or Google update to keep your local presence active and consistent.
              </p>
              <button
                type="button"
                onClick={onOpenCreateContent}
                className="mt-3.5 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D]"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Content Item</span>
              </button>
            </div>
          )}

          {/* Active Campaigns Row */}
          <div className="pt-2">
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#304650] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Active & Planned Campaigns</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab('campaigns')}
                className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
              >
                Manage Campaigns →
              </button>
            </div>

            {data.campaigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.campaigns.slice(0, 2).map((camp) => (
                  <div
                    key={camp.id}
                    onClick={() => onNavigateTab('campaigns')}
                    className="cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3.5 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] truncate">
                        {camp.name}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-[#65D6B2]'
                            : 'bg-slate-100 text-slate-700 dark:bg-[#223640] dark:text-slate-300'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#B5C5C7] line-clamp-2">
                      {camp.objective}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#91A5A9] pt-1 border-t border-slate-100 dark:border-[#304650]">
                      <span>{camp.marketingChannel}</span>
                      <span>{camp.startDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#304650] p-6 text-center bg-slate-50/50 dark:bg-[#172830]">
                <p className="text-xs text-slate-500 dark:text-[#91A5A9]">No active marketing campaigns yet.</p>
                <button
                  type="button"
                  onClick={onOpenCreateCampaign}
                  className="mt-2 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
                >
                  + Start a seasonal campaign
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Notes & Pinned Ideas (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-[#304650] pb-2">
            <div className="flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">Recent Notes</h3>
            </div>
            <button
              type="button"
              onClick={onOpenCreateNote}
              className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
            >
              + New Note
            </button>
          </div>

          {recentNotes.length > 0 ? (
            <div className="space-y-2.5">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onNavigateTab('notes')}
                  className="cursor-pointer rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3 shadow-2xs hover:border-[#16866F] dark:hover:border-[#65D6B2] transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-1.5">
                      {note.isPinned && <Pin className="h-3 w-3 text-amber-500 fill-amber-500" />}
                      {note.title}
                    </span>
                    {note.category && (
                      <span className="text-[10px] rounded bg-slate-100 dark:bg-[#223640] px-1.5 py-0.5 text-slate-600 dark:text-[#91A5A9]">
                        {note.category}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-[#B5C5C7] line-clamp-2">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#304650] p-6 text-center bg-slate-50/50 dark:bg-[#172830]">
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">No notes saved yet.</p>
              <button
                type="button"
                onClick={onOpenCreateNote}
                className="mt-2 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
              >
                + Add quick note
              </button>
            </div>
          )}

          {/* Quick Ideas Shortcut Box */}
          <div className="rounded-xl border border-amber-200 dark:border-[#304650] bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                Saved Ideas Library ({data.ideas.length})
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('ideas')}
                className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 hover:underline"
              >
                Browse →
              </button>
            </div>
            {data.ideas.length > 0 ? (
              <p className="text-xs text-slate-700 dark:text-[#B5C5C7] line-clamp-2">
                Latest: <strong>{data.ideas[0].title}</strong> — {data.ideas[0].description}
              </p>
            ) : (
              <p className="text-xs text-slate-600 dark:text-[#B5C5C7]">Save content hooks and campaign ideas for later.</p>
            )}
            <button
              type="button"
              onClick={onOpenCreateIdea}
              className="w-full text-center text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline"
            >
              + Save New Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
