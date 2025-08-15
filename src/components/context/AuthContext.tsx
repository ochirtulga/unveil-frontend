import React, { createContext, useContext, useState } from 'react';

interface LinkedInUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  headline?: string;
}

interface AuthState {
  user: LinkedInUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType {
  authState: AuthState;
  login: () => void;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false, // For now, always false since we're using IP-based voting
    isLoading: false,
    error: null,
  });

  const login = () => {
    // For now, just set a mock user or handle differently
    // Since we're using IP-based voting, this could show an info message
    setAuthState(prev => ({
      ...prev,
      error: 'Authentication is currently disabled. Voting is based on IP address.',
    }));
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get auth token for API calls (now returns null since no auth)
export const getAuthToken = (): string | null => {
  return null;
};

// Helper function to create authenticated fetch (now just regular fetch)
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};