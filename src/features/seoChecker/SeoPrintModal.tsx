import React from 'react';
import { SeoAuditReport } from '../../types/seoChecker';
import { generateSeoPdfReport } from './generateSeoPdf';
import { formatDate } from '../../locales/i18n';
import { X, Download, Printer, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

interface SeoPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SeoAuditReport;
}

export const SeoPrintModal: React.FC<SeoPrintModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateSeoPdfReport(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="flex flex-col w-full max-w-4xl max-h-[92vh] rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="print-audit-report-title"
      >
        {/* Header toolbar */}
        <div className="no-print flex items-center justify-between border-b border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/70 dark:bg-[#172830]">
          <div>
            <h2 id="print-audit-report-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
              Print & Export Audit Report
            </h2>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
              {report.domain} · Audited on {formatDate(report.timestamp)}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 shadow-2xs transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print Page</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#0F5C4D] shadow-2xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF File</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] transition-colors ml-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-100/60 dark:bg-[#122027]">
          <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-8 shadow-md text-slate-900 dark:bg-[#1D3039] dark:border-[#304650] dark:text-[#F2F7F5] space-y-6">
            {/* Header branding */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 dark:border-[#304650] pb-6 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#16866F] dark:text-[#65D6B2]">
                  TapGrow Website & SEO Diagnostic Report
                </span>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F2F7F5] mt-1">
                  {report.businessProfileUsed?.name || report.domain}
                </h1>
                <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-0.5">
                  Target: {report.normalizedUrl} · Audited on {formatDate(report.timestamp)}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-[#16866F] px-4 py-2.5 text-center text-white shadow-sm">
                  <div className="text-2xl font-black leading-none">{report.overallScore}</div>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">/ 100 PTS</span>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-[#304650] px-3.5 py-2 text-center">
                  <div className="text-xl font-bold text-slate-800 dark:text-[#F2F7F5]">Grade {report.grade}</div>
                  <span className="text-[10px] text-slate-400 font-medium">Rating</span>
                </div>
              </div>
            </div>

            {/* Category breakdown table */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] mb-3">
                Audit Category Scores
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {Object.values(report.categoryScores).map((cat) => (
                  <div
                    key={cat.category}
                    className="rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/60 dark:bg-[#223640] p-3 text-center"
                  >
                    <span className="text-[11px] font-bold text-slate-600 dark:text-[#B5C5C7] block truncate">
                      {cat.label}
                    </span>
                    <div className="text-lg font-black text-[#16866F] dark:text-[#65D6B2] my-1">
                      {cat.score}%
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-[#91A5A9] block">
                      {cat.passedCount}P · {cat.warningCount}W · {cat.issueCount}I
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Findings list */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9] mb-3">
                Key Findings & Action Items ({report.findings.length})
              </h3>
              <div className="space-y-3">
                {report.findings.map((f) => (
                  <div
                    key={f.id}
                    className={`rounded-lg border p-3.5 text-xs ${
                      f.status === 'issue'
                        ? 'border-red-200 bg-red-50/30 dark:bg-red-950/20 dark:border-red-900/50'
                        : f.status === 'warning'
                        ? 'border-amber-200 bg-amber-50/30 dark:bg-amber-950/20 dark:border-amber-900/50'
                        : 'border-slate-200 bg-slate-50/30 dark:bg-[#223640] dark:border-[#304650]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-slate-900 dark:text-[#F2F7F5]">{f.title}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-bold ${
                          f.status === 'issue'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-[#F07171]'
                            : f.status === 'warning'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-[#E9A23B]'
                            : 'bg-emerald-100 text-[#0F5C4D] dark:bg-[#16866F]/30 dark:text-[#65D6B2]'
                        }`}
                      >
                        {f.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-[#B5C5C7] leading-relaxed">{f.recommendation}</p>
                    <div className="mt-2 text-[11px] text-slate-400 font-mono">
                      Observed: {f.observed}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical metadata signals */}
            <div className="border-t border-slate-200 dark:border-[#304650] pt-4 text-[11px] text-slate-500 dark:text-[#91A5A9] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
              <div>Response: {report.summaryMetrics.responseTimeMs}ms</div>
              <div>Words: ~{report.summaryMetrics.wordCount}</div>
              <div>Images: {report.summaryMetrics.imagesCount} ({report.summaryMetrics.imagesMissingAlt} missing alt)</div>
              <div>SSL: {report.summaryMetrics.isHttps ? 'Valid' : 'Insecure'}</div>
              <div>Robots: {report.summaryMetrics.hasRobotsTxt ? 'Present' : 'None'}</div>
              <div>Sitemap: {report.summaryMetrics.hasSitemapXml ? 'Present' : 'None'}</div>
              <div>Local Schema: {report.summaryMetrics.hasLocalSchema ? 'Detected' : 'None'}</div>
              <div>Viewport: {report.summaryMetrics.hasViewport ? 'Responsive' : 'None'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
