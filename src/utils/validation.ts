// src/utils/validation.ts
import { config } from '../config';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  if (!config.validation.email.regex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > config.validation.email.maxLength) {
    return { isValid: false, error: 'Email address is too long' };
  }

  return { isValid: true };
};

export const validatePhone = (phone: string): ValidationResult => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < config.validation.phone.minDigits) {
    return { isValid: false, error: `Phone number must be at least ${config.validation.phone.minDigits} digits` };
  }

  if (digitsOnly.length > config.validation.phone.maxDigits) {
    return { isValid: false, error: 'Phone number is too long' };
  }

  return { isValid: true };
};

export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }

  const { minLength, maxLength, regex } = config.validation.name;

  if (name.trim().length < minLength) {
    return { isValid: false, error: `Name must be at least ${minLength} characters long` };
  }

  if (name.trim().length > maxLength) {
    return { isValid: false, error: `Name is too long (max ${maxLength} characters)` };
  }

  if (!regex.test(name.trim())) {
    return { isValid: false, error: 'Name contains invalid characters' };
  }

  return { isValid: true };
};

export const validateCompany = (company: string): ValidationResult => {
  if (!company.trim()) {
    return { isValid: false, error: 'Company name is required' };
  }

  const { minLength, maxLength } = config.validation.company;

  if (company.trim().length < minLength) {
    return { isValid: false, error: `Company name must be at least ${minLength} characters long` };
  }

  if (company.trim().length > maxLength) {
    return { isValid: false, error: `Company name is too long (max ${maxLength} characters)` };
  }

  return { isValid: true };
};

export const validateDescription = (description: string): ValidationResult => {
  if (!description.trim()) {
    return { isValid: false, error: 'Description is required' };
  }

  const { minLength, maxLength } = config.validation.description;

  if (description.trim().length < minLength) {
    return { isValid: false, error: `Description must be at least ${minLength} characters long` };
  }

  if (description.trim().length > maxLength) {
    return { isValid: false, error: `Description is too long (max ${maxLength} characters)` };
  }

  return { isValid: true };
};

export const validateSearchQuery = (query: string, filter: string): ValidationResult => {
  if (!query.trim()) {
    return { isValid: false, error: 'Please enter a search term' };
  }

  // Use centralized config for search validation
  const { minQueryLength, maxQueryLength } = config.search;

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
    default:
      if (query.trim().length < minQueryLength) {
        return { isValid: false, error: `Search term must be at least ${minQueryLength} characters long` };
      }
      if (query.trim().length > maxQueryLength) {
        return { isValid: false, error: `Search term is too long (max ${maxQueryLength} characters)` };
      }
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