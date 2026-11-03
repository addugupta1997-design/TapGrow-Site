import React, { useState, useMemo } from 'react';
import { SavedIdea, IdeaCategory } from '../../types/workspace';
import {
  saveIdea,
  deleteIdea,
  toggleIdeaFavourite,
  convertIdeaToContentDraft,
  convertIdeaToCampaign,
  exportIdeaToText,
} from '../../lib/workspaceStorage';
import {
  Plus,
  Search,
  Bookmark,
  Star,
  Trash2,
  Edit2,
  Download,
  Share2,
  FilePlus,
  TrendingUp,
  Tag,
  Sparkles,
  X,
  Filter,
} from 'lucide-react';

interface IdeasLibraryProps {
  ideas: SavedIdea[];
  onIdeasUpdated: () => void;
  onIdeaConvertedToContent: () => void;
  onIdeaConvertedToCampaign: () => void;
  onOpenAIAssistantForIdeas?: () => void;
}

const IDEA_CATEGORIES: { id: IdeaCategory; label: string }[] = [
  { id: 'social_media', label: 'Social Media Ideas' },
  { id: 'reel_hooks', label: 'Reel & Video Hooks' },
  { id: 'campaign_ideas', label: 'Campaign Concepts' },
  { id: 'promotional_offers', label: 'Promotional Offers' },
  { id: 'local_marketing', label: 'Local Community Marketing' },
  { id: 'customer_engagement', label: 'Customer Retention & Reviews' },
  { id: 'blog_topics', label: 'Blog / Educational Topics' },
  { id: 'ai_strategies', label: 'AI Generated Strategies' },
  { id: 'other', label: 'Other Ideas' },
];

export const IdeasLibrary: React.FC<IdeasLibraryProps> = ({
  ideas,
  onIdeasUpdated,
  onIdeaConvertedToContent,
  onIdeaConvertedToCampaign,
  onOpenAIAssistantForIdeas,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterFavouritesOnly, setFilterFavouritesOnly] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<SavedIdea | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<IdeaCategory>('social_media');
  const [formTags, setFormTags] = useState('');
  const [formFavourite, setFormFavourite] = useState(false);

  const openCreateModal = () => {
    setEditingIdea(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('social_media');
    setFormTags('');
    setFormFavourite(false);
    setIsModalOpen(true);
  };

  const openEditModal = (idea: SavedIdea) => {
    setEditingIdea(idea);
    setFormTitle(idea.title);
    setFormDescription(idea.description);
    setFormCategory(idea.category);
    setFormTags(idea.tags.join(', '));
    setFormFavourite(idea.isFavourite);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const tagsList = formTags
      .split(/[\s,]+/)
      .map((t) => t.replace(/^#/, '').trim())
      .filter(Boolean);

    saveIdea({
      id: editingIdea?.id,
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      tags: tagsList,
      isFavourite: formFavourite,
    });

    setIsModalOpen(false);
    onIdeasUpdated();
  };

  const handleToggleStar = (id: string) => {
    toggleIdeaFavourite(id);
    onIdeasUpdated();
  };

  const handleDelete = (id: string) => {
    deleteIdea(id);
    setDeleteConfirmId(null);
    onIdeasUpdated();
  };

  const handleConvertToContent = (idea: SavedIdea) => {
    const created = convertIdeaToContentDraft(idea.id);
    if (created) {
      setActionNotice(`Converted "${idea.title}" into a new Content Planner draft!`);
      setTimeout(() => setActionNotice(null), 3500);
      onIdeaConvertedToContent();
    }
  };

  const handleConvertToCampaign = (idea: SavedIdea) => {
    const created = convertIdeaToCampaign(idea.id);
    if (created) {
      setActionNotice(`Converted "${idea.title}" into a new Marketing Campaign!`);
      setTimeout(() => setActionNotice(null), 3500);
      onIdeaConvertedToCampaign();
    }
  };

  const handleExportText = (idea: SavedIdea) => {
    const text = exportIdeaToText(idea);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${idea.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_idea.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered ideas
  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch =
        searchQuery === '' ||
        idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
      const matchesFav = !filterFavouritesOnly || idea.isFavourite;

      return matchesSearch && matchesCategory && matchesFav;
    });
  }, [ideas, searchQuery, selectedCategory, filterFavouritesOnly]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Banner Notice if converted */}
      {actionNotice && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-emerald-800 dark:text-[#65D6B2] flex items-center justify-between animate-in fade-in duration-150">
          <span>{actionNotice}</span>
          <button
            type="button"
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-[#91A5A9]" />
            <input
              type="text"
              placeholder="Search marketing ideas or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] pl-8 pr-3 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-8.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs text-slate-700 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          >
            <option value="all">All Idea Categories</option>
            {IDEA_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          {/* Starred Only Toggle */}
          <button
            type="button"
            onClick={() => setFilterFavouritesOnly(!filterFavouritesOnly)}
            className={`h-8.5 inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs font-semibold transition-colors ${
              filterFavouritesOnly
                ? 'border-amber-400 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300'
                : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${filterFavouritesOnly ? 'fill-amber-400 text-amber-500' : 'text-slate-400'}`} />
            <span>Starred Only</span>
          </button>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {onOpenAIAssistantForIdeas && (
            <button
              type="button"
              onClick={onOpenAIAssistantForIdeas}
              className="h-8.5 inline-flex items-center gap-1.5 rounded-lg border border-[#16866F]/40 bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3 text-xs font-semibold text-[#0F5C4D] dark:text-[#65D6B2] hover:bg-[#D4EFE6] dark:hover:bg-[#16866F]/30 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              <span>AI Brainstorm</span>
            </button>
          )}

          <button
            type="button"
            onClick={openCreateModal}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Save New Idea</span>
          </button>
        </div>
      </div>

      {/* Ideas Grid */}
      {filteredIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIdeas.map((idea) => {
            const catMeta = IDEA_CATEGORIES.find((c) => c.id === idea.category) || IDEA_CATEGORIES[0];

            return (
              <div
                key={idea.id}
                className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4.5 shadow-2xs hover:border-[#16866F]/40 dark:hover:border-[#65D6B2]/40 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] pb-2">
                    <span className="text-[10px] font-bold uppercase rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-slate-600 dark:text-[#B5C5C7]">
                      {catMeta.label}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleToggleStar(idea.id)}
                      className="rounded p-1 text-slate-400 hover:text-amber-500 transition-colors"
                      title={idea.isFavourite ? 'Unstar Idea' : 'Star Idea as Favourite'}
                    >
                      <Star className={`h-4 w-4 ${idea.isFavourite ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                      {idea.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed whitespace-pre-wrap line-clamp-3">
                      {idea.description}
                    </p>
                  </div>

                  {idea.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-teal-700 dark:text-[#65D6B2] font-mono">
                      {idea.tags.map((t, idx) => (
                        <span key={idx} className="rounded bg-teal-50 dark:bg-[#16866F]/15 px-1.5 py-0.5">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Toolbar */}
                <div className="pt-2 border-t border-slate-100 dark:border-[#304650] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    {/* Convert Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleConvertToContent(idea)}
                        className="inline-flex items-center gap-1 rounded bg-[#E0F5EE] dark:bg-[#16866F]/20 px-2 py-1 text-[11px] font-semibold text-[#0F5C4D] dark:text-[#65D6B2] hover:bg-[#D4EFE6] dark:hover:bg-[#16866F]/30 transition-colors"
                        title="Turn into Content Draft"
                      >
                        <FilePlus className="h-3 w-3" />
                        <span>To Content Draft</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConvertToCampaign(idea)}
                        className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-[#223640] px-2 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-200 dark:hover:bg-[#29404A] transition-colors"
                        title="Turn into Campaign"
                      >
                        <TrendingUp className="h-3 w-3" />
                        <span>To Campaign</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleExportText(idea)}
                        className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        title="Export Markdown"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(idea)}
                        className="rounded p-1 text-slate-400 hover:text-[#16866F] dark:hover:text-[#65D6B2]"
                        title="Edit Idea"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(idea.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-500"
                        title="Delete Idea"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Delete Confirmation Box */}
                  {deleteConfirmId === idea.id && (
                    <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-2 flex items-center justify-between text-xs text-red-800 dark:text-red-200 animate-in fade-in duration-100">
                      <span>Delete this idea?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(idea.id)}
                          className="rounded bg-red-600 px-2 py-0.5 font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 font-semibold text-slate-600 dark:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[#304650] p-10 text-center bg-slate-50/50 dark:bg-[#172830]">
          <Bookmark className="h-10 w-10 text-slate-400 dark:text-[#91A5A9] mx-auto mb-2 opacity-50" />
          <h4 className="text-base font-bold text-slate-800 dark:text-[#F2F7F5]">
            {searchQuery || selectedCategory !== 'all' || filterFavouritesOnly
              ? 'No matching ideas found'
              : 'Your Ideas Library is ready'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-1 max-w-sm mx-auto">
            Store video hooks, promotional angles, customer stories, or AI brainstorms so you never run out of inspiration.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D]"
          >
            <Plus className="h-4 w-4" />
            <span>Save First Marketing Idea</span>
          </button>
        </div>
      )}

      {/* Create / Edit Idea Modal */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-100"
        >
          <div className="relative flex flex-col w-full max-w-lg max-h-[90vh] rounded-2xl bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] px-5 py-4 bg-slate-50/80 dark:bg-[#172830]">
              <h3 className="text-sm sm:text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                {editingIdea ? 'Edit Marketing Idea' : 'Save Marketing Idea'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Idea Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 3-Second Coffee Pour Hook or Autumn Referral Special"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as IdeaCategory)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                >
                  {IDEA_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Concept Description
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the hook, video scene, promotion terms, or strategy notes."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Tags (comma or space separated)
                </label>
                <input
                  type="text"
                  placeholder="reels, promotion, reviews, food"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formFavourite"
                  checked={formFavourite}
                  onChange={(e) => setFormFavourite(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#16866F] focus:ring-[#16866F]"
                />
                <label htmlFor="formFavourite" className="font-semibold text-slate-700 dark:text-[#F2F7F5] cursor-pointer">
                  Star as Favourite (pin to top)
                </label>
              </div>

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
                  {editingIdea ? 'Save Idea' : 'Save to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
