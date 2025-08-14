import React from 'react';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white border-t border-slate-200 mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <FooterLogo />
              <p className="text-slate-600 mb-6 max-w-md leading-relaxed">
                Protecting communities from fraud by providing comprehensive scammer information 
                and verification services. Together, we can make the internet a safer place.
              </p>
              <SocialLinks />
            </div>

            {/* Quick Links */}
            <div>
              <FooterSection title="Quick Links">
                <FooterLink href="/about">About Us</FooterLink>
                <FooterLink href="/how-it-works">How It Works</FooterLink>
                <FooterLink href="/safety-tips">Safety Tips</FooterLink>
                <FooterLink href="/report">Report Scammer</FooterLink>
                <FooterLink href="/search">Search Database</FooterLink>
              </FooterSection>
            </div>

            {/* Support & Legal */}
            <div>
              <FooterSection title="Support & Legal">
                <FooterLink href="/help">Help Center</FooterLink>
                <FooterLink href="/contact">Contact Us</FooterLink>
                <FooterLink href="/privacy">Privacy Policy</FooterLink>
                <FooterLink href="/terms">Terms of Service</FooterLink>
                <FooterLink href="/disclaimer">Disclaimer</FooterLink>
              </FooterSection>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-slate-500 text-sm">
                &copy; {currentYear} ScamGuard. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <FooterLink href="/status" small>Status</FooterLink>
                <FooterLink href="/api" small>API</FooterLink>
                <FooterLink href="/blog" small>Blog</FooterLink>
              </div>
            </div>

            {/* Contact Info */}
            <ContactInfo />
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Logo Component
const FooterLogo: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <span className="text-xl font-bold text-slate-900">ScamGuard</span>
    </div>
  );
};

// Footer Section Component
interface FooterSectionProps {
  title: string;
  children: React.ReactNode;
}

const FooterSection: React.FC<FooterSectionProps> = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
};

// Footer Link Component
interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  small?: boolean;
  external?: boolean;
}

const FooterLink: React.FC<FooterLinkProps> = ({ 
  href, 
  children, 
  small = false, 
  external = false 
}) => {
  const baseClasses = "transition-colors hover:text-slate-900";
  const sizeClasses = small ? "text-xs" : "text-sm";
  const colorClasses = "text-slate-500";

  const linkProps = external ? {
    target: "_blank",
    rel: "noopener noreferrer"
  } : {};

  return (
    <a
      href={href}
      className={`${baseClasses} ${sizeClasses} ${colorClasses} block`}
      {...linkProps}
    >
      {children}
    </a>
  );
};

// Social Links Component
const SocialLinks: React.FC = () => {
  const socialLinks = [
    {
      name: 'Twitter',
      href: 'https://twitter.com/scamguard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/company/scamguard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/scamguard',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-slate-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
          aria-label={`Follow us on ${social.name}`}
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
};

// Contact Info Component
const ContactInfo: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-500">
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <span>support@scamguard.com</span>
      </div>
      <div className="flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        <span>1-800-SCAM-HELP</span>
      </div>
    </div>
  );
};