import React, { useState, useEffect } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import {
  AuditCategory,
  AuditFinding,
  AuditStatus,
  SeoAuditReport,
} from '../../types/seoChecker';
import { runWebsiteAudit, normalizeWebsiteUrl } from './seoApiService';
import {
  loadSavedAudits,
  saveAuditReport,
  deleteAuditReport,
  clearAuditStorage,
} from './seoStorage';
import { SAMPLE_WEBSITES, getSampleAuditReport } from './sampleAudits';
import { FindingItem } from './FindingItem';
import { SeoAiAssistantModal } from './SeoAiAssistantModal';
import { AuditComparisonModal } from './AuditComparisonModal';
import { SeoPrintModal } from './SeoPrintModal';
import { generateSeoPdfReport } from './generateSeoPdf';
import { formatDate } from '../../locales/i18n';
import {
  Search,
  Globe,
  Sparkles,
  Download,
  Printer,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  History,
  Trash2,
  ExternalLink,
  Loader2,
  Info,
  Layers,
  ChevronRight,
  RefreshCw,
  Building2,
  MapPin,
  Tag,
} from 'lucide-react';

interface SeoCheckerTabProps {
  answers?: AssessmentAnswers;
}

export const SeoCheckerTab: React.FC<SeoCheckerTabProps> = ({ answers }) => {
  // Input form state
  const [urlInput, setUrlInput] = useState<string>('');
  const [bizNameInput, setBizNameInput] = useState<string>(answers?.businessName || '');
  const [cityInput, setCityInput] = useState<string>(answers?.cityArea || '');
  const [categoryInput, setCategoryInput] = useState<string>(answers?.category || 'other_local');

  // Audit state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [auditStepMessage, setAuditStepMessage] = useState<string>('');
  const [auditError, setAuditError] = useState<string | null>(null);

  // Active Report
  const [currentReport, setCurrentReport] = useState<SeoAuditReport | null>(null);
  const [savedAudits, setSavedAudits] = useState<SeoAuditReport[]>([]);

  // Filtering state
  const [statusFilter, setStatusFilter] = useState<'all' | 'issue' | 'warning' | 'pass'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [activeAiFinding, setActiveAiFinding] = useState<AuditFinding | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [compareReport, setCompareReport] = useState<SeoAuditReport | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load saved audits on initial mount
  useEffect(() => {
    const list = loadSavedAudits();
    setSavedAudits(list);
    if (list.length > 0 && !currentReport) {
      setCurrentReport(list[0]);
    }
  }, []);

  // Update prefilled inputs if answers change
  useEffect(() => {
    if (answers) {
      if (!bizNameInput && answers.businessName) setBizNameInput(answers.businessName);
      if (!cityInput && answers.cityArea) setCityInput(answers.cityArea);
      if (answers.category) setCategoryInput(answers.category);
    }
  }, [answers]);

  const handleRunAudit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = normalizeWebsiteUrl(urlInput);

    if (!cleanUrl) {
      setAuditError('Please enter a website address to audit (e.g., example.com).');
      return;
    }

    setAuditError(null);
    setIsRunning(true);
    setAuditStepMessage('Resolving domain DNS and verifying SSL certificate...');

    const timer1 = setTimeout(() => {
      setAuditStepMessage('Crawling HTML body, response headers, and redirect chain...');
    }, 1200);

    const timer2 = setTimeout(() => {
      setAuditStepMessage('Inspecting headings, links, robots.txt, and sitemap.xml...');
    }, 2400);

    const timer3 = setTimeout(() => {
      setAuditStepMessage('Evaluating Local SEO signals and LocalBusiness schema markup...');
    }, 3800);

    try {
      const report = await runWebsiteAudit({
        url: cleanUrl,
        businessName: bizNameInput.trim() || undefined,
        cityArea: cityInput.trim() || undefined,
        category: categoryInput || undefined,
      });

      saveAuditReport(report);
      setCurrentReport(report);
      setSavedAudits(loadSavedAudits());
    } catch (err: any) {
      console.error('Audit execution error:', err);
      setAuditError(err.message || 'Failed to complete website audit. Please verify the URL is publicly reachable.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      setIsRunning(false);
      setAuditStepMessage('');
    }
  };

  const handleLoadSample = (sampleId: string) => {
    setAuditError(null);
    setIsRunning(true);
    setAuditStepMessage('Loading sample audit snapshot for demonstration...');

    setTimeout(() => {
      const sampleReport = getSampleAuditReport(sampleId);
      setUrlInput(sampleReport.url);
      if (sampleReport.businessProfileUsed) {
        setBizNameInput(sampleReport.businessProfileUsed.name);
        setCityInput(sampleReport.businessProfileUsed.cityArea);
      }
      saveAuditReport(sampleReport);
      setCurrentReport(sampleReport);
      setSavedAudits(loadSavedAudits());
      setIsRunning(false);
      setAuditStepMessage('');
    }, 600);
  };

  const handleOpenAiFix = (finding: AuditFinding) => {
    setActiveAiFinding(finding);
    setIsAiModalOpen(true);
  };

  const handleCompareWith = (previous: SeoAuditReport) => {
    setCompareReport(previous);
    setIsCompareModalOpen(true);
  };

  const handleDeleteAudit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteAuditReport(id);
    const updated = loadSavedAudits();
    setSavedAudits(updated);
    if (currentReport?.id === id) {
      setCurrentReport(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleDownloadPdf = () => {
    if (currentReport) {
      generateSeoPdfReport(currentReport);
    }
  };

  // Filter findings
  const filteredFindings = (currentReport?.findings || []).filter((f) => {
    if (statusFilter !== 'all' && f.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && f.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = f.title.toLowerCase().includes(q);
      const matchObs = f.observed.toLowerCase().includes(q);
      const matchRec = f.recommendation.toLowerCase().includes(q);
      return matchTitle || matchObs || matchRec;
    }
    return true;
  });

  const issuesCount = (currentReport?.findings || []).filter((f) => f.status === 'issue').length;
  const warningsCount = (currentReport?.findings || []).filter((f) => f.status === 'warning').length;
  const passedCount = (currentReport?.findings || []).filter((f) => f.status === 'pass').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header & Introduction */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 dark:border-[#304650] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#16866F] text-white">
                <Globe className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2]">
                Local Discovery Diagnostic
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F2F7F5]">
              Website & SEO Checker
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-[#91A5A9] max-w-2xl leading-relaxed">
              Audit your website for technical health, on-page optimization, and local search alignment. Get plain-English guidance and instant AI-assisted fixes.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
            {savedAudits.length > 1 && currentReport && (
              <button
                type="button"
                onClick={() => {
                  const previous = savedAudits.find((a) => a.id !== currentReport.id);
                  if (previous) handleCompareWith(previous);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 shadow-2xs transition-colors"
                title="Compare against previous audit runs"
              >
                <TrendingUp className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
                <span>Compare Runs</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <History className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
              <span>History ({savedAudits.length})</span>
            </button>
          </div>
        </div>

        {/* Audit Runner Form */}
        <form onSubmit={handleRunAudit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Website URL Field */}
            <div className="md:col-span-6">
              <label htmlFor="seo-audit-url" className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                Website Address (URL) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="seo-audit-url"
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="e.g. apexplumbing.com or https://mybusiness.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  disabled={isRunning}
                  required
                />
              </div>
            </div>

            {/* Business Name Field */}
            <div className="md:col-span-3">
              <label htmlFor="seo-audit-bizname" className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                Business Name
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="seo-audit-bizname"
                  type="text"
                  value={bizNameInput}
                  onChange={(e) => setBizNameInput(e.target.value)}
                  placeholder="e.g. Apex Plumbing"
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  disabled={isRunning}
                />
              </div>
            </div>

            {/* Target City/Area Field */}
            <div className="md:col-span-3">
              <label htmlFor="seo-audit-city" className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                Target City / Area
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="seo-audit-city"
                  type="text"
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  placeholder="e.g. Denver, CO"
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  disabled={isRunning}
                />
              </div>
            </div>
          </div>

          {/* Form Actions & Sample Audits */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-[#91A5A9]">
              <span className="font-semibold text-slate-600 dark:text-[#B5C5C7]">Try Sample Demo:</span>
              <button
                type="button"
                onClick={() => handleLoadSample('contractor_apex')}
                className="rounded-md border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#2a4350] transition-colors"
                disabled={isRunning}
              >
                Apex Heating & Plumbing (Contractor)
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('bakery_sweetbloom')}
                className="rounded-md border border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#223640] px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#2a4350] transition-colors"
                disabled={isRunning}
              >
                Sweet Bloom Bakery (Austin, TX)
              </button>
            </div>

            <button
              type="submit"
              disabled={isRunning || !urlInput.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#16866F] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Auditing Website...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span>Run Live Website Audit</span>
                </>
              )}
            </button>
          </div>

          {/* Running Progress Phase Bar */}
          {isRunning && (
            <div className="rounded-xl border border-emerald-100 dark:border-[#304650] bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 p-4 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-[#0F5C4D] dark:text-[#65D6B2]">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#16866F] dark:text-[#65D6B2]" />
                  <span>{auditStepMessage || 'Processing audit checks...'}</span>
                </div>
                <span className="font-mono text-[11px]">Safe SSRF Proxy Active</span>
              </div>
              <div className="h-1.5 w-full bg-emerald-200/50 dark:bg-[#304650] rounded-full overflow-hidden">
                <div className="h-full bg-[#16866F] rounded-full animate-pulse w-3/4"></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {auditError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Audit Could Not Complete</p>
                <p className="mt-0.5 leading-relaxed">{auditError}</p>
                <p className="mt-2 text-[11px] text-red-600/80">
                  Tip: Ensure the domain is public and online. If you are developing locally, click one of the sample demo buttons above to explore the full suite of diagnostic checks.
                </p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* 2. Audit History Drawer */}
      {isHistoryOpen && (
        <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F2F7F5] flex items-center gap-1.5">
              <History className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
              <span>Saved Audit Reports History ({savedAudits.length})</span>
            </h3>
            {savedAudits.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Clear all saved audit reports from this browser?')) {
                    clearAuditStorage();
                    setSavedAudits([]);
                    setCurrentReport(null);
                  }
                }}
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Clear History
              </button>
            )}
          </div>

          {savedAudits.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-[#91A5A9] py-3 italic">
              No previous audit reports stored yet. Run an audit or try a sample to see it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {savedAudits.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setCurrentReport(item)}
                  className={`flex flex-col justify-between rounded-xl border p-3.5 cursor-pointer transition-all ${
                    currentReport?.id === item.id
                      ? 'border-[#16866F] bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 ring-1 ring-[#16866F]'
                      : 'border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#223640] hover:bg-slate-100/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-800 dark:text-[#F2F7F5] truncate max-w-[160px]">
                        {item.domain}
                      </span>
                      <span className="rounded bg-[#16866F] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        {item.overallScore} pts
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#91A5A9]">
                      {formatDate(item.timestamp)} · Grade {item.grade}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-[#304650] flex items-center justify-between text-xs">
                    <span className="text-[#16866F] dark:text-[#65D6B2] font-semibold text-[11px]">
                      {currentReport?.id === item.id ? 'Active Report' : 'Load Report →'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteAudit(item.id, e)}
                      className="text-slate-400 hover:text-red-500 p-1"
                      title="Delete report"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Audit Report Screen */}
      {currentReport && (
        <div className="space-y-6">
          {/* Executive Scorecard Hero */}
          <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Score Indicator */}
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center justify-center h-24 w-24 rounded-2xl bg-[#16866F] text-white shadow-md shrink-0">
                  <span className="text-3xl font-black leading-none">{currentReport.overallScore}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mt-1">/ 100 PTS</span>
                  <span className="mt-0.5 rounded bg-white/20 px-1.5 text-[10px] font-bold">
                    Grade {currentReport.grade}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-[#16866F] dark:text-[#65D6B2] uppercase tracking-wider">
                      Audit Diagnostic Summary
                    </span>
                    <span className="text-slate-300 dark:text-[#304650]">·</span>
                    <span className="text-xs text-slate-500 dark:text-[#91A5A9]">
                      {formatDate(currentReport.timestamp)}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F2F7F5] truncate max-w-lg">
                    {currentReport.businessProfileUsed?.name || currentReport.domain}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-slate-700 dark:text-[#F2F7F5] font-mono">
                      <Clock className="h-3 w-3 text-slate-500" />
                      {currentReport.summaryMetrics.responseTimeMs}ms response
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-semibold ${
                        currentReport.summaryMetrics.isHttps
                          ? 'bg-[#E0F5EE] text-[#0F5C4D] dark:bg-[#16866F]/20 dark:text-[#65D6B2]'
                          : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-[#F07171]'
                      }`}
                    >
                      {currentReport.summaryMetrics.isHttps ? (
                        <>
                          <ShieldCheck className="h-3 w-3" />
                          HTTPS Active
                        </>
                      ) : (
                        <>
                          <ShieldAlert className="h-3 w-3" />
                          Insecure HTTP
                        </>
                      )}
                    </span>

                    <span className="text-slate-500 dark:text-[#91A5A9] truncate max-w-xs">
                      {currentReport.normalizedUrl}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] px-4 text-xs font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors"
                  title="Download complete audit as branded PDF report"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 shadow-2xs transition-colors"
                >
                  <Printer className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
                  <span>Print Report</span>
                </button>
              </div>
            </div>

            {/* Quick Diagnostic Pill Matrix */}
            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#304650] grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs">
              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Word Count
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-[#F2F7F5] mt-0.5 block">
                  {currentReport.summaryMetrics.wordCount} words
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Images
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-[#F2F7F5] mt-0.5 block">
                  {currentReport.summaryMetrics.imagesCount} ({currentReport.summaryMetrics.imagesMissingAlt} no alt)
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  H1 Headings
                </span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-[#F2F7F5] mt-0.5 block">
                  {currentReport.summaryMetrics.h1Count} found
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Robots.txt
                </span>
                <span className={`text-xs font-extrabold mt-0.5 block ${currentReport.summaryMetrics.hasRobotsTxt ? 'text-[#16866F] dark:text-[#65D6B2]' : 'text-amber-600'}`}>
                  {currentReport.summaryMetrics.hasRobotsTxt ? '✓ Active' : 'Missing'}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Sitemap.xml
                </span>
                <span className={`text-xs font-extrabold mt-0.5 block ${currentReport.summaryMetrics.hasSitemapXml ? 'text-[#16866F] dark:text-[#65D6B2]' : 'text-amber-600'}`}>
                  {currentReport.summaryMetrics.hasSitemapXml ? '✓ Active' : 'Missing'}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Local Schema
                </span>
                <span className={`text-xs font-extrabold mt-0.5 block ${currentReport.summaryMetrics.hasLocalSchema ? 'text-[#16866F] dark:text-[#65D6B2]' : 'text-amber-600'}`}>
                  {currentReport.summaryMetrics.hasLocalSchema ? '✓ LocalBiz' : 'Missing'}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Direct Call
                </span>
                <span className={`text-xs font-extrabold mt-0.5 block ${currentReport.summaryMetrics.hasPhone ? 'text-[#16866F] dark:text-[#65D6B2]' : 'text-red-500'}`}>
                  {currentReport.summaryMetrics.hasPhone ? '✓ Phone Tel' : 'No Phone'}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-[#223640] p-2.5 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] block">
                  Mobile Viewport
                </span>
                <span className={`text-xs font-extrabold mt-0.5 block ${currentReport.summaryMetrics.hasViewport ? 'text-[#16866F] dark:text-[#65D6B2]' : 'text-red-500'}`}>
                  {currentReport.summaryMetrics.hasViewport ? '✓ Responsive' : 'Missing'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Category Scorecards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {Object.values(currentReport.categoryScores).map((cat) => {
              const isSelected = categoryFilter === cat.category;
              return (
                <button
                  key={cat.category}
                  type="button"
                  onClick={() => setCategoryFilter(isSelected ? 'all' : cat.category)}
                  className={`text-left rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-[#16866F] ${
                    isSelected
                      ? 'border-[#16866F] bg-[#E0F5EE]/30 dark:bg-[#16866F]/15 ring-1 ring-[#16866F]'
                      : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] hover:border-slate-300 dark:hover:border-[#3A535D]'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-800 dark:text-[#F2F7F5] truncate">
                      {cat.label}
                    </span>
                    <span
                      className={`font-black text-sm ${
                        cat.score >= 80
                          ? 'text-[#16866F] dark:text-[#65D6B2]'
                          : cat.score >= 60
                          ? 'text-amber-600 dark:text-[#E9A23B]'
                          : 'text-red-600 dark:text-[#F07171]'
                      }`}
                    >
                      {cat.score}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-100 dark:bg-[#223640] rounded-full overflow-hidden my-2">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        cat.score >= 80
                          ? 'bg-[#16866F]'
                          : cat.score >= 60
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${cat.score}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-[#91A5A9] line-clamp-2">
                    {cat.summary}
                  </p>
                </button>
              );
            })}
          </div>

          {/* 5. Findings Filter & Search Toolbar */}
          <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-4 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[#16866F] text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-[#223640] text-slate-700 dark:text-[#B5C5C7] hover:bg-slate-200'
                  }`}
                >
                  All ({currentReport.findings.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('issue')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    statusFilter === 'issue'
                      ? 'bg-red-600 text-white shadow-2xs'
                      : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-[#F07171] hover:bg-red-100'
                  }`}
                >
                  Critical Issues ({issuesCount})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('warning')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    statusFilter === 'warning'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-[#E9A23B] hover:bg-amber-100'
                  }`}
                >
                  Warnings ({warningsCount})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('pass')}
                  className={`rounded-lg px-3 py-1.5 font-semibold transition-colors ${
                    statusFilter === 'pass'
                      ? 'bg-[#16866F] text-white shadow-2xs'
                      : 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#0F5C4D] dark:text-[#65D6B2] hover:bg-emerald-100'
                  }`}
                >
                  Passed ({passedCount})
                </button>
              </div>

              {/* Category Dropdown and Search Input */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-2.5 py-1.5 text-xs text-slate-700 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                >
                  <option value="all">All Categories</option>
                  <option value="health">Health & Speed</option>
                  <option value="on_page">On-Page SEO</option>
                  <option value="technical">Technical SEO</option>
                  <option value="local_seo">Local SEO</option>
                  <option value="content">Content & Conversions</option>
                </select>

                <div className="relative flex-1 sm:w-48">
                  <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search findings..."
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] pl-8 pr-2.5 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 6. Findings Accordion List */}
          <div className="space-y-3">
            {filteredFindings.length === 0 ? (
              <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-8 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-700 dark:text-[#F2F7F5]">
                  No findings match the selected filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-xs font-bold text-[#16866F] dark:text-[#65D6B2] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredFindings.map((finding) => (
                <FindingItem
                  key={finding.id}
                  finding={finding}
                  onOpenAiFix={handleOpenAiFix}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      <SeoAiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        finding={activeAiFinding}
        report={currentReport}
        answers={answers}
      />

      {/* Comparison Modal */}
      {compareReport && currentReport && (
        <AuditComparisonModal
          isOpen={isCompareModalOpen}
          onClose={() => setIsCompareModalOpen(false)}
          previousReport={compareReport}
          currentReport={currentReport}
        />
      )}

      {/* Print Report Modal */}
      {currentReport && (
        <SeoPrintModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          report={currentReport}
        />
      )}
    </div>
  );
};
