import React, { useState, useEffect } from 'react';
import { AuditFinding, SeoAuditReport } from '../../types/seoChecker';
import { generateSeoAiFix } from './seoAiService';
import { AssessmentAnswers } from '../../types/assessment';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  X,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Send,
  Loader2,
  FileText,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface SeoAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  finding: AuditFinding | null;
  report: SeoAuditReport | null;
  answers?: AssessmentAnswers;
}

export const SeoAiAssistantModal: React.FC<SeoAiAssistantModalProps> = ({
  isOpen,
  onClose,
  finding,
  report,
  answers,
}) => {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && finding && report) {
      setContent('');
      setError(null);
      setIsLoading(true);

      generateSeoAiFix(finding, report, answers)
        .then((res) => {
          setContent(res);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to generate SEO fix:', err);
          setError('Failed to generate AI advice. Please try again.');
          setIsLoading(false);
        });
    }
  }, [isOpen, finding, report, answers]);

  if (!isOpen || !finding || !report) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || isSubmittingQuestion) return;

    setIsSubmittingQuestion(true);
    const questionText = customQuestion.trim();
    setCustomQuestion('');

    try {
      const specializedFinding: AuditFinding = {
        ...finding,
        observed: `${finding.observed} | User Question: "${questionText}"`,
      };
      const newResponse = await generateSeoAiFix(specializedFinding, report, answers);
      setContent((prev) => `${prev}\n\n---\n\n### Follow-up: "${questionText}"\n\n${newResponse}`);
    } catch (err: any) {
      console.error('Follow-up failed:', err);
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-seo-assistant-title"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/50 dark:bg-[#172830]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 id="ai-seo-assistant-title" className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
                AI SEO Fix Assistant
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Tailored solution for: {finding.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640] transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Context Tag */}
        <div className="bg-[#E0F5EE]/50 dark:bg-[#16866F]/15 px-6 py-2 border-b border-emerald-100 dark:border-[#304650] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#0F5C4D] dark:text-[#65D6B2] font-medium truncate">
            <span className="font-bold">Target:</span>
            <span className="truncate">{report.normalizedUrl}</span>
          </div>
          <span className="text-slate-500 dark:text-[#91A5A9] shrink-0 font-mono text-[11px]">
            Est. Fix: {finding.effort}
          </span>
        </div>

        {/* Modal Body / Generated Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#16866F] dark:text-[#65D6B2]" />
              <p className="text-sm font-semibold text-slate-800 dark:text-[#F2F7F5]">
                Analyzing your website and drafting optimized recommendations...
              </p>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] max-w-sm">
                Tailoring titles, copy, and instructions to {report.businessProfileUsed?.name || 'your local business'}.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300">
              <p className="font-bold">Error Generating Solution</p>
              <p className="mt-1">{error}</p>
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-[#F2F7F5] prose-code:bg-slate-100 dark:prose-code:bg-[#223640] prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Modal Footer & Follow-up Prompt */}
        <div className="border-t border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#172830] p-4 space-y-3">
          <form onSubmit={handleAskFollowUp} className="flex items-center gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask a question (e.g. 'Shorten this to 140 chars' or 'How do I add this in WordPress?')"
              className="flex-1 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              disabled={isLoading || isSubmittingQuestion}
            />
            <button
              type="submit"
              disabled={isLoading || isSubmittingQuestion || !customQuestion.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-[#16866F] px-3 py-2 text-xs font-semibold text-white hover:bg-[#0F5C4D] disabled:opacity-50 transition-colors"
            >
              {isSubmittingQuestion ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              <span>Ask</span>
            </button>
          </form>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoading || !content}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                copied
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-[#65D6B2]'
                  : 'border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#223640]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-[#65D6B2]" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
                  <span>Copy Solution</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-slate-200 dark:bg-[#223640] px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-300 dark:hover:bg-[#2a4350] transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
