import React from 'react';
import { ArrowLeft, ShieldCheck, Database, HardDrive, Lock } from 'lucide-react';

interface PrivacyPageProps {
  onBack: () => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ onBack }) => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#91A5A9] hover:text-slate-800 dark:hover:text-[#F2F7F5] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </button>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9]">Privacy Notice</span>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#17252B] dark:text-[#F2F7F5] sm:text-4xl">
          TapGrow Privacy & Local Storage
        </h1>
        <p className="text-base text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
          We designed TapGrow around a simple principle: your business information belongs exclusively to you.
        </p>
      </div>

      <div className="space-y-6 text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
            1. Where is your data stored?
          </h2>
          <p>
            All assessment responses, marketing readiness scores, task statuses, and personal notes are stored strictly in your device's web browser using the <strong>HTML5 localStorage API</strong>. No data is transmitted to an external server or remote database.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
            2. No Accounts, Emails, or Passwords
          </h2>
          <p>
            We do not ask for or collect your email address, full names, payment methods, credit card details, customer private records, or website access credentials. The application operates entirely without user login credentials.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <Database className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
            3. Zero Third-Party Advertising Pixels or Trackers
          </h2>
          <p>
            This application does not load third-party ad tracking scripts, Facebook Pixel, Google Tag Manager, or affiliate tracking software.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-xs space-y-3">
          <h2 className="text-base font-bold text-slate-900 dark:text-[#F2F7F5] flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#16866F] dark:text-[#65D6B2]" />
            4. Exporting and Clearing Your Data
          </h2>
          <p>
            You have complete control over your saved information at all times:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
            <li><strong className="text-slate-800 dark:text-[#F2F7F5]">Download PDF:</strong> Click "Download PDF" on your dashboard to save a complete, formatted document.</li>
            <li><strong className="text-slate-800 dark:text-[#F2F7F5]">Share Plan:</strong> Click "Share / Copy Link" to serialize and share your plan via link.</li>
            <li><strong className="text-slate-800 dark:text-[#F2F7F5]">Clear Data:</strong> Click "Clear" on your dashboard or header to immediately wipe all data from your browser.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
