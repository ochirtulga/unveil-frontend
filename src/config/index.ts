// src/config/index.ts
export const config = {
    // API Configuration
    api: {
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080',
      endpoints: {
        search: '/api/v1/search',
        report: '/api/v1/case/report',
        vote: '/api/v1/case/{id}/vote',
        otpSend: '/api/v1/otp/send',
        otpVerify: '/api/v1/otp/verify',
      },
      timeout: 10000, // 10 seconds
    },
  
    // App Configuration
    app: {
      name: 'Unveil',
      description: 'Find Out Truth - Verify suspicious contacts and protect yourself from scams',
      version: '1.0.0',
    },
  
    // Search Configuration
    search: {
      defaultPageSize: 20,
      maxPageSize: 100,
      minQueryLength: 2,
      maxQueryLength: 200,
    },
  
    // Validation Configuration
    validation: {
      email: {
        regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 254,
      },
      phone: {
        minDigits: 10,
        maxDigits: 15,
      },
      name: {
        minLength: 2,
        maxLength: 100,
        regex: /^[a-zA-Z\s\-'\.]+$/,
      },
      company: {
        minLength: 2,
        maxLength: 200,
      },
      description: {
        minLength: 20,
        maxLength: 2000,
      },
    },
  
    // OTP Configuration
    otp: {
      length: 6,
      resendCooldown: 60, // seconds
      expiryTime: 10, // minutes
    },
  
    // UI Configuration
    ui: {
      toast: {
        defaultDuration: 5000, // milliseconds
        maxToasts: 3,
      },
      debounce: {
        search: 300, // milliseconds
      },
    },
  
    // Feature Flags
    features: {
      enableRegistration: false, // MVP: email verification only
      enableSocialAuth: false,   // Future feature
      enableAdvancedSearch: false, // Future feature
      enableReports: true,
      enableVoting: true,
    },
  
    // Contact Information
    contact: {
      supportEmail: 'support@unveil.com',
      helpPhone: '1-800-UNVEIL',
    },
  } as const;
  
  // Type helpers
  export type Config = typeof config;
  export type ApiEndpoints = keyof typeof config.api.endpoints;