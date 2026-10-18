'use client';

import React from 'react';

interface TDLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
}

export function TDLogo({
  size = 'md',
  showWordmark = false,
  className = '',
}: TDLogoProps) {
  const pixelSizes = {
    sm: 24,
    md: 30,
    lg: 38,
    xl: 46,
  };

  const dim = pixelSizes[size] || 30;

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Modern, Minimalist Stripe-Grade Vector Glyph */}
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      >
        <defs>
          {/* Signature Stripe Blurple to Electric Indigo Gradient */}
          <linearGradient id="td-stripe-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#635bff" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>

        {/* Minimalist Rounded Squircle */}
        <rect width="32" height="32" rx="8" fill="url(#td-stripe-grad)" />

        {/* Crisp Pure-White Geometric Network Glyph: Sovereign Merchant & Customer Planes */}
        <path
          d="M8.5 9.5H16.5C17.0523 9.5 17.5 9.94772 17.5 10.5V12C17.5 12.5523 17.0523 13 16.5 13H14V21.5C14 22.0523 13.5523 22.5 13 22.5H11.5C10.9477 22.5 10.5 22.0523 10.5 21.5V13H8.5C7.94772 13 7.5 12.5523 7.5 12V10.5C7.5 9.94772 7.94772 9.5 8.5 9.5Z"
          fill="#ffffff"
        />
        <path
          d="M17 11.5C17 10.9477 17.4477 10.5 18 10.5H20.5C23.5376 10.5 25.5 12.4624 25.5 16.5C25.5 20.5376 23.5376 22.5 20.5 22.5H18C17.4477 22.5 17 22.0523 17 21.5V11.5ZM19.5 13V20H20.5C22.1569 20 23 18.8 23 16.5C23 14.2 22.1569 13 20.5 13H19.5Z"
          fill="#ffffff"
        />
      </svg>

      {/* Modern Typographic Wordmark & Beta Pill */}
      {showWordmark && (
        <div className="flex items-center gap-2 tracking-tight">
          <div className="flex items-baseline">
            <span className={`font-black text-foreground ${textSizes[size]}`}>td</span>
            <span className={`font-semibold text-muted-foreground ml-0.5 ${textSizes[size]}`}>retail</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.2 rounded-full">
            Beta
          </span>
        </div>
      )}
    </div>
  );
}
export default TDLogo;
