import React, { useState } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import {
  generateContentIdeasAI,
  improveCaptionAI,
  suggestContentHooksAI,
  suggestCampaignConceptAI,
  generatePromotionalCopyAI,
} from './workspaceAIService';
import { saveContentItem, saveIdea } from '../../lib/workspaceStorage';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';
import {
  Sparkles,
  X,
  Send,
  Check,
  FilePlus,
  Bookmark,
  Copy,
  Edit3,
  Lightbulb,
  TrendingUp,
  MessageSquare,
  AlertCircle,
  Tag,
} from 'lucide-react';

interface AIContentAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers: AssessmentAnswers;
  initialMode?: 'ideas' | 'improve_caption' | 'hooks' | 'campaign' | 'promo';
  initialText?: string;
  onItemSaved?: (type: 'content' | 'idea') => void;
}

export const AIContentAssistantModal: React.FC<AIContentAssistantModalProps> = ({
  isOpen,
  onClose,
  answers,
  initialMode = 'ideas',
  initialText = '',
  onItemSaved,
}) => {
  const [activeTool, setActiveTool] = useState<'ideas' | 'improve_caption' | 'hooks' | 'campaign' | 'promo'>(initialMode);
  const [userInput, setUserInput] = useState(initialText);
  const [selectedTone, setSelectedTone] = useState<'engaging' | 'friendly' | 'promotional' | 'educational'>('engaging');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [isEditingOutput, setIsEditingOutput] = useState(false);
  const [editableOutput, setEditableOutput] = useState('');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const bizName = answers.businessName || 'Your Business';

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSaveFeedback(null);
    setIsEditingOutput(false);

    try {
      let result = '';
      switch (activeTool) {
        case 'ideas':
          result = await generateContentIdeasAI(answers, userInput.trim() || undefined);
          break;
        case 'improve_caption':
          if (!userInput.trim()) {
            setErrorMessage('Please enter an existing draft caption to improve.');
            setIsLoading(false);
            return;
          }
          result = await improveCaptionAI(answers, userInput, selectedTone);
          break;
        case 'hooks':
          result = await suggestContentHooksAI(answers, userInput.trim() || undefined);
          break;
        case 'campaign':
          result = await suggestCampaignConceptAI(answers, userInput.trim() || undefined);
          break;
        case 'promo':
          if (!userInput.trim()) {
            setErrorMessage('Please specify your special offer or discount details.');
            setIsLoading(false);
            return;
          }
          result = await generatePromotionalCopyAI(answers, userInput);
          break;
      }

      setGeneratedOutput(result);
      setEditableOutput(result);
    } catch (err: any) {
      console.error('AI assistant error:', err);
      setErrorMessage(err?.message || 'Unable to generate response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    const textToCopy = isEditingOutput ? editableOutput : generatedOutput;
    if (!textToCopy) return;

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy output:', err);
    }
  };

  const handleSaveToContentDraft = () => {
    const text = isEditingOutput ? editableOutput : (generatedOutput || '');
    if (!text) return;

    saveContentItem({
      title: `${activeTool.replace(/_/g, ' ').toUpperCase()}: ${bizName}`,
      platform: 'instagram',
      contentType: 'image_post',
      caption: text,
      hashtags: [answers.category.replace(/_/g, ''), 'localbusiness'],
      callToAction: 'Visit us or tap link in bio',
      status: 'draft',
    });

    setSaveFeedback('Saved as draft in Content Planner!');
    if (onItemSaved) onItemSaved('content');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  const handleSaveToIdeas = () => {
    const text = isEditingOutput ? editableOutput : (generatedOutput || '');
    if (!text) return;

    saveIdea({
      title: `${activeTool.replace(/_/g, ' ').toUpperCase()} Concept for ${bizName}`,
      description: text,
      category: activeTool === 'hooks' ? 'reel_hooks' : activeTool === 'campaign' ? 'campaign_ideas' : 'social_media',
      tags: ['ai_generated', answers.category],
      isFavourite: true,
    });

    setSaveFeedback('Saved to Ideas Library!');
    if (onItemSaved) onItemSaved('idea');
    setTimeout(() => setSaveFeedback(null), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs animate-in fade-in duration-100"
    >
      <div className="relative flex flex-col w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#304650] px-5 py-4 bg-slate-50/80 dark:bg-[#172830]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white shadow-2xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                AI Marketing Assistant
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Tailored for {bizName} ({answers.category.replace(/_/g, ' ')})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tool Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 px-5 py-2.5 border-b border-slate-100 dark:border-[#304650] bg-white dark:bg-[#1D3039] text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTool('ideas');
              setGeneratedOutput(null);
            }}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
              activeTool === 'ideas'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            Content Ideas
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('improve_caption');
              setGeneratedOutput(null);
            }}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
              activeTool === 'improve_caption'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            Caption Polish
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('hooks');
              setGeneratedOutput(null);
            }}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
              activeTool === 'hooks'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            Video / Reel Hooks
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('campaign');
              setGeneratedOutput(null);
            }}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
              activeTool === 'campaign'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            Campaign Concept
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTool('promo');
              setGeneratedOutput(null);
            }}
            className={`rounded-lg px-2.5 py-1 font-semibold transition-colors ${
              activeTool === 'promo'
                ? 'bg-[#16866F] text-white shadow-2xs'
                : 'text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]'
            }`}
          >
            Promotional Copy
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          {/* Input prompts based on selected tool */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-[#F2F7F5] mb-1">
              {activeTool === 'ideas' && 'Optional Focus Topic or Seasonal Angle:'}
              {activeTool === 'improve_caption' && 'Paste Draft Caption to Polish:'}
              {activeTool === 'hooks' && 'Optional Topic (or leave blank for category hooks):'}
              {activeTool === 'campaign' && 'Campaign Theme or Goal (optional):'}
              {activeTool === 'promo' && 'Offer Details (e.g., 20% off first visit or free consultation):'}
            </label>
            <textarea
              rows={activeTool === 'improve_caption' ? 3 : 2}
              placeholder={
                activeTool === 'ideas'
                  ? 'e.g., Weekend special, client education, or behind the scenes'
                  : activeTool === 'improve_caption'
                  ? 'Paste your rough caption here...'
                  : activeTool === 'promo'
                  ? 'e.g. Free home inspection this month or Buy 2 Get 1 Free on Saturday'
                  : 'Type any specific direction or leave blank for automatic recommendation...'
              }
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] px-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
            />
          </div>

          {activeTool === 'improve_caption' && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700 dark:text-[#F2F7F5]">Tone:</span>
              {(['engaging', 'friendly', 'promotional', 'educational'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTone(t)}
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase ${
                    selectedTone === t
                      ? 'bg-[#16866F] text-white'
                      : 'bg-slate-100 dark:bg-[#223640] text-slate-600 dark:text-[#B5C5C7]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            disabled={isLoading}
            onClick={handleGenerate}
            className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866F] font-bold text-white shadow-2xs hover:bg-[#0F5C4D] disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <span>Crafting business recommendations...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate with Advisor</span>
              </>
            )}
          </button>

          {errorMessage && (
            <div className="rounded-lg border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-2.5 text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Generated Result Output */}
          {generatedOutput && (
            <div className="mt-4 rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#172830] p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-[#304650] pb-2">
                <span className="font-bold text-slate-800 dark:text-[#F2F7F5] flex items-center gap-1">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                  Advisor Recommendations:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setIsEditingOutput(!isEditingOutput)}
                    className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title={isEditingOutput ? 'Preview Markdown' : 'Edit Text'}
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    title="Copy Output"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {isEditingOutput ? (
                <textarea
                  rows={8}
                  value={editableOutput}
                  onChange={(e) => setEditableOutput(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3 text-xs leading-relaxed text-slate-900 dark:text-[#F2F7F5] focus:outline-none focus:ring-1 focus:ring-[#16866F]"
                />
              ) : (
                <div className="prose-xs max-h-60 overflow-y-auto">
                  <MarkdownRenderer content={editableOutput} />
                </div>
              )}

              {saveFeedback && (
                <div className="rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-[#65D6B2] px-2.5 py-1 text-xs font-semibold flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5" />
                  <span>{saveFeedback}</span>
                </div>
              )}

              {/* Action Buttons: Save to Content Draft or Save to Ideas */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-[#304650]">
                <button
                  type="button"
                  onClick={handleSaveToIdeas}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1D3039] px-3 py-1.5 font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
                >
                  <Bookmark className="h-3.5 w-3.5 text-amber-500" />
                  <span>Save to Ideas Library</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveToContentDraft}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 py-1.5 font-bold text-white shadow-2xs hover:bg-[#0F5C4D] transition-colors"
                >
                  <FilePlus className="h-3.5 w-3.5" />
                  <span>Create Content Draft</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#304650] px-5 py-3 bg-slate-50/80 dark:bg-[#172830] text-xs text-slate-500 dark:text-[#91A5A9]">
          <span>Review and edit before saving • Never published automatically</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 font-semibold text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-200 dark:hover:bg-[#223640]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
