import React, { useState, useMemo } from 'react';
import { Campaign, CampaignStatus, ContentItem } from '../../types/workspace';
import {
  saveCampaign,
  deleteCampaign,
  exportCampaignToText,
} from '../../lib/workspaceStorage';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Share2,
  Trash2,
  Edit2,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  X,
  FileText,
  AlertCircle,
} from 'lucide-react';

interface CampaignManagerProps {
  campaigns: Campaign[];
  contents: ContentItem[];
  onCampaignsUpdated: () => void;
  onNavigateToContentWithCampaignFilter?: (campaignId: string) => void;
  onOpenAIAssistantForCampaign?: (theme?: string) => void;
}

const CAMPAIGN_STATUSES: { id: CampaignStatus; label: string; color: string }[] = [
  { id: 'planning', label: 'Planning', color: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' },
  { id: 'active', label: 'Active', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' },
  { id: 'paused', label: 'Paused', color: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
  { id: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300' },
];

export const CampaignManager: React.FC<CampaignManagerProps> = ({
  campaigns,
  contents,
  onCampaignsUpdated,
  onNavigateToContentWithCampaignFilter,
  onOpenAIAssistantForCampaign,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [detailCampaign, setDetailCampaign] = useState<Campaign | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formObjective, setFormObjective] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formAudience, setFormAudience] = useState('');
  const [formChannel, setFormChannel] = useState('');
  const [formStartDate, setFormStartDate] = useState('');
  const [formEndDate, setFormEndDate] = useState('');
  const [formBudget, setFormBudget] = useState('');
  const [formStatus, setFormStatus] = useState<CampaignStatus>('planning');
  const [formNotes, setFormNotes] = useState('');
  const [formUserResults, setFormUserResults] = useState('');

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormName('');
    setFormObjective('');
    setFormDescription('');
    setFormAudience('Local neighbourhood residents');
    setFormChannel('Google Business Profile & Social Media');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate('');
    setFormBudget('');
    setFormStatus('planning');
    setFormNotes('');
    setFormUserResults('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (camp: Campaign) => {
    setEditingCampaign(camp);
    setFormName(camp.name);
    setFormObjective(camp.objective);
    setFormDescription(camp.description);
    setFormAudience(camp.targetAudience);
    setFormChannel(camp.marketingChannel);
    setFormStartDate(camp.startDate);
    setFormEndDate(camp.endDate || '');
    setFormBudget(camp.budget || '');
    setFormStatus(camp.status);
    setFormNotes(camp.notes || '');
    setFormUserResults(camp.userResults || '');
    setIsFormModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formObjective.trim()) return;

    saveCampaign({
      id: editingCampaign?.id,
      name: formName.trim(),
      objective: formObjective.trim(),
      description: formDescription.trim(),
      targetAudience: formAudience.trim(),
      marketingChannel: formChannel.trim(),
      startDate: formStartDate || new Date().toISOString().split('T')[0],
      endDate: formEndDate.trim() || undefined,
      budget: formBudget.trim() || undefined,
      status: formStatus,
      notes: formNotes.trim() || undefined,
      userResults: formUserResults.trim() || undefined,
    });

    setIsFormModalOpen(false);
    onCampaignsUpdated();
  };

  const handleDelete = (id: string) => {
    deleteCampaign(id);
    setDeleteConfirmId(null);
    if (detailCampaign?.id === id) setDetailCampaign(null);
    onCampaignsUpdated();
  };

  const handleExportText = (camp: Campaign) => {
    const text = exportCampaignToText(camp);
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${camp.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_campaign.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filtered campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.marketingChannel.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  // Counts
  const activeCount = campaigns.filter((c) => c.status === 'active').length;
  const planningCount = campaigns.filter((c) => c.status === 'planning').length;
  const completedCount = campaigns.filter((c) => c.status === 'completed').length;

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-[#91A5A9]" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] pl-8 pr-3 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs text-slate-700 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          >
            <option value="all">All Campaign Statuses</option>
            {CAMPAIGN_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          {onOpenAIAssistantForCampaign && (
            <button
              type="button"
              onClick={() => onOpenAIAssistantForCampaign()}
              className="h-8.5 inline-flex items-center gap-1.5 rounded-lg border border-[#16866F]/40 bg-[#E0F5EE] dark:bg-[#16866F]/20 px-3 text-xs font-semibold text-[#0F5C4D] dark:text-[#65D6B2] hover:bg-[#D4EFE6] dark:hover:bg-[#16866F]/30 transition-colors"
            >
              <TrendingUp className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              <span>AI Concept Ideas</span>
            </button>
          )}

          <button
            type="button"
            onClick={openCreateModal}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Campaign List */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCampaigns.map((camp) => {
            const statusMeta = CAMPAIGN_STATUSES.find((s) => s.id === camp.status) || CAMPAIGN_STATUSES[0];
            const linkedItems = contents.filter((c) => c.campaignId === camp.id);
            const publishedCount = linkedItems.filter((c) => c.status === 'published').length;

            return (
              <div
                key={camp.id}
                className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4.5 shadow-2xs hover:border-[#16866F]/50 dark:hover:border-[#65D6B2]/50 transition-colors flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-[#304650] pb-2.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${statusMeta.color}`}>
                      {statusMeta.label}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setDetailCampaign(camp)}
                        className="rounded p-1 text-slate-400 hover:text-[#16866F] dark:hover:text-[#65D6B2] hover:bg-slate-100 dark:hover:bg-[#223640]"
                        title="View Full Campaign Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleExportText(camp)}
                        className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]"
                        title="Export Markdown Document"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(camp)}
                        className="rounded p-1 text-slate-400 hover:text-[#16866F] dark:hover:text-[#65D6B2] hover:bg-slate-100 dark:hover:bg-[#223640]"
                        title="Edit Campaign"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(camp.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        title="Delete Campaign"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-2.5 space-y-1.5">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                      {camp.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed line-clamp-2">
                      {camp.objective}
                    </p>
                  </div>
                </div>

                {/* Campaign Progress / Linked Content */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#304650] text-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-[#91A5A9]">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
                      <strong>{linkedItems.length}</strong> linked content items
                    </span>
                    <span>{publishedCount} published</span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-[#172830] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#16866F] dark:bg-[#65D6B2] h-full rounded-full transition-all"
                      style={{
                        width: `${linkedItems.length > 0 ? (publishedCount / linkedItems.length) * 100 : 0}%`,
                      }}
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400 dark:text-[#91A5A9] pt-1">
                    <span>Channel: {camp.marketingChannel}</span>
                    <span>{camp.startDate} {camp.endDate ? `→ ${camp.endDate}` : ''}</span>
                  </div>

                  {camp.budget && (
                    <div className="text-[11px] font-medium text-emerald-800 dark:text-[#65D6B2] bg-emerald-50 dark:bg-emerald-950/30 rounded px-2 py-0.5 inline-block">
                      Budget: {camp.budget}
                    </div>
                  )}

                  {/* Delete Confirmation Alert */}
                  {deleteConfirmId === camp.id && (
                    <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50/70 dark:bg-red-950/30 p-2.5 flex items-center justify-between text-xs text-red-800 dark:text-red-200 animate-in fade-in duration-100">
                      <span>Delete campaign and unlink related posts?</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDelete(camp.id)}
                          className="rounded bg-red-600 px-2.5 py-1 font-semibold text-white hover:bg-red-700"
                        >
                          Confirm
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
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-[#304650] p-10 text-center bg-slate-50/50 dark:bg-[#172830]">
          <TrendingUp className="h-10 w-10 text-slate-400 dark:text-[#91A5A9] mx-auto mb-2 opacity-50" />
          <h4 className="text-base font-bold text-slate-800 dark:text-[#F2F7F5]">
            {searchQuery || statusFilter !== 'all' ? 'No matching campaigns' : 'No marketing campaigns planned yet'}
          </h4>
          <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-1 max-w-sm mx-auto">
            Group focused marketing actions around seasonal events, holiday specials, or local promotions to maximize momentum.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D]"
          >
            <Plus className="h-4 w-4" />
            <span>Create First Campaign</span>
          </button>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {detailCampaign && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-100"
        >
          <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] px-5 py-4 bg-slate-50/80 dark:bg-[#172830]">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase text-[#16866F] dark:text-[#65D6B2]">
                  Campaign Blueprint · {detailCampaign.status}
                </span>
                <h3 className="text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                  {detailCampaign.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailCampaign(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
              <div className="rounded-xl bg-[#E0F5EE]/40 dark:bg-[#16866F]/10 p-3.5 border border-emerald-200/60 dark:border-[#304650]">
                <strong className="text-slate-800 dark:text-[#F2F7F5] block mb-1">Core Objective:</strong>
                <p className="text-slate-700 dark:text-[#B5C5C7] leading-relaxed">{detailCampaign.objective}</p>
              </div>

              {detailCampaign.description && (
                <div>
                  <strong className="text-slate-800 dark:text-[#F2F7F5] block mb-1">Strategy & Details:</strong>
                  <p className="text-slate-600 dark:text-[#B5C5C7] leading-relaxed whitespace-pre-wrap">
                    {detailCampaign.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-[#304650]">
                <div>
                  <span className="text-slate-400 dark:text-[#91A5A9] block">Target Audience:</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">{detailCampaign.targetAudience}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#91A5A9] block">Marketing Channel:</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">{detailCampaign.marketingChannel}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#91A5A9] block">Timeline:</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">
                    {detailCampaign.startDate} {detailCampaign.endDate ? `to ${detailCampaign.endDate}` : '(Ongoing)'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#91A5A9] block">Budget Allocation:</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F2F7F5]">{detailCampaign.budget || 'Not set ($0 / sweat equity)'}</span>
                </div>
              </div>

              {/* Linked Content Items */}
              <div className="pt-3 border-t border-slate-100 dark:border-[#304650] space-y-2">
                <strong className="text-slate-800 dark:text-[#F2F7F5] block">
                  Linked Content Items ({contents.filter((c) => c.campaignId === detailCampaign.id).length}):
                </strong>
                {contents.filter((c) => c.campaignId === detailCampaign.id).length > 0 ? (
                  <div className="space-y-1.5">
                    {contents
                      .filter((c) => c.campaignId === detailCampaign.id)
                      .map((c) => (
                        <div
                          key={c.id}
                          className="rounded-lg border border-slate-200 dark:border-[#304650] p-2.5 flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-slate-900 dark:text-[#F2F7F5] mr-2">{c.title}</span>
                            <span className="text-[10px] text-slate-400">({c.platform} · {c.status})</span>
                          </div>
                          {c.scheduledDate && <span className="font-mono text-[11px] text-slate-500">{c.scheduledDate}</span>}
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs">No content items linked to this campaign yet.</p>
                )}
              </div>

              {/* User Results Section */}
              {detailCampaign.userResults && (
                <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 p-3.5 space-y-1">
                  <span className="font-bold text-blue-900 dark:text-blue-300 block text-[11px] uppercase">
                    User-Reported Results:
                  </span>
                  <p className="text-slate-700 dark:text-[#B5C5C7] leading-relaxed whitespace-pre-wrap">
                    {detailCampaign.userResults}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#304650] px-5 py-3 bg-slate-50/80 dark:bg-[#172830]">
              <button
                type="button"
                onClick={() => handleExportText(detailCampaign)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:underline"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Campaign (.MD)</span>
              </button>
              <button
                type="button"
                onClick={() => setDetailCampaign(null)}
                className="rounded-lg bg-slate-200 dark:bg-[#223640] px-4 py-1.5 font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Campaign Form Modal */}
      {isFormModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-100"
        >
          <div className="relative flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] px-5 py-4 bg-slate-50/80 dark:bg-[#172830]">
              <h3 className="text-sm sm:text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                {editingCampaign ? 'Edit Marketing Campaign' : 'Create Marketing Campaign'}
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Campaign Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Spring Local Welcome Offer or Holiday Table Booking Blitz"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Primary Objective <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Acquire 15 new local patrons from Google Maps"
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Marketing Channel
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Instagram & Google Maps"
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Homeowners within 10km radius"
                    value={formAudience}
                    onChange={(e) => setFormAudience(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    End Date (optional)
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Budget (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. $100 or $0"
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as CampaignStatus)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                >
                  {CAMPAIGN_STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Campaign Strategy & Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline the promotional offer, giveaway rules, or storytelling angle."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  User-Entered Results (optional notes from your tracking)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Gained 18 customer inquiries and 4 new 5-star Google reviews"
                  value={formUserResults}
                  onChange={(e) => setFormUserResults(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#304650]">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#223640]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#16866F] px-4 py-2 font-bold text-white shadow-2xs hover:bg-[#0F5C4D]"
                >
                  {editingCampaign ? 'Save Campaign' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
