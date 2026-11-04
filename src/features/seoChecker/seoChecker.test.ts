import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import { isPrivateOrReservedIp } from '../../../server/seoScraper';
import { parseHtmlContent } from './htmlParser';
import { evaluateWebsiteAudit } from './auditEngine';
import { saveAuditReport, loadSavedAudits, compareAudits, clearAuditStorage } from './seoStorage';
import { generateSeoPdfReport } from './generateSeoPdf';
import { SAMPLE_WEBSITES, getSampleAuditReport } from './sampleAudits';
import { RawScrapeResult } from '../../../server/seoScraper';

import { formatAuditErrorMessage } from './errorFormatter';

describe('Website & SEO Checker Unit Tests', () => {
  describe('Error Formatter & Serialization Defense', () => {
    it('never returns [object Object] for arbitrary objects', () => {
      assert.notStrictEqual(formatAuditErrorMessage({}), '[object Object]');
      assert.notStrictEqual(formatAuditErrorMessage({ error: {} }), '[object Object]');
      assert.notStrictEqual(formatAuditErrorMessage(new Error({} as any)), '[object Object]');
      assert.notStrictEqual(formatAuditErrorMessage('[object Object]'), '[object Object]');
    });

    it('extracts nested messages accurately', () => {
      const res1 = formatAuditErrorMessage({ error: 'DNS resolution failure' });
      assert.ok(res1.includes('website domain') || res1.includes('DNS'));

      const res2 = formatAuditErrorMessage({ error: { message: 'Timed out' } });
      assert.ok(res2.includes('too long to respond') || res2.includes('Timed out'));

      const res3 = formatAuditErrorMessage({ message: 'Failed to fetch' });
      assert.ok(res3.includes('Could not connect'));
    });
  });
  describe('SSRF Protection & IP Verification', () => {
    it('blocks localhost and loopback addresses', () => {
      assert.strictEqual(isPrivateOrReservedIp('127.0.0.1'), true);
      assert.strictEqual(isPrivateOrReservedIp('127.0.1.1'), true);
      assert.strictEqual(isPrivateOrReservedIp('::1'), true);
    });

    it('blocks private subnets (RFC 1918)', () => {
      assert.strictEqual(isPrivateOrReservedIp('10.0.0.1'), true);
      assert.strictEqual(isPrivateOrReservedIp('10.255.255.255'), true);
      assert.strictEqual(isPrivateOrReservedIp('172.16.0.1'), true);
      assert.strictEqual(isPrivateOrReservedIp('172.31.255.255'), true);
      assert.strictEqual(isPrivateOrReservedIp('192.168.1.1'), true);
      assert.strictEqual(isPrivateOrReservedIp('192.168.254.100'), true);
    });

    it('blocks cloud metadata endpoints (169.254.169.254 and link-local)', () => {
      assert.strictEqual(isPrivateOrReservedIp('169.254.169.254'), true);
      assert.strictEqual(isPrivateOrReservedIp('169.254.1.1'), true);
    });

    it('allows valid public IPs', () => {
      assert.strictEqual(isPrivateOrReservedIp('8.8.8.8'), false);
      assert.strictEqual(isPrivateOrReservedIp('1.1.1.1'), false);
      assert.strictEqual(isPrivateOrReservedIp('142.250.190.46'), false);
      assert.strictEqual(isPrivateOrReservedIp('104.21.55.2'), false);
    });
  });

  describe('HTML Parser & Signal Extraction', () => {
    const sampleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apex Heating & Plumbing | Denver, CO</title>
  <meta name="description" content="Professional plumbing and heating repair in Denver, Colorado. Call today for 24/7 service!">
  <link rel="canonical" href="https://apexdenver.com/">
  <meta property="og:title" content="Apex Denver Plumber">
  <meta property="og:image" content="https://apexdenver.com/og.jpg">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "PlumbingService",
    "name": "Apex Heating & Plumbing"
  }
  </script>
</head>
<body>
  <h1>Denver's Trusted Plumbers & HVAC Specialists</h1>
  <a href="tel:3035550199">(303) 555-0199</a>
  <h2>Water Heater Installation & Drain Cleaning</h2>
  <p>Our licensed plumbers solve emergency burst pipes, sewer repairs, and heating issues with flat-rate transparent pricing.</p>
  <img src="/van.jpg" alt="Service Van in Denver" />
  <img src="/logo.jpg" alt="Company Logo" />
  <a href="/schedule">Book Now for Free Quote</a>
  <address>1420 Larimer St, Denver, CO 80202</address>
</body>
</html>`;

    it('extracts titles, meta descriptions, headings, and viewport', () => {
      const parsed = parseHtmlContent(sampleHtml, 'https://apexdenver.com');
      assert.strictEqual(parsed.title, 'Apex Heating & Plumbing | Denver, CO');
      assert.ok(parsed.metaDescription.includes('Professional plumbing'));
      assert.strictEqual(parsed.viewportTag, 'width=device-width, initial-scale=1.0');
      assert.strictEqual(parsed.h1s.length, 1);
      assert.strictEqual(parsed.h1s[0], "Denver's Trusted Plumbers & HVAC Specialists");
      assert.strictEqual(parsed.h2Count, 1);
    });

    it('extracts images and verifies alt attributes', () => {
      const parsed = parseHtmlContent(sampleHtml, 'https://apexdenver.com');
      assert.strictEqual(parsed.totalImages, 2);
      assert.strictEqual(parsed.imagesMissingAlt, 0);
    });

    it('extracts schema.org JSON-LD types and contact indicators', () => {
      const parsed = parseHtmlContent(sampleHtml, 'https://apexdenver.com');
      assert.ok(parsed.detectedSchemas.includes('PlumbingService'));
      assert.strictEqual(parsed.detectedPhone, '3035550199');
      assert.strictEqual(parsed.hasAddressIndicator, true);
      assert.ok(parsed.detectedCtas.includes('book now'));
    });
  });

  describe('SEO Audit Engine Scoring & Findings', () => {
    it('evaluates Apex Plumbing sample with high score and expected findings', () => {
      const report = getSampleAuditReport('contractor_apex');
      assert.ok(report.overallScore >= 70, `Expected score >= 70, got ${report.overallScore}`);
      assert.ok(['A', 'B', 'C'].includes(report.grade));

      // Category breakdown
      assert.strictEqual(report.categoryScores.health.score, 100);
      assert.ok(report.categoryScores.local_seo.score >= 80);

      // Verify specific finding
      const titleFinding = report.findings.find((f) => f.id === 'onpage_title');
      assert.ok(titleFinding);
      // In contractor sample, title is 120 chars -> warning for too long
      assert.strictEqual(titleFinding?.status, 'warning');
    });

    it('evaluates Sweet Bloom Bakery sample and flags missing phone and alt tags', () => {
      const report = getSampleAuditReport('bakery_sweetbloom');
      assert.ok(report.overallScore > 50);

      // Verify phone check
      const phoneFinding = report.findings.find((f) => f.id === 'local_phone');
      assert.ok(phoneFinding);
      assert.strictEqual(phoneFinding?.status, 'issue');

      // Verify alt tags check
      const altFinding = report.findings.find((f) => f.id === 'onpage_image_alt');
      assert.ok(altFinding);
      assert.strictEqual(altFinding?.status, 'issue');
    });
  });

  describe('Storage, CRUD, and Comparison Logic', () => {
    it('saves and retrieves audit reports in storage', () => {
      clearAuditStorage();
      const report = getSampleAuditReport('contractor_apex');
      saveAuditReport(report);

      const list = loadSavedAudits();
      assert.strictEqual(list.length, 1);
      assert.strictEqual(list[0].domain, report.domain);
    });

    it('compares two audits and accurately computes score delta and fixed findings', () => {
      const report1 = getSampleAuditReport('bakery_sweetbloom');

      // Create an improved version of report1 with higher score
      const report2 = {
        ...report1,
        id: 'audit_improved',
        timestamp: new Date(Date.now() + 10000).toISOString(),
        overallScore: report1.overallScore + 18,
        findings: report1.findings.map((f) => {
          if (f.id === 'local_phone') {
            return {
              ...f,
              status: 'pass' as const,
              observed: 'Phone number tel: link configured.',
            };
          }
          return f;
        }),
      };

      const comparison = compareAudits(report1, report2);
      assert.strictEqual(comparison.scoreDelta, 18);
      assert.strictEqual(comparison.fixedFindings.length, 1);
      assert.strictEqual(comparison.fixedFindings[0].id, 'local_phone');
    });
  });

  describe('PDF Generation', () => {
    it('creates a valid jsPDF document without throwing errors', () => {
      const report = getSampleAuditReport('contractor_apex');
      const doc = generateSeoPdfReport(report, { skipSave: true });
      assert.ok(doc);
      assert.ok(doc.internal.pageSize.getWidth() > 0);
      assert.strictEqual(doc.getNumberOfPages() >= 1, true);
    });
  });
});
