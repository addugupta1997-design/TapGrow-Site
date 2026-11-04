import { RawScrapeResult } from '../../../server/seoScraper';
import { SeoAuditReport } from '../../types/seoChecker';
import { evaluateWebsiteAudit } from './auditEngine';
import { formatAuditErrorMessage } from './errorFormatter';

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
    throw new Error('Please enter a valid website address (e.g. example.com).');
  }

  // Validate basic URL syntax
  try {
    const parsed = new URL(normalizedUrl);
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      throw new Error('Please enter a valid domain name (e.g., example.com).');
    }
  } catch (err: any) {
    throw new Error(formatAuditErrorMessage(err.message || 'Invalid website address provided.'));
  }

  let response: Response;
  try {
    response = await fetch('/api/audit/website', {
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
  } catch (fetchErr: any) {
    console.error('Audit network request error:', fetchErr);
    throw new Error(formatAuditErrorMessage(fetchErr));
  }

  // Safely parse response body whether JSON or HTML
  const contentType = response.headers.get('content-type') || '';
  let responseData: any = null;

  if (contentType.includes('application/json')) {
    try {
      responseData = await response.json();
    } catch (parseErr) {
      console.warn('Failed to parse audit JSON response:', parseErr);
    }
  } else {
    // If server returned plain text or HTML (e.g. 502/504 gateway error)
    const textBody = await response.text().catch(() => '');
    if (!response.ok) {
      const summary = textBody.slice(0, 300);
      throw new Error(formatAuditErrorMessage(`HTTP ${response.status}: ${summary || response.statusText || 'Audit service error'}`));
    }
  }

  if (!response.ok) {
    const rawError = responseData?.error || responseData?.message || responseData?.details || `HTTP error ${response.status}`;
    const formattedError = formatAuditErrorMessage(rawError);
    throw new Error(formattedError);
  }

  if (!responseData || !responseData.scrapeResult) {
    throw new Error('The audit service did not return valid website crawl data.');
  }

  const scrapeResult: RawScrapeResult = responseData.scrapeResult;

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
