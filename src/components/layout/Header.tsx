import React, { useState } from 'react';

interface HeaderProps {
  onLogoClick?: () => void;
  className?: string;
}

interface NavigationItem {
  label: string;
  href: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLogoClick,
  className = '',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { label: 'About', href: '/about' },
    { label: 'Report', href: '/report' },
    { label: 'Help', href: '/help' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`bg-white border-b border-slate-100 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          {/* Minimal Logo */}
          <Logo onClick={onLogoClick} />

          {/* Clean Desktop Navigation */}
          <nav className="hidden md:flex space-x-12">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="text-slate-600 hover:text-slate-900 transition-colors font-light tracking-wide text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Minimal Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-slate-50 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Clean Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4">
            <nav className="space-y-4">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block px-2 py-2 text-slate-700 hover:text-slate-900 transition-colors font-light"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

// Minimal Logo Component
interface LogoProps {
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  onClick,
  size = 'md',
  showText = true,
  className = '',
}) => {
  const logoContent = (
    <div className={`flex items-center ${className}`}>
      {showText && (
        <span className="text-xl font-light text-slate-900 tracking-wide">
          Unveil
        </span>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="hover:opacity-70 transition-opacity focus:outline-none"
        aria-label="Go to homepage"
      >
        {logoContent}
      </button>
    );
  }

  return logoContent;
};