import React, { useState, useEffect, useRef } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import {
  WorkspaceData,
  WorkspaceSubTab,
  ContentItem,
  Campaign,
  SavedIdea,
  MarketingNote,
} from '../../types/workspace';
import {
  loadWorkspaceData,
  exportWorkspaceToJsonString,
  importWorkspaceFromJsonString,
} from '../../lib/workspaceStorage';
import { WorkspaceOverview } from './WorkspaceOverview';
import { ContentPlanner } from './ContentPlanner';
import { CampaignManager } from './CampaignManager';
import { IdeasLibrary } from './IdeasLibrary';
import { MarketingNotes } from './MarketingNotes';
import { AIContentAssistantModal } from './AIContentAssistantModal';
import {
  Layers,
  LayoutDashboard,
  Calendar,
  TrendingUp,
  Bookmark,
  StickyNote,
  Sparkles,
  Download,
  Upload,
  Shield,
  Plus,
  Check,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

interface MarketingWorkspaceProps {
  answers: AssessmentAnswers;
}

export const MarketingWorkspace: React.FC<MarketingWorkspaceProps> = ({ answers }) => {
  const [data, setData] = useState<WorkspaceData>(() => loadWorkspaceData(answers));
  const [activeSubTab, setActiveSubTab] = useState<WorkspaceSubTab>('overview');

  // AI Modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<'ideas' | 'improve_caption' | 'hooks' | 'campaign' | 'promo'>('ideas');
  const [aiModalText, setAiModalText] = useState('');

  // Backup notice
  const [backupNotice, setBackupNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Refresh data from storage
  const refreshData = () => {
    setData(loadWorkspaceData(answers));
  };

  const handleExportBackup = () => {
    try {
      const json = exportWorkspaceToJsonString();
      const bizSlug = (answers.businessName || 'tapgrow')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .substring(0, 20);
      const filename = `${bizSlug}_marketing_workspace_backup_${new Date().toISOString().split('T')[0]}.json`;

      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setBackupNotice('Workspace backup exported successfully!');
      setTimeout(() => setBackupNotice(null), 3000);
    } catch (err) {
      console.error('Backup export failed:', err);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importWorkspaceFromJsonString(content);
        if (result.success) {
          refreshData();
          setBackupNotice(result.message);
        } else {
          setBackupNotice(`Import failed: ${result.message}`);
        }
        setTimeout(() => setBackupNotice(null), 4000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openAIAssistant = (mode: 'ideas' | 'improve_caption' | 'hooks' | 'campaign' | 'promo' = 'ideas', text = '') => {
    setAiModalMode(mode);
    setAiModalText(text);
    setIsAIModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Workspace Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 dark:border-[#304650] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2]">
              <Layers className="h-4 w-4" />
              <span>Marketing Workspace</span>
            </span>
            <span className="text-slate-300 dark:text-[#304650]">·</span>
            <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:text-[#B5C5C7]">
              {answers.businessName || 'Local Business'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[#142A36] dark:text-[#F2F7F5]">
            Marketing Operations Hub
          </h2>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 shrink-0">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            title="Import Workspace JSON Backup"
          >
            <Upload className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
            <span className="hidden sm:inline">Import JSON</span>
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            title="Download full workspace backup as JSON"
          >
            <Download className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
            <span className="hidden sm:inline">Backup (JSON)</span>
          </button>

          <button
            type="button"
            onClick={() => openAIAssistant('ideas')}
            className="h-8.5 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Backup Notification Alert */}
      {backupNotice && (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-[#65D6B2] flex items-center justify-between animate-in fade-in duration-100">
          <span>{backupNotice}</span>
          <button
            type="button"
            onClick={() => setBackupNotice(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sub-Navigation Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b border-slate-200 dark:border-[#304650] pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeSubTab === 'overview'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('content')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeSubTab === 'content'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <Calendar className="h-4 w-4" />
          <span>Content Planner</span>
          <span className="rounded-full bg-slate-100 dark:bg-[#172830] px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:text-[#65D6B2]">
            {data.contents.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('campaigns')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeSubTab === 'campaigns'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Campaign Manager</span>
          <span className="rounded-full bg-slate-100 dark:bg-[#172830] px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:text-[#65D6B2]">
            {data.campaigns.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ideas')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeSubTab === 'ideas'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <Bookmark className="h-4 w-4" />
          <span>Ideas Library</span>
          <span className="rounded-full bg-slate-100 dark:bg-[#172830] px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:text-[#65D6B2]">
            {data.ideas.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('notes')}
          className={`flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors ${
            activeSubTab === 'notes'
              ? 'bg-[#16866F] text-white shadow-2xs'
              : 'text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
          }`}
        >
          <StickyNote className="h-4 w-4" />
          <span>Marketing Notes</span>
          <span className="rounded-full bg-slate-100 dark:bg-[#172830] px-1.5 py-0.2 text-[10px] font-bold text-slate-700 dark:text-[#65D6B2]">
            {data.notes.length}
          </span>
        </button>
      </div>

      {/* Main Workspace Content Area */}
      <div>
        {activeSubTab === 'overview' && (
          <WorkspaceOverview
            data={data}
            answers={answers}
            onNavigateTab={(tab) => setActiveSubTab(tab)}
            onOpenCreateContent={() => setActiveSubTab('content')}
            onOpenCreateCampaign={() => setActiveSubTab('campaigns')}
            onOpenCreateIdea={() => setActiveSubTab('ideas')}
            onOpenCreateNote={() => setActiveSubTab('notes')}
            onOpenAIAssistant={() => openAIAssistant('ideas')}
          />
        )}

        {activeSubTab === 'content' && (
          <ContentPlanner
            contents={data.contents}
            campaigns={data.campaigns}
            onContentsUpdated={refreshData}
            onOpenAIAssistantWithDraft={(caption) => openAIAssistant('improve_caption', caption)}
          />
        )}

        {activeSubTab === 'campaigns' && (
          <CampaignManager
            campaigns={data.campaigns}
            contents={data.contents}
            onCampaignsUpdated={refreshData}
            onNavigateToContentWithCampaignFilter={() => setActiveSubTab('content')}
            onOpenAIAssistantForCampaign={(theme) => openAIAssistant('campaign', theme)}
          />
        )}

        {activeSubTab === 'ideas' && (
          <IdeasLibrary
            ideas={data.ideas}
            onIdeasUpdated={refreshData}
            onIdeaConvertedToContent={() => {
              refreshData();
              setActiveSubTab('content');
            }}
            onIdeaConvertedToCampaign={() => {
              refreshData();
              setActiveSubTab('campaigns');
            }}
            onOpenAIAssistantForIdeas={() => openAIAssistant('ideas')}
          />
        )}

        {activeSubTab === 'notes' && (
          <MarketingNotes
            notes={data.notes}
            onNotesUpdated={refreshData}
          />
        )}
      </div>

      {/* Local Storage Privacy Disclaimer Banner */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200/80 dark:border-[#304650] bg-slate-50/60 dark:bg-[#172830] px-4 py-2.5 text-xs text-slate-500 dark:text-[#91A5A9]">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0" />
          <span>
            <strong>Local Storage Privacy:</strong> All content drafts, campaigns, ideas, and notes are securely stored in your local browser storage. No marketing plans are sent to external third parties.
          </span>
        </div>
        <span className="hidden sm:inline font-mono text-[11px]">v{data.schemaVersion} Storage</span>
      </div>

      {/* AI Content Assistant Modal */}
      <AIContentAssistantModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        answers={answers}
        initialMode={aiModalMode}
        initialText={aiModalText}
        onItemSaved={() => refreshData()}
      />
    </div>
  );
};
