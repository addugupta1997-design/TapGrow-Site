import dns from 'node:dns/promises';
import net from 'node:net';

export interface RawScrapeResult {
  url: string;
  finalUrl: string;
  statusCode: number;
  statusText: string;
  responseTimeMs: number;
  redirectChain: string[];
  isHttps: boolean;
  headers: Record<string, string>;
  html: string;
  robotsTxt: {
    exists: boolean;
    statusCode: number;
    content: string;
  } | null;
  sitemapXml: {
    exists: boolean;
    statusCode: number;
    content: string;
  } | null;
}

/**
 * Checks if an IPv4 or IPv6 string is private, loopback, link-local, or cloud metadata.
 */
export function isPrivateOrReservedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map((p) => parseInt(p, 10));
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true; // invalid -> treat as unsafe
    }

    const [a, b] = parts;

    // 0.0.0.0/8 (Current network)
    if (a === 0) return true;

    // 10.0.0.0/8 (Private)
    if (a === 10) return true;

    // 100.64.0.0/10 (Shared address / CGNAT)
    if (a === 100 && b >= 64 && b <= 127) return true;

    // 127.0.0.0/8 (Loopback)
    if (a === 127) return true;

    // 169.254.0.0/16 (Link-local & Cloud Metadata, e.g. 169.254.169.254)
    if (a === 169 && b === 254) return true;

    // 172.16.0.0/12 (Private)
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (a === 192 && b === 0) return true;

    // 192.0.2.0/24 (TEST-NET-1)
    if (a === 192 && b === 0 && parts[2] === 2) return true;

    // 192.168.0.0/16 (Private)
    if (a === 192 && b === 168) return true;

    // 198.18.0.0/15 (Network benchmark tests)
    if (a === 198 && (b === 18 || b === 19)) return true;

    // 198.51.100.0/24 (TEST-NET-2)
    if (a === 198 && b === 51 && parts[2] === 100) return true;

    // 203.0.113.0/24 (TEST-NET-3)
    if (a === 203 && b === 0 && parts[2] === 113) return true;

    // 224.0.0.0/4 (Multicast)
    if (a >= 224 && a <= 239) return true;

    // 240.0.0.0/4 (Reserved / Future use)
    if (a >= 240) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // Loopback
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') return true;
    // Unspecified
    if (lower === '::' || lower === '0:0:0:0:0:0:0:0') return true;
    // Unique local address fc00::/7
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
    // Link local fe80::/10
    if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) return true;
    // IPv4-mapped IPv6 ::ffff:127.0.0.1
    if (lower.includes('::ffff:')) {
      const v4Part = lower.split('::ffff:')[1];
      if (v4Part && net.isIPv4(v4Part)) {
        return isPrivateOrReservedIp(v4Part);
      }
      return true;
    }
    return false;
  }

  return true; // Not valid IP -> block
}

/**
 * Validates target URL against SSRF rules, resolves DNS, and blocks private hosts.
 */
export async function validateAndResolveUrl(inputUrl: string): Promise<{
  validUrl: URL;
  resolvedIp: string;
}> {
  let normalized = inputUrl.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = 'https://' + normalized;
  }

  let parsed: URL;
  try {
    parsed = new URL(normalized);
  } catch {
    throw new Error('Invalid URL format. Please provide a valid web address (e.g. example.com).');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only HTTP and HTTPS protocols are allowed for website auditing.');
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost, internal hostnames, and metadata hostnames directly
  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname === 'metadata.google.internal' ||
    hostname === 'instance-data'
  ) {
    throw new Error('Access to local, internal, or cloud metadata hostnames is restricted.');
  }

  // Resolve DNS
  let lookupResults: { address: string; family: number }[];
  try {
    lookupResults = await dns.lookup(hostname, { all: true });
  } catch (err: any) {
    throw new Error(`Could not resolve hostname "${hostname}". Please check that the domain exists.`);
  }

  if (!lookupResults || lookupResults.length === 0) {
    throw new Error(`No IP addresses found for hostname "${hostname}".`);
  }

  // Ensure ALL resolved IPs are public
  for (const item of lookupResults) {
    if (isPrivateOrReservedIp(item.address)) {
      throw new Error(`Hostname "${hostname}" resolves to a restricted/private IP address (${item.address}).`);
    }
  }

  return {
    validUrl: parsed,
    resolvedIp: lookupResults[0].address,
  };
}

/**
 * Safely fetches a public URL with timeout, max size limit, and SSRF-checked redirect following.
 */
export async function safeFetchHtml(
  targetUrl: string,
  options: { maxRedirects?: number; timeoutMs?: number; maxBytes?: number } = {}
): Promise<RawScrapeResult> {
  const maxRedirects = options.maxRedirects ?? 5;
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxBytes = options.maxBytes ?? 2 * 1024 * 1024; // 2MB

  let currentUrlStr = targetUrl;
  const redirectChain: string[] = [];

  const startTime = Date.now();
  let response: Response | null = null;
  let finalUrl = targetUrl;
  let responseHeaders: Record<string, string> = {};

  for (let hop = 0; hop <= maxRedirects; hop++) {
    const { validUrl } = await validateAndResolveUrl(currentUrlStr);
    finalUrl = validUrl.toString();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TapGrowBot/1.0; +https://tapgrow.local/bot)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'manual', // Manual handling to ensure each redirect target is validated
        signal: controller.signal,
      });
    } catch (err: any) {
      clearTimeout(timer);
      if (err.name === 'AbortError') {
        throw new Error(`Audit timed out after ${timeoutMs}ms while contacting ${validUrl.hostname}.`);
      }
      throw new Error(`Failed to connect to ${validUrl.hostname}: ${err.message || 'Network error'}`);
    } finally {
      clearTimeout(timer);
    }

    // Check for redirect status (301, 302, 303, 307, 308)
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get('location');
      if (!location) {
        break; // No location header, treat as end
      }
      const nextUrl = new URL(location, finalUrl).toString();
      redirectChain.push(nextUrl);
      currentUrlStr = nextUrl;
      continue;
    }

    // Finished redirect chain
    break;
  }

  if (!response) {
    throw new Error('No HTTP response received from server.');
  }

  const responseTimeMs = Date.now() - startTime;

  // Extract relevant response headers
  response.headers.forEach((val, key) => {
    responseHeaders[key.toLowerCase()] = val;
  });

  const cType = (responseHeaders['content-type'] || '').toLowerCase();
  if (cType && (cType.includes('image/') || cType.includes('video/') || cType.includes('audio/') || cType.includes('application/pdf') || cType.includes('application/octet-stream') || cType.includes('application/zip'))) {
    throw new Error(`The website returned a non-HTML file (${cType}). Only HTML websites can be audited.`);
  }

  // Read body with size cutoff
  const reader = response.body?.getReader();
  let receivedBytes = 0;
  const chunks: Uint8Array[] = [];

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        receivedBytes += value.length;
        if (receivedBytes > maxBytes) {
          chunks.push(value.slice(0, maxBytes - (receivedBytes - value.length)));
          try {
            await reader.cancel();
          } catch {
            // ignore
          }
          break;
        }
        chunks.push(value);
      }
    }
  }

  const fullBuffer = Buffer.concat(chunks);
  const html = fullBuffer.toString('utf-8');

  // Safely check for /robots.txt and /sitemap.xml on the final origin
  const origin = new URL(finalUrl).origin;
  const [robotsTxt, sitemapXml] = await Promise.all([
    fetchAuxiliaryText(`${origin}/robots.txt`, 3000, 100 * 1024),
    fetchAuxiliaryText(`${origin}/sitemap.xml`, 3000, 500 * 1024),
  ]);

  return {
    url: targetUrl,
    finalUrl,
    statusCode: response.status,
    statusText: response.statusText,
    responseTimeMs,
    redirectChain,
    isHttps: finalUrl.startsWith('https://'),
    headers: responseHeaders,
    html,
    robotsTxt,
    sitemapXml,
  };
}

/**
 * Safely fetches auxiliary files like robots.txt or sitemap.xml.
 */
async function fetchAuxiliaryText(
  url: string,
  timeoutMs: number,
  maxBytes: number
): Promise<{ exists: boolean; statusCode: number; content: string } | null> {
  try {
    const { validUrl } = await validateAndResolveUrl(url);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const res = await fetch(validUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TapGrowBot/1.0; +https://tapgrow.local/bot)',
        'Accept': 'text/plain,application/xml,text/xml,*/*',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);

    if (res.status === 200) {
      const text = await res.text();
      return {
        exists: true,
        statusCode: 200,
        content: text.slice(0, maxBytes),
      };
    }
    return {
      exists: false,
      statusCode: res.status,
      content: '',
    };
  } catch {
    return null;
  }
}
