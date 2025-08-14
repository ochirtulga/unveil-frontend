import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: boolean;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  border = true,
  hover = false,
}) => {
  const baseClasses = 'bg-white rounded-xl';
  
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const borderClass = border ? 'border border-slate-200' : '';
  const hoverClass = hover ? 'hover:shadow-lg transition-shadow cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${paddings[padding]} ${shadows[shadow]} ${borderClass} ${hoverClass} ${className}`;

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
};