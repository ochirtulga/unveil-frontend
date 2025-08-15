import React, { createContext, useContext, useState, useEffect } from 'react';

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

// LinkedIn OAuth Configuration
const LINKEDIN_CONFIG = {
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || 'your-linkedin-client-id',
  redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI || `${window.location.origin}/auth/callback`,
  scope: 'openid profile email',
  responseType: 'code',
  state: generateRandomState(),
};

function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Check for existing session on app load
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Handle LinkedIn callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: `LinkedIn authentication failed: ${error}`,
      }));
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (code && state) {
      handleLinkedInCallback(code, state);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkExistingSession = async () => {
    try {
      const token = localStorage.getItem('unveil_auth_token');
      if (!token) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Verify token with backend
      const response = await fetch('/api/v1/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setAuthState({
          user: userData.user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        // Token invalid, remove it
        localStorage.removeItem('unveil_auth_token');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      localStorage.removeItem('unveil_auth_token');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const login = () => {
    setAuthState(prev => ({ ...prev, error: null }));
    
    // Generate new state for this login attempt
    const state = generateRandomState();
    sessionStorage.setItem('linkedin_oauth_state', state);

    // Build LinkedIn OAuth URL
    const linkedInAuthUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
    linkedInAuthUrl.searchParams.append('response_type', LINKEDIN_CONFIG.responseType);
    linkedInAuthUrl.searchParams.append('client_id', LINKEDIN_CONFIG.clientId);
    linkedInAuthUrl.searchParams.append('redirect_uri', LINKEDIN_CONFIG.redirectUri);
    linkedInAuthUrl.searchParams.append('scope', LINKEDIN_CONFIG.scope);
    linkedInAuthUrl.searchParams.append('state', state);

    // Redirect to LinkedIn
    window.location.href = linkedInAuthUrl.toString();
  };

  const handleLinkedInCallback = async (code: string, state: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      // Verify state parameter
      const storedState = sessionStorage.getItem('linkedin_oauth_state');
      if (state !== storedState) {
        throw new Error('Invalid state parameter');
      }

      // Exchange code for tokens via backend
      const response = await fetch('/api/v1/auth/linkedin/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          redirectUri: LINKEDIN_CONFIG.redirectUri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const authData = await response.json();

      // Store auth token
      localStorage.setItem('unveil_auth_token', authData.token);

      // Update auth state
      setAuthState({
        user: authData.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Clean up
      sessionStorage.removeItem('linkedin_oauth_state');

    } catch (error) {
      console.error('LinkedIn callback error:', error);
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Authentication failed',
      }));
      sessionStorage.removeItem('linkedin_oauth_state');
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('unveil_auth_token');
      if (token) {
        // Notify backend of logout
        await fetch('/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('unveil_auth_token');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
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

// Helper function to get auth token for API calls
export const getAuthToken = (): string | null => {
  return localStorage.getItem('unveil_auth_token');
};

// Helper function to create authenticated fetch
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = getAuthToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};