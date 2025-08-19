// src/services/api.ts
import { config } from '../config';
import { HTTP_STATUS } from '../utils/constants';

interface ApiError extends Error {
  status: number;
  code?: string;
}

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = config.api.baseUrl;
    this.timeout = config.api.timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = new Error(`API Error: ${response.status}`) as ApiError;
        error.status = response.status;
        
        try {
          const errorData = await response.json();
          error.message = errorData.error || error.message;
          error.code = errorData.code;
        } catch {
          // If we can't parse error response, use status text
          error.message = response.statusText;
        }
        
        throw error;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        const timeoutError = new Error('Request timeout') as ApiError;
        timeoutError.status = 408;
        throw timeoutError;
      }
      
      throw error;
    }
  }

  async search(params: {
    filter: string;
    value: string;
    page?: number;
    size?: number;
  }) {
    const searchParams = new URLSearchParams({
      filter: params.filter,
      value: params.value,
      page: (params.page || 0).toString(),
      size: (params.size || config.search.defaultPageSize).toString(),
    });

    return this.request(`${config.api.endpoints.search}?${searchParams}`);
  }

  async reportCase(data: any, verificationToken?: string) {
    const headers: Record<string, string> = {};
    
    if (verificationToken) {
      headers['Authorization'] = `Bearer ${verificationToken}`;
    }

    return this.request(config.api.endpoints.report, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  async vote(caseId: number, vote: string, email?: string, verificationToken?: string) {
    const headers: Record<string, string> = {};
    
    if (verificationToken) {
      headers['Authorization'] = `Bearer ${verificationToken}`;
    }

    const endpoint = config.api.endpoints.vote.replace('{id}', caseId.toString());
    const body: any = { vote };
    
    if (email) {
      body.email = email;
    }

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
  }

  async sendOTP(email: string) {
    return this.request(config.api.endpoints.otpSend, {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });
  }

  async verifyOTP(email: string, otp: string) {
    return this.request(config.api.endpoints.otpVerify, {
      method: 'POST',
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      }),
    });
  }
}

// Create a singleton instance
export const apiService = new ApiService();

// Error handling helper
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    
    switch (apiError.status) {
      case HTTP_STATUS.BAD_REQUEST:
        return apiError.message || 'Invalid request data';
      case HTTP_STATUS.UNAUTHORIZED:
        return 'Authentication required';
      case HTTP_STATUS.CONFLICT:
        return 'This action conflicts with existing data';
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        return 'Too many requests. Please wait before trying again';
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        return 'Server error. Please try again later';
      case 408:
        return 'Request timeout. Please check your connection';
      default:
        return apiError.message || 'An unexpected error occurred';
    }
  }
  
  return 'An unexpected error occurred';
};