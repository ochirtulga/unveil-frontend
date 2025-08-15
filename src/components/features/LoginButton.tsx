import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface LoginButtonProps {
  className?: string;
  showProfile?: boolean;
}

export const LoginButton: React.FC<LoginButtonProps> = ({ 
  className = '', 
  showProfile = true 
}) => {
  const { authState, login, logout, clearError } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = () => {
    clearError();
    login();
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Loading state
  if (authState.isLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-300 border-t-slate-600"></div>
        <span className="text-sm text-slate-600 font-light">Loading...</span>
      </div>
    );
  }

  // Error state
  if (authState.error) {
    return (
      <div className={`${className}`}>
        <div className="text-xs text-red-600 mb-2">{authState.error}</div>
        <button
          onClick={handleLogin}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors"
        >
          <LinkedInIcon />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // Authenticated state
  if (authState.isAuthenticated && authState.user) {
    return (
      <div className={`relative ${className}`}>
        {showProfile ? (
          <div className="flex items-center space-x-3">
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              {authState.user.profilePicture ? (
                <img
                  src={authState.user.profilePicture}
                  alt={`${authState.user.firstName} ${authState.user.lastName}`}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {authState.user.firstName[0]}{authState.user.lastName[0]}
                </div>
              )}
              <div className="hidden md:block">
                <div className="text-sm font-medium text-slate-900">
                  {authState.user.firstName} {authState.user.lastName}
                </div>
                {authState.user.headline && (
                  <div className="text-xs text-slate-500 font-light">
                    {authState.user.headline}
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown Button */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 shadow-lg z-50">
                <div className="p-3 border-b border-slate-200">
                  <div className="text-sm font-medium text-slate-900">
                    {authState.user.firstName} {authState.user.lastName}
                  </div>
                  <div className="text-xs text-slate-500 font-light">
                    {authState.user.email}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-slate-900 font-light transition-colors"
          >
            Sign Out
          </button>
        )}

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  // Not authenticated state
  return (
    <button
      onClick={handleLogin}
      className={`flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors ${className}`}
    >
      <LinkedInIcon />
      <span>Sign in with LinkedIn</span>
    </button>
  );
};

// LinkedIn Icon Component
const LinkedInIcon: React.FC = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Simple login prompt component for use in modals
interface LoginPromptProps {
  onLogin: () => void;
  message?: string;
}

export const LoginPrompt: React.FC<LoginPromptProps> = ({ 
  onLogin, 
  message = "Please sign in with LinkedIn to vote on cases" 
}) => {
  return (
    <div className="text-center p-6 bg-slate-50 rounded-lg">
      <div className="flex justify-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <LinkedInIcon />
        </div>
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">Authentication Required</h3>
      <p className="text-slate-600 mb-4 font-light">{message}</p>
      <button
        onClick={onLogin}
        className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors mx-auto"
      >
        <LinkedInIcon />
        <span>Sign in with LinkedIn</span>
      </button>
      <p className="text-xs text-slate-500 mt-3 font-light">
        We use LinkedIn to prevent vote manipulation and ensure community trust.
      </p>
    </div>
  );
};