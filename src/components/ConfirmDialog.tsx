import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      confirmButtonRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      <div className="relative w-full max-w-md rounded-xl bg-white dark:bg-[#1D3039] p-6 shadow-xl border border-slate-200 dark:border-[#304650] transition-colors duration-150">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] transition-colors p-1 rounded-lg"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
              isDestructive
                ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-[#F07171]'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-[#E9A23B]'
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>

          <div className="flex-1">
            <h3 id="dialog-title" className="text-base font-semibold text-slate-900 dark:text-[#F2F7F5]">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-[#B5C5C7] leading-relaxed">
              {message}
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="h-9 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#223640] px-4 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmButtonRef}
                type="button"
                onClick={onConfirm}
                className={`h-9 inline-flex items-center justify-center rounded-lg px-4 text-xs font-semibold text-white shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#16866F] ${
                  isDestructive
                    ? 'bg-red-600 hover:bg-red-700 dark:bg-[#F07171] dark:hover:bg-red-600'
                    : 'bg-[#16866F] hover:bg-[#0F5C4D] dark:bg-[#16866F] dark:hover:bg-[#1A9B80]'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
