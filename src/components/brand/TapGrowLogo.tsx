import React from 'react';

interface TapGrowLogoProps {
  /**
   * 'full': Symbol + Wordmark + Tagline
   * 'compact': Symbol + Wordmark
   * 'symbol': Symbol only
   * 'text': Wordmark only
   */
  variant?: 'full' | 'compact' | 'symbol' | 'text';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Official TapGrow growth symbol
 * Features the authentic curved teal ribbon arrow pointing upward-right with three radiant warm-orange sparks.
 */
export const TapGrowSymbol: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${sizeClasses[size]} transition-transform duration-200 group-hover:scale-105 ${className}`}
    >
      <img
        src="/assets/aistudio/Teal_Growth_Arrow_with_Orange_Sparks_transparent.png"
        onError={(e) => {
          // Graceful fallback to raw uploaded asset
          e.currentTarget.src = '/assets/aistudio/Teal_Growth_Arrow_with_Orange_Sparks_2815cc7d.png';
        }}
        alt="TapGrow Growth Symbol"
        className="w-full h-full object-contain select-none pointer-events-none drop-shadow-xs"
        draggable={false}
      />
    </div>
  );
};

export const TapGrowWordmark: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}> = ({ size = 'md', showTagline = false, className = '' }) => {
  return (
    <div className={`flex flex-col leading-none ${className}`}>
      <div className="flex items-baseline tracking-tight">
        <span
          className={`font-black tracking-tight text-[#17252B] dark:text-[#F2F7F5] transition-colors duration-150 ${
            size === 'sm'
              ? 'text-lg'
              : size === 'md'
              ? 'text-xl'
              : size === 'lg'
              ? 'text-2xl sm:text-3xl'
              : 'text-3xl sm:text-4xl'
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          Tap
        </span>
        <span
          className={`font-black tracking-tight text-[#16866F] dark:text-[#0FAF91] transition-colors duration-150 ${
            size === 'sm'
              ? 'text-lg'
              : size === 'md'
              ? 'text-xl'
              : size === 'lg'
              ? 'text-2xl sm:text-3xl'
              : 'text-3xl sm:text-4xl'
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          Grow
        </span>
      </div>

      {showTagline && (
        <span
          className={`font-semibold tracking-wider uppercase text-[#65777A] dark:text-[#91A5A9] pt-1 transition-colors duration-150 ${
            size === 'sm' ? 'text-[9px]' : size === 'md' ? 'text-[10px]' : 'text-xs'
          }`}
          style={{ letterSpacing: '0.14em' }}
        >
          Plan • Improve • Grow
        </span>
      )}
    </div>
  );
};

export const TapGrowLogo: React.FC<TapGrowLogoProps> = ({
  variant = 'compact',
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`group flex items-center gap-2.5 select-none ${className}`}>
      {/* Symbol */}
      {variant !== 'text' && <TapGrowSymbol size={size} />}

      {/* Wordmark & Optional Tagline */}
      {variant !== 'symbol' && (
        <TapGrowWordmark
          size={size}
          showTagline={variant === 'full'}
        />
      )}
    </div>
  );
};
