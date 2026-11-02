import React, { useState } from 'react';
import { SavedPlanState, ReminderSubscription } from '../../types/storage';
import { generateWeeklyDigest, createMailtoLink } from '../../lib/weeklyDigest';
import { updateRemindersSubscriptionInStorage } from '../../lib/storage';
import {
  Bell,
  Mail,
  X,
  Check,
  Calendar,
  Clock,
  Send,
  Eye,
  Sliders,
  Sparkles,
  Copy,
  ExternalLink,
  ShieldCheck,
  Trash2,
} from 'lucide-react';

interface WeeklyRemindersModalProps {
  isOpen: boolean;
  plan: SavedPlanState;
  onClose: () => void;
  onPlanUpdated: (updatedPlan: SavedPlanState) => void;
}

export const WeeklyRemindersModal: React.FC<WeeklyRemindersModalProps> = ({
  isOpen,
  plan,
  onClose,
  onPlanUpdated,
}) => {
  const existingSub = plan.remindersSubscription;

  const [activeTab, setActiveTab] = useState<'settings' | 'preview'>('settings');
  const [email, setEmail] = useState(existingSub?.email || 'addugupta1997@gmail.com');
  const [dayOfWeek, setDayOfWeek] = useState<ReminderSubscription['dayOfWeek']>(
    existingSub?.dayOfWeek || 'monday'
  );
  const [timeOfDay, setTimeOfDay] = useState(existingSub?.timeOfDay || '09:00');
  const [includeTopPriorities, setIncludeTopPriorities] = useState(
    existingSub?.includeTopPriorities ?? true
  );
  const [includeGrowthPulse, setIncludeGrowthPulse] = useState(
    existingSub?.includeGrowthPulse ?? true
  );
  const [copiedDigest, setCopiedDigest] = useState(false);
  const [subscribedToast, setSubscribedToast] = useState(false);
  const [emailError, setEmailError] = useState('');

  if (!isOpen) return null;

  const digest = generateWeeklyDigest(plan);

  const validateEmail = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };

  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateEmail(email);
    if (err) {
      setEmailError(err);
      return;
    }
    setEmailError('');

    const newSub: ReminderSubscription = {
      enabled: true,
      email: email.trim(),
      frequency: 'weekly',
      dayOfWeek,
      timeOfDay,
      includeTopPriorities,
      includeGrowthPulse,
      subscribedAt: existingSub?.subscribedAt || new Date().toISOString(),
      lastDigestSent: existingSub?.lastDigestSent,
    };

    const updated = updateRemindersSubscriptionInStorage(newSub);
    if (updated) {
      onPlanUpdated(updated);
    }

    setSubscribedToast(true);
    setTimeout(() => {
      setSubscribedToast(false);
    }, 4000);
  };

  const handleUnsubscribe = () => {
    const updated = updateRemindersSubscriptionInStorage(undefined);
    if (updated) {
      onPlanUpdated(updated);
    }
  };

  const handleCopyDigest = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(digest.markdownContent);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = digest.markdownContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedDigest(true);
      setTimeout(() => setCopiedDigest(false), 2500);
    } catch (err) {
      console.error('Failed to copy digest:', err);
    }
  };

  const mailtoUrl = createMailtoLink(email || 'your-email@example.com', digest);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminders-modal-title"
    >
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl bg-white dark:bg-[#1D3039] shadow-2xl border border-slate-200 dark:border-[#304650] overflow-hidden">
        {/* Modal Header */}
        <div className="no-print relative flex items-center justify-between border-b border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#172830] px-6 py-4 pr-14">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#16866f] text-white shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h3 id="reminders-modal-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                Weekly Growth Digest & Briefing
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Prepare your weekly task digest to open in your email client or copy for your team
              </p>
            </div>
          </div>

          {/* Close button fixed to top right */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 dark:text-[#91A5A9] hover:text-slate-700 dark:hover:text-[#F2F7F5] hover:bg-slate-200/60 dark:hover:bg-[#223640] transition-colors"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Client-Side Architecture Transparency Notice */}
        <div className="bg-emerald-50/70 dark:bg-[#16866F]/15 border-b border-emerald-100 dark:border-[#304650] px-6 py-2.5 text-xs text-slate-600 dark:text-[#B5C5C7] flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0" />
          <span>
            <strong>100% Client-Side Privacy:</strong> TapGrow does not run an automated background email server. Digests are generated locally and launched in your email client via <code className="font-mono text-[11px] bg-white dark:bg-[#1D3039] px-1 rounded">mailto:</code> or copied to clipboard.
          </span>
        </div>

        {/* Tab Switcher: Settings vs Live Digest Preview */}
        <div className="flex border-b border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'border-[#16866f] dark:border-[#65D6B2] text-[#16866f] dark:text-[#65D6B2]'
                : 'border-transparent text-slate-500 dark:text-[#91A5A9] hover:text-slate-800 dark:hover:text-[#F2F7F5]'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Digest Settings
            {existingSub?.enabled && (
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-1.5 py-0.5 text-[10px] font-bold text-[#0F5C4D] dark:text-[#65D6B2]">
                Saved
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-semibold transition-colors ${
              activeTab === 'preview'
                ? 'border-[#16866f] dark:border-[#65D6B2] text-[#16866f] dark:text-[#65D6B2]'
                : 'border-transparent text-slate-500 dark:text-[#91A5A9] hover:text-slate-800 dark:hover:text-[#F2F7F5]'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview & Export Email
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {subscribedToast && (
            <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800/40 bg-[#DFF5EA]/60 dark:bg-emerald-950/40 p-3 text-xs text-[#0F5C4D] dark:text-[#65D6B2] animate-in fade-in duration-200">
              <Check className="h-4 w-4 shrink-0 text-[#16866f] dark:text-[#65D6B2]" />
              <span>
                <strong>Digest preferences saved!</strong> Configured for{' '}
                <span className="capitalize">{dayOfWeek}</span> at {timeOfDay} to prefill{' '}
                <strong>{email}</strong> in your email app.
              </span>
            </div>
          )}

          {activeTab === 'settings' ? (
            <form onSubmit={handleSaveSubscription} className="space-y-5">
              {/* Email Address */}
              <div>
                <label
                  htmlFor="reminder-email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#B5C5C7] mb-1.5"
                >
                  Your Email Address (For prefilling mailto links)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#91A5A9]" />
                  <input
                    id="reminder-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    placeholder="e.g. owner@yourbusiness.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-[#F2F7F5] placeholder:text-slate-400 dark:placeholder:text-[#91A5A9] focus:border-[#16866f] dark:focus:border-[#65D6B2] focus:bg-white dark:focus:bg-[#172830] focus:ring-1 focus:ring-[#16866f] dark:focus:ring-[#65D6B2] focus:outline-none"
                    required
                  />
                </div>
                {emailError && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{emailError}</p>}
                <p className="mt-1.5 text-[11px] text-slate-500 dark:text-[#91A5A9]">
                  Stored strictly in your device's local storage to prefill the recipient field when generating email digests.
                </p>
              </div>

              {/* Schedule / Timing */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="delivery-day"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#B5C5C7] mb-1.5"
                  >
                    Delivery Day
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#91A5A9] pointer-events-none" />
                    <select
                      id="delivery-day"
                      value={dayOfWeek}
                      onChange={(e) =>
                        setDayOfWeek(e.target.value as ReminderSubscription['dayOfWeek'])
                      }
                      className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] pl-9 pr-3 py-2 text-xs font-medium text-slate-800 dark:text-[#F2F7F5] focus:border-[#16866f] dark:focus:border-[#65D6B2] focus:ring-1 focus:ring-[#16866f] dark:focus:ring-[#65D6B2] focus:outline-none"
                    >
                      <option value="monday">Monday Morning (Plan the week)</option>
                      <option value="friday">Friday Afternoon (Weekly review)</option>
                      <option value="sunday">Sunday Evening (Prep week)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="delivery-time"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#B5C5C7] mb-1.5"
                  >
                    Time of Day
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#91A5A9] pointer-events-none" />
                    <select
                      id="delivery-time"
                      value={timeOfDay}
                      onChange={(e) => setTimeOfDay(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#172830] pl-9 pr-3 py-2 text-xs font-medium text-slate-800 dark:text-[#F2F7F5] focus:border-[#16866f] dark:focus:border-[#65D6B2] focus:ring-1 focus:ring-[#16866f] dark:focus:ring-[#65D6B2] focus:outline-none"
                    >
                      <option value="08:00">08:00 AM (Early Start)</option>
                      <option value="09:00">09:00 AM (Business Hours)</option>
                      <option value="10:00">10:00 AM (Mid-Morning)</option>
                      <option value="17:00">05:00 PM (End of Day)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Content Inclusions */}
              <div className="rounded-lg border border-slate-200 dark:border-[#304650] bg-slate-50/50 dark:bg-[#172830] p-3.5 space-y-2.5">
                <span className="block text-xs font-bold text-slate-800 dark:text-[#F2F7F5]">
                  Included in Every Weekly Digest
                </span>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-[#B5C5C7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeTopPriorities}
                    onChange={(e) => setIncludeTopPriorities(e.target.checked)}
                    className="rounded border-slate-300 dark:border-[#304650] text-[#16866f] focus:ring-[#16866f]"
                  />
                  <span>
                    <strong className="text-slate-800 dark:text-[#F2F7F5]">Top 3 priority actions</strong> with effort estimates and immediate next steps
                  </span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-[#B5C5C7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeGrowthPulse}
                    onChange={(e) => setIncludeGrowthPulse(e.target.checked)}
                    className="rounded border-slate-300 dark:border-[#304650] text-[#16866f] focus:ring-[#16866f]"
                  />
                  <span>
                    <strong className="text-slate-800 dark:text-[#F2F7F5]">Growth Pulse momentum</strong> and category completion percentages
                  </span>
                </label>
              </div>

              {/* Status & Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {existingSub?.enabled ? (
                  <button
                    type="button"
                    onClick={handleUnsubscribe}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 py-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Cancel Subscription
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#91A5A9]">
                    <ShieldCheck className="h-4 w-4 text-[#16866f] dark:text-[#65D6B2]" />
                    <span>Preferences stored locally in this browser</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('preview')}
                    className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3.5 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866f]"
                  >
                    <Eye className="h-3.5 w-3.5 text-slate-500 dark:text-[#91A5A9]" />
                    <span>Preview Email</span>
                  </button>
                  <button
                    type="submit"
                    className="h-9 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#16866f] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866f]"
                  >
                    <Bell className="h-3.5 w-3.5" />
                    <span>{existingSub?.enabled ? 'Update Subscription' : 'Subscribe to Weekly Reminders'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* Live Email Preview */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 dark:bg-[#172830] p-2.5 rounded-lg border border-slate-200 dark:border-[#304650] text-xs">
                <div>
                  <span className="font-semibold text-slate-600 dark:text-[#B5C5C7]">Subject: </span>
                  <span className="font-medium text-slate-900 dark:text-[#F2F7F5]">{digest.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopyDigest}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-[#F2F7F5] bg-white dark:bg-[#223640] border border-slate-200 dark:border-[#304650] px-2 py-1 rounded hover:bg-slate-50 dark:hover:bg-[#29404A]"
                  >
                    {copiedDigest ? (
                      <>
                        <Check className="h-3 w-3 text-[#16866f] dark:text-[#65D6B2]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3 text-slate-400 dark:text-[#91A5A9]" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>
                  <a
                    href={mailtoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#16866f] px-2.5 py-1 rounded hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80]"
                  >
                    <Send className="h-3 w-3" />
                    <span>Send Test Email</span>
                  </a>
                </div>
              </div>

              {/* Rendered HTML preview container */}
              <div
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs overflow-hidden"
                dangerouslySetInnerHTML={{ __html: digest.htmlContent }}
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="no-print flex items-center justify-between border-t border-slate-200 dark:border-[#304650] bg-slate-50 dark:bg-[#172830] px-6 py-3 text-xs text-slate-500 dark:text-[#91A5A9]">
          <span>
            {existingSub?.enabled ? (
              <span className="text-[#0F5C4D] dark:text-[#65D6B2] font-medium flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#16866f] dark:text-[#65D6B2]" />
                Active weekly digests to {existingSub.email}
              </span>
            ) : (
              'No active subscription yet'
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-100 dark:hover:bg-[#29404A]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
