// src/components/context/VerificationContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useToast } from './ToastContext';
import { apiService, handleApiError } from '../../services/api';
import { TOAST_TYPES } from '../../utils/constants';

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
    setVerificationState(prev => {
      return { ...prev, isLoading: true, error: null };
    });

    try {
      await apiService.sendOTP(email);
      
      setVerificationState(prev => {
        return {
          ...prev,
          email: email.trim().toLowerCase(),
          isLoading: false,
          error: null,
        };
      });

      showToast(TOAST_TYPES.SUCCESS, 'OTP Sent', `Check your email at ${email} for the verification code.`);
      return true;

    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setVerificationState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));

      showToast(TOAST_TYPES.ERROR, 'OTP Failed', errorMessage);
      return false;
    }
  }, [showToast]);

  const verifyCode = useCallback(async (code: string): Promise<boolean> => {
    if (!verificationState.email) {
      showToast(TOAST_TYPES.ERROR, 'No Email', 'Please request a verification code first.');
      return false;
    }
    
    setVerificationState(prev => {
      return { ...prev, isLoading: true, error: null };
    });

    try {
      const data = await apiService.verifyOTP(verificationState.email, code);
      
      setVerificationState(prev => {
        return {
          ...prev,
          isVerified: true,
          verificationToken: data.token,
          isLoading: false,
          error: null,
        };
      });

      showToast(TOAST_TYPES.SUCCESS, 'Verified!', 'Email verified successfully. You can now vote on cases.');
      
      return true;

    } catch (error) {
      const errorMessage = handleApiError(error);
      
      setVerificationState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));

      showToast(TOAST_TYPES.ERROR, 'Verification Failed', errorMessage);
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
    showToast(TOAST_TYPES.INFO, 'Verification Cleared', 'Please verify your email again to vote.');
  }, [showToast]);

  const isVerificationRequired = useCallback(() => {
    const required = !verificationState.isVerified;
    return required;
  }, [verificationState.isVerified]);

  // Debug: Log state changes
  React.useEffect(() => {
  }, [verificationState]);

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