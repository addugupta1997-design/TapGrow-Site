import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { EmptyStateIllustration, EmptyStateType } from './graphics/EmptyStateIllustration';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  illustrationType?: EmptyStateType;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Inbox,
  illustrationType,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-8 text-center sm:p-12 transition-colors duration-150">
      <div className="mb-4">
        {illustrationType ? (
          <EmptyStateIllustration type={illustrationType} size={96} />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 dark:bg-[#223640] text-slate-400 dark:text-[#91A5A9]">
            <Icon className="h-7 w-7" />
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-[#F2F7F5]">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-[#91A5A9]">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center rounded-lg bg-[#16866F] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80] transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
