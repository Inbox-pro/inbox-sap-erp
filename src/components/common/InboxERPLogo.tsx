import React from 'react';

interface InboxERPLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  showSubtext?: boolean;
  inverted?: boolean;
  iconOnly?: boolean;
}

export const GangaERPLogo: React.FC<InboxERPLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  showSubtext,
  inverted = false,
  iconOnly = false,
}) => {
  const displaySubtitle = showSubtext !== undefined ? showSubtext : showSubtitle;
  const iconSizes = {
    sm: { w: 32, h: 28 },
    md: { w: 42, h: 36 },
    lg: { w: 56, h: 48 },
  };

  const textSizes = {
    sm: { title: 'text-lg', badge: 'text-[9px] px-1.5 py-0.5', subtitle: 'text-[9px]' },
    md: { title: 'text-2xl', badge: 'text-[11px] px-2 py-0.5', subtitle: 'text-[11px]' },
    lg: { title: 'text-3xl', badge: 'text-xs px-2.5 py-1', subtitle: 'text-xs' },
  };

  const s = iconSizes[size];
  const t = textSizes[size];

  return (
    <div id="ganga-erp-logo" className={`flex items-center gap-3 select-none ${className}`}>
      {/* Custom Vector Icon with enterprise flow & dual-tone flaps */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={s.w}
          height={s.h}
          viewBox="0 0 100 85"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xs"
        >
          {/* Peeking Document with lines */}
          <g filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.15))">
            {/* Top green bookmark flag */}
            <polygon points="46,4 54,4 50,0" fill="#22c55e" />
            <rect x="25" y="8" width="50" height="48" rx="3" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            {/* Document Lines */}
            <line x1="33" y1="18" x2="67" y2="18" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="33" y1="26" x2="61" y2="26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <line x1="33" y1="33" x2="55" y2="33" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* Envelope Body Background */}
          <path
            d="M8 28 L50 56 L92 28 V72 C92 76 88 80 84 80 H16 C12 80 8 76 8 72 Z"
            fill="#F8FAFC"
          />

          {/* Left Flap: Reddish Orange / Terracotta */}
          <path
            d="M8 30 L50 62 L8 78 Z"
            fill="#EA580C"
          />

          {/* Right Flap: Vivid Blue */}
          <path
            d="M92 30 L50 62 L92 78 Z"
            fill="#0284C7"
          />

          {/* Bottom Envelope Fold Border */}
          <path
            d="M8 78 L50 62 L92 78"
            stroke="#C2410C"
            strokeWidth="1.5"
            fill="none"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Brand Typography & Badge "Ganga ERP" */}
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-extrabold tracking-tight ${
                inverted ? 'text-white' : 'text-slate-900'
              } ${t.title}`}
            >
              Ganga
            </span>
            <span
              className={`font-bold tracking-wider rounded-md border border-blue-300 bg-blue-100 text-blue-900 uppercase shadow-xs ${t.badge}`}
            >
              ERP
            </span>
          </div>

          {/* Orange Accent Underline */}
          <div className="w-full h-[2px] bg-linear-to-r from-orange-600 via-orange-500 to-amber-500 my-0.5 rounded-full" />

          {/* Subtitle */}
          {displaySubtitle && (
            <span
              className={`font-semibold tracking-wide ${
                inverted ? 'text-slate-300' : 'text-slate-600'
              } ${t.subtitle}`}
            >
              Infotech Pvt. Ltd.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const InboxERPLogo = GangaERPLogo;

