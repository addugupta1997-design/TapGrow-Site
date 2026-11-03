import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MarketingNote } from '../../types/workspace';
import {
  saveNote,
  deleteNote,
  toggleNotePin,
  exportNoteToText,
} from '../../lib/workspaceStorage';
import {
  Plus,
  Search,
  Pin,
  Trash2,
  Edit3,
  Download,
  Tag,
  Check,
  Clock,
  StickyNote,
  Sparkles,
} from 'lucide-react';

interface MarketingNotesProps {
  notes: MarketingNote[];
  onNotesUpdated: () => void;
}

export const MarketingNotes: React.FC<MarketingNotesProps> = ({
  notes,
  onNotesUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeNoteId, setActiveNoteId] = useState<string | null>(() => {
    return notes.length > 0 ? notes[0].id : null;
  });

  const [activeTitle, setActiveTitle] = useState('');
  const [activeContent, setActiveContent] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [activeTags, setActiveTags] = useState('');
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'ready'>('ready');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync active note fields when activeNoteId changes
  useEffect(() => {
    if (!activeNoteId) {
      if (notes.length > 0) {
        setActiveNoteId(notes[0].id);
      } else {
        setActiveTitle('');
        setActiveContent('');
        setActiveCategory('');
        setActiveTags('');
      }
      return;
    }

    const current = notes.find((n) => n.id === activeNoteId);
    if (current) {
      setActiveTitle(current.title);
      setActiveContent(current.content);
      setActiveCategory(current.category || '');
      setActiveTags(current.tags.join(', '));
      setAutoSaveStatus('saved');
    }
  }, [activeNoteId, notes]);

  // Handle auto-saving on content or title change
  const handleFieldChange = (newTitle: string, newContent: string, newCategory: string, newTags: string) => {
    setActiveTitle(newTitle);
    setActiveContent(newContent);
    setActiveCategory(newCategory);
    setActiveTags(newTags);
    setAutoSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (!activeNoteId && !newTitle.trim()) {
        setAutoSaveStatus('ready');
        return;
      }

      const tagsList = newTags
        .split(/[\s,]+/)
        .map((t) => t.replace(/^#/, '').trim())
        .filter(Boolean);

      const saved = saveNote({
        id: activeNoteId || undefined,
        title: newTitle.trim() || 'Untitled Note',
        content: newContent,
        category: newCategory.trim() || undefined,
        tags: tagsList,
        isPinned: false,
      });

      if (!activeNoteId) {
        setActiveNoteId(saved.id);
      }

      setAutoSaveStatus('saved');
      onNotesUpdated();
    }, 600);
  };

  const handleCreateNew = () => {
    const saved = saveNote({
      title: 'New Marketing Note',
      content: '',
      category: 'General',
      tags: [],
      isPinned: false,
    });
    setActiveNoteId(saved.id);
    onNotesUpdated();
  };

  const handleDelete = (id: string) => {
    deleteNote(id);
    setDeleteConfirmId(null);
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
    }
    onNotesUpdated();
  };

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNotePin(id);
    onNotesUpdated();
  };

  const handleExportText = (note: MarketingNote) => {
    const text = exportNoteToText(note);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_note.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.category) set.add(n.category);
    });
    return Array.from(set);
  }, [notes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return [...notes]
      .filter((note) => {
        const matchesSearch =
          searchQuery === '' ||
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        // Pinned notes first, then updated date descending
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, searchQuery, selectedCategory]);

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-[#91A5A9]" />
            <input
              type="text"
              placeholder="Search notes or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] pl-8 pr-3 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            />
          </div>

          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-8.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs text-slate-700 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="h-8.5 self-start sm:self-auto inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Split Workspace: Notes List + Editor */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Note list (5 cols) */}
        <div className="md:col-span-5 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;

              return (
                <div
                  key={note.id}
                  onClick={() => setActiveNoteId(note.id)}
                  className={`group relative cursor-pointer rounded-xl border p-3.5 transition-all text-xs space-y-1.5 ${
                    isActive
                      ? 'border-[#16866F] bg-white dark:bg-[#1D3039] shadow-xs ring-1 ring-[#16866F]'
                      : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-[#F2F7F5] truncate flex items-center gap-1.5">
                      {note.isPinned && <Pin className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />}
                      {note.title || 'Untitled Note'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(note.id, e)}
                        className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-[#223640] ${
                          note.isPinned ? 'text-amber-500' : 'text-slate-300 hover:text-slate-500'
                        }`}
                        title={note.isPinned ? 'Unpin Note' : 'Pin Note to Top'}
                      >
                        <Pin className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(note.id);
                        }}
                        className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete Note"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-500 dark:text-[#91A5A9] line-clamp-2 leading-relaxed">
                    {note.content || 'Empty note...'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-[#91A5A9] pt-1">
                    <span>{note.category || 'General'}</span>
                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                  </div>

                  {deleteConfirmId === note.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-2 flex items-center justify-between text-[11px] text-red-800 dark:text-red-200"
                    >
                      <span>Delete permanently?</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          className="rounded bg-red-600 px-2 py-0.5 font-semibold text-white hover:bg-red-700"
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(null)}
                          className="rounded border border-slate-300 dark:border-slate-700 px-1.5 py-0.5 text-slate-600 dark:text-slate-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 dark:border-[#304650] p-6 text-center bg-slate-50/50 dark:bg-[#172830]">
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">No notes found.</p>
              <button
                type="button"
                onClick={handleCreateNew}
                className="mt-2 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
              >
                + Create first note
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Editor Pane (7 cols) */}
        <div className="md:col-span-7 rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-2xs space-y-4">
          {activeNoteId ? (
            <>
              {/* Editor Header Bar with Auto-Save Badge & Export */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-500 dark:text-[#91A5A9]">Note Editor</span>
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
                      autoSaveStatus === 'saving'
                        ? 'text-amber-600'
                        : 'text-emerald-700 dark:text-[#65D6B2]'
                    }`}
                  >
                    {autoSaveStatus === 'saving' ? (
                      <>
                        <Clock className="h-3 w-3 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Saved locally</span>
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {notes.find((n) => n.id === activeNoteId) && (
                    <button
                      type="button"
                      onClick={() => handleExportText(notes.find((n) => n.id === activeNoteId)!)}
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                      title="Export Note to Markdown"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Export .MD</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <input
                  type="text"
                  placeholder="Note Title..."
                  value={activeTitle}
                  onChange={(e) =>
                    handleFieldChange(e.target.value, activeContent, activeCategory, activeTags)
                  }
                  className="w-full text-base sm:text-lg font-bold text-slate-900 dark:text-[#F2F7F5] border-0 border-b border-transparent hover:border-slate-200 focus:border-[#16866F] bg-transparent pb-1 px-0 focus:outline-none"
                />
              </div>

              {/* Category & Tags Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Social, Strategy, Ads"
                    value={activeCategory}
                    onChange={(e) =>
                      handleFieldChange(activeTitle, activeContent, e.target.value, activeTags)
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] px-2.5 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-1 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="ideas, scripts, promo"
                    value={activeTags}
                    onChange={(e) =>
                      handleFieldChange(activeTitle, activeContent, activeCategory, e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] px-2.5 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-1 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              {/* Content Textarea */}
              <div>
                <textarea
                  rows={14}
                  placeholder="Type your marketing thoughts, local collaboration ideas, review follow-up scripts, or competitor notes here... Automatically saved as you type."
                  value={activeContent}
                  onChange={(e) =>
                    handleFieldChange(activeTitle, e.target.value, activeCategory, activeTags)
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] p-3 text-xs sm:text-sm text-slate-800 dark:text-[#F2F7F5] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-slate-400 dark:text-[#91A5A9] space-y-2">
              <StickyNote className="h-10 w-10 mx-auto opacity-40" />
              <p className="text-xs">Select a note from the left or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
