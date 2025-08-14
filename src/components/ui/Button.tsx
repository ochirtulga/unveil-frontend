import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'md',
  type = 'button',
  className = '',
}) => {
  const baseClasses = 'font-semibold rounded-xl transition-colors flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300',
    outline: 'border-2 border-red-600 text-red-600 hover:bg-red-50 disabled:border-slate-300 disabled:text-slate-300',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
  } ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};