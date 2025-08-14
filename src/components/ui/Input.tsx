import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  disabled?: boolean;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  leftIcon,
  rightIcon,
  onKeyPress,
  className = '',
}) => {
  const baseClasses = 'w-full py-3 px-4 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors';
  const errorClasses = error ? 'border-red-500' : 'border-slate-300';
  const iconPadding = leftIcon ? 'pl-12' : rightIcon ? 'pr-12' : '';
  
  const inputClasses = `${baseClasses} ${errorClasses} ${iconPadding} ${className}`;

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {leftIcon}
        </div>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
      />
      
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {rightIcon}
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};