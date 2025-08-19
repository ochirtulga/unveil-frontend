// src/utils/constants.ts

export const FILTER_OPTIONS = [
    { value: 'all', label: 'All Fields' },
    { value: 'name', label: 'Name' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'company', label: 'Company' },
  ] as const;
  
  export const SCAM_TYPES = [
    'Phone Scam',
    'Email Fraud',
    'Investment Scam',
    'Romance Scam',
    'Tech Support Scam',
    'Identity Theft',
    'Online Shopping Fraud',
    'Phishing',
    'Cryptocurrency Scam',
    'Job Interview Scam',
    'Tax Refund Scam',
    'Charity Scam',
    'Other',
  ] as const;
  
  export const NAVIGATION_ITEMS = [
    { label: 'About', href: '/about' },
    { label: 'Report', href: '/report' },
  ] as const;
  
  export const HTTP_STATUS = {
    OK: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    CONFLICT: 409,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
  } as const;
  
  export const TOAST_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info',
  } as const;
  
  export type FilterOption = typeof FILTER_OPTIONS[number]['value'];
  export type ScamType = typeof SCAM_TYPES[number];
  export type ToastType = typeof TOAST_TYPES[keyof typeof TOAST_TYPES];