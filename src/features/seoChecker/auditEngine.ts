import {
  AuditFinding,
  CategoryScore,
  RawAuditHighlights,
  SeoAuditReport,
  SeoSummaryMetrics,
  AuditCategory,
  AuditStatus,
} from '../../types/seoChecker';
import { RawScrapeResult } from '../../../server/seoScraper';
import { parseHtmlContent } from './htmlParser';

export interface AuditEvaluationInput {
  scrapeResult: RawScrapeResult;
  businessProfile?: {
    name?: string;
    cityArea?: string;
    category?: string;
    categoryLabel?: string;
  };
}

/**
 * Calculates category score based on findings.
 * Pass = 100%, Warning = 60%, Issue = 20%, Info = ignored in denominator
 */
function calculateScoreFromFindings(findings: AuditFinding[]): {
  score: number;
  passedCount: number;
  warningCount: number;
  issueCount: number;
} {
  const scoredFindings = findings.filter((f) => f.status !== 'info');
  if (scoredFindings.length === 0) {
    return { score: 100, passedCount: 0, warningCount: 0, issueCount: 0 };
  }

  let totalPoints = 0;
  let passedCount = 0;
  let warningCount = 0;
  let issueCount = 0;

  for (const f of scoredFindings) {
    if (f.status === 'pass') {
      totalPoints += 100;
      passedCount++;
    } else if (f.status === 'warning') {
      totalPoints += 60;
      warningCount++;
    } else if (f.status === 'issue') {
      totalPoints += 20;
      issueCount++;
    }
  }

  const score = Math.round(totalPoints / scoredFindings.length);
  return { score, passedCount, warningCount, issueCount };
}

/**
 * Assigns letter grade based on overall 0-100 score
 */
function getGradeFromScore(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Evaluates website health, on-page SEO, technical SEO, local SEO, and content depth.
 */
export function evaluateWebsiteAudit(input: AuditEvaluationInput): SeoAuditReport {
  const { scrapeResult, businessProfile } = input;
  const raw: RawAuditHighlights = parseHtmlContent(scrapeResult.html, scrapeResult.finalUrl);

  const findings: AuditFinding[] = [];

  const bizName = businessProfile?.name?.trim() || '';
  const bizCity = businessProfile?.cityArea?.trim() || '';
  const bizCategory = businessProfile?.category || '';
  const bizCategoryLabel = businessProfile?.categoryLabel || bizCategory.replace(/_/g, ' ');

  // ==========================================
  // 1. HEALTH CHECKS (Weight: 20%)
  // ==========================================

  // 1.1 HTTPS Usage
  if (scrapeResult.isHttps) {
    findings.push({
      id: 'health_https',
      category: 'health',
      title: 'HTTPS & SSL Encryption Active',
      status: 'pass',
      impact: 'high',
      observed: `The website loads securely via encrypted HTTPS (${scrapeResult.finalUrl}).`,
      explanation: 'Google treats HTTPS as a standard security baseline and ranking signal. Secure connections protect user information and prevent browser security warnings.',
      recommendation: 'Keep your SSL certificate active and maintain auto-renewal with your hosting provider.',
      howToFix: ['SSL is properly configured. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'health_https',
      category: 'health',
      title: 'Website Not Secure (Missing HTTPS)',
      status: 'issue',
      impact: 'high',
      observed: `The website was requested over insecure HTTP (${scrapeResult.finalUrl}).`,
      explanation: 'Modern browsers flag HTTP sites as "Not Secure". This damages customer trust, increases bounce rates, and lowers your visibility in Google search.',
      recommendation: 'Install a free SSL certificate (via Let\'s Encrypt or your web host) and enforce automatic HTTP-to-HTTPS 301 redirection.',
      howToFix: [
        'Log in to your hosting provider or domain registrar.',
        'Enable free SSL / TLS certificate in your security settings.',
        'Configure permanent 301 redirection from http:// to https://.',
      ],
      effort: '15 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 1.2 HTTP Status Code
  if (scrapeResult.statusCode === 200) {
    findings.push({
      id: 'health_status',
      category: 'health',
      title: 'Server Responds with 200 OK',
      status: 'pass',
      impact: 'high',
      observed: `HTTP Status Code 200 received successfully.`,
      explanation: 'A 200 OK status indicates your web server is online, accessible, and serving pages properly to visitors and search engine bots.',
      recommendation: 'Maintain server uptime monitoring so you are alerted if your host encounters outages.',
      howToFix: ['Server response is healthy. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'health_status',
      category: 'health',
      title: `Unexpected Server Status (${scrapeResult.statusCode})`,
      status: 'issue',
      impact: 'high',
      observed: `Received HTTP ${scrapeResult.statusCode} ${scrapeResult.statusText || ''}.`,
      explanation: 'Search crawlers cannot index pages that return error status codes, leading to dropped rankings and lost inquiries.',
      recommendation: 'Check your web server error logs and verify DNS records are pointing to the correct server.',
      howToFix: [
        'Check hosting control panel for web server errors.',
        'Verify that domain nameservers are resolved correctly.',
        'Ensure the home page index file is properly published.',
      ],
      effort: '20 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 1.3 Response Time
  const responseMs = scrapeResult.responseTimeMs;
  if (responseMs < 800) {
    findings.push({
      id: 'health_response_time',
      category: 'health',
      title: 'Fast Server Response Time',
      status: 'pass',
      impact: 'medium',
      observed: `Initial HTML server response time was ${responseMs}ms.`,
      explanation: 'Fast server response times improve visitor retention and help search engine bots crawl your pages smoothly.',
      recommendation: 'Your web server response is fast. Continue keeping media optimized.',
      howToFix: ['Response speed is optimal. No action needed.'],
      effort: 'Completed',
    });
  } else if (responseMs <= 1500) {
    findings.push({
      id: 'health_response_time',
      category: 'health',
      title: 'Moderate Server Response Time',
      status: 'warning',
      impact: 'medium',
      observed: `Initial HTML server response took ${responseMs}ms (target is under 800ms).`,
      explanation: 'Slower responses can make your site feel sluggish on mobile data connections, potentially increasing abandonment before the page finishes loading.',
      recommendation: 'Enable page caching and ensure your web host is located geographically close to your target local customers.',
      howToFix: [
        'Enable server-level page caching (or a WordPress caching plugin like WP Rocket / LiteSpeed).',
        'Verify your hosting plan has adequate CPU and RAM resources.',
      ],
      effort: '20 minutes',
    });
  } else {
    findings.push({
      id: 'health_response_time',
      category: 'health',
      title: 'Slow Server Response Time',
      status: 'issue',
      impact: 'high',
      observed: `Initial HTML server response took ${responseMs}ms (target is under 800ms).`,
      explanation: 'Slow response times frustrate local mobile visitors and negatively affect Google Core Web Vitals performance benchmarks.',
      recommendation: 'Upgrade to high-performance hosting or implement a CDN (like Cloudflare) to cache static pages close to users.',
      howToFix: [
        'Consider enabling Cloudflare free CDN for caching.',
        'Review database queries or heavy plugins slowing down page rendering.',
        'Check if your web host is overloaded.',
      ],
      effort: '30 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 1.4 Mobile Responsive Viewport
  if (raw.viewportTag && raw.viewportTag.toLowerCase().includes('width=device-width')) {
    findings.push({
      id: 'health_viewport',
      category: 'health',
      title: 'Mobile Viewport Meta Tag Present',
      status: 'pass',
      impact: 'high',
      observed: `Found: <meta name="viewport" content="${raw.viewportTag}">`,
      explanation: 'A mobile viewport tag tells smartphones and tablets to render pages formatted to their screen width rather than zooming out to a desktop layout.',
      recommendation: 'Mobile viewport is properly declared. Ensure all text and buttons remain easy to tap on smaller screens.',
      howToFix: ['Viewport configuration is correct. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'health_viewport',
      category: 'health',
      title: 'Missing Mobile Viewport Tag',
      status: 'issue',
      impact: 'high',
      observed: raw.viewportTag ? `Incomplete viewport: "${raw.viewportTag}"` : 'No viewport meta tag found in HTML <head>.',
      explanation: 'Without this tag, mobile devices will render your site as a tiny desktop screen, forcing local customers to pinch and zoom to read anything.',
      recommendation: 'Add the standard viewport tag inside the <head> section of your website templates.',
      howToFix: [
        'Open your website header template.',
        'Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` inside the `<head>` section.',
        'Save and test on a mobile phone.',
      ],
      effort: '5 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 1.5 Redirect Chain
  const redirectCount = scrapeResult.redirectChain.length;
  if (redirectCount <= 1) {
    findings.push({
      id: 'health_redirects',
      category: 'health',
      title: 'Clean URL Redirect Structure',
      status: 'pass',
      impact: 'low',
      observed: redirectCount === 0 ? 'Direct load with 0 redirects.' : `Clean single redirect (1 hop).`,
      explanation: 'Minimal redirects prevent wasted crawler crawl budget and eliminate unnecessary latency for visitors.',
      recommendation: 'Maintain direct links throughout internal navigation.',
      howToFix: ['Redirect structure is clean. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'health_redirects',
      category: 'health',
      title: 'Multiple Redirect Hops Detected',
      status: 'warning',
      impact: 'medium',
      observed: `Website went through ${redirectCount} consecutive redirects before reaching the destination.`,
      explanation: 'Redirect chains introduce avoidable delay on mobile networks and can dilute link equity passed between pages.',
      recommendation: 'Update your internal links and canonical targets directly to the final destination URL.',
      howToFix: [
        'Review server redirect rules (e.g. .htaccess or NGINX config).',
        'Ensure http:// directly redirects to https://www.yourdomain.com in a single step without bouncing through intermediate URLs.',
      ],
      effort: '15 minutes',
    });
  }

  // ==========================================
  // 2. ON-PAGE SEO (Weight: 30%)
  // ==========================================

  // 2.1 Page Title
  const titleLen = raw.title.length;
  if (!raw.title) {
    findings.push({
      id: 'onpage_title',
      category: 'on_page',
      title: 'Missing Page Title Tag',
      status: 'issue',
      impact: 'high',
      observed: 'No <title> tag was found inside the HTML <head>.',
      explanation: 'The page title is the single most important on-page SEO factor. It determines what Google shows as the clickable blue headline in search results.',
      recommendation: 'Add an informative, compelling page title between 30 and 60 characters containing your business name, primary service, and city.',
      howToFix: [
        'Add `<title>Your Business Name | Primary Service in City</title>` inside the `<head>`.',
        'Keep the length between 30 and 60 characters to prevent Google truncation.',
      ],
      effort: '5 minutes',
      aiActionType: 'title',
    });
  } else if (titleLen < 30) {
    findings.push({
      id: 'onpage_title',
      category: 'on_page',
      title: 'Page Title is Too Short',
      status: 'warning',
      impact: 'medium',
      observed: `Current title is ${titleLen} characters: "${raw.title}"`,
      explanation: 'Titles under 30 characters miss the opportunity to target your primary service and local service area for local searchers.',
      recommendation: 'Expand your title to 45–60 characters by including your core specialty and geographic area (e.g. "Apex Plumbing | Emergency Plumber in Denver, CO").',
      howToFix: [
        'Format title as: Primary Service - Business Name | City, State.',
        'Use the TapGrow AI Title Generator to write optimized variations.',
      ],
      effort: '5 minutes',
      aiActionType: 'title',
    });
  } else if (titleLen > 65) {
    findings.push({
      id: 'onpage_title',
      category: 'on_page',
      title: 'Page Title is Too Long (Truncation Risk)',
      status: 'warning',
      impact: 'medium',
      observed: `Current title is ${titleLen} characters: "${raw.title.slice(0, 70)}..."`,
      explanation: 'Google search results display a maximum width of ~600px (~60 characters). Longer titles get cut off with ellipses (...), hiding important context.',
      recommendation: 'Trim your title to 50–60 characters, placing your most important keyword and business name first.',
      howToFix: [
        'Remove redundant filler words, repeated brand slogans, or multiple phone numbers.',
        'Aim for 50–60 characters so the full title fits on mobile Google results.',
      ],
      effort: '5 minutes',
      aiActionType: 'title',
    });
  } else {
    findings.push({
      id: 'onpage_title',
      category: 'on_page',
      title: 'Optimized Page Title Length',
      status: 'pass',
      impact: 'high',
      observed: `Title length is ${titleLen} characters: "${raw.title}"`,
      explanation: 'Your title fits within Google\'s recommended 30–60 character display window and provides clear context for searchers.',
      recommendation: 'Ensure your title naturally highlights your main service and local city.',
      howToFix: ['Title length is optimal. No action needed.'],
      effort: 'Completed',
    });
  }

  // 2.2 Meta Description
  const descLen = raw.metaDescription.length;
  if (!raw.metaDescription) {
    findings.push({
      id: 'onpage_description',
      category: 'on_page',
      title: 'Missing Meta Description',
      status: 'issue',
      impact: 'high',
      observed: 'No meta description tag found in HTML.',
      explanation: 'The meta description is the 2-line preview snippet displayed beneath your title in Google search results. Without it, Google pulls random body sentences that may not convert searchers into customers.',
      recommendation: 'Write an enticing 130–160 character description summarizing what you do, who you serve, and a clear call to action.',
      howToFix: [
        'Add `<meta name="description" content="...">` to your page header.',
        'Include your primary service, local city, and an action prompt (e.g. "Call for a free quote today").',
      ],
      effort: '5 minutes',
      aiActionType: 'meta_description',
    });
  } else if (descLen < 80) {
    findings.push({
      id: 'onpage_description',
      category: 'on_page',
      title: 'Meta Description is Too Short',
      status: 'warning',
      impact: 'medium',
      observed: `Current description is ${descLen} characters: "${raw.metaDescription}"`,
      explanation: 'Short descriptions leave valuable search snippet space empty, reducing click-through rates against competitors who provide more convincing detail.',
      recommendation: 'Expand your meta description to 130–160 characters with clear customer benefits and a call-to-action.',
      howToFix: [
        'Add details about experience, availability, or your service guarantee.',
        'Use the TapGrow AI assistant to generate a polished meta description.',
      ],
      effort: '5 minutes',
      aiActionType: 'meta_description',
    });
  } else if (descLen > 165) {
    findings.push({
      id: 'onpage_description',
      category: 'on_page',
      title: 'Meta Description is Too Long (Snippet Cutoff)',
      status: 'warning',
      impact: 'medium',
      observed: `Current description is ${descLen} characters (target is 120–160).`,
      explanation: 'Google truncates descriptions that exceed ~160 characters, cutting off your phone number or call-to-action.',
      recommendation: 'Edit your description down to 140–160 characters so your complete message and call-to-action remain visible.',
      howToFix: [
        'Shorten the text to between 130 and 158 characters.',
        'Ensure the call-to-action appears within the first 130 characters.',
      ],
      effort: '5 minutes',
      aiActionType: 'meta_description',
    });
  } else {
    findings.push({
      id: 'onpage_description',
      category: 'on_page',
      title: 'Well-Crafted Meta Description Length',
      status: 'pass',
      impact: 'high',
      observed: `Description length is ${descLen} characters: "${raw.metaDescription.slice(0, 90)}..."`,
      explanation: 'Your meta description fits the ideal 120–160 character range, giving searchers a clean, compelling summary of your services.',
      recommendation: 'Periodically check that seasonal offers or phone numbers in your snippet remain up to date.',
      howToFix: ['Description length is optimal. No action needed.'],
      effort: 'Completed',
    });
  }

  // 2.3 H1 Heading Tag
  const h1Count = raw.h1s.length;
  if (h1Count === 0) {
    findings.push({
      id: 'onpage_h1',
      category: 'on_page',
      title: 'Missing H1 Heading Tag',
      status: 'issue',
      impact: 'high',
      observed: 'No <h1> heading tag was found on the page.',
      explanation: 'The H1 tag tells search engines and screen readers the main topic of your page. Having no H1 weakens your on-page relevance for your core service.',
      recommendation: 'Add exactly one clear, prominent H1 heading at the top of your page that communicates your primary business offering.',
      howToFix: [
        'Add an `<h1>` tag to your main hero or page header section.',
        'Include your primary business offering and city name.',
      ],
      effort: '5 minutes',
      aiActionType: 'title',
    });
  } else if (h1Count === 1) {
    findings.push({
      id: 'onpage_h1',
      category: 'on_page',
      title: 'Single, Clear H1 Heading Present',
      status: 'pass',
      impact: 'high',
      observed: `Found 1 H1 tag: "${raw.h1s[0]}"`,
      explanation: 'Having exactly one primary H1 heading provides clear, unambiguous hierarchy for search engines and visitors.',
      recommendation: 'Verify that your H1 complements your page title without repeating it word-for-word.',
      howToFix: ['H1 structure is optimal. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'onpage_h1',
      category: 'on_page',
      title: `Multiple H1 Headings Detected (${h1Count} Found)`,
      status: 'warning',
      impact: 'medium',
      observed: `Found ${h1Count} separate H1 tags on the page: "${raw.h1s.slice(0, 2).join('", "')}"...`,
      explanation: 'Having multiple H1 tags can dilute topic focus and confuse accessibility tools regarding what the primary theme of the page is.',
      recommendation: 'Keep one primary H1 heading for the main page theme, and change the other section headings to H2 tags.',
      howToFix: [
        'Inspect the secondary H1 tags.',
        'Change secondary section titles from `<h1>` to `<h2>` tags in your template or page builder.',
      ],
      effort: '10 minutes',
    });
  }

  // 2.4 Heading Hierarchy (H2 / H3)
  if (raw.h2Count >= 2) {
    findings.push({
      id: 'onpage_headings_hierarchy',
      category: 'on_page',
      title: 'Good Heading Structure (H2 Subheadings)',
      status: 'pass',
      impact: 'medium',
      observed: `Detected ${raw.h2Count} H2 headings and ${raw.h3Count} H3 subheadings.`,
      explanation: 'Organizing your content with subheadings makes your services easy to scan for mobile visitors and helps search engines understand individual sections.',
      recommendation: 'Keep subheadings descriptive and focused on customer questions and services.',
      howToFix: ['Heading hierarchy is healthy. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'onpage_headings_hierarchy',
      category: 'on_page',
      title: 'Limited Subheading Hierarchy',
      status: 'warning',
      impact: 'medium',
      observed: `Found ${raw.h2Count} H2 subheadings.`,
      explanation: 'Pages without clear subheadings look like large walls of text, which increases bounce rates and reduces topical depth in search rankings.',
      recommendation: 'Add H2 subheadings for your core services, about section, customer reviews, and contact info.',
      howToFix: [
        'Break up body content with 2–4 descriptive `<h2>` headings for key sections (e.g. "Our Local Services", "Why Choose Us", "Serving [City] & Surrounding Areas").',
      ],
      effort: '10 minutes',
    });
  }

  // 2.5 Image Alt Attributes
  if (raw.totalImages === 0) {
    findings.push({
      id: 'onpage_image_alt',
      category: 'on_page',
      title: 'No Images Detected on Page',
      status: 'info',
      impact: 'low',
      observed: 'No <img> elements found in the HTML body.',
      explanation: 'Visual imagery builds trust for local businesses. Photos of your team, work, storefront, or products significantly improve user engagement.',
      recommendation: 'Add high-quality, authentic photos of your business with descriptive alt tags.',
      howToFix: ['Add photos showcasing your team, premises, or completed jobs.'],
      effort: '15 minutes',
    });
  } else if (raw.imagesMissingAlt === 0) {
    findings.push({
      id: 'onpage_image_alt',
      category: 'on_page',
      title: 'All Images Have Alt Attributes',
      status: 'pass',
      impact: 'medium',
      observed: `All ${raw.totalImages} images on the page have alt text specified.`,
      explanation: 'Alt text provides context for search engine image indexing and ensures screen-reader accessibility for visually impaired visitors.',
      recommendation: 'Continue adding descriptive alt text to all new images uploaded to your site.',
      howToFix: ['Image accessibility is optimal. No action needed.'],
      effort: 'Completed',
    });
  } else if (raw.imagesMissingAlt <= 3) {
    findings.push({
      id: 'onpage_image_alt',
      category: 'on_page',
      title: `Some Images Missing Alt Text (${raw.imagesMissingAlt} of ${raw.totalImages})`,
      status: 'warning',
      impact: 'medium',
      observed: `${raw.imagesMissingAlt} image(s) lack descriptive alt attributes.`,
      explanation: 'Missing alt tags hurt accessibility scores and prevent your photos from appearing in Google Image search results for local queries.',
      recommendation: 'Add descriptive alt text describing the subject of each image and mention your service or location where natural.',
      howToFix: [
        'In your CMS media library, click each image and fill in the "Alt Text" field with a concise description.',
        'Example: alt="Family dining on outdoor patio at Sweet Bloom Bakery in Austin".',
      ],
      effort: '5 minutes',
    });
  } else {
    findings.push({
      id: 'onpage_image_alt',
      category: 'on_page',
      title: `Multiple Images Missing Alt Text (${raw.imagesMissingAlt} of ${raw.totalImages})`,
      status: 'issue',
      impact: 'medium',
      observed: `${raw.imagesMissingAlt} out of ${raw.totalImages} images have no alt attribute or empty alt text.`,
      explanation: 'A significant portion of your imagery cannot be read by accessibility screen readers or indexed by search engines.',
      recommendation: 'Audit your media library and add clear alt text to all informational photos.',
      howToFix: [
        'Open your media manager or image editor.',
        'Add brief, descriptive alt text to each image without keyword stuffing.',
      ],
      effort: '15 minutes',
    });
  }

  // 2.6 Canonical URL
  if (raw.canonicalUrl) {
    findings.push({
      id: 'onpage_canonical',
      category: 'on_page',
      title: 'Canonical Tag Specified',
      status: 'pass',
      impact: 'medium',
      observed: `Canonical URL: ${raw.canonicalUrl}`,
      explanation: 'The canonical tag prevents duplicate content issues by telling search engines the definitive version of the page to index.',
      recommendation: 'Ensure your canonical URL matches your preferred domain format (https and www or non-www).',
      howToFix: ['Canonical URL is configured. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'onpage_canonical',
      category: 'on_page',
      title: 'Missing Canonical Link Tag',
      status: 'warning',
      impact: 'medium',
      observed: 'No <link rel="canonical" href="..."> tag detected in <head>.',
      explanation: 'Without a canonical tag, URL variations (such as trailing slashes, URL parameters, or http/https versions) can create duplicate content issues in search indexes.',
      recommendation: 'Add a self-referencing canonical tag pointing to the clean, permanent URL of your homepage.',
      howToFix: [
        `Add \`<link rel="canonical" href="${scrapeResult.finalUrl}" />\` inside your \`<head>\`.`,
      ],
      effort: '5 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 2.7 Open Graph & Social Cards
  if (raw.ogTitle && raw.ogImage) {
    findings.push({
      id: 'onpage_opengraph',
      category: 'on_page',
      title: 'Open Graph Social Cards Configured',
      status: 'pass',
      impact: 'medium',
      observed: `Found og:title ("${raw.ogTitle.slice(0, 40)}...") and og:image.`,
      explanation: 'Open Graph tags control how your website looks when shared in Facebook, iMessage, WhatsApp, LinkedIn, and Twitter.',
      recommendation: 'Periodically check that your social share image looks crisp and professional.',
      howToFix: ['Social share previews are active. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'onpage_opengraph',
      category: 'on_page',
      title: 'Incomplete Social Share Preview (Open Graph)',
      status: 'warning',
      impact: 'low',
      observed: !raw.ogTitle ? 'Missing og:title tag.' : 'Missing og:image preview tag.',
      explanation: 'When clients or partners share your link on social media or messaging apps, missing Open Graph tags result in blank or awkward automatic previews.',
      recommendation: 'Add og:title, og:description, and a branded og:image (1200x630px) for professional social shares.',
      howToFix: [
        'Add `<meta property="og:title" content="Your Title" />`',
        'Add `<meta property="og:image" content="https://yourdomain.com/social-preview.jpg" />` in your `<head>`.',
      ],
      effort: '10 minutes',
    });
  }

  // ==========================================
  // 3. TECHNICAL SEO (Weight: 20%)
  // ==========================================

  // 3.1 robots.txt
  if (scrapeResult.robotsTxt?.exists) {
    const robotsContent = scrapeResult.robotsTxt.content.toLowerCase();
    const isDisallowAll = robotsContent.includes('disallow: /') && !robotsContent.includes('disallow: /wp-admin') && !robotsContent.includes('disallow: /*?');
    if (isDisallowAll) {
      findings.push({
        id: 'tech_robots_txt',
        category: 'technical',
        title: 'robots.txt is Blocking Search Crawlers (Critical)',
        status: 'issue',
        impact: 'high',
        observed: 'Found "Disallow: /" in your robots.txt file, which tells search engines not to crawl or index your site.',
        explanation: 'A broad disallow directive prevents Google from indexing your pages, effectively making your website invisible in search results.',
        recommendation: 'Remove the broad disallow rule immediately to allow Googlebot and search crawlers to access your pages.',
        howToFix: [
          'Access your server\'s public_html or root directory.',
          'Open robots.txt and change `Disallow: /` to `Disallow: /admin` or remove the block.',
        ],
        effort: '5 minutes',
        aiActionType: 'technical_explainer',
      });
    } else {
      findings.push({
        id: 'tech_robots_txt',
        category: 'technical',
        title: 'robots.txt Present and Accessible',
        status: 'pass',
        impact: 'high',
        observed: 'Found valid robots.txt file at /robots.txt with search engines permitted.',
        explanation: 'A clean robots.txt file helps search crawlers understand which parts of your site should be indexed and which admin areas should be private.',
        recommendation: 'Ensure your robots.txt includes a link to your sitemap.xml file.',
        howToFix: ['robots.txt is healthy. No action needed.'],
        effort: 'Completed',
      });
    }
  } else {
    findings.push({
      id: 'tech_robots_txt',
      category: 'technical',
      title: 'Missing robots.txt File',
      status: 'warning',
      impact: 'medium',
      observed: 'No robots.txt file found at /robots.txt (returned 404 or not found).',
      explanation: 'While not strictly mandatory, search crawlers look for robots.txt on their first visit to discover crawl directives and sitemap locations.',
      recommendation: 'Create a simple robots.txt file in your domain root directory.',
      howToFix: [
        'Create a plain text file named `robots.txt` in your web root.',
        'Add: `User-agent: *\nAllow: /\nSitemap: https://yourdomain.com/sitemap.xml`.',
      ],
      effort: '5 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 3.2 XML Sitemap
  if (scrapeResult.sitemapXml?.exists) {
    findings.push({
      id: 'tech_sitemap',
      category: 'technical',
      title: 'XML Sitemap Detected',
      status: 'pass',
      impact: 'high',
      observed: 'Found active XML sitemap at /sitemap.xml.',
      explanation: 'XML sitemaps provide search engines with an up-to-date index of all public URLs on your website to ensure fast indexing of new pages.',
      recommendation: 'Submit your sitemap URL directly to Google Search Console for automated monitoring.',
      howToFix: ['XML sitemap is present. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'tech_sitemap',
      category: 'technical',
      title: 'No Standard sitemap.xml Found',
      status: 'warning',
      impact: 'medium',
      observed: 'No XML sitemap responded at /sitemap.xml.',
      explanation: 'Without a sitemap, search engines have to rely solely on following internal links, which can cause newly added service pages or blog posts to be indexed much more slowly.',
      recommendation: 'Generate an XML sitemap using your CMS (such as Yoast/RankMath for WordPress or built-in Squarespace/Shopify sitemaps) and submit it to Google Search Console.',
      howToFix: [
        'If using WordPress, activate an SEO plugin to generate /sitemap_index.xml or /sitemap.xml.',
        'If using Webflow, enable auto-sitemap in SEO settings.',
        'Submit the sitemap URL in your Google Search Console account.',
      ],
      effort: '10 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 3.3 Structured Data / Schema Markup
  if (raw.detectedSchemas.length > 0) {
    findings.push({
      id: 'tech_schema',
      category: 'technical',
      title: `Structured Schema Detected (${raw.detectedSchemas.join(', ')})`,
      status: 'pass',
      impact: 'high',
      observed: `Detected Schema.org types: ${raw.detectedSchemas.join(', ')}.`,
      explanation: 'Schema markup helps search engines understand your entity data, business hours, and services, unlocking rich search results and knowledge panels.',
      recommendation: 'Validate your schema using Google\'s Rich Results Test tool periodically.',
      howToFix: ['Structured schema is present. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'tech_schema',
      category: 'technical',
      title: 'Missing Structured Data (Schema.org)',
      status: 'warning',
      impact: 'high',
      observed: 'No JSON-LD or Microdata structured data detected in the page code.',
      explanation: 'Without Schema.org markup, Google has to guess your business hours, address, reviews, and category from raw text, making rich snippet results less likely.',
      recommendation: 'Add LocalBusiness JSON-LD structured data to your homepage header.',
      howToFix: [
        'Add a `<script type="application/ld+json">` block containing your business name, address, phone, and opening hours.',
        'Use the TapGrow AI assistant to generate ready-to-paste schema code.',
      ],
      effort: '10 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // 3.4 Language and Encoding
  if (raw.lang && (raw.charset?.toLowerCase().includes('utf-8') || raw.charset)) {
    findings.push({
      id: 'tech_lang_charset',
      category: 'technical',
      title: 'Character Encoding & Language Declared',
      status: 'pass',
      impact: 'low',
      observed: `HTML language is "${raw.lang}" and charset is "${raw.charset || 'UTF-8'}".`,
      explanation: 'Declaring language and UTF-8 encoding ensures text, accents, and currency symbols render correctly across all international browsers and search indexers.',
      recommendation: 'Maintain standard charset and language attributes in your root template.',
      howToFix: ['Encoding is optimal. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'tech_lang_charset',
      category: 'technical',
      title: 'Missing HTML Language or Charset Declaration',
      status: 'warning',
      impact: 'low',
      observed: !raw.lang ? 'Missing lang attribute on <html> element.' : 'Missing charset meta tag.',
      explanation: 'Missing language or charset tags can cause browsers to misinterpret character sets or trigger unnecessary browser translation prompts.',
      recommendation: 'Add lang="en" to your <html> tag and <meta charset="utf-8"> at the top of your <head>.',
      howToFix: [
        'Set `<html lang="en">` at the start of your document.',
        'Add `<meta charset="UTF-8">` as the first tag inside `<head>`.',
      ],
      effort: '3 minutes',
    });
  }

  // ==========================================
  // 4. LOCAL SEO ALIGNMENT (Weight: 20%)
  // ==========================================

  // 4.1 Business Name Visibility
  const fullHtmlLower = (raw.title + ' ' + raw.h1s.join(' ') + ' ' + scrapeResult.html).toLowerCase();
  const hasBizNameMention = bizName ? fullHtmlLower.includes(bizName.toLowerCase()) : (raw.title.length > 5 || raw.h1s.length > 0);

  if (hasBizNameMention) {
    findings.push({
      id: 'local_biz_name',
      category: 'local_seo',
      title: 'Business Name Prominently Featured',
      status: 'pass',
      impact: 'high',
      observed: bizName ? `Identified "${bizName}" in title, headings, or page content.` : `Clear brand title detected: "${raw.title}".`,
      explanation: 'Having your business name clear and consistent across your website, Google Business Profile, and local directories builds trust and brand signals.',
      recommendation: 'Keep your business name spelling identical to your official Google Business Profile title.',
      howToFix: ['Business name presence is strong. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'local_biz_name',
      category: 'local_seo',
      title: 'Business Name Not Clearly Found in Key Areas',
      status: 'warning',
      impact: 'high',
      observed: bizName ? `Could not find exact match for business name "${bizName}" in page title or primary headings.` : 'Brand name could not be identified with confidence.',
      explanation: 'If your official business name is not prominent in your page title and H1, search engines may struggle to associate your website with your Google Business Profile.',
      recommendation: `Add "${bizName || 'your business name'}" clearly to your page title and main hero heading.`,
      howToFix: [
        `Update page title: "${bizName || 'Your Business'} | [Core Service] in [City]"`,
        'Ensure the business name is displayed as readable text in the header, not solely as an image logo.',
      ],
      effort: '5 minutes',
      aiActionType: 'title',
    });
  }

  // 4.2 Location / City Mention
  const hasCityMention = bizCity
    ? fullHtmlLower.includes(bizCity.toLowerCase())
    : (raw.hasAddressIndicator || raw.hasMapIndicator);

  if (hasCityMention) {
    findings.push({
      id: 'local_city_geo',
      category: 'local_seo',
      title: 'Local City / Geographic Targeting Detected',
      status: 'pass',
      impact: 'high',
      observed: bizCity ? `Detected mentions of "${bizCity}" across page content.` : 'Detected local address cues and geographic signals.',
      explanation: 'Prominently mentioning your city and service neighborhoods helps Google connect your website with "near me" and local geo-targeted queries.',
      recommendation: 'Mention specific local neighborhoods and suburbs you serve to capture nearby service area searches.',
      howToFix: ['Geographic relevance is established. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'local_city_geo',
      category: 'local_seo',
      title: 'Missing Clear City / Neighborhood Mentions',
      status: 'issue',
      impact: 'high',
      observed: bizCity ? `Could not find mentions of target city "${bizCity}" in title, meta description, or main body text.` : 'No clear geographic city or region detected on the homepage.',
      explanation: 'Google relies heavily on location keywords on your website to rank your business for local customers searching in your city.',
      recommendation: `Add "${bizCity || 'your city/service area'}" to your page title, H1, meta description, and footer address.`,
      howToFix: [
        `Include "${bizCity || 'Your City'}" in your title tag and meta description.`,
        'Add a dedicated "Areas We Serve" section listing nearby neighborhoods and towns.',
      ],
      effort: '10 minutes',
      aiActionType: 'meta_description',
    });
  }

  // 4.3 Click-to-Call Phone Number
  if (raw.detectedPhone) {
    findings.push({
      id: 'local_phone',
      category: 'local_seo',
      title: 'Direct Phone Number / Call Link Detected',
      status: 'pass',
      impact: 'high',
      observed: `Detected phone number: ${raw.detectedPhone}`,
      explanation: 'Over 65% of local searches happen on mobile devices. Having a direct phone number and tap-to-call link is the highest-converting element on a local business website.',
      recommendation: 'Ensure your phone number is wrapped in a `<a href="tel:...">` link so mobile users can dial with a single tap.',
      howToFix: ['Phone number is visible. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'local_phone',
      category: 'local_seo',
      title: 'No Direct Phone Number Detected',
      status: 'issue',
      impact: 'high',
      observed: 'Could not detect a clear phone number or tel: link in the page code.',
      explanation: 'Local customers who need service immediately (especially for repairs, bookings, dining, or appointments) will leave if they cannot immediately find a phone number.',
      recommendation: 'Add your primary business phone number prominently in the website header and footer with a click-to-call link.',
      howToFix: [
        'Add a phone link in your header navigation: `<a href="tel:+15551234567">(555) 123-4567</a>`.',
        'Make the phone button visible above the fold on mobile screens.',
      ],
      effort: '5 minutes',
    });
  }

  // 4.4 Address & Map Presence
  if (raw.hasAddressIndicator || raw.hasMapIndicator) {
    findings.push({
      id: 'local_address_map',
      category: 'local_seo',
      title: 'Physical Address or Map Links Found',
      status: 'pass',
      impact: 'medium',
      observed: 'Found physical address references or Google Maps link.',
      explanation: 'Displaying your physical address and map link verifies your real-world location and aligns with your Google Business Profile address data.',
      recommendation: 'Verify that your street address formatting matches your Google Business Profile letter-for-letter.',
      howToFix: ['Address cues are visible. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'local_address_map',
      category: 'local_seo',
      title: 'Missing Physical Address or Map Link',
      status: 'warning',
      impact: 'medium',
      observed: 'No physical street address or Google Maps embed/link detected on the homepage.',
      explanation: 'Search engines use NAP (Name, Address, Phone) consistency across the web to verify local legitimacy.',
      recommendation: 'Add your full street address in your website footer and include a link to your Google Maps listing.',
      howToFix: [
        'Add your business address in the footer formatted with `<address>` tags.',
        'Link to your Google Maps location so customers can get directions with one click.',
      ],
      effort: '10 minutes',
    });
  }

  // 4.5 LocalBusiness Schema Verification
  const hasLocalSchema = raw.detectedSchemas.some((s) =>
    s.toLowerCase().includes('localbusiness') ||
    s.toLowerCase().includes('restaurant') ||
    s.toLowerCase().includes('store') ||
    s.toLowerCase().includes('service') ||
    s.toLowerCase().includes('dentist') ||
    s.toLowerCase().includes('plumber') ||
    s.toLowerCase().includes('medical')
  );

  if (hasLocalSchema) {
    findings.push({
      id: 'local_schema_markup',
      category: 'local_seo',
      title: 'LocalBusiness Schema Markup Verified',
      status: 'pass',
      impact: 'high',
      observed: `Detected specialized local schema: ${raw.detectedSchemas.filter((s) => s.toLowerCase().includes('local') || s.toLowerCase().includes('restaurant') || s.toLowerCase().includes('store')).join(', ') || 'LocalBusiness'}.`,
      explanation: 'LocalBusiness schema explicitly feeds Google your business name, coordinates, opening hours, accepted payments, and price range.',
      recommendation: 'Keep opening hours in your schema aligned with holiday schedules.',
      howToFix: ['Local schema is implemented. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'local_schema_markup',
      category: 'local_seo',
      title: 'Missing LocalBusiness Schema Markup',
      status: 'issue',
      impact: 'high',
      observed: 'No schema with @type "LocalBusiness" (or local subtypes) was found in page scripts.',
      explanation: 'Adding LocalBusiness schema provides a direct line to Google\'s Local Knowledge Graph, giving you an edge over local competitors who only have plain text.',
      recommendation: 'Add LocalBusiness JSON-LD markup to your website.',
      howToFix: [
        'Generate LocalBusiness schema with your address, phone, and opening hours.',
        'Paste the JSON-LD snippet into your site\'s header.',
        'Use the TapGrow AI assistant to create the exact JSON-LD snippet tailored to your business.',
      ],
      effort: '10 minutes',
      aiActionType: 'technical_explainer',
    });
  }

  // ==========================================
  // 5. CONTENT QUALITY (Weight: 10%)
  // ==========================================

  // 5.1 Word Count & Content Depth
  const words = raw.wordCount;
  if (words >= 350) {
    findings.push({
      id: 'content_word_count',
      category: 'content',
      title: 'Substantial Content Depth',
      status: 'pass',
      impact: 'medium',
      observed: `Page contains approximately ${words} words of readable body text.`,
      explanation: 'Adequate content depth allows you to cover your services thoroughly, answer customer questions, and provide natural keyword context for search engines.',
      recommendation: 'Add customer FAQs and case studies to answer common questions before customers call.',
      howToFix: ['Content depth is healthy. No action needed.'],
      effort: 'Completed',
    });
  } else if (words >= 180) {
    findings.push({
      id: 'content_word_count',
      category: 'content',
      title: 'Light Page Content Depth',
      status: 'warning',
      impact: 'medium',
      observed: `Page contains only ~${words} words of body text (recommended is 350+ words).`,
      explanation: 'Pages with sparse text may be perceived as "thin content" by search engines, making it harder to rank against established competitors.',
      recommendation: 'Add 150–250 more words outlining your specific services, credentials, customer guarantees, and service area.',
      howToFix: [
        'Add a short "Why Choose Us" section with 3 key benefits.',
        'List out individual services you provide rather than grouping them in a single bullet.',
      ],
      effort: '15 minutes',
      aiActionType: 'local_service_page',
    });
  } else {
    findings.push({
      id: 'content_word_count',
      category: 'content',
      title: 'Thin Content Detected',
      status: 'issue',
      impact: 'high',
      observed: `Page contains only ~${words} words.`,
      explanation: 'Search engines struggle to rank pages with very little text. Visitors also need enough information to feel confident choosing your business.',
      recommendation: 'Expand your homepage with clear descriptions of your services, business story, customer testimonials, and contact details.',
      howToFix: [
        'Write 2–3 paragraphs describing what sets your business apart.',
        'Add a list of your top 5 services with a short paragraph explaining each.',
        'Use the TapGrow AI Local Service Page writer to draft clear copy.',
      ],
      effort: '20 minutes',
      aiActionType: 'local_service_page',
    });
  }

  // 5.2 Clear Call-to-Action (CTA)
  if (raw.detectedCtas.length > 0 || raw.hasContactPageLink) {
    findings.push({
      id: 'content_cta',
      category: 'content',
      title: 'Clear Call-to-Action (CTA) Detected',
      status: 'pass',
      impact: 'high',
      observed: raw.detectedCtas.length > 0
        ? `Found action prompts: "${raw.detectedCtas.slice(0, 3).join('", "')}".`
        : 'Found clear Contact page navigation link.',
      explanation: 'A clear conversion action guides interested visitors toward becoming paying customers.',
      recommendation: 'Make sure your primary CTA button stands out visually against the page background.',
      howToFix: ['Call to action is established. No action needed.'],
      effort: 'Completed',
    });
  } else {
    findings.push({
      id: 'content_cta',
      category: 'content',
      title: 'Weak or Missing Primary Call-to-Action',
      status: 'warning',
      impact: 'high',
      observed: 'Could not detect high-intent action prompts (e.g. "Book Now", "Call Today", "Get a Quote").',
      explanation: 'Even when visitors land on your site, without a prominent next step they may browse briefly and leave without reaching out.',
      recommendation: 'Add a high-contrast CTA button above the fold (e.g. "Request Free Quote" or "Call (555) 123-4567").',
      howToFix: [
        'Place a large, contrasting button in the hero section.',
        'Use clear, active verbs: "Schedule Your Appointment" or "Call for Same-Day Service".',
      ],
      effort: '5 minutes',
    });
  }

  // ==========================================
  // CALCULATE CATEGORY SCORES & OVERALL SCORE
  // ==========================================

  const categories: AuditCategory[] = ['health', 'on_page', 'technical', 'local_seo', 'content'];
  const categoryLabels: Record<AuditCategory, string> = {
    health: 'Website Health & Speed',
    on_page: 'On-Page SEO',
    technical: 'Technical SEO',
    local_seo: 'Local SEO Alignment',
    content: 'Content & Conversions',
  };

  const weights: Record<AuditCategory, number> = {
    health: 0.20,
    on_page: 0.30,
    technical: 0.20,
    local_seo: 0.20,
    content: 0.10,
  };

  const categoryScores: Record<AuditCategory, CategoryScore> = {} as any;
  let weightedOverall = 0;

  for (const cat of categories) {
    const catFindings = findings.filter((f) => f.category === cat);
    const { score, passedCount, warningCount, issueCount } = calculateScoreFromFindings(catFindings);

    let summary = 'Optimal setup across all evaluated parameters.';
    if (issueCount > 0) {
      summary = `${issueCount} critical ${issueCount === 1 ? 'issue' : 'issues'} need attention.`;
    } else if (warningCount > 0) {
      summary = `${warningCount} ${warningCount === 1 ? 'area' : 'areas'} could be improved for higher visibility.`;
    }

    categoryScores[cat] = {
      category: cat,
      label: categoryLabels[cat],
      score,
      weight: weights[cat],
      passedCount,
      warningCount,
      issueCount,
      summary,
    };

    weightedOverall += score * weights[cat];
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(weightedOverall)));
  const grade = getGradeFromScore(overallScore);

  let domain = '';
  try {
    domain = new URL(scrapeResult.finalUrl).hostname;
  } catch {
    domain = scrapeResult.finalUrl;
  }

  const summaryMetrics: SeoSummaryMetrics = {
    responseTimeMs: scrapeResult.responseTimeMs,
    isHttps: scrapeResult.isHttps,
    statusCode: scrapeResult.statusCode,
    wordCount: raw.wordCount,
    imagesCount: raw.totalImages,
    imagesMissingAlt: raw.imagesMissingAlt,
    h1Count: raw.h1s.length,
    hasRobotsTxt: Boolean(scrapeResult.robotsTxt?.exists),
    hasSitemapXml: Boolean(scrapeResult.sitemapXml?.exists),
    hasLocalSchema,
    hasPhone: Boolean(raw.detectedPhone),
    hasAddress: Boolean(raw.hasAddressIndicator || raw.hasMapIndicator),
    hasViewport: Boolean(raw.viewportTag),
    redirectsCount: scrapeResult.redirectChain.length,
  };

  return {
    id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    url: scrapeResult.url,
    normalizedUrl: scrapeResult.finalUrl,
    domain,
    timestamp: new Date().toISOString(),
    overallScore,
    grade,
    businessProfileUsed: businessProfile?.name ? {
      name: businessProfile.name,
      cityArea: businessProfile.cityArea || '',
      category: bizCategoryLabel,
    } : undefined,
    categoryScores,
    findings,
    summaryMetrics,
    rawHighlights: raw,
  };
}
