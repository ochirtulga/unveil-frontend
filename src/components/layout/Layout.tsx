import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  onLogoClick?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  className = '',
  containerClassName = '',
  showHeader = true,
  showFooter = false,
  onLogoClick,
}) => {
  return (
    <div className={`min-h-screen bg-white flex flex-col ${className}`}>
      {/* Header */}
      {showHeader && <Header onLogoClick={onLogoClick} />}
      
      {/* Main Content */}
      <main className={`flex-1 ${containerClassName}`}>
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  );
};

// Container Component
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'lg',
  className = '',
  padding = true,
}) => {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-none',
  };

  const paddingClasses = padding ? 'px-6 sm:px-8 lg:px-12' : '';

  return (
    <div className={`${sizes[size]} mx-auto ${paddingClasses} ${className}`}>
      {children}
    </div>
  );
};