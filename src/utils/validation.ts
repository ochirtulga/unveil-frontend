// src/utils/validation.ts

export interface ValidationResult {
    isValid: boolean;
    error?: string;
  }
  
  export const validateEmail = (email: string): ValidationResult => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
  
    return { isValid: true };
  };
  
  export const validatePhone = (phone: string): ValidationResult => {
    if (!phone.trim()) {
      return { isValid: false, error: 'Phone number is required' };
    }
  
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length < 10) {
      return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }
  
    if (digitsOnly.length > 15) {
      return { isValid: false, error: 'Phone number is too long' };
    }
  
    return { isValid: true };
  };
  
  export const validateName = (name: string): ValidationResult => {
    if (!name.trim()) {
      return { isValid: false, error: 'Name is required' };
    }
  
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }
  
    if (name.trim().length > 100) {
      return { isValid: false, error: 'Name is too long (max 100 characters)' };
    }
  
    // Check for valid characters (letters, spaces, hyphens, apostrophes)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, error: 'Name contains invalid characters' };
    }
  
    return { isValid: true };
  };
  
  export const validateCompany = (company: string): ValidationResult => {
    if (!company.trim()) {
      return { isValid: false, error: 'Company name is required' };
    }
  
    if (company.trim().length < 2) {
      return { isValid: false, error: 'Company name must be at least 2 characters long' };
    }
  
    if (company.trim().length > 200) {
      return { isValid: false, error: 'Company name is too long (max 200 characters)' };
    }
  
    return { isValid: true };
  };
  
  export const validateSearchQuery = (query: string, filter: string): ValidationResult => {
    if (!query.trim()) {
      return { isValid: false, error: 'Please enter a search term' };
    }
  
    // Validate based on filter type
    switch (filter) {
      case 'email':
        return validateEmail(query);
      case 'phone':
        return validatePhone(query);
      case 'name':
        return validateName(query);
      case 'company':
        return validateCompany(query);
      case 'all':
        // For 'all' filter, just check basic requirements
        if (query.trim().length < 2) {
          return { isValid: false, error: 'Search term must be at least 2 characters long' };
        }
        if (query.trim().length > 200) {
          return { isValid: false, error: 'Search term is too long (max 200 characters)' };
        }
        return { isValid: true };
      default:
        return { isValid: true };
    }
  };
  
  export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };
  
  export const formatPhoneNumber = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');
    
    if (digits.length === 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    
    if (digits.length === 11 && digits[0] === '1') {
      return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    
    return phone; // Return original if not a standard format
  };