// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log to error reporting service in production
    if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
      // You can integrate with Sentry or other error reporting services here
      this.logErrorToService(error, errorInfo);
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Implement error logging to your preferred service
    console.error('Error logged to service:', { error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="max-w-md w-full mx-4">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h1 className="text-xl font-semibold text-slate-900 mb-2">
                Something went wrong
              </h1>
              
              <p className="text-slate-600 mb-6">
                We're sorry for the inconvenience. The page has encountered an error.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Reload Page
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Go Home
                </button>
              </div>

              {import.meta.env.DEV && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                    Error Details (Development Only)
                  </summary>
                  <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-auto max-h-40">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ===================================

// src/utils/analytics.ts
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

class Analytics {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
  }

  track(event: AnalyticsEvent) {
    if (!this.isEnabled) return;

    try {
      // Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', event.name, event.properties);
      }

      // Console log in development
      if (import.meta.env.DEV) {
        console.log('Analytics Event:', event);
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  page(path: string, title?: string) {
    if (!this.isEnabled) return;

    try {
      if (typeof gtag !== 'undefined') {
        gtag('config', import.meta.env.VITE_GOOGLE_ANALYTICS_ID, {
          page_path: path,
          page_title: title,
        });
      }
    } catch (error) {
      console.error('Analytics page tracking error:', error);
    }
  }
}

export const analytics = new Analytics();

// ===================================

// src/utils/constants.ts
export const APP_CONFIG = {
  name: import.meta.env.VITE_APP_NAME || 'Unveil',
  description: import.meta.env.VITE_APP_DESCRIPTION || 'Community-driven scam verification platform',
  version: import.meta.env.PACKAGE_VERSION || '1.0.0',
  buildTime: '__BUILD_TIME__',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

export const API_ENDPOINTS = {
  search: '/api/v1/search',
  latestCases: '/api/v1/cases/latest',
  reportCase: '/api/v1/case/report',
  vote: (caseId: number) => `/api/v1/case/${caseId}/vote`,
  sendOtp: '/api/v1/otp/send',
  verifyOtp: '/api/v1/otp/verify',
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  maxPageSize: 100,
} as const;

export const VALIDATION = {
  minSearchLength: 2,
  maxSearchLength: 200,
  minDescriptionLength: 20,
  maxDescriptionLength: 2000,
  otpLength: 6,
  otpExpiryMinutes: 10,
} as const;

// ===================================

// src/utils/errorReporting.ts
interface ErrorContext {
  userId?: string;
  userAgent: string;
  url: string;
  timestamp: string;
  buildVersion: string;
}

class ErrorReporter {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true';
  }

  captureException(error: Error, context?: Partial<ErrorContext>) {
    if (!this.isEnabled) return;

    const errorContext: ErrorContext = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      buildVersion: APP_CONFIG.version,
      ...context,
    };

    try {
      // Log to console in development
      if (import.meta.env.DEV) {
        console.error('Error captured:', error, errorContext);
      }

      // Send to error reporting service in production
      if (import.meta.env.PROD) {
        this.sendToErrorService(error, errorContext);
      }
    } catch (reportingError) {
      console.error('Error reporting failed:', reportingError);
    }
  }

  private async sendToErrorService(error: Error, context: ErrorContext) {
    try {
      // Example: Send to your error reporting service
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
          context,
        }),
      });
    } catch (sendError) {
      console.error('Failed to send error to service:', sendError);
    }
  }
}

export const errorReporter = new ErrorReporter();

// ===================================

// src/utils/performance.ts
class Performance {
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = 'performance' in window;
  }

  mark(name: string) {
    if (!this.isEnabled) return;
    
    try {
      performance.mark(name);
    } catch (error) {
      console.warn('Performance mark failed:', error);
    }
  }

  measure(name: string, startMark: string, endMark?: string) {
    if (!this.isEnabled) return;

    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }

      const measure = performance.getEntriesByName(name)[0];
      if (measure && import.meta.env.DEV) {
        console.log(`Performance: ${name} took ${measure.duration.toFixed(2)}ms`);
      }

      return measure;
    } catch (error) {
      console.warn('Performance measure failed:', error);
    }
  }

  observeWebVitals() {
    if (!this.isEnabled) return;

    // Observe Core Web Vitals
    try {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.onWebVital);
        getFID(this.onWebVital);
        getFCP(this.onWebVital);
        getLCP(this.onWebVital);
        getTTFB(this.onWebVital);
      });
    } catch (error) {
      console.warn('Web Vitals observation failed:', error);
    }
  }

  private onWebVital = (metric: any) => {
    if (import.meta.env.DEV) {
      console.log('Web Vital:', metric);
    }

    // Send to analytics
    analytics.track({
      name: 'web_vital',
      properties: {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
      },
    });
  };
}

export const performanceMonitor = new Performance();

// ===================================

// src/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { useToast } from '../components/context/ToastContext';
import { errorReporter } from '../utils/errorReporting';

export const useErrorHandler = () => {
  const { showToast } = useToast();

  const handleError = useCallback((error: Error, context?: string) => {
    console.error('Error handled:', error);

    // Report error
    errorReporter.captureException(error, { context });

    // Show user-friendly message
    const userMessage = getUserFriendlyMessage(error);
    showToast('error', 'Error', userMessage);
  }, [showToast]);

  return { handleError };
};

function getUserFriendlyMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes('network') || message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  if (message.includes('rate limit')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  
  if (message.includes('unauthorized') || message.includes('403')) {
    return 'You are not authorized to perform this action.';
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return 'The requested resource was not found.';
  }

  return 'An unexpected error occurred. Please try again.';
}