import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onGoHome }) => {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center space-y-6">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-[#1D3039] text-[#16866F] dark:text-[#65D6B2]">
        <Home className="h-8 w-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-[#142A36] dark:text-[#F2F7F5]">Page Not Found</h1>
      <p className="text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
        The page you are looking for does not exist or was moved. Your local marketing plan data remains safe.
      </p>
      <div>
        <button
          type="button"
          onClick={onGoHome}
          className="h-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#16866F] px-5 text-xs font-bold text-white shadow-sm hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Overview</span>
        </button>
      </div>
    </div>
  );
};
