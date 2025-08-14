import React from 'react';

interface HeroSectionProps {
  title?: {
    word1: string;
    word2: string;
    word3: string;
  };
  subtitle?: string;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title = {
    word1: 'Find',
    word2: 'Out',
    word3: 'Truth'
  },
  subtitle = 'Search our comprehensive database to verify suspicious contacts and protect yourself from scams.',
  className = '',
}) => {
  return (
    <div className={`text-center ${className}`}>
      {/* Simplified single-color title */}
      <h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-6 tracking-tight">
        {title.word1} {title.word2} {title.word3}
      </h1>
      
      {/* Cleaner subtitle */}
      <p className="text-lg text-slate-600 max-w-xl mx-auto mb-16 font-light leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
};