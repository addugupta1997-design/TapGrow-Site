import React, { useState, useMemo } from 'react';
import {
  ContentItem,
  ContentPlatform,
  ContentType,
  ContentStatus,
  Campaign,
} from '../../types/workspace';
import {
  saveContentItem,
  duplicateContentItem,
  deleteContentItem,
  exportContentItemToText,
} from '../../lib/workspaceStorage';
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  List as ListIcon,
  Copy,
  Trash2,
  Edit2,
  Download,
  Check,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  X,
  Share2,
  AlertCircle,
  HelpCircle,
  Tag,
} from 'lucide-react';

interface ContentPlannerProps {
  contents: ContentItem[];
  campaigns: Campaign[];
  onContentsUpdated: () => void;
  onOpenAIAssistantWithDraft?: (caption: string) => void;
}

const PLATFORMS: { id: ContentPlatform; label: string }[] = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'google_business', label: 'Google Business' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'other', label: 'Other Channel' },
];

const CONTENT_TYPES: { id: ContentType; label: string }[] = [
  { id: 'image_post', label: 'Image Post' },
  { id: 'reel', label: 'Reel / Video' },
  { id: 'carousel', label: 'Carousel' },
  { id: 'story', label: 'Story' },
  { id: 'short_video', label: 'Short Video' },
  { id: 'blog_article', label: 'Blog Article' },
  { id: 'other', label: 'Other Format' },
];

const STATUSES: { id: ContentStatus; label: string; color: string }[] = [
  { id: 'idea', label: 'Idea', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' },
  { id: 'draft', label: 'Draft', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
  { id: 'ready', label: 'Ready', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' },
  { id: 'published', label: 'Published', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' },
];

export const ContentPlanner: React.FC<ContentPlannerProps> = ({
  contents,
  campaigns,
  onContentsUpdated,
  onOpenAIAssistantWithDraft,
}) => {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Calendar month state
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  // Modal state
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formPlatform, setFormPlatform] = useState<ContentPlatform>('instagram');
  const [formContentType, setFormContentType] = useState<ContentType>('image_post');
  const [formCaption, setFormCaption] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formHashtags, setFormHashtags] = useState('');
  const [formCTA, setFormCTA] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formStatus, setFormStatus] = useState<ContentStatus>('draft');
  const [formCampaignId, setFormCampaignId] = useState<string>('');

  const openCreateModal = (prefillDate?: string) => {
    setEditingItem(null);
    setFormTitle('');
    setFormPlatform('instagram');
    setFormContentType('image_post');
    setFormCaption('');
    setFormDescription('');
    setFormHashtags('');
    setFormCTA('');
    setFormDate(prefillDate || '');
    setFormStatus('draft');
    setFormCampaignId('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: ContentItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormPlatform(item.platform);
    setFormContentType(item.contentType);
    setFormCaption(item.caption);
    setFormDescription(item.description || '');
    setFormHashtags(item.hashtags.join(', '));
    setFormCTA(item.callToAction || '');
    setFormDate(item.scheduledDate || '');
    setFormStatus(item.status);
    setFormCampaignId(item.campaignId || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const hashtagsList = formHashtags
      .split(/[\s,]+/)
      .map((h) => h.replace(/^#/, '').trim())
      .filter(Boolean);

    saveContentItem({
      id: editingItem?.id,
      title: formTitle.trim(),
      platform: formPlatform,
      contentType: formContentType,
      caption: formCaption.trim(),
      description: formDescription.trim() || undefined,
      hashtags: hashtagsList,
      callToAction: formCTA.trim() || undefined,
      scheduledDate: formDate || undefined,
      status: formStatus,
      campaignId: formCampaignId || undefined,
    });

    setIsModalOpen(false);
    onContentsUpdated();
  };

  const handleDuplicate = (id: string) => {
    duplicateContentItem(id);
    onContentsUpdated();
  };

  const handleDelete = (id: string) => {
    deleteContentItem(id);
    setDeleteConfirmId(null);
    onContentsUpdated();
  };

  const handleExportText = (item: ContentItem) => {
    const text = exportContentItemToText(item);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_content.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyCaption = async (item: ContentItem) => {
    try {
      const fullText = `${item.caption}\n\n${item.hashtags.map((h) => `#${h}`).join(' ')}`;
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullText);
      }
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (err) {
      console.error('Failed to copy caption:', err);
    }
  };

  // Filtered items
  const filteredContents = useMemo(() => {
    return contents.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.hashtags.some((h) => h.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesPlatform && matchesStatus;
    });
  }, [contents, searchQuery, platformFilter, statusFilter]);

  // Calendar calculations
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const prevMonth = () => setCalendarMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCalendarMonth(new Date(year, month + 1, 1));

  // Map of YYYY-MM-DD to content items
  const itemsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    for (const item of contents) {
      if (item.scheduledDate) {
        if (!map[item.scheduledDate]) {
          map[item.scheduledDate] = [];
        }
        map[item.scheduledDate].push(item);
      }
    }
    return map;
  }, [contents]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Controls: Search, Filter, View Switcher & Create Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search Bar */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-[#91A5A9]" />
            <input
              type="text"
              placeholder="Search content or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] pl-8 pr-3 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="h-8.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs text-slate-700 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          >
            <option value="all">All Platforms</option>
            {PLATFORMS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs text-slate-700 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          >
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Switcher & Action CTA */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#16866F] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ListIcon className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-[#16866F] text-white shadow-2xs'
                  : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => openCreateModal()}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Content</span>
          </button>
        </div>
      </div>

      {/* Info Notice: Organisational Planner */}
      <div className="flex items-center gap-2 rounded-lg border border-emerald-100 dark:border-[#304650] bg-[#E0F5EE]/40 dark:bg-[#16866F]/10 px-3.5 py-2 text-xs text-slate-600 dark:text-[#B5C5C7]">
        <HelpCircle className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0" />
        <span>
          <strong>Organisational Planner:</strong> Draft, schedule, and refine your marketing content here. Once ready, copy your caption with 1-click to paste into Instagram, Facebook, or Google Business.
        </span>
      </div>

      {/* View Mode 1: List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredContents.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {filteredContents.map((item) => {
                const statusMeta = STATUSES.find((s) => s.id === item.status) || STATUSES[0];
                const linkedCampaign = campaigns.find((c) => c.id === item.campaignId);

                return (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 shadow-2xs hover:border-[#16866F]/40 dark:hover:border-[#65D6B2]/40 transition-colors space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-[#304650] pb-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700 dark:text-[#F2F7F5]">
                          {item.platform}
                        </span>
                        <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-[#B5C5C7]">
                          {item.contentType.replace(/_/g, ' ')}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusMeta.color}`}>
                          {statusMeta.label}
                        </span>
                        {linkedCampaign && (
                          <span className="rounded bg-emerald-50 dark:bg-[#16866F]/20 text-[10px] font-medium text-[#16866F] dark:text-[#65D6B2] px-2 py-0.5">
                            Campaign: {linkedCampaign.name}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        {item.scheduledDate && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-xs font-mono text-slate-600 dark:text-[#B5C5C7]">
                            <Clock className="h-3 w-3" />
                            {item.scheduledDate}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopyCaption(item)}
                          className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
                          title="Copy Caption & Hashtags"
                        >
                          {copiedId === item.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(item.id)}
                          className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
                          title="Duplicate Content"
                        >
                          <Share2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExportText(item)}
                          className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
                          title="Export Markdown Document"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          className="rounded p-1 text-slate-400 hover:text-[#16866F] dark:hover:text-[#65D6B2] hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
                          title="Edit Content"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(item.id)}
                          className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                          title="Delete Content"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-slate-700 dark:text-[#B5C5C7] whitespace-pre-wrap leading-relaxed line-clamp-3">
                          {item.caption}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1">
                      {item.hashtags.length > 0 ? (
                        <div className="flex flex-wrap gap-1 text-[11px] text-teal-700 dark:text-[#65D6B2] font-mono">
                          {item.hashtags.map((h, i) => (
                            <span key={i}>#{h}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 dark:text-[#91A5A9]">No hashtags</span>
                      )}

                      {item.callToAction && (
                        <span className="text-[11px] font-semibold text-slate-600 dark:text-[#91A5A9]">
                          CTA: {item.callToAction}
                        </span>
                      )}
                    </div>

                    {/* Delete Confirmation Box */}
                    {deleteConfirmId === item.id && (
                      <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 p-2.5 flex items-center justify-between text-xs text-red-800 dark:text-red-200 animate-in fade-in duration-100">
                        <span>Are you sure you want to delete this content item?</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="rounded bg-red-600 px-2.5 py-1 font-semibold text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmId(null)}
                            className="rounded border border-slate-300 dark:border-slate-700 px-2 py-1 font-semibold text-slate-600 dark:text-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[#304650] p-10 text-center bg-slate-50/50 dark:bg-[#172830]">
              <CalendarIcon className="h-10 w-10 text-slate-400 dark:text-[#91A5A9] mx-auto mb-2 opacity-50" />
              <h4 className="text-base font-bold text-slate-800 dark:text-[#F2F7F5]">
                {searchQuery || platformFilter !== 'all' || statusFilter !== 'all'
                  ? 'No matching content found'
                  : 'Your Content Planner is empty'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-1 max-w-sm mx-auto">
                Start by creating your first post idea or use the AI Content Assistant to generate tailored content hooks.
              </p>
              <button
                type="button"
                onClick={() => openCreateModal()}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D]"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Content Item</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Interactive Month Calendar View */}
      {viewMode === 'calendar' && (
        <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
              {calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h3>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevMonth}
                className="rounded-lg p-1.5 text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date())}
                className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]"
              >
                Today
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="rounded-lg p-1.5 text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-200 dark:bg-[#304650] overflow-hidden text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="bg-slate-50 dark:bg-[#172830] p-2 text-center font-bold text-slate-600 dark:text-[#91A5A9]"
              >
                {day}
              </div>
            ))}

            {/* Empty offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`offset-${i}`} className="bg-slate-50/40 dark:bg-[#172830]/40 min-h-[90px] p-1.5" />
            ))}

            {/* Month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayItems = itemsByDate[dateStr] || [];
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dayNum}
                  onClick={() => openCreateModal(dateStr)}
                  className={`bg-white dark:bg-[#1D3039] min-h-[90px] p-1.5 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors flex flex-col justify-between group ${
                    isToday ? 'ring-1 ring-inset ring-[#16866F]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold ${
                        isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#16866F] text-white'
                          : 'text-slate-700 dark:text-[#B5C5C7]'
                      }`}
                    >
                      {dayNum}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] text-[#16866F] dark:text-[#65D6B2] font-semibold">
                      + Add
                    </span>
                  </div>

                  <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[75px] scrollbar-none">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-[#E0F5EE] dark:bg-[#16866F]/25 text-[#0F5C4D] dark:text-[#65D6B2] truncate border border-emerald-200/50 dark:border-[#304650]"
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create / Edit Content Item Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-100"
        >
          <div className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] px-5 py-4 bg-slate-50/80 dark:bg-[#172830]">
              <h3 className="text-sm sm:text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                {editingItem ? 'Edit Content Item' : 'New Content Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Content Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 3 Common Home Plumbing Mistakes or Weekend Brunch Spotlight"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Platform
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as ContentPlatform)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Format / Type
                  </label>
                  <select
                    value={formContentType}
                    onChange={(e) => setFormContentType(e.target.value as ContentType)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  >
                    {CONTENT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700 dark:text-[#F2F7F5]">
                    Caption / Post Text
                  </label>
                  {onOpenAIAssistantWithDraft && formCaption.trim() && (
                    <button
                      type="button"
                      onClick={() => onOpenAIAssistantWithDraft(formCaption)}
                      className="text-[11px] font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Polish with AI
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  placeholder="Write your engaging caption here. What's the story, lesson, or invitation?"
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              {/* Call to Action & Hashtags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Call to Action (CTA)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tap the link in bio to book"
                    value={formCTA}
                    onChange={(e) => setFormCTA(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Hashtags (comma or space separated)
                  </label>
                  <input
                    type="text"
                    placeholder="localbusiness, smallbiz, sandiego"
                    value={formHashtags}
                    onChange={(e) => setFormHashtags(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              {/* Schedule Date & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as ContentStatus)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Link to Campaign (optional)
                  </label>
                  <select
                    value={formCampaignId}
                    onChange={(e) => setFormCampaignId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  >
                    <option value="">None (Independent Post)</option>
                    {campaigns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Internal Production Notes (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Photos saved in Google Drive / ask Sarah for review quote"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#304650]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#223640]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#16866F] px-4 py-2 font-bold text-white shadow-2xs hover:bg-[#0F5C4D]"
                >
                  {editingItem ? 'Save Changes' : 'Create Content'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
