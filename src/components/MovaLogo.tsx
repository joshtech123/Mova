import React from 'react';

interface MovaLogoProps {
  variant?: 'full' | 'mark' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

export const MovaLogo: React.FC<MovaLogoProps> = ({ variant = 'full', size = 'md', className = '' }) => {
  const widths = { sm: 104, md: 142, lg: 178, xl: 220 };
  const width = variant === 'mark' ? Math.round(widths[size] * 0.42) : widths[size];
  const src = variant === 'mark' ? '/assets/mova/mova-symbol.jpg' : '/assets/mova/mova-logo-lockup.jpg';
  return (
    <span className={`inline-flex items-center overflow-hidden rounded-xl bg-[#071044] ${className}`} aria-label="MOVA">
      <img src={src} alt="MOVA" width={width} style={{ width }} className="block h-auto object-contain" />
    </span>
  );
};
