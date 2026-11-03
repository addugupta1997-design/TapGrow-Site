import { RawScrapeResult } from '../../../server/seoScraper';
import { SeoAuditReport } from '../../types/seoChecker';
import { evaluateWebsiteAudit } from './auditEngine';

export interface RunAuditParams {
  url: string;
  businessName?: string;
  cityArea?: string;
  category?: string;
  categoryLabel?: string;
}

/**
 * Normalizes input URL by adding https:// if missing and validating basic structure
 */
export function normalizeWebsiteUrl(rawUrl: string): string {
  let trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

/**
 * Runs a full website audit by querying the server-side SSRF-safe scraper endpoint
 */
export async function runWebsiteAudit(params: RunAuditParams): Promise<SeoAuditReport> {
  const normalizedUrl = normalizeWebsiteUrl(params.url);
  if (!normalizedUrl) {
    throw new Error('Please enter a website URL to audit.');
  }

  // Validate basic URL syntax
  try {
    const parsed = new URL(normalizedUrl);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      throw new Error('Please enter a valid domain name (e.g., example.com).');
    }
  } catch (err: any) {
    throw new Error(err.message || 'Invalid URL address provided.');
  }

  const response = await fetch('/api/audit/website', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      url: normalizedUrl,
      businessName: params.businessName,
      cityArea: params.cityArea,
      category: params.category,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to complete website audit.');
  }

  const scrapeResult: RawScrapeResult = data.scrapeResult;

  // Run audit engine with user profile answers
  return evaluateWebsiteAudit({
    scrapeResult,
    businessProfile: {
      name: params.businessName,
      cityArea: params.cityArea,
      category: params.category,
      categoryLabel: params.categoryLabel,
    },
  });
}
