import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, label }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500 dark:text-[#91A5A9] mb-1.5">
        <span>{label || `Step ${currentStep} of ${totalSteps}`}</span>
        <span className="font-mono tabular-nums">{percentage}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-[#172830]"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[#16866F] dark:bg-[#65D6B2] transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
