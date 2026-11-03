import { RawAuditHighlights } from '../../types/seoChecker';

/**
 * Safely decodes HTML entities into plain text
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .trim();
}

/**
 * Parses raw HTML string and extracts structured SEO signals safely without executing code.
 */
export function parseHtmlContent(html: string, baseUrl: string): RawAuditHighlights {
  // 1. Title
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? decodeHtmlEntities(titleMatch[1].replace(/\s+/g, ' ')) : '';

  // 2. Meta Description
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const metaDescription = metaDescMatch ? decodeHtmlEntities(metaDescMatch[1].trim()) : '';

  // 3. Viewport tag
  const viewportMatch = html.match(/<meta[^>]*name=["']viewport["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']viewport["']/i);
  const viewportTag = viewportMatch ? viewportMatch[1].trim() : undefined;

  // 4. Canonical link
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i)
    || html.match(/<link[^>]*href=["']([^"']*)["'][^>]*rel=["']canonical["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : '';

  // 5. Open Graph tags
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:title["']/i);
  const ogTitle = ogTitleMatch ? decodeHtmlEntities(ogTitleMatch[1].trim()) : undefined;

  const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:description["']/i);
  const ogDescription = ogDescMatch ? decodeHtmlEntities(ogDescMatch[1].trim()) : undefined;

  const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)
    || html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["']/i);
  const ogImage = ogImgMatch ? ogImgMatch[1].trim() : undefined;

  // 6. Charset and lang
  const charsetMatch = html.match(/<meta[^>]*charset=["']?([^"'\s>]+)["']?/i);
  const charset = charsetMatch ? charsetMatch[1] : undefined;

  const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  const lang = langMatch ? langMatch[1] : undefined;

  // 7. Headings (H1, H2, H3)
  const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1s = h1Matches.map((m) =>
    decodeHtmlEntities(m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
  ).filter(Boolean);

  const h2Count = (html.match(/<h2[^>]*>[\s\S]*?<\/h2>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>[\s\S]*?<\/h3>/gi) || []).length;

  // 8. Images and Alt Attributes
  const imgTags = [...html.matchAll(/<img\b([^>]*)>/gi)];
  const totalImages = imgTags.length;
  let imagesMissingAlt = 0;

  for (const img of imgTags) {
    const attrs = img[1];
    const hasAlt = /alt\s*=\s*["']([^"']*)["']/i.test(attrs);
    if (!hasAlt) {
      imagesMissingAlt++;
    } else {
      const altValMatch = attrs.match(/alt\s*=\s*["']([^"']*)["']/i);
      const val = altValMatch ? altValMatch[1].trim() : '';
      if (!val) {
        imagesMissingAlt++;
      }
    }
  }

  // 9. Links Analysis
  let domain = '';
  try {
    domain = new URL(baseUrl).hostname.toLowerCase();
  } catch {
    // ignore
  }

  const linkTags = [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  let internalLinksCount = 0;
  let externalLinksCount = 0;
  let hasContactPageLink = false;
  let hasMapIndicator = false;

  for (const link of linkTags) {
    const attrs = link[1];
    const innerText = decodeHtmlEntities(link[2].replace(/<[^>]+>/g, '').trim().toLowerCase());
    const hrefMatch = attrs.match(/href\s*=\s*["']([^"']*)["']/i);
    const href = hrefMatch ? hrefMatch[1].trim() : '';

    if (!href || href.startsWith('#') || href.startsWith('javascript:')) {
      continue;
    }

    if (
      href.includes('google.com/maps') ||
      href.includes('maps.google.com') ||
      href.includes('maps.apple.com') ||
      attrs.includes('maps.app')
    ) {
      hasMapIndicator = true;
    }

    if (
      href.includes('contact') ||
      href.includes('get-in-touch') ||
      href.includes('reach-us') ||
      innerText.includes('contact')
    ) {
      hasContactPageLink = true;
    }

    if (href.startsWith('/') || href.startsWith('./') || (domain && href.includes(domain))) {
      internalLinksCount++;
    } else if (href.startsWith('http://') || href.startsWith('https://')) {
      externalLinksCount++;
    }
  }

  // 10. Schema.org / JSON-LD detection
  const detectedSchemas: string[] = [];
  const jsonLdBlocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  for (const block of jsonLdBlocks) {
    try {
      const parsed = JSON.parse(block[1]);
      const extractTypes = (obj: any) => {
        if (!obj) return;
        if (typeof obj === 'object') {
          if (obj['@type']) {
            if (Array.isArray(obj['@type'])) {
              detectedSchemas.push(...obj['@type']);
            } else if (typeof obj['@type'] === 'string') {
              detectedSchemas.push(obj['@type']);
            }
          }
          if (Array.isArray(obj['@graph'])) {
            obj['@graph'].forEach(extractTypes);
          }
        }
      };
      if (Array.isArray(parsed)) {
        parsed.forEach(extractTypes);
      } else {
        extractTypes(parsed);
      }
    } catch {
      // malformed JSON-LD script, ignore
    }
  }

  // Also check microdata if no JSON-LD found
  if (detectedSchemas.length === 0) {
    const microdataMatches = [...html.matchAll(/itemtype=["']https?:\/\/schema\.org\/([a-zA-Z0-9_]+)["']/gi)];
    for (const m of microdataMatches) {
      detectedSchemas.push(m[1]);
    }
  }

  // 11. Body Text & Word Count (strip scripts, styles, comments, and tags)
  const cleanBodyHtml = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, ' ');

  const textOnly = decodeHtmlEntities(cleanBodyHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
  const words = textOnly.trim().split(/\s+/).filter((w) => w.length > 1);
  const wordCount = words.length;

  // 12. Local Contact Detection (Phone, Email, Address cues)
  // Check for tel: links or typical US/international phone number patterns
  const telLinkMatch = html.match(/href=["']tel:([^"']+)["']/i);
  let detectedPhone = telLinkMatch ? telLinkMatch[1].trim() : undefined;

  if (!detectedPhone) {
    const phonePattern = /(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/;
    const phoneMatch = textOnly.match(phonePattern);
    if (phoneMatch) {
      detectedPhone = phoneMatch[0];
    }
  }

  // Check for mailto: or email regex
  const mailtoMatch = html.match(/href=["']mailto:([^"']+)["']/i);
  let detectedEmail = mailtoMatch ? mailtoMatch[1].trim() : undefined;
  if (!detectedEmail) {
    const emailMatch = textOnly.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      detectedEmail = emailMatch[0];
    }
  }

  // Address indicators
  const addressMatch = /<address\b[^>]*>[\s\S]*?<\/address>/i.test(html) ||
    /\b(suite|ste|ave|avenue|street|st|blvd|boulevard|rd|road|dr|drive|highway|hwy|zip\s*code|postal\s*code)\b/i.test(textOnly);
  const hasAddressIndicator = addressMatch;

  // 13. Call-to-Action phrases detection in buttons, links, or text
  const ctaCandidates = [
    'book now',
    'call now',
    'get a quote',
    'free quote',
    'schedule appointment',
    'book appointment',
    'request a service',
    'contact us',
    'order online',
    'view menu',
    'get started',
    'claim offer',
    'call today',
  ];

  const detectedCtas: string[] = [];
  const lowerText = textOnly.toLowerCase();
  for (const cta of ctaCandidates) {
    if (lowerText.includes(cta)) {
      detectedCtas.push(cta);
    }
  }

  return {
    title,
    metaDescription,
    canonicalUrl,
    h1s,
    h2Count,
    h3Count,
    totalImages,
    imagesMissingAlt,
    internalLinksCount,
    externalLinksCount,
    ogTitle,
    ogDescription,
    ogImage,
    viewportTag,
    charset,
    lang,
    detectedSchemas: Array.from(new Set(detectedSchemas)),
    detectedPhone,
    detectedEmail,
    hasAddressIndicator,
    hasMapIndicator,
    hasContactPageLink,
    detectedCtas,
    wordCount,
  };
}
