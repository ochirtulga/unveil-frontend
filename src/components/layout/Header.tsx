// src/components/layout/Header.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogoClick?: () => void;
  className?: string;
  showHero?: boolean;
  heroSize?: 'full' | 'minimal';
}

interface NavigationItem {
  label: string;
  href: string;
}

export const Header: React.FC<HeaderProps> = ({
  onLogoClick,
  className = '',
  showHero = false,
  heroSize = 'full',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { label: 'About', href: '/about' },
    { label: 'Report', href: '/report' },
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
        {/* Navigation Bar with Hero in Center */}
        <div className="flex justify-between items-center py-4">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Logo onClick={onLogoClick} />
          </div>

          {/* Center: Hero Section */}
                <div>
                  <h1 className="text-2xl lg:text-3xl font-light text-slate-900 mb-1 tracking-tight">
                    Find Out Truth
                  </h1>
                  <p className="text-xs text-slate-600 font-light">
                    Community-driven scam verification
                  </p>
                </div>

          {/* Right: Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 flex-shrink-0">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="text-slate-600 hover:text-slate-900 transition-colors font-light tracking-wide text-sm"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 hover:bg-slate-50 transition-colors flex-shrink-0"
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

        {/* Mobile Hero Section (below navigation bar) */}
        {showHero && (
          <div className="md:hidden text-center py-6 border-t border-slate-100">
            {heroSize === 'full' ? (
              <div>
                <h1 className="text-4xl font-light text-slate-900 mb-4 tracking-tight">
                  Find Out Truth
                </h1>
                <p className="text-base text-slate-600 font-light leading-relaxed">
                  Search our comprehensive database to verify suspicious contacts and protect yourself from scams.
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-3xl font-light text-slate-900 mb-3 tracking-tight">
                  Find Out Truth
                </h1>
                <p className="text-sm text-slate-600 font-light">
                  Community-driven scam verification platform
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-4">
            <nav className="space-y-4">
              {navigationItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  onClick={closeMobileMenu}
                  className="block px-2 py-2 text-slate-700 hover:text-slate-900 transition-colors font-light"
                >
                  {item.label}
                </Link>
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

  return (
    <Link to="/" className="hover:opacity-70 transition-opacity">
      {logoContent}
    </Link>
  );
};