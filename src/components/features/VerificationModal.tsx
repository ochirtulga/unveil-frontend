// src/components/features/VerificationModal.tsx
import React, { useState, useEffect } from 'react';
import { useVerification } from '../context/VerificationContext';
import { validateEmail } from '../../utils/validation';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  caseId?: number;
}

type VerificationStep = 'email' | 'code' | 'success';

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  caseId,
}) => {
  const { verificationState, requestVerification, verifyCode } = useVerification();
  const [currentStep, setCurrentStep] = useState<VerificationStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('email');
      setEmail('');
      setCode('');
      setEmailError(null);
      setCountdown(0);
    }
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Auto-advance to success when verified
  useEffect(() => {
    if (verificationState.isVerified && currentStep === 'code') {
      setCurrentStep('success');
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
    }
  }, [verificationState.isVerified, currentStep, onVerified, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailError(validation.error || 'Invalid email');
      return;
    }

    setEmailError(null);
    const success = await requestVerification(email);
    if (success) {
      setCurrentStep('code');
      setCountdown(60); // 60 second cooldown for resend
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      return;
    }

    const success = await verifyCode(code);
    if (success) {
      setCurrentStep('success');
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    
    const success = await requestVerification(email);
    if (success) {
      setCountdown(60);
      setCode('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-light text-slate-900 tracking-wide">
            Email Verification
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          
          {/* Email Step */}
          {currentStep === 'email' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Verify Your Email</h3>
                <p className="text-slate-600 font-light text-sm">
                  We'll send a verification code to your email to confirm your vote.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      emailError ? 'border-red-300' : 'border-slate-300'
                    }`}
                    disabled={verificationState.isLoading}
                    required
                  />
                  {emailError && (
                    <p className="mt-2 text-sm text-red-600">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={verificationState.isLoading || !email.trim()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {verificationState.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Sending Code...</span>
                    </>
                  ) : (
                    <span>Send Verification Code</span>
                  )}
                </button>
              </form>

              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-9a2 2 0 00-2-2H6a2 2 0 00-2 2v9a2 2 0 002 2zm10-12V6a4 4 0 00-8 0v3" />
                  </svg>
                  <span className="text-xs text-slate-600 font-light">
                    Your email is only used for verification and will not be stored or shared.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Code Step */}
          {currentStep === 'code' && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Enter Verification Code</h3>
                <p className="text-slate-600 font-light text-sm">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-2xl font-mono tracking-widest"
                    disabled={verificationState.isLoading}
                    maxLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={verificationState.isLoading || code.length !== 6}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {verificationState.isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify Code</span>
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-600 mb-2">Didn't receive the code?</p>
                <button
                  onClick={handleResendCode}
                  disabled={countdown > 0 || verificationState.isLoading}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:text-slate-400 font-medium"
                >
                  {countdown > 0 ? `Resend in ${formatTime(countdown)}` : 'Resend Code'}
                </button>
              </div>
            </div>
          )}

          {/* Success Step */}
          {currentStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900">Verified!</h3>
              <p className="text-slate-600 font-light">
                Your email has been verified. You can now vote on cases.
              </p>
              <div className="flex justify-center mt-6">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent"></div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};