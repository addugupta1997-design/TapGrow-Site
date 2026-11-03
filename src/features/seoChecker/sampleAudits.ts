import { RawScrapeResult } from '../../../server/seoScraper';
import { SeoAuditReport } from '../../types/seoChecker';
import { evaluateWebsiteAudit } from './auditEngine';

export const SAMPLE_WEBSITES = [
  {
    id: 'contractor_apex',
    name: 'Apex Heating & Plumbing',
    city: 'Denver, CO',
    category: 'home_trades',
    categoryLabel: 'Home Services & Trades',
    url: 'https://apexplumbingdenver.example.com',
    description: 'Local HVAC and plumbing contractor with strong local schema, fast speed, but missing meta description and oversized title.',
    scrapeResult: {
      url: 'https://apexplumbingdenver.example.com',
      finalUrl: 'https://apexplumbingdenver.example.com/',
      statusCode: 200,
      statusText: 'OK',
      responseTimeMs: 380,
      redirectChain: ['https://apexplumbingdenver.example.com/'],
      isHttps: true,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'server': 'nginx',
      },
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Heating & Plumbing - Emergency 24/7 Plumber Repair, Drain Cleaning, Water Heater Installation in Denver Colorado Area</title>
  <!-- Missing meta description -->
  <link rel="canonical" href="https://apexplumbingdenver.example.com/">
  <meta property="og:title" content="Apex Heating & Plumbing Denver">
  <meta property="og:image" content="https://apexplumbingdenver.example.com/hero-van.jpg">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    "name": "Apex Heating & Plumbing",
    "telephone": "(303) 555-0199",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1420 Larimer St",
      "addressLocality": "Denver",
      "addressRegion": "CO",
      "postalCode": "80202"
    }
  }
  </script>
</head>
<body>
  <header>
    <h1>Apex Heating & Plumbing Services in Denver, CO</h1>
    <a href="tel:3035550199" class="phone-link">(303) 555-0199</a>
    <a href="/contact">Schedule Service</a>
  </header>
  <main>
    <h2>24/7 Emergency Repairs & Drain Solutions</h2>
    <p>When you have a burst pipe or freezing water heater in the greater Denver metro area, Apex Heating & Plumbing arrives fast. Our certified technicians carry fully-stocked vans to solve 90% of plumbing repairs on the very first visit.</p>
    <h2>Our Core Residential & Commercial Services</h2>
    <p>From tankless water heater installation to trenchless sewer line replacement, we offer upfront, flat-rate pricing with zero hidden fees. Serving Denver, Aurora, Lakewood, and Littleton.</p>
    <img src="/van.jpg" alt="Apex Plumbing service truck in Denver" />
    <img src="/technician.jpg" alt="Licensed plumber fixing water heater" />
    <img src="/badge.jpg" /> <!-- missing alt -->
    <a href="/schedule" class="cta-button">Book Your Free Estimate Today</a>
  </main>
  <footer>
    <address>1420 Larimer St, Suite 300, Denver, CO 80202</address>
    <a href="https://maps.google.com/?q=Apex+Plumbing+Denver">View on Google Maps</a>
  </footer>
</body>
</html>`,
      robotsTxt: {
        exists: true,
        statusCode: 200,
        content: `User-agent: *\nAllow: /\nSitemap: https://apexplumbingdenver.example.com/sitemap.xml`,
      },
      sitemapXml: {
        exists: true,
        statusCode: 200,
        content: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://apexplumbingdenver.example.com/</loc></url></urlset>`,
      },
    } as RawScrapeResult,
  },
  {
    id: 'bakery_sweetbloom',
    name: 'Sweet Bloom Artisan Bakery',
    city: 'Austin, TX',
    category: 'restaurant_cafe',
    categoryLabel: 'Restaurant & Cafe',
    url: 'https://sweetbloombakery.example.com',
    description: 'Charming neighbourhood bakery with great photos but missing click-to-call link, no LocalBusiness schema, and missing image alt tags.',
    scrapeResult: {
      url: 'https://sweetbloombakery.example.com',
      finalUrl: 'https://sweetbloombakery.example.com/',
      statusCode: 200,
      statusText: 'OK',
      responseTimeMs: 620,
      redirectChain: [],
      isHttps: true,
      headers: {
        'content-type': 'text/html; charset=utf-8',
      },
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sweet Bloom Artisan Bakery | Austin, TX</title>
  <meta name="description" content="Handcrafted sourdough breads, French pastries, and specialty espresso roasted in Austin, Texas. Visit our East Austin cafe today!">
  <link rel="canonical" href="https://sweetbloombakery.example.com/">
</head>
<body>
  <header>
    <h1>Sweet Bloom Bakery</h1>
    <nav>
      <a href="/menu">Menu</a>
      <a href="/story">Our Story</a>
      <a href="/contact">Visit Us</a>
    </nav>
  </header>
  <main>
    <h2>Fresh Baked Daily in East Austin</h2>
    <p>We believe great bread starts with time, organic heirloom flour, and wild yeast. Every morning at 5:00 AM our bakers craft crusty sourdough loaves and delicate butter croissants.</p>
    <img src="/croissant.jpg" /> <!-- missing alt -->
    <img src="/sourdough.jpg" /> <!-- missing alt -->
    <img src="/cafe.jpg" /> <!-- missing alt -->
    <img src="/coffee.jpg" /> <!-- missing alt -->
    <h2>Custom Cakes & Catering</h2>
    <p>Planning a wedding or birthday in Austin? We specialize in botanical-inspired celebration cakes featuring seasonal Texas flowers and natural fruit preserves.</p>
    <a href="/menu">View Menu & Pre-Order Online</a>
  </main>
  <footer>
    <address>1204 E 11th St, Austin, TX 78702</address>
    <a href="https://maps.google.com/?q=Sweet+Bloom+Bakery+Austin">Find Us on Google Maps</a>
    <!-- Missing phone number -->
  </footer>
</body>
</html>`,
      robotsTxt: {
        exists: true,
        statusCode: 200,
        content: `User-agent: *\nAllow: /`,
      },
      sitemapXml: null,
    } as RawScrapeResult,
  },
];

export function getSampleAuditReport(sampleId: string): SeoAuditReport {
  const sample = SAMPLE_WEBSITES.find((s) => s.id === sampleId) || SAMPLE_WEBSITES[0];
  return evaluateWebsiteAudit({
    scrapeResult: sample.scrapeResult,
    businessProfile: {
      name: sample.name,
      cityArea: sample.city,
      category: sample.category,
      categoryLabel: sample.categoryLabel,
    },
  });
}
