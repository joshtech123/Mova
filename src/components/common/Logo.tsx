import React from 'react';

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  variant?: 'dark' | 'light' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const widths = { sm: 104, md: 142, lg: 178, xl: 220 };
  return (
    <span
      className={`inline-flex items-center overflow-hidden rounded-xl bg-[#071044] ${className}`}
      aria-label="MOVA, Entertainment. Rewards. More."
    >
      <img
        src="/assets/mova/mova-logo-lockup.jpg"
        alt="MOVA, Entertainment. Rewards. More."
        width={widths[size]}
        className="block h-auto w-auto object-contain"
        style={{ width: widths[size] }}
      />
    </span>
  );
};
