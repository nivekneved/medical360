/**
 * Med360 — Universal Form Input Validation, Anti-Spam & Security Suite
 * 
 * Provides unified, strict, and localized validation rules with built-in
 * SQL Injection (SQLi) & Cross-Site Scripting (XSS) detection for all customer & admin forms.
 */

import {
  detectSqlInjection,
  sanitizeInput,
  sanitizeHtml,
  stripHtmlTags,
  escapeHtml,
  deepSanitize,
} from './security.service';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

// RFC 5322 simplified regex for robust email validation
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// International & Mauritian phone regex: digits, +, spaces, hyphens, parentheses (7 to 25 chars)
const PHONE_CHARS_REGEX = /^[+0-9\s\-().]{7,25}$/;

/**
 * Validates Email Address format with XSS & SQLi checks
 */
export function validateEmail(email: string, isRequired: boolean = true): ValidationResult {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    if (!isRequired) return { isValid: true, sanitizedValue: '' };
    return { isValid: false, error: 'Email address is required.' };
  }

  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email address cannot exceed 254 characters.' };
  }

  // Check for dangerous injection payloads
  if (detectSqlInjection(trimmed) || /<|>|javascript:|script/i.test(trimmed)) {
    return { isValid: false, error: 'Email contains forbidden characters or injection patterns.' };
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address (e.g. name@example.com).' };
  }

  return { isValid: true, sanitizedValue: sanitizeInput(trimmed) };
}

/**
 * Validates Phone / WhatsApp number (Supports Mauritius +230 and International numbers)
 */
export function validatePhone(phone: string, isRequired: boolean = true): ValidationResult {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    if (!isRequired) return { isValid: true, sanitizedValue: '' };
    return { isValid: false, error: 'Phone or WhatsApp number is required.' };
  }

  // Disallow scripts or SQL characters in phone numbers
  if (detectSqlInjection(trimmed) || /['";<>\\]/.test(trimmed)) {
    return { isValid: false, error: 'Phone number contains unauthorized characters.' };
  }

  if (!PHONE_CHARS_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Phone number contains invalid characters. Use digits and optional "+".' };
  }

  // Count raw digits
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (digitCount < 7) {
    return { isValid: false, error: 'Phone number is too short (minimum 7 digits).' };
  }
  if (digitCount > 15) {
    return { isValid: false, error: 'Phone number exceeds international maximum (15 digits).' };
  }

  return { isValid: true, sanitizedValue: trimmed };
}

/**
 * Validates Contact string which can be either Email or Phone
 */
export function validateEmailOrPhone(input: string, isRequired: boolean = true): ValidationResult {
  const trimmed = (input || '').trim();
  if (!trimmed) {
    if (!isRequired) return { isValid: true, sanitizedValue: '' };
    return { isValid: false, error: 'Please provide either an email or phone/WhatsApp number.' };
  }

  if (trimmed.includes('@')) {
    return validateEmail(trimmed, true);
  }
  return validatePhone(trimmed, true);
}

/**
 * Validates Name fields (First Name, Last Name, Full Name) with SQLi/XSS defense
 */
export function validateName(name: string, fieldLabel: string = 'Name', minLength: number = 2): ValidationResult {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldLabel} is required.` };
  }

  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldLabel} must be at least ${minLength} characters.` };
  }

  if (trimmed.length > 70) {
    return { isValid: false, error: `${fieldLabel} cannot exceed 70 characters.` };
  }

  // SQLi & XSS Detection
  if (detectSqlInjection(trimmed) || /<|>|script|onload|onerror/i.test(trimmed)) {
    return { isValid: false, error: `${fieldLabel} contains disallowed syntax or injection patterns.` };
  }

  // Disallow purely numeric or symbols
  if (!/^[a-zA-ZÀ-ÿ\s'\-\.]+$/.test(trimmed)) {
    return { isValid: false, error: `${fieldLabel} should only contain letters, spaces, hyphens, or apostrophes.` };
  }

  return { isValid: true, sanitizedValue: sanitizeInput(trimmed) };
}

/**
 * Validates text descriptions, clinical notes, messages, and inquiries with SQLi & XSS defense
 */
export function validateDescription(
  text: string,
  fieldLabel: string = 'Description',
  minLength: number = 10,
  maxLength: number = 3000
): ValidationResult {
  const trimmed = (text || '').trim();
  if (!trimmed) {
    return { isValid: false, error: `${fieldLabel} is required.` };
  }

  if (trimmed.length < minLength) {
    return { isValid: false, error: `${fieldLabel} must contain at least ${minLength} characters.` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `${fieldLabel} cannot exceed ${maxLength} characters.` };
  }

  // SQL Injection Pattern Flagging
  if (detectSqlInjection(trimmed)) {
    return { isValid: false, error: `${fieldLabel} contains invalid special characters or database query syntax.` };
  }

  return { isValid: true, sanitizedValue: sanitizeInput(trimmed) };
}

/**
 * Validates search query input against SQLi & XSS payloads
 */
export function validateSearchQuery(query: string, maxLength: number = 100): ValidationResult {
  const trimmed = (query || '').trim();
  if (!trimmed) return { isValid: true, sanitizedValue: '' };

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Search query cannot exceed ${maxLength} characters.` };
  }

  if (detectSqlInjection(trimmed)) {
    return { isValid: false, error: 'Search query contains forbidden characters.' };
  }

  return { isValid: true, sanitizedValue: sanitizeInput(trimmed) };
}

/**
 * Validates password input
 */
export function validatePassword(password: string, minLength: number = 6): ValidationResult {
  if (!password) {
    return { isValid: false, error: 'Password is required.' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters.` };
  }

  return { isValid: true };
}

/**
 * Validates Numerical inputs
 */
export function validateNumber(value: number | string, min?: number, max?: number, fieldLabel: string = 'Field'): ValidationResult {
  if (value === undefined || value === null || value === '') {
    return { isValid: false, error: `${fieldLabel} is required.` };
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) {
    return { isValid: false, error: `${fieldLabel} must be a valid number.` };
  }

  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldLabel} must be at least ${min}.` };
  }

  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldLabel} cannot exceed ${max}.` };
  }

  return { isValid: true };
}

/**
 * Anti-Bot Honeypot validator
 */
export function isHoneypotClean(honeypotVal?: string | null): boolean {
  if (!honeypotVal) return true;
  return honeypotVal.trim().length === 0;
}

// Re-export core sanitization utilities for convenience
export {
  detectSqlInjection,
  sanitizeInput,
  sanitizeHtml,
  stripHtmlTags,
  escapeHtml,
  deepSanitize,
};
