import { AssessmentAnswers, ValidationError } from '../types/assessment';

/**
 * Sanitizes plain text input to prevent XSS injection.
 */
export function sanitizeText(input?: string): string {
  if (!input) return '';
  return input
    .trim()
    .replace(/<[^>]*>?/gm, '') // Strip HTML tags
    .replace(/[<>'"`;]/g, ''); // Strip dangerous injection characters
}

/**
 * Normalizes and validates user-entered website URLs.
 * Handles inputs like "mybusiness.com", "http://mybusiness.com", "https://www.mybiz.co.uk".
 * Returns normalized URL string or null if invalid.
 */
export function normalizeUrl(rawUrl?: string): { valid: boolean; normalizedUrl: string; error?: string } {
  if (!rawUrl || !rawUrl.trim()) {
    return { valid: true, normalizedUrl: '' };
  }

  let cleaned = rawUrl.trim();

  // If missing scheme, prepend https://
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }

  try {
    const parsed = new URL(cleaned);
    // Ensure hostname has at least one dot, no double dots, and valid format
    if (
      !parsed.hostname.includes('.') ||
      parsed.hostname.includes('..') ||
      parsed.hostname.length < 4 ||
      !/^([a-z0-9_-]+\.)+[a-z]{2,}$/i.test(parsed.hostname)
    ) {
      return { valid: false, normalizedUrl: '', error: 'Please enter a valid domain (e.g. yourbusiness.com)' };
    }
    // Disallow javascript: or file: schemes
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, normalizedUrl: '', error: 'URL must begin with http:// or https://' };
    }
    return { valid: true, normalizedUrl: parsed.origin + parsed.pathname.replace(/\/$/, '') };
  } catch {
    return { valid: false, normalizedUrl: '', error: 'Invalid website URL format' };
  }
}

/**
 * Validates step 1 answers
 */
export function validateStep1(data: Partial<AssessmentAnswers>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.category) {
    errors.push({ field: 'category', message: 'Please select your business category' });
  }

  if (!data.country || !data.country.trim()) {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  if (!data.cityArea || !data.cityArea.trim()) {
    errors.push({ field: 'cityArea', message: 'City, town or primary service area is required' });
  }

  if (!data.businessModel) {
    errors.push({ field: 'businessModel', message: 'Please select how you serve customers (business model)' });
  }

  return errors;
}

/**
 * Validates step 2 answers
 */
export function validateStep2(data: Partial<AssessmentAnswers>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.hasWebsite) {
    errors.push({ field: 'hasWebsite', message: 'Please indicate whether you have a website' });
  }

  if (data.hasWebsite === 'yes' && data.websiteUrl && data.websiteUrl.trim()) {
    const urlCheck = normalizeUrl(data.websiteUrl);
    if (!urlCheck.valid) {
      errors.push({ field: 'websiteUrl', message: urlCheck.error || 'Please enter a valid website URL' });
    }
  }

  if (!data.hasBusinessListing) {
    errors.push({ field: 'hasBusinessListing', message: 'Please indicate if you have a Google or map listing' });
  }

  if (!data.socialPresence) {
    errors.push({ field: 'socialPresence', message: 'Please select your social media status' });
  }

  return errors;
}

/**
 * Validates step 3 answers
 */
export function validateStep3(data: Partial<AssessmentAnswers>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.discoveryMethods || data.discoveryMethods.length === 0) {
    errors.push({ field: 'discoveryMethods', message: 'Please select at least one way customers discover you' });
  }

  if (!data.contactConsistent) {
    errors.push({ field: 'contactConsistent', message: 'Please select whether your contact information is consistent' });
  }

  if (!data.askForReviews) {
    errors.push({ field: 'askForReviews', message: 'Please select whether you actively invite customer reviews' });
  }

  if (!data.websiteDetailsClear) {
    errors.push({ field: 'websiteDetailsClear', message: 'Please answer whether your services & location are clear' });
  }

  if (!data.publishesContent) {
    errors.push({ field: 'publishesContent', message: 'Please indicate if you regularly publish helpful content' });
  }

  if (!data.tracksMarketing) {
    errors.push({ field: 'tracksMarketing', message: 'Please indicate if you track inquiries or marketing results' });
  }

  if (!data.clearConversionAction) {
    errors.push({ field: 'clearConversionAction', message: 'Please answer whether you have a clear primary call to action' });
  }

  return errors;
}

/**
 * Validates step 4 answers
 */
export function validateStep4(data: Partial<AssessmentAnswers>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!data.mainGoal) {
    errors.push({ field: 'mainGoal', message: 'Please select your primary growth goal' });
  }

  if (!data.weeklyHours) {
    errors.push({ field: 'weeklyHours', message: 'Please select how much time you can invest each week' });
  }

  if (!data.budgetPreference) {
    errors.push({ field: 'budgetPreference', message: 'Please select your budget preference' });
  }

  return errors;
}
