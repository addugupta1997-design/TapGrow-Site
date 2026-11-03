import React, { useState, useEffect, useRef } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import {
  ChatMessage,
  Conversation,
  GeneratedMarketingStrategy,
  AdvisorServiceStatus,
} from '../../types/advisor';
import { buildBusinessIntelligenceProfile } from '../recommendations/businessProfile';
import { getSuggestedQuestionsForProfile } from './localAdvisorEngine';
import {
  askAdvisor,
  checkAdvisorServiceStatus,
  generateMarketingStrategyPlan,
} from './advisorService';
import {
  loadAllConversations,
  saveConversation,
  createNewConversation,
  renameConversation,
  deleteConversation,
  clearAllConversations,
  getActiveConversationId,
  setActiveConversationId,
  appendMessageToConversation,
} from '../../lib/advisorStorage';
import { MarketingStrategyModal } from './MarketingStrategyModal';
import { MarkdownRenderer } from '../../components/common/MarkdownRenderer';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Plus,
  Trash2,
  Edit2,
  ChevronDown,
  RotateCcw,
  Check,
  Copy,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Shield,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface AIMarketingAdvisorProps {
  answers: AssessmentAnswers;
}

export const AIMarketingAdvisor: React.FC<AIMarketingAdvisorProps> = ({ answers }) => {
  const profile = buildBusinessIntelligenceProfile(answers);
  const suggestedQuestions = getSuggestedQuestionsForProfile(profile, answers);

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false);
  const [serviceStatus, setServiceStatus] = useState<AdvisorServiceStatus>({
    configured: false,
    provider: 'local',
  });
  const [activeStrategy, setActiveStrategy] = useState<GeneratedMarketingStrategy | null>(null);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isSessionMenuOpen, setIsSessionMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameInput, setRenameInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize service status and load conversations
  useEffect(() => {
    checkAdvisorServiceStatus().then(setServiceStatus);

    const savedConvs = loadAllConversations();
    if (savedConvs.length > 0) {
      setConversations(savedConvs);
      const activeId = getActiveConversationId();
      const current = savedConvs.find((c) => c.id === activeId) || savedConvs[0];
      setActiveConv(current);
      setActiveConversationId(current.id);
    } else {
      const initial = createNewConversation(`Marketing Session for ${profile.businessName}`);
      setConversations([initial]);
      setActiveConv(initial);
    }
  }, [profile.businessName]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !activeConv || isLoading) return;

    setErrorMessage(null);
    setInputText('');

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Update conversation with user message
    const updatedWithUser = appendMessageToConversation(activeConv.id, userMsg);
    if (updatedWithUser) {
      setActiveConv({ ...updatedWithUser });
      setConversations(loadAllConversations());
    }

    setIsLoading(true);

    try {
      const result = await askAdvisor({
        userMessage: text,
        answers,
        conversationHistory: activeConv.messages,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_${Date.now()}_a`,
        role: 'assistant',
        content: result.text,
        timestamp: new Date().toISOString(),
        source: result.source,
        structuredAdvice: result.structuredAdvice,
      };

      const finalUpdated = appendMessageToConversation(activeConv.id, assistantMsg);
      if (finalUpdated) {
        setActiveConv({ ...finalUpdated });
        setConversations(loadAllConversations());
      }
    } catch (err: any) {
      console.error('Failed to query marketing advisor:', err);
      setErrorMessage(
        err?.message || 'Unable to complete response. Please check your network connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    const newConv = createNewConversation(`Session ${conversations.length + 1}`);
    const updated = loadAllConversations();
    setConversations(updated);
    setActiveConv(newConv);
    setIsSessionMenuOpen(false);
  };

  const handleSelectConversation = (conv: Conversation) => {
    setActiveConv(conv);
    setActiveConversationId(conv.id);
    setIsSessionMenuOpen(false);
  };

  const handleDeleteActiveConversation = () => {
    if (!activeConv) return;
    deleteConversation(activeConv.id);
    const updated = loadAllConversations();
    setConversations(updated);
    if (updated.length > 0) {
      setActiveConv(updated[0]);
    } else {
      const fresh = createNewConversation('New Strategy Session');
      setConversations([fresh]);
      setActiveConv(fresh);
    }
  };

  const handleClearActiveMessages = () => {
    if (!activeConv) return;
    const cleared: Conversation = {
      ...activeConv,
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    saveConversation(cleared);
    setActiveConv(cleared);
    setConversations(loadAllConversations());
  };

  const handleStartRename = () => {
    if (!activeConv) return;
    setRenameInput(activeConv.title);
    setIsRenaming(true);
    setIsSessionMenuOpen(false);
  };

  const handleSaveRename = () => {
    if (!activeConv || !renameInput.trim()) {
      setIsRenaming(false);
      return;
    }
    const renamed = renameConversation(activeConv.id, renameInput);
    if (renamed) {
      setActiveConv({ ...renamed });
      setConversations(loadAllConversations());
    }
    setIsRenaming(false);
  };

  const handleGenerateStrategy = async () => {
    setIsGeneratingStrategy(true);
    setErrorMessage(null);
    try {
      const strategy = await generateMarketingStrategyPlan(answers);
      setActiveStrategy(strategy);
      setIsStrategyModalOpen(true);
    } catch (err) {
      console.error('Failed to generate strategy blueprint:', err);
      setErrorMessage('Could not generate full marketing strategy. Please try again.');
    } finally {
      setIsGeneratingStrategy(false);
    }
  };

  const handleCopyMessage = async (msg: ChatMessage) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(msg.content);
      }
      setCopiedMessageId(msg.id);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-xs overflow-hidden transition-colors flex flex-col min-h-[640px]">
      {/* 1. Top Advisor Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-slate-100 dark:border-[#304650] p-4 sm:p-5 bg-slate-50/70 dark:bg-[#172830]">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#16866F] to-[#0F5C4D] text-white shadow-xs">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-[#142A36] dark:text-[#F2F7F5] tracking-tight">
                AI Marketing Advisor
              </h2>
              {/* Service mode badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                  serviceStatus.configured
                    ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 text-[#0F5C4D] dark:text-[#65D6B2]'
                    : 'border-teal-200 dark:border-[#304650] bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#16866F] dark:text-[#65D6B2]'
                }`}
                title={
                  serviceStatus.configured
                    ? 'Connected to Gemini AI model via secure server proxy'
                    : 'Running in Local Rule-Based Strategy Mode (No remote API key required)'
                }
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    serviceStatus.configured ? 'bg-emerald-500' : 'bg-[#16866F]'
                  }`}
                />
                {serviceStatus.configured ? 'Live Gemini AI' : 'Local Strategy Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#91A5A9] mt-0.5">
              Personalized growth guidance for <strong>{profile.businessName}</strong> ({profile.categoryLabel} · {profile.locationDisplay || 'Local Area'})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Generate Strategy Blueprint Button */}
          <button
            type="button"
            onClick={handleGenerateStrategy}
            disabled={isGeneratingStrategy}
            className="h-9 inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-3.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none disabled:opacity-50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>{isGeneratingStrategy ? 'Generating Strategy...' : 'Generate My Marketing Strategy'}</span>
          </button>

          {/* Conversation Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSessionMenuOpen(!isSessionMenuOpen)}
              className="h-9 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-3 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] shadow-2xs hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span className="max-w-[120px] truncate">{activeConv?.title || 'Session'}</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {isSessionMenuOpen && (
              <div className="absolute right-0 top-11 z-30 w-72 rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-2 shadow-xl space-y-1 animate-in fade-in duration-100">
                <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9] border-b border-slate-100 dark:border-[#304650] pb-1.5">
                  <span>Conversation Sessions ({conversations.length})</span>
                  <button
                    type="button"
                    onClick={handleNewConversation}
                    className="flex items-center gap-1 text-[#16866F] dark:text-[#65D6B2] hover:underline normal-case font-semibold"
                  >
                    <Plus className="h-3 w-3" /> New
                  </button>
                </div>

                <div className="max-h-56 overflow-y-auto space-y-1 py-1">
                  {conversations.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleSelectConversation(c)}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors ${
                        c.id === activeConv?.id
                          ? 'bg-[#E0F5EE] dark:bg-[#16866F]/20 text-[#0F5C4D] dark:text-[#65D6B2] font-bold'
                          : 'text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640]'
                      }`}
                    >
                      <span className="truncate flex-1 pr-2">{c.title}</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#91A5A9] shrink-0 font-mono">
                        {c.messages.length} msgs
                      </span>
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 dark:border-[#304650] pt-1.5 flex items-center justify-between px-1 text-xs">
                  <button
                    type="button"
                    onClick={handleStartRename}
                    className="flex items-center gap-1 text-slate-600 dark:text-[#B5C5C7] hover:text-slate-900 dark:hover:text-white py-1"
                  >
                    <Edit2 className="h-3 w-3" /> Rename
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteActiveConversation}
                    className="flex items-center gap-1 text-red-600 dark:text-[#F07171] hover:underline py-1"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* New Session Button */}
          <button
            type="button"
            onClick={handleNewConversation}
            className="h-9 inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors"
            title="Start fresh conversation"
          >
            <Plus className="h-3.5 w-3.5 text-slate-500" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>

      {/* Rename dialog inline banner */}
      {isRenaming && (
        <div className="flex items-center gap-2 px-5 py-2.5 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/40 text-xs">
          <span className="font-semibold text-amber-900 dark:text-amber-200">Rename Session:</span>
          <input
            type="text"
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveRename();
              if (e.key === 'Escape') setIsRenaming(false);
            }}
            className="h-7 flex-1 rounded border border-amber-300 dark:border-amber-700 bg-white dark:bg-[#1D3039] px-2 text-xs text-slate-900 dark:text-white"
            autoFocus
          />
          <button
            type="button"
            onClick={handleSaveRename}
            className="h-7 rounded bg-[#16866F] px-2.5 font-semibold text-white hover:bg-[#0F5C4D]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setIsRenaming(false)}
            className="h-7 rounded border border-slate-200 dark:border-slate-700 px-2 font-semibold text-slate-600 dark:text-slate-300"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 2. Messages View Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 max-h-[520px]">
        {/* Welcome Card if conversation is empty */}
        {(!activeConv || activeConv.messages.length === 0) && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#172830] p-5 sm:p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#16866F] text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#142A36] dark:text-[#F2F7F5]">
                    Welcome! I'm your TapGrow Marketing Advisor.
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
                    I'm primed with your business diagnostic data for <strong>{profile.businessName}</strong>. You can ask for concrete advice on Google Maps visibility, website conversions, review acquisition routines, social media batching, or organic customer retention.
                  </p>
                </div>
              </div>

              {/* Injected Business Context Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-[#304650] text-[11px]">
                <span className="font-semibold text-slate-500 dark:text-[#91A5A9]">Profile Grounding:</span>
                <span className="rounded bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] px-2 py-0.5 text-slate-700 dark:text-[#F2F7F5] font-medium">
                  {profile.categoryLabel}
                </span>
                <span className="rounded bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] px-2 py-0.5 text-slate-700 dark:text-[#F2F7F5] font-medium">
                  Goal: {profile.primaryGoal.replace(/_/g, ' ')}
                </span>
                <span className="rounded bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] px-2 py-0.5 text-slate-700 dark:text-[#F2F7F5] font-medium">
                  Time: {profile.weeklyTime.replace(/_/g, ' ')}
                </span>
                <span className="rounded bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] px-2 py-0.5 text-slate-700 dark:text-[#F2F7F5] font-medium">
                  Budget: {profile.budgetPreference.replace(/_/g, ' ')}
                </span>
                <span className="rounded bg-white dark:bg-[#1D3039] border border-slate-200 dark:border-[#304650] px-2 py-0.5 text-slate-700 dark:text-[#F2F7F5] font-medium">
                  Website: {profile.hasWebsite ? 'Active' : 'None yet'}
                </span>
              </div>
            </div>

            {/* Suggested Question Pills */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 dark:text-[#F2F7F5] flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                Recommended questions for {profile.businessName}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3 text-left text-xs text-slate-700 dark:text-[#F2F7F5] font-medium hover:border-[#16866F] dark:hover:border-[#65D6B2] hover:bg-slate-50 dark:hover:bg-[#223640] transition-colors shadow-2xs group"
                  >
                    <span>{q}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#16866F] dark:group-hover:text-[#65D6B2] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Render Conversation Messages */}
        {activeConv?.messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} group animate-in fade-in duration-100`}
            >
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#16866F] text-white mt-1 shadow-2xs">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                  isUser ? 'items-end' : 'items-start'
                }`}
              >
                {/* Bubble */}
                <div
                  className={`relative rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-[#142A36] text-white dark:bg-[#16866F] rounded-br-xs'
                      : 'bg-slate-50 dark:bg-[#172830] text-slate-800 dark:text-[#F2F7F5] border border-slate-200/80 dark:border-[#304650] rounded-bl-xs'
                  }`}
                >
                  {/* Message Content: User plain text, Assistant rich Markdown */}
                  {isUser ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}

                  {/* Structured 7-part Advice Card if available */}
                  {msg.structuredAdvice && (
                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#304650] space-y-3 text-xs">
                      {msg.structuredAdvice.understanding && (
                        <div className="rounded-lg bg-white dark:bg-[#1D3039] p-2.5 border border-slate-200 dark:border-[#304650]">
                          <span className="font-bold text-slate-900 dark:text-[#F2F7F5] block mb-0.5">
                            1. Understanding:
                          </span>
                          <MarkdownRenderer content={msg.structuredAdvice.understanding} />
                        </div>
                      )}

                      {msg.structuredAdvice.observation && (
                        <div className="rounded-lg bg-white dark:bg-[#1D3039] p-2.5 border border-slate-200 dark:border-[#304650]">
                          <span className="font-bold text-slate-900 dark:text-[#F2F7F5] block mb-0.5">
                            2. Business-Specific Observation:
                          </span>
                          <MarkdownRenderer content={msg.structuredAdvice.observation} />
                        </div>
                      )}

                      {msg.structuredAdvice.recommendedSolution && (
                        <div className="rounded-lg bg-[#E0F5EE]/60 dark:bg-[#16866F]/15 p-2.5 border border-emerald-200 dark:border-[#304650] text-[#0F5C4D] dark:text-[#65D6B2]">
                          <span className="font-bold block mb-0.5">
                            3. Recommended Solution:
                          </span>
                          <MarkdownRenderer content={msg.structuredAdvice.recommendedSolution} />
                        </div>
                      )}

                      {msg.structuredAdvice.stepByStep && msg.structuredAdvice.stepByStep.length > 0 && (
                        <div className="rounded-lg bg-white dark:bg-[#1D3039] p-2.5 border border-slate-200 dark:border-[#304650]">
                          <span className="font-bold text-slate-900 dark:text-[#F2F7F5] block mb-1">
                            4. Step-by-Step Implementation:
                          </span>
                          <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-700 dark:text-[#B5C5C7]">
                            {msg.structuredAdvice.stepByStep.map((s, idx) => (
                              <li key={idx} className="marker:text-[#16866F] dark:marker:text-[#65D6B2]">
                                <MarkdownRenderer content={s} className="inline [&>p]:inline" />
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {msg.structuredAdvice.estimatedEffort && (
                          <div className="rounded-lg bg-white dark:bg-[#1D3039] p-2.5 border border-slate-200 dark:border-[#304650]">
                            <span className="font-bold text-slate-800 dark:text-[#F2F7F5] block mb-0.5">
                              5. Estimated Effort:
                            </span>
                            <span className="text-slate-600 dark:text-[#B5C5C7] font-mono text-xs">
                              {msg.structuredAdvice.estimatedEffort}
                            </span>
                          </div>
                        )}

                        {msg.structuredAdvice.expectedBenefit && (
                          <div className="rounded-lg bg-white dark:bg-[#1D3039] p-2.5 border border-slate-200 dark:border-[#304650]">
                            <span className="font-bold text-slate-800 dark:text-[#F2F7F5] block mb-0.5">
                              6. Expected Benefit:
                            </span>
                            <MarkdownRenderer content={msg.structuredAdvice.expectedBenefit} />
                          </div>
                        )}
                      </div>

                      {msg.structuredAdvice.suggestedNextAction && (
                        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-2.5 border border-emerald-200 dark:border-emerald-800/40 text-[#0F5C4D] dark:text-[#65D6B2]">
                          <span className="font-bold block mb-0.5">
                            7. Suggested Next Action:
                          </span>
                          <MarkdownRenderer content={msg.structuredAdvice.suggestedNextAction} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Metadata & Copy action */}
                <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400 dark:text-[#91A5A9]">
                  {!isUser && msg.source && (
                    <span className="font-semibold text-slate-500 dark:text-[#91A5A9]">
                      {msg.source === 'gemini' ? 'Gemini 3.8 Flash' : 'Local Strategy Engine'}
                    </span>
                  )}
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(msg)}
                    className="opacity-0 group-hover:opacity-100 hover:text-slate-700 dark:hover:text-white transition-opacity flex items-center gap-1"
                    title="Copy message content"
                  >
                    {copiedMessageId === msg.id ? (
                      <Check className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    <span>{copiedMessageId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 dark:bg-[#304650] text-slate-700 dark:text-[#F2F7F5] mt-1 shadow-2xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-in fade-in duration-100">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#16866F] text-white mt-1 shadow-2xs">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl rounded-bl-xs bg-slate-50 dark:bg-[#172830] border border-slate-200/80 dark:border-[#304650] p-4 text-xs text-slate-600 dark:text-[#B5C5C7] space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16866F] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16866F]"></span>
                </span>
                <span className="font-semibold text-slate-700 dark:text-[#F2F7F5]">
                  Analyzing {profile.businessName}'s profile and formulating marketing recommendations...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 p-3 text-xs text-red-800 dark:text-[#F07171] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => handleSendMessage()}
              className="font-bold underline hover:no-underline shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Message Input Form */}
      <div className="border-t border-slate-100 dark:border-[#304650] p-3 sm:p-4 bg-white dark:bg-[#1D3039]">
        {/* Dynamic Suggested Follow-ups Pill Row */}
        {activeConv && activeConv.messages.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 text-xs">
            <span className="text-[11px] font-bold text-slate-400 dark:text-[#91A5A9] shrink-0 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> Quick queries:
            </span>
            {suggestedQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap shrink-0 rounded-full bg-slate-100 dark:bg-[#223640] border border-slate-200 dark:border-[#304650] px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-200 dark:hover:bg-[#2c434f] transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask anything about marketing for ${profile.businessName} (e.g. Local SEO, reviews, website CTA)...`}
              disabled={isLoading}
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/60 dark:bg-[#172830] px-4 pr-10 text-xs sm:text-sm text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] focus:border-[#16866F] dark:focus:border-[#65D6B2] focus:bg-white dark:focus:bg-[#172830] focus:ring-1 focus:ring-[#16866F] dark:focus:ring-[#65D6B2] focus:outline-none transition-colors disabled:opacity-50"
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ×
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="h-11 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#16866F] px-4 font-bold text-white shadow-2xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm shrink-0"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#91A5A9] mt-2 px-1">
          <span>
            {activeConv?.messages.length || 0} messages in this session · Saved in browser
          </span>
          {activeConv && activeConv.messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearActiveMessages}
              className="hover:text-red-500 transition-colors"
            >
              Clear conversation
            </button>
          )}
        </div>
      </div>

      {/* 4. Strategy Modal */}
      {activeStrategy && (
        <MarketingStrategyModal
          strategy={activeStrategy}
          isOpen={isStrategyModalOpen}
          onClose={() => setIsStrategyModalOpen(false)}
        />
      )}
    </div>
  );
};
