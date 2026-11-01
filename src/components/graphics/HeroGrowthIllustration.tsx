import React from 'react';

interface HeroGrowthIllustrationProps {
  className?: string;
  onExploreClick?: () => void;
}

export const HeroGrowthIllustration: React.FC<HeroGrowthIllustrationProps> = ({
  className = '',
  onExploreClick,
}) => {
  return (
    <div className={`relative w-full max-w-[580px] mx-auto select-none ${className}`}>
      {/* Background Ambient Glow using brand CSS variables */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-3xl opacity-40 blur-2xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, var(--brand-subtle, rgba(22, 134, 111, 0.15)) 0%, transparent 70%)',
        }}
      />

      <svg
        viewBox="0 0 600 460"
        className="w-full h-auto overflow-visible drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Minimalist layered illustration of local business marketing growth featuring a floating growth chart, local map pin, and performance metrics"
      >
        <defs>
          {/* Scoped CSS rules mapping to design system CSS variables for light/dark consistency */}
          <style>
            {`
              .hero-surface-primary { fill: var(--surface-primary, #FFFFFF); }
              .hero-surface-secondary { fill: var(--surface-secondary, #F8FAF9); }
              .hero-border-primary { stroke: var(--border-primary, #E1EAE6); }
              .hero-border-secondary { stroke: var(--border-secondary, #CBD8D3); }
              .hero-text-primary { fill: var(--text-primary, #17252B); }
              .hero-text-secondary { fill: var(--text-secondary, #65777A); }
              .hero-text-muted { fill: var(--text-muted, #889A9C); }
              .hero-brand-fill { fill: var(--brand-primary, #16866F); }
              .hero-brand-stroke { stroke: var(--brand-primary, #16866F); }
              .hero-brand-light-fill { fill: var(--brand-light, #E0F5EE); }
              .hero-warning-fill { fill: var(--warning, #E9A23B); }
              .hero-success-fill { fill: var(--success, #239B75); }
              .hero-grid-dash { stroke: var(--border-primary, #E1EAE6); }
            `}
          </style>

          {/* Shadows */}
          <filter id="hero-card-shadow" x="-10%" y="-10%" width="125%" height="130%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.09" />
          </filter>
          <filter id="hero-badge-shadow" x="-15%" y="-15%" width="135%" height="140%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000000" floodOpacity="0.11" />
          </filter>

          {/* Dynamic Gradients referencing CSS variables */}
          <linearGradient id="hero-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary, #16866F)" />
            <stop offset="100%" stopColor="var(--brand-light, #65D6B2)" />
          </linearGradient>

          <linearGradient id="hero-chart-area-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--brand-primary, #16866F)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--brand-primary, #16866F)" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="hero-score-ring" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--brand-primary, #16866F)" />
            <stop offset="70%" stopColor="var(--brand-hover, #1A9B80)" />
            <stop offset="100%" stopColor="var(--brand-light, #65D6B2)" />
          </linearGradient>
        </defs>

        {/* --- LAYER 1: Background Connective Geometry & Guides --- */}
        <g className="hero-grid-dash" strokeDasharray="3 4" strokeWidth="1.2">
          {/* Connector to Top-Left Location Pin Card */}
          <path d="M190 190 Q120 160 115 110" />
          {/* Connector to Top-Right Reviews Card */}
          <path d="M410 190 Q480 160 485 105" />
          {/* Connector to Bottom-Left Mobile Clarity */}
          <path d="M190 310 Q120 340 105 380" />
          {/* Connector to Bottom-Right Floating Growth Chart */}
          <path d="M410 310 Q480 340 495 385" />
        </g>

        {/* Connector nodes */}
        <circle cx="115" cy="110" r="3" className="hero-brand-fill" />
        <circle cx="485" cy="105" r="3" className="hero-warning-fill" />
        <circle cx="105" cy="380" r="3" className="hero-brand-fill" />
        <circle cx="495" cy="385" r="3" className="hero-brand-fill" />

        {/* --- LAYER 2: Central Marketing Workspace Dashboard --- */}
        <g transform="translate(150, 115)" filter="url(#hero-card-shadow)">
          {/* Main Card Surface */}
          <rect
            width="300"
            height="235"
            rx="16"
            className="hero-surface-primary hero-border-primary"
            strokeWidth="1.5"
          />

          {/* Card Header Bar */}
          <path
            d="M0 16 C0 7.16 7.16 0 16 0 L284 0 C292.84 0 300 7.16 300 16 L300 38 L0 38 Z"
            className="hero-surface-secondary hero-border-primary"
            strokeWidth="1"
          />
          {/* Window dots */}
          <circle cx="20" cy="19" r="4" fill="var(--danger, #F07171)" opacity="0.8" />
          <circle cx="32" cy="19" r="4" fill="var(--warning, #E9A23B)" opacity="0.8" />
          <circle cx="44" cy="19" r="4" fill="var(--brand-light, #65D6B2)" opacity="0.8" />

          {/* Workspace Title */}
          <text
            x="64"
            y="23"
            className="hero-text-primary font-sans text-[11px] font-bold tracking-tight"
          >
            Local Business Growth Workspace
          </text>

          {/* Marketing Readiness Score Ring Module */}
          <g transform="translate(24, 52)">
            {/* Background Track */}
            <circle
              cx="44"
              cy="44"
              r="34"
              fill="none"
              strokeWidth="7"
              className="hero-surface-secondary"
            />
            {/* Progress Arc (84% stroke) */}
            <circle
              cx="44"
              cy="44"
              r="34"
              fill="none"
              stroke="url(#hero-score-ring)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray="213.6"
              strokeDashoffset="34.2"
              transform="rotate(-90 44 44)"
            />
            {/* Inner Score Label */}
            <text
              x="44"
              y="42"
              textAnchor="middle"
              className="hero-text-primary font-mono text-xl font-black"
            >
              84
            </text>
            <text
              x="44"
              y="56"
              textAnchor="middle"
              className="hero-brand-fill font-sans text-[9px] font-bold uppercase tracking-wider"
            >
              Strong
            </text>

            {/* Score Text details */}
            <text
              x="96"
              y="32"
              className="hero-text-primary font-sans text-xs font-bold"
            >
              Marketing Readiness
            </text>
            <text
              x="96"
              y="48"
              className="hero-text-muted font-sans text-[10px]"
            >
              Foundations, Reviews & Conversion
            </text>
            <rect
              x="96"
              y="58"
              width="155"
              height="6"
              rx="3"
              className="hero-surface-secondary"
            />
            <rect
              x="96"
              y="58"
              width="130"
              height="6"
              rx="3"
              fill="url(#hero-brand-grad)"
            />
          </g>

          {/* Embedded Growth Preview */}
          <g transform="translate(24, 142)">
            <rect
              width="252"
              height="72"
              rx="8"
              className="hero-surface-secondary hero-border-primary"
              strokeWidth="1"
            />
            {/* Subtle grid lines */}
            <line x1="12" y1="20" x2="240" y2="20" className="hero-grid-dash" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
            <line x1="12" y1="44" x2="240" y2="44" className="hero-grid-dash" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />

            {/* Area Fill beneath curve */}
            <path
              d="M18 52 Q55 45 95 38 T170 24 T234 14 L234 56 L18 56 Z"
              fill="url(#hero-chart-area-grad)"
            />
            {/* Upward Growth Curve */}
            <path
              d="M18 52 Q55 45 95 38 T170 24 T234 14"
              fill="none"
              stroke="var(--brand-primary, #16866F)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Milestone Dots */}
            <circle cx="18" cy="52" r="3" className="hero-brand-fill" />
            <circle cx="95" cy="38" r="3" className="hero-brand-fill" />
            <circle cx="170" cy="24" r="3" className="hero-brand-fill" />
            <circle cx="234" cy="14" r="4.5" className="hero-warning-fill hero-surface-primary" strokeWidth="2" />

            <text x="24" y="66" className="hero-text-muted font-sans text-[9px] font-semibold">
              Weekly Local Customer Inquiries
            </text>
            <text x="180" y="66" className="hero-brand-fill font-sans text-[9px] font-bold">
              +142% Momentum
            </text>
          </g>
        </g>

        {/* --- LAYER 3: Minimalist Floating Satellite Elements --- */}

        {/* 1. FLOATING LOCATION PIN (Top-Left) */}
        <g
          transform="translate(42, 60)"
          filter="url(#hero-badge-shadow)"
          className="transition-transform duration-300 hover:-translate-y-1"
        >
          <rect
            width="170"
            height="68"
            rx="12"
            className="hero-surface-primary hero-border-primary"
            strokeWidth="1.5"
          />
          {/* Pin Icon Background Circle */}
          <circle cx="34" cy="34" r="18" fill="var(--brand-subtle, rgba(22, 134, 111, 0.12))" />

          {/* Minimalist Location Pin */}
          <path
            d="M34 22 C30 22 27 25 27 29 C27 34 34 40 34 40 C34 40 41 34 41 29 C41 25 38 22 34 22 Z"
            className="hero-brand-fill"
          />
          <circle cx="34" cy="28" r="2" fill="var(--surface-primary, #FFFFFF)" />

          <text x="60" y="28" className="hero-text-primary font-sans text-[11px] font-bold">
            Local Discovery
          </text>
          <text x="60" y="42" className="hero-text-secondary font-sans text-[10px]">
            Google Maps & Radius
          </text>
          <path
            d="M60 52 L120 52"
            stroke="var(--brand-primary, #16866F)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* 2. REPUTATION & 5-STAR REVIEWS (Top-Right) */}
        <g
          transform="translate(390, 50)"
          filter="url(#hero-badge-shadow)"
          className="transition-transform duration-300 hover:-translate-y-1"
        >
          <rect
            width="175"
            height="72"
            rx="12"
            className="hero-surface-primary hero-border-primary"
            strokeWidth="1.5"
          />
          <circle cx="34" cy="36" r="18" fill="var(--brand-subtle, rgba(22, 134, 111, 0.12))" />
          {/* Gold Star */}
          <polygon
            points="34,26 36.5,31.5 42,31.5 37.5,35 39,40 34,37 29,40 30.5,35 26,31.5 31.5,31.5"
            className="hero-warning-fill"
          />
          <text x="60" y="27" className="hero-text-primary font-sans text-[11px] font-bold">
            5.0 Star Reputation
          </text>
          {/* 5 Star Row */}
          <g transform="translate(60, 34)">
            {[0, 14, 28, 42, 56].map((offset, i) => (
              <polygon
                key={i}
                points={`${offset + 4},0 ${offset + 5.5},3 ${offset + 9},3 ${offset + 6},5 ${offset + 7},8 ${offset + 4},6.5 ${offset + 1},8 ${offset + 2},5 ${offset + 0},3 ${offset + 2.5},3`}
                className="hero-warning-fill"
              />
            ))}
          </g>
          <text x="60" y="56" className="hero-text-muted font-sans text-[9px] font-medium">
            128 Verified Happy Clients
          </text>
        </g>

        {/* 3. MOBILE CLARITY CARD (Bottom-Left) */}
        <g
          transform="translate(25, 335)"
          filter="url(#hero-badge-shadow)"
          className="transition-transform duration-300 hover:-translate-y-1"
        >
          <rect
            width="180"
            height="74"
            rx="12"
            className="hero-surface-primary hero-border-primary"
            strokeWidth="1.5"
          />
          {/* Phone Wireframe */}
          <rect
            x="16"
            y="14"
            width="28"
            height="46"
            rx="4"
            className="hero-surface-secondary hero-border-primary"
            strokeWidth="1.2"
          />
          <rect x="22" y="22" width="16" height="5" rx="1" className="hero-brand-fill" />
          <rect x="22" y="30" width="16" height="18" rx="1" className="hero-surface-primary" />
          <circle cx="30" cy="54" r="1.5" className="hero-text-muted" />

          <text x="54" y="32" className="hero-text-primary font-sans text-[11px] font-bold">
            Mobile Clarity
          </text>
          <text x="54" y="46" className="hero-text-secondary font-sans text-[10px]">
            Fast 1-Tap Booking
          </text>
          <g transform="translate(54, 52)">
            <rect width="88" height="14" rx="7" fill="var(--brand-subtle, rgba(22, 134, 111, 0.12))" />
            <text x="44" y="10" textAnchor="middle" className="hero-brand-fill font-sans text-[9px] font-bold">
              ✓ 5s Value Check
            </text>
          </g>
        </g>

        {/* 4. FLOATING GROWTH CHART & SPRINT PLANNER (Bottom-Right) */}
        <g
          transform="translate(395, 325)"
          filter="url(#hero-badge-shadow)"
          className="transition-transform duration-300 hover:-translate-y-1"
        >
          <rect
            width="185"
            height="82"
            rx="12"
            className="hero-surface-primary hero-border-primary"
            strokeWidth="1.5"
          />

          {/* Mini Floating Growth Chart Badge */}
          <g transform="translate(14, 16)">
            {/* Background pill */}
            <rect
              width="44"
              height="50"
              rx="8"
              className="hero-surface-secondary hero-border-secondary"
              strokeWidth="1"
            />
            {/* Upward mini bar chart */}
            <rect x="6" y="32" width="6" height="12" rx="2" className="hero-surface-primary hero-border-secondary" strokeWidth="0.8" />
            <rect x="15" y="24" width="6" height="20" rx="2" className="hero-brand-fill" opacity="0.6" />
            <rect x="24" y="16" width="6" height="28" rx="2" className="hero-brand-fill" opacity="0.85" />
            <rect x="33" y="10" width="6" height="34" rx="2" fill="url(#hero-brand-grad)" />
            {/* Floating arrow trend */}
            <path
              d="M8 28 L20 18 L36 8"
              fill="none"
              stroke="var(--brand-primary, #16866F)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>

          <text x="68" y="28" className="hero-text-primary font-sans text-[11px] font-bold">
            Weekly Focus Sprint
          </text>
          <text x="68" y="42" className="hero-text-secondary font-sans text-[10px]">
            High-Leverage Execution
          </text>

          {/* Status Badge */}
          <g transform="translate(68, 50)">
            <rect width="98" height="18" rx="5" fill="var(--brand-subtle, rgba(22, 134, 111, 0.12))" />
            <circle cx="8" cy="9" r="3" className="hero-success-fill" />
            <text x="16" y="12" className="hero-brand-fill font-sans text-[9px] font-bold">
              45 Mins / Wk Done
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
