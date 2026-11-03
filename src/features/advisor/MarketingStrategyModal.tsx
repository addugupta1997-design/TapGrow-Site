import React, { useState } from 'react';
import { GeneratedMarketingStrategy } from '../../types/advisor';
import { saveMarketingStrategy } from '../../lib/advisorStorage';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';
import {
  X,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  BookmarkCheck,
  Target,
  Compass,
  Calendar,
  Layers,
  BarChart3,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface MarketingStrategyModalProps {
  strategy: GeneratedMarketingStrategy;
  isOpen: boolean;
  onClose: () => void;
}

export const MarketingStrategyModal: React.FC<MarketingStrategyModalProps> = ({
  strategy,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(strategy.markdownContent);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = strategy.markdownContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy strategy:', err);
    }
  };

  const handleDownload = () => {
    try {
      const bizSlug = strategy.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 25);
      const filename = `${bizSlug}_marketing_strategy_${new Date().toISOString().split('T')[0]}.md`;
      const blob = new Blob([strategy.markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download strategy markdown:', err);
    }
  };

  const handleSaveToStorage = () => {
    saveMarketingStrategy(strategy);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { data: strategy.businessOverview, icon: Target, color: 'text-teal-600 dark:text-[#65D6B2]' },
    { data: strategy.currentSituation, icon: Compass, color: 'text-amber-600 dark:text-amber-400' },
    { data: strategy.mainOpportunities, icon: Sparkles, color: 'text-emerald-600 dark:text-emerald-400' },
    { data: strategy.shortTermPriorities, icon: Calendar, color: 'text-rose-600 dark:text-rose-400' },
    { data: strategy.longTermObjectives, icon: Layers, color: 'text-blue-600 dark:text-blue-400' },
    { data: strategy.recommendedChannels, icon: Share2, color: 'text-purple-600 dark:text-purple-400' },
    { data: strategy.implementationSteps, icon: CheckCircle2, color: 'text-teal-600 dark:text-teal-400' },
    { data: strategy.successMeasurements, icon: BarChart3, color: 'text-emerald-600 dark:text-emerald-400' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="strategy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] px-5 py-4 bg-slate-50/80 dark:bg-[#172830]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16866F] text-white shadow-2xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 id="strategy-modal-title" className="text-base sm:text-lg font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                {strategy.businessName} — Marketing Strategy Blueprint
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Tailored for {strategy.categoryLabel} · Generated on {new Date(strategy.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
              aria-label="Close marketing strategy modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2 px-5 py-2.5 border-b border-slate-100 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveToStorage}
              className={`h-8 inline-flex items-center gap-1.5 rounded-md px-3 font-semibold transition-colors border ${
                saved
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-[#65D6B2]'
                  : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]'
              }`}
            >
              <BookmarkCheck className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2]" />
              <span>{saved ? 'Saved to Browser!' : 'Save Strategy'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className={`h-8 inline-flex items-center gap-1.5 rounded-md px-3 font-semibold transition-colors border ${
                copied
                  ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-[#65D6B2]'
                  : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]'
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Markdown!' : 'Copy Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="h-8 inline-flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
              title="Download strategy as a Markdown document"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export .MD</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handlePrint}
            className="h-8 inline-flex items-center gap-1.5 rounded-md bg-[#16866F] px-3.5 font-semibold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Strategy</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="rounded-xl border border-emerald-100 dark:border-[#304650] bg-emerald-50/30 dark:bg-[#16866F]/10 p-4 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
            <strong className="text-slate-800 dark:text-[#F2F7F5]">About This Strategy: </strong>
            This strategic roadmap is generated specifically from your saved business profile, category patterns, and current marketing foundation. Use it as your operating guide for the next 6–12 months.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] p-4.5 shadow-2xs space-y-3"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-[#304650] pb-2">
                    <Icon className={`h-4 w-4 shrink-0 ${sec.color}`} />
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                      {sec.data.title}
                    </h3>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed font-medium">
                    <MarkdownRenderer content={sec.data.summary} />
                  </div>

                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-[#B5C5C7]">
                    {sec.data.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-[#16866F] dark:text-[#65D6B2] font-bold shrink-0 mt-0.5">•</span>
                        <div className="flex-1">
                          <MarkdownRenderer content={point} className="[&>p]:inline" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="no-print flex items-center justify-between border-t border-slate-100 dark:border-[#304650] px-5 py-3 bg-slate-50/80 dark:bg-[#172830] text-xs text-slate-500 dark:text-[#91A5A9]">
          <span>TapGrow Strategy Engine • Saved locally</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-1.5 font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-200 dark:hover:bg-[#223640] transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
