import React from 'react';

interface MovaLogoProps {
  variant?: 'full' | 'mark' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const MovaLogo: React.FC<MovaLogoProps> = ({
  variant = 'full',
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  // Dimensions
  const heightMap = {
    sm: 28,
    md: 36,
    lg: 46,
    xl: 60,
  };
  const h = heightMap[size];

  const isWhite = variant === 'white';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic MOVA Geometric Emblem */}
      <svg
        height={h}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="movaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="movaOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EA580C" />
            <stop offset="50%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="movaNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="100%" stopColor="#1C2541" />
          </linearGradient>
          <filter id="movaGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#2563EB" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Outer squircle base */}
        <rect
          x="6"
          y="6"
          width="108"
          height="108"
          rx="30"
          fill={isWhite ? "url(#movaNavyGrad)" : "url(#movaNavyGrad)"}
          stroke={isWhite ? "#3B82F6" : "rgba(255,255,255,0.08)"}
          strokeWidth="2.5"
        />

        {/* Dynamic geometric "M" & "V" Ribbon / Forward Arrow */}
        {/* Left blue M-pillar */}
        <path
          d="M 28 88 L 28 36 C 28 32 32 29 36 32 L 60 52 L 44 88 Z"
          fill="url(#movaBlueGrad)"
          filter="url(#movaGlow)"
        />

        {/* Central energetic Orange V-wedge & arrow */}
        <path
          d="M 44 88 L 60 52 L 76 88 C 74 91 68 93 60 93 C 52 93 46 91 44 88 Z"
          fill="url(#movaOrangeGrad)"
        />

        {/* Right blue M-pillar */}
        <path
          d="M 92 88 L 92 36 C 92 32 88 29 84 32 L 60 52 L 76 88 Z"
          fill="url(#movaBlueGrad)"
        />

        {/* Sparkling Reward Dot (Orange/Gold) at apex */}
        <circle cx="60" cy="27" r="6.5" fill="url(#movaOrangeGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
      </svg>

      {/* Typography: MOVA */}
      {variant !== 'mark' && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center tracking-tight font-extrabold text-[1.45em]">
            <span className={isWhite ? 'text-white' : 'text-[#0B132B]'}>M</span>
            <span className="text-[#2563EB]">O</span>
            <span className="text-[#F97316]">V</span>
            <span className={isWhite ? 'text-white' : 'text-[#0B132B]'}>A</span>
          </div>
          {showTagline && (
            <span
              className={`text-[0.62em] font-semibold tracking-wider uppercase mt-0.5 ${
                isWhite ? 'text-blue-200/90' : 'text-slate-500'
              }`}
            >
              Entertainment. Rewards. More.
            </span>
          )}
        </div>
      )}
    </div>
  );
};
