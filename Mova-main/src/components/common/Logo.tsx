import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'dark' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  showTagline = false,
  variant = 'dark',
  size = 'md',
}) => {
  const sizeMap = {
    sm: { height: 28, text: 'text-lg', tag: 'text-[9px]' },
    md: { height: 34, text: 'text-2xl', tag: 'text-[10px]' },
    lg: { height: 44, text: 'text-3xl', tag: 'text-xs' },
    xl: { height: 56, text: 'text-4xl', tag: 'text-sm' },
  };

  const { height, text, tag } = sizeMap[size];

  // Text color based on background
  const textColor = variant === 'light' || variant === 'white' ? 'text-white' : 'text-[#0B192C]';
  const taglineColor = variant === 'light' || variant === 'white' ? 'text-slate-300' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Dynamic MOVA Emblem Icon */}
      <svg
        height={height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform hover:scale-105 duration-200"
      >
        <defs>
          <linearGradient id="movaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2575FC" />
            <stop offset="100%" stopColor="#0056FD" />
          </linearGradient>
          <linearGradient id="movaOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8533" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>
        </defs>

        {/* Outer subtle shield/rounded hex contour */}
        <rect width="100" height="100" rx="26" fill={variant === 'white' ? 'rgba(255,255,255,0.12)' : '#0B192C'} />

        {/* Electric Blue dynamic geometric flow */}
        <path
          d="M24 72V28L42 50L60 28V72"
          stroke="url(#movaBlueGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Orange Accent Spark / Pulse */}
        <circle cx="75" cy="34" r="9" fill="url(#movaOrangeGrad)" />
        <path
          d="M66 66L82 50"
          stroke="url(#movaOrangeGrad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>

      <div className="flex flex-col justify-center leading-none">
        <span className={`font-extrabold tracking-tight font-sans ${text} ${textColor}`}>
          MOV<span className="text-[#FF6B00]">A</span>
        </span>
        {showTagline && (
          <span className={`font-semibold tracking-wider uppercase mt-0.5 ${tag} ${taglineColor}`}>
            Entertainment. Rewards. More.
          </span>
        )}
      </div>
    </div>
  );
};
