import React, { useState, useEffect } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import {
  CompetitorProfile,
  CompetitorObservation,
  CompetitiveOpportunity,
} from '../../types/competitor';
import {
  loadSavedCompetitors,
  saveCompetitor,
  deleteCompetitor,
  addObservationToCompetitor,
  deleteObservation,
} from './competitorStorage';
import { analyzeCompetitiveOpportunities } from './opportunityEngine';
import { CompetitorCard } from './CompetitorCard';
import { CompetitorComparisonTable } from './CompetitorComparisonTable';
import { OpportunityFinderCard } from './OpportunityFinderCard';
import { AddEditCompetitorModal } from './AddEditCompetitorModal';
import { CompetitorAiAssistantModal } from './CompetitorAiAssistantModal';
import { CompetitorDiscoveryModal } from './CompetitorDiscoveryModal';
import { generateCompetitorPdfReport } from './generateCompetitorPdf';
import { loadSavedAudits } from '../seoChecker/seoStorage';
import { SeoAuditReport } from '../../types/seoChecker';
import { formatDate } from '../../locales/i18n';
import {
  Users,
  Plus,
  Compass,
  Sparkles,
  Download,
  Search,
  Filter,
  CheckCircle2,
  Table,
  LayoutGrid,
  Lightbulb,
  FileText,
  ShieldCheck,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface CompetitorIntelligenceTabProps {
  answers?: AssessmentAnswers;
}

export const CompetitorIntelligenceTab: React.FC<CompetitorIntelligenceTabProps> = ({ answers }) => {
  const [competitors, setCompetitors] = useState<CompetitorProfile[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'opportunities' | 'profiles'>('matrix');
  const [searchQuery, setSearchQuery] = useState('');
  const [opportunityPriorityFilter, setOpportunityPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [competitorToEdit, setCompetitorToEdit] = useState<CompetitorProfile | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [selectedOpportunityForAi, setSelectedOpportunityForAi] = useState<CompetitiveOpportunity | null>(null);
  const [isDiscoveryModalOpen, setIsDiscoveryModalOpen] = useState(false);

  // Latest SEO audit for cross-referencing
  const [latestSeoAudit, setLatestSeoAudit] = useState<SeoAuditReport | null>(null);

  useEffect(() => {
    const list = loadSavedCompetitors(answers);
    setCompetitors(list);

    const audits = loadSavedAudits();
    if (audits.length > 0) {
      setLatestSeoAudit(audits[0]);
    }
  }, [answers]);

  const defaultAnswers: AssessmentAnswers = answers || {
    businessName: 'My Local Business',
    country: 'United States',
    cityArea: 'Denver, CO',
    category: 'other_local',
    businessModel: 'service_area',
    hasWebsite: 'yes',
    hasBusinessListing: 'yes',
    socialPresence: 'one',
    discoveryMethods: ['google_search'],
    contactConsistent: 'yes',
    askForReviews: 'yes',
    websiteDetailsClear: 'yes',
    publishesContent: 'not_sure',
    tracksMarketing: 'not_sure',
    clearConversionAction: 'yes',
    mainGoal: 'local_visibility',
    weeklyHours: '1_to_3h',
    budgetPreference: 'free_only',
  };

  // Run deterministic opportunity engine
  const opportunities = analyzeCompetitiveOpportunities({
    answers: defaultAnswers,
    competitors,
    latestSeoAudit,
  });

  const handleSaveCompetitor = (comp: CompetitorProfile) => {
    saveCompetitor(comp);
    setCompetitors(loadSavedCompetitors(answers));
    setCompetitorToEdit(null);
  };

  const handleDeleteCompetitor = (id: string) => {
    deleteCompetitor(id);
    setCompetitors(loadSavedCompetitors(answers));
  };

  const handleOpenAddModal = (prefill?: { name?: string; category?: string; city?: string }) => {
    setCompetitorToEdit(
      prefill
        ? ({
            id: '',
            businessName: prefill.name || '',
            category: prefill.category || defaultAnswers.category,
            cityOrArea: prefill.city || defaultAnswers.cityArea,
            dateAdded: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            websitePresence: 'not_checked',
            listingPresence: 'not_checked',
            socialPresence: 'not_checked',
            observations: [],
          } as CompetitorProfile)
        : null
    );
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (comp: CompetitorProfile) => {
    setCompetitorToEdit(comp);
    setIsAddEditModalOpen(true);
  };

  const handleOpenAiWithOpportunity = (opp: CompetitiveOpportunity) => {
    setSelectedOpportunityForAi(opp);
    setIsAiModalOpen(true);
  };

  const handleExportPdf = () => {
    generateCompetitorPdfReport(defaultAnswers, competitors, opportunities);
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(
      {
        businessName: defaultAnswers.businessName,
        city: defaultAnswers.cityArea,
        category: defaultAnswers.category,
        exportDate: new Date().toISOString(),
        competitors,
        opportunities,
      },
      null,
      2
    );
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TapGrow_Competitors_${(defaultAnswers.businessName || 'Business').replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtering
  const filteredCompetitors = competitors.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.businessName.toLowerCase().includes(q) ||
      c.cityOrArea.toLowerCase().includes(q) ||
      (c.communicatedValueProp && c.communicatedValueProp.toLowerCase().includes(q)) ||
      (c.visibleServices && c.visibleServices.some((s) => s.toLowerCase().includes(q)))
    );
  });

  const filteredOpportunities = opportunities.filter((o) => {
    if (opportunityPriorityFilter === 'all') return true;
    return o.priority === opportunityPriorityFilter;
  });

  const maxCompetitors = 5;
  const canAddMore = competitors.length < maxCompetitors;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header & Quick Actions */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 border-b border-slate-100 dark:border-[#304650] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#16866F] text-white">
                <Users className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2]">
                Competitive Positioning & Research
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
              Competitor Intelligence
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#91A5A9] max-w-2xl leading-relaxed">
              Research local competitors in {defaultAnswers.cityArea || 'your area'}, compare public marketing activities side-by-side, and identify clear differentiation opportunities.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 self-start lg:self-center shrink-0">
            <button
              type="button"
              onClick={() => setIsDiscoveryModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Compass className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
              <span>Discovery Tool</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedOpportunityForAi(null);
                setIsAiModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200/80 dark:border-[#304650] bg-[#E0F5EE]/60 dark:bg-[#16866F]/20 px-3.5 py-2 text-xs font-semibold text-[#0F5C4D] dark:text-[#65D6B2] hover:bg-[#D4EFE6] transition-colors shadow-2xs"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              <span>AI Strategic Advisor</span>
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-bold text-white hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] shadow-xs transition-colors"
              title="Download branded competitor comparison PDF"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

        {/* Status Bar: Competitor Capacity and Category Alignment */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700 dark:text-[#F2F7F5]">
              Active Comparison Set:
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E0F5EE] dark:bg-[#16866F]/25 px-2.5 py-0.5 text-xs font-bold text-[#16866F] dark:text-[#65D6B2]">
              {competitors.length} / {maxCompetitors} Competitors Tracked
            </span>
            {!canAddMore && (
              <span className="text-[11px] text-amber-600 dark:text-[#E9A23B]">
                (Default limit of 5 reached for optimal comparison)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleOpenAddModal()}
              disabled={!canAddMore}
              className="inline-flex items-center gap-1 rounded-lg bg-[#16866F] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0F5C4D] disabled:opacity-50 transition-colors shadow-2xs"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Competitor</span>
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-2.5 py-1.5 text-xs text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-50 transition-colors"
              title="Export research data as JSON"
            >
              Export JSON
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-[#304650] pb-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSubTab('matrix')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              activeSubTab === 'matrix'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            <Table className="h-4 w-4" />
            <span>Comparison Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('opportunities')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              activeSubTab === 'opportunities'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>Opportunity Finder ({opportunities.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('profiles')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-colors ${
              activeSubTab === 'profiles'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>Competitor Profiles ({competitors.length})</span>
          </button>
        </div>

        {/* Search Input for profiles & matrix */}
        <div className="relative w-full sm:w-56">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter competitors..."
            className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
          />
        </div>
      </div>

      {/* 3. Sub-Tab Content Views */}

      {/* SUB-TAB A: SIDE-BY-SIDE MATRIX */}
      {activeSubTab === 'matrix' && (
        <div className="space-y-4">
          <CompetitorComparisonTable
            answers={defaultAnswers}
            competitors={filteredCompetitors}
            latestSeoAudit={latestSeoAudit}
            onEditCompetitor={handleOpenEditModal}
          />
        </div>
      )}

      {/* SUB-TAB B: OPPORTUNITY FINDER */}
      {activeSubTab === 'opportunities' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-[#1D3039] p-4 rounded-xl border border-slate-200 dark:border-[#304650]">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                Differentiating Opportunities
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Actionable gaps identified by cross-referencing your profile, website audit, and competitor signals
              </p>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Priority:</span>
              <button
                type="button"
                onClick={() => setOpportunityPriorityFilter('all')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold ${
                  opportunityPriorityFilter === 'all'
                    ? 'bg-[#16866F] text-white'
                    : 'bg-slate-100 dark:bg-[#223640] text-slate-600 dark:text-[#B5C5C7]'
                }`}
              >
                All ({opportunities.length})
              </button>
              <button
                type="button"
                onClick={() => setOpportunityPriorityFilter('high')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold ${
                  opportunityPriorityFilter === 'high'
                    ? 'bg-red-600 text-white'
                    : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-[#F07171]'
                }`}
              >
                High Priority
              </button>
              <button
                type="button"
                onClick={() => setOpportunityPriorityFilter('medium')}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold ${
                  opportunityPriorityFilter === 'medium'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-[#E9A23B]'
                }`}
              >
                Medium
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredOpportunities.map((opp) => (
              <OpportunityFinderCard
                key={opp.id}
                opportunity={opp}
                onExploreWithAi={handleOpenAiWithOpportunity}
              />
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB C: COMPETITOR PROFILES GRID */}
      {activeSubTab === 'profiles' && (
        <div className="space-y-4">
          {filteredCompetitors.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-8 text-center space-y-3">
              <p className="text-sm font-bold text-slate-700 dark:text-[#F2F7F5]">
                No competitors match your current search query.
              </p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCompetitors.map((comp) => (
                <CompetitorCard
                  key={comp.id}
                  competitor={comp}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteCompetitor}
                  onAddObservation={(c) => {
                    setCompetitorToEdit(c);
                    setIsAddEditModalOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. MODALS */}
      <AddEditCompetitorModal
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setCompetitorToEdit(null);
        }}
        onSave={handleSaveCompetitor}
        competitorToEdit={competitorToEdit}
        defaultCity={defaultAnswers.cityArea}
        defaultCategory={defaultAnswers.category}
      />

      <CompetitorAiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setSelectedOpportunityForAi(null);
        }}
        answers={defaultAnswers}
        competitors={competitors}
        opportunities={opportunities}
        latestSeoAudit={latestSeoAudit}
        initialContextOpportunity={selectedOpportunityForAi}
      />

      <CompetitorDiscoveryModal
        isOpen={isDiscoveryModalOpen}
        onClose={() => setIsDiscoveryModalOpen(false)}
        answers={defaultAnswers}
        onSelectManualAdd={(prefill) => handleOpenAddModal(prefill)}
      />
    </div>
  );
};
