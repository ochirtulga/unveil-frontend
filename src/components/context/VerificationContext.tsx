// src/components/context/VerificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from './ToastContext';

interface VerificationState {
  isVerified: boolean;
  email: string | null;
  verificationToken: string | null;
  isLoading: boolean;
  error: string | null;
}

interface VerificationContextType {
  verificationState: VerificationState;
  requestVerification: (email: string) => Promise<boolean>;
  verifyCode: (code: string) => Promise<boolean>;
  clearVerification: () => void;
  isVerificationRequired: () => boolean;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

interface VerificationProviderProps {
  children: React.ReactNode;
}

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const VerificationProvider: React.FC<VerificationProviderProps> = ({ children }) => {
  const { showToast } = useToast();
  
  const [verificationState, setVerificationState] = useState<VerificationState>({
    isVerified: false,
    email: null,
    verificationToken: null,
    isLoading: false,
    error: null,
  });

  const requestVerification = useCallback(async (email: string): Promise<boolean> => {
    setVerificationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/otp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Invalid email address';
          setVerificationState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
          showToast('error', 'Invalid Email', errorMessage);
          return false;
        }
        if (response.status === 429) {
          const errorData = await response.json();
          const errorMessage = errorData.error || 'Too many verification requests. Please wait before requesting another code.';
          setVerificationState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
          showToast('warning', 'Rate Limited', errorMessage);
          return false;
        }
        throw new Error(`OTP request failed: ${response.status}`);
      }

      const data = await response.json();
      
      setVerificationState(prev => ({
        ...prev,
        email: email.trim().toLowerCase(),
        isLoading: false,
        error: null,
      }));

      showToast('success', 'OTP Sent', `Check your email at ${email} for the verification code.`);
      return true;

    } catch (error) {
      console.error('OTP request error:', error);
      const errorMessage = 'Failed to send verification code. Please try again.';
      
      setVerificationState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));

      showToast('error', 'OTP Failed', errorMessage);
      return false;
    }
  }, [showToast]);

  const verifyCode = useCallback(async (code: string): Promise<boolean> => {
    if (!verificationState.email) {
      showToast('error', 'No Email', 'Please request a verification code first.');
      return false;
    }

    setVerificationState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/otp/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: verificationState.email,
          otp: code.trim(),
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          let errorMessage = 'Invalid verification code';
          
          if (errorData.error?.includes('expired')) {
            errorMessage = 'Verification code has expired. Please request a new one.';
          } else if (errorData.error?.includes('invalid') || errorData.error?.includes('Invalid OTP')) {
            errorMessage = 'Invalid verification code. Please check and try again.';
          } else if (errorData.error?.includes('attempts')) {
            errorMessage = 'Too many failed attempts. Please request a new verification code.';
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          
          setVerificationState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
          showToast('error', 'Verification Failed', errorMessage);
          return false;
        }
        throw new Error(`OTP verification failed: ${response.status}`);
      }

      const data = await response.json();
      
      setVerificationState(prev => ({
        ...prev,
        isVerified: true,
        verificationToken: data.token,
        isLoading: false,
        error: null,
      }));

      showToast('success', 'Verified!', 'Email verified successfully. You can now vote on cases.');
      return true;

    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = 'Verification failed. Please try again.';
      
      setVerificationState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));

      showToast('error', 'Verification Failed', errorMessage);
      return false;
    }
  }, [verificationState.email, showToast]);

  const clearVerification = useCallback(() => {
    setVerificationState({
      isVerified: false,
      email: null,
      verificationToken: null,
      isLoading: false,
      error: null,
    });
    showToast('info', 'Verification Cleared', 'Please verify your email again to vote.');
  }, [showToast]);

  const isVerificationRequired = useCallback(() => {
    return !verificationState.isVerified;
  }, [verificationState.isVerified]);

  return (
    <VerificationContext.Provider value={{
      verificationState,
      requestVerification,
      verifyCode,
      clearVerification,
      isVerificationRequired,
    }}>
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = (): VerificationContextType => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};

// Helper function to get verification token for API calls
export const getVerificationToken = (): string | null => {
  // In a real app, you might want to store this in localStorage
  // For now, we'll rely on the context state
  return null;
};

// Helper function to create verified fetch
export const verifiedFetch = async (
  url: string, 
  options: RequestInit = {}, 
  verificationToken?: string
): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    ...(verificationToken && { 'Authorization': `Bearer ${verificationToken}` }),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};