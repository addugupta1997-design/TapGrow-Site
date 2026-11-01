import React from 'react';

interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  strokeColor?: string;
}

export const DotGridPattern: React.FC<GridPatternProps> = ({
  className = '',
  width = 24,
  height = 24,
}) => {
  return (
    <svg
      className={`pointer-events-none select-none opacity-40 dark:opacity-20 ${className}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="dot-grid-pattern" width={width} height={height} patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="fill-slate-400 dark:fill-[#65D6B2]" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dot-grid-pattern)" />
    </svg>
  );
};

export const SubtleGridMatrix: React.FC<GridPatternProps> = ({
  className = '',
  width = 36,
  height = 36,
}) => {
  return (
    <svg
      className={`pointer-events-none select-none opacity-30 dark:opacity-15 ${className}`}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="subtle-line-matrix" width={width} height={height} patternUnits="userSpaceOnUse">
          <path
            d={`M ${width} 0 L 0 0 0 ${height}`}
            fill="none"
            className="stroke-slate-300 dark:stroke-[#304650]"
            strokeWidth="0.75"
            strokeDasharray="2 3"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#subtle-line-matrix)" />
    </svg>
  );
};

export const AmbientGlow: React.FC<{
  className?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-48 h-48 blur-2xl',
    md: 'w-80 h-80 blur-3xl',
    lg: 'w-96 h-96 blur-3xl',
  }[size];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute select-none rounded-full bg-radial from-[#16866F]/12 via-[#65D6B2]/5 to-transparent dark:from-[#65D6B2]/10 dark:via-[#16866F]/5 dark:to-transparent ${sizeClasses} ${className}`}
    />
  );
};
