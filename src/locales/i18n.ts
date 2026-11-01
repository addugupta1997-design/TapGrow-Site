import { en } from './en';

export const t = en;

/**
 * Replaces `{param}` placeholders in a template string.
 */
export function formatString(template: string, params: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

/**
 * Formats an ISO date string in a user-friendly, locale-aware manner.
 */
export function formatDate(isoString?: string | null, locale = 'en-US'): string {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}
