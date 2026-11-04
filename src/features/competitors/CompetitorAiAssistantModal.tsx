import React, { useState, useEffect } from 'react';
import { CompetitorProfile, CompetitiveOpportunity } from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';
import { SeoAuditReport } from '../../types/seoChecker';
import { executeCompetitorAiStrategy, CompetitorAiAction } from './competitorAIService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Send,
  Loader2,
  Building2,
  TrendingUp,
  Compass,
  Layers,
  FileText,
} from 'lucide-react';

interface CompetitorAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: AssessmentAnswers;
  competitors: CompetitorProfile[];
  opportunities: CompetitiveOpportunity[];
  latestSeoAudit?: SeoAuditReport | null;
  initialAction?: CompetitorAiAction;
  initialContextOpportunity?: CompetitiveOpportunity | null;
}

export const CompetitorAiAssistantModal: React.FC<CompetitorAiAssistantModalProps> = ({
  isOpen,
  onClose,
  answers,
  competitors,
  opportunities,
  latestSeoAudit,
  initialAction = 'analyse_competitors',
  initialContextOpportunity,
}) => {
  const [selectedAction, setSelectedAction] = useState<CompetitorAiAction>(initialAction);
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedAction(initialAction);
      runAction(initialAction, initialContextOpportunity ? `Focus on opportunity: ${initialContextOpportunity.title}` : undefined);
    }
  }, [isOpen, initialAction, initialContextOpportunity]);

  const runAction = async (action: CompetitorAiAction, extraPrompt?: string) => {
    setIsLoading(true);
    setError(null);
    setContent('');

    try {
      const result = await executeCompetitorAiStrategy({
        action,
        answers,
        competitors,
        opportunities,
        latestSeoAudit,
        customPrompt: extraPrompt,
      });
      setContent(result);
    } catch (err: any) {
      console.error('Failed to execute AI competitor strategy:', err);
      setError('Failed to generate competitive strategy. Falling back to strategic rules engine.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionChange = (action: CompetitorAiAction) => {
    setSelectedAction(action);
    runAction(action);
  };

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
    if (!customQuestion.trim() || isSubmittingFollowUp) return;

    setIsSubmittingFollowUp(true);
    const q = customQuestion.trim();
    setCustomQuestion('');

    try {
      const followUpResponse = await executeCompetitorAiStrategy({
        action: selectedAction,
        answers,
        competitors,
        opportunities,
        latestSeoAudit,
        customPrompt: q,
      });
      setContent((prev) => `${prev}\n\n---\n\n### Follow-up Inquiry: "${q}"\n\n${followUpResponse}`);
    } catch (err: any) {
      console.error('Follow-up error:', err);
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="flex flex-col w-full max-w-3xl max-h-[92vh] rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="comp-ai-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/70 dark:bg-[#172830]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 id="comp-ai-modal-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                AI Competitive Strategy Advisor
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Grounded in your business profile and {competitors.length} saved local competitors
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Strategy Selector Tabs */}
        <div className="flex overflow-x-auto gap-1 px-4 py-2 bg-slate-100/60 dark:bg-[#172830] border-b border-slate-200 dark:border-[#304650] scrollbar-none">
          <button
            type="button"
            onClick={() => handleActionChange('analyse_competitors')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedAction === 'analyse_competitors'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
            }`}
          >
            Landscape Analysis
          </button>

          <button
            type="button"
            onClick={() => handleActionChange('find_opportunities')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedAction === 'find_opportunities'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
            }`}
          >
            Find Opportunities
          </button>

          <button
            type="button"
            onClick={() => handleActionChange('compare_messaging')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedAction === 'compare_messaging'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
            }`}
          >
            Compare Messaging
          </button>

          <button
            type="button"
            onClick={() => handleActionChange('suggest_differentiation')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedAction === 'suggest_differentiation'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
            }`}
          >
            Differentiation Angles
          </button>

          <button
            type="button"
            onClick={() => handleActionChange('content_strategy')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedAction === 'content_strategy'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
            }`}
          >
            Content Strategy
          </button>

          <button
            type="button"
            onClick={() => handleActionChange('service_presentation_gaps')}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedAction === 'service_presentation_gaps'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-white dark:hover:bg-[#223640]'
            }`}
          >
            Service Gaps
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#16866F] dark:text-[#65D6B2]" />
              <p className="text-sm font-bold text-slate-800 dark:text-[#F2F7F5]">
                Synthesizing competitor signals & formulating strategic differentiation...
              </p>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9] max-w-sm">
                Analyzing verified offerings, value propositions, and direct user observations.
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300">
              <p className="font-bold">Error Generating Strategy</p>
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

        {/* Footer & Follow-up Prompt */}
        <div className="border-t border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#172830] p-4 space-y-3">
          <form onSubmit={handleAskFollowUp} className="flex items-center gap-2">
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Ask a strategic follow-up (e.g. 'How do I word my pricing guarantee?' or 'Draft 3 Instagram hooks')..."
              className="flex-1 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              disabled={isLoading || isSubmittingFollowUp}
            />
            <button
              type="submit"
              disabled={isLoading || isSubmittingFollowUp || !customQuestion.trim()}
              className="inline-flex items-center gap-1 rounded-lg bg-[#16866F] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0F5C4D] disabled:opacity-50 transition-colors"
            >
              {isSubmittingFollowUp ? (
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
                  <span>Copied Strategy!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
                  <span>Copy Strategy</span>
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
