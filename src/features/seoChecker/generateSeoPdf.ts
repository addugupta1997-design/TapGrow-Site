import { jsPDF } from 'jspdf';
import { SeoAuditReport } from '../../types/seoChecker';
import { formatDate } from '../../locales/i18n';

/**
 * Generates and downloads a branded PDF audit report directly from the client.
 */
export function generateSeoPdfReport(
  report: SeoAuditReport,
  options?: { skipSave?: boolean }
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;

  const bizName = report.businessProfileUsed?.name || report.domain;
  const dateStr = formatDate(report.timestamp) || new Date().toISOString().split('T')[0];
  const fileDateStr = new Date().toISOString().split('T')[0];

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 20) {
      doc.addPage();
      y = 18;
      renderPageHeader();
    }
  };

  const renderPageHeader = () => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 114, 122);
    doc.text('TAPGROW · WEBSITE & SEO AUDIT REPORT', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(dateStr, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  // --- 1. COVER / HEADER BLOCK ---
  doc.setFillColor(16, 29, 36); // #101D24
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`Website & SEO Audit: ${bizName}`, margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(101, 214, 178); // Emerald #65D6B2
  doc.text(`Target URL: ${report.normalizedUrl}`, margin + 6, y + 15);

  doc.setFontSize(8);
  doc.setTextColor(145, 165, 169);
  doc.text(
    `Audited on ${dateStr} · Response: ${report.summaryMetrics.responseTimeMs}ms · SSL: ${report.summaryMetrics.isHttps ? 'Active' : 'Missing'}`,
    margin + 6,
    y + 20
  );

  y += 30;

  // --- 2. EXECUTIVE SCORECARD ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  // Overall Score
  doc.setFillColor(22, 134, 111); // #16866F
  doc.roundedRect(margin + 4, y + 4, 28, 18, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`${report.overallScore}`, margin + 18, y + 14, { align: 'center' });
  doc.setFontSize(7);
  doc.text('/ 100 PTS', margin + 18, y + 19, { align: 'center' });

  // Score description
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text(`Audit Grade: ${report.grade}`, margin + 38, y + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const issuesCount = report.findings.filter((f) => f.status === 'issue').length;
  const warningsCount = report.findings.filter((f) => f.status === 'warning').length;
  const passedCount = report.findings.filter((f) => f.status === 'pass').length;

  doc.text(
    `Identified ${issuesCount} critical ${issuesCount === 1 ? 'issue' : 'issues'}, ${warningsCount} improvement ${warningsCount === 1 ? 'warning' : 'warnings'}, and ${passedCount} passed optimizations.`,
    margin + 38,
    y + 16
  );
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Target City: ${report.businessProfileUsed?.cityArea || 'Local Market'} · Category: ${report.businessProfileUsed?.category || 'General Local Business'}`, margin + 38, y + 21);

  y += 32;

  // --- 3. CATEGORY SCORES SUMMARY TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text('Performance by Audit Category', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Category', margin + 3, y + 5);
  doc.text('Score', margin + 65, y + 5);
  doc.text('Passed / Warnings / Issues', margin + 88, y + 5);
  doc.text('Status Summary', margin + 138, y + 5);
  y += 7;

  const catKeys = Object.keys(report.categoryScores) as (keyof typeof report.categoryScores)[];
  for (const catKey of catKeys) {
    const cat = report.categoryScores[catKey];
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 42, 54);
    doc.text(cat.label, margin + 3, y + 5);

    // Score badge
    doc.setFont('helvetica', 'bold');
    if (cat.score >= 80) doc.setTextColor(22, 134, 111);
    else if (cat.score >= 60) doc.setTextColor(217, 119, 6);
    else doc.setTextColor(220, 38, 38);
    doc.text(`${cat.score}/100`, margin + 65, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`${cat.passedCount} pass · ${cat.warningCount} warn · ${cat.issueCount} issue`, margin + 88, y + 5);

    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(cat.summary.slice(0, 38), margin + 138, y + 5);

    y += 7;
  }
  doc.line(margin, y, margin + contentWidth, y);
  y += 9;

  // --- 4. PRIORITY ACTION ITEMS & CRITICAL FINDINGS ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text('Priority Findings & Step-by-Step Fixes', margin, y);
  y += 6;

  const priorityFindings = report.findings.filter((f) => f.status === 'issue' || f.status === 'warning');

  if (priorityFindings.length === 0) {
    doc.setFillColor(224, 245, 238);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(22, 134, 111);
    doc.text('✓ Excellent on-page setup! No critical issues or warnings detected.', margin + 4, y + 8);
    y += 20;
  } else {
    for (const f of priorityFindings) {
      checkPageBreak(34);

      const isIssue = f.status === 'issue';
      // Finding box
      doc.setFillColor(isIssue ? 254 : 255, isIssue ? 242 : 251, isIssue ? 242 : 235);
      doc.setDrawColor(isIssue ? 254 : 253, isIssue ? 202 : 230, isIssue ? 202 : 138);
      doc.roundedRect(margin, y, contentWidth, 28, 1.5, 1.5, 'FD');

      // Status pill
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(isIssue ? 185 : 180, isIssue ? 28 : 83, isIssue ? 28 : 9);
      doc.text(isIssue ? 'CRITICAL ISSUE' : 'IMPROVEMENT WARNING', margin + 4, y + 5.5);

      // Title
      doc.setFontSize(9);
      doc.setTextColor(20, 42, 54);
      doc.text(f.title, margin + 40, y + 5.5);

      // Observed evidence
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      const obsLines = doc.splitTextToSize(`Observed: ${f.observed}`, contentWidth - 8);
      doc.text(obsLines.slice(0, 2), margin + 4, y + 10.5);

      // Recommendation
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(20, 42, 54);
      doc.text('Recommended Fix:', margin + 4, y + 16);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      const recLines = doc.splitTextToSize(f.recommendation, contentWidth - 36);
      doc.text(recLines.slice(0, 2), margin + 34, y + 16);

      // Fix steps
      if (f.howToFix && f.howToFix.length > 0) {
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.text(`Action: ${f.howToFix[0]}`, margin + 4, y + 22);
      }

      // Effort tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(`Est. Effort: ${f.effort}`, margin + contentWidth - 26, y + 26);

      y += 31;
    }
  }

  // --- 5. KEY TECHNICAL HIGHLIGHTS ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text('Technical Signals Quick Reference', margin, y);
  y += 6;

  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, y, contentWidth, 22, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);

  const col1 = margin + 4;
  const col2 = margin + 50;
  const col3 = margin + 100;
  const col4 = margin + 145;

  doc.text(`• Word Count: ${report.summaryMetrics.wordCount} words`, col1, y + 6);
  doc.text(`• Images: ${report.summaryMetrics.imagesCount} (${report.summaryMetrics.imagesMissingAlt} missing alt)`, col1, y + 12);
  doc.text(`• H1 Headings: ${report.summaryMetrics.h1Count} found`, col1, y + 18);

  doc.text(`• Robots.txt: ${report.summaryMetrics.hasRobotsTxt ? 'Present' : 'Not found'}`, col2, y + 6);
  doc.text(`• Sitemap.xml: ${report.summaryMetrics.hasSitemapXml ? 'Detected' : 'Not found'}`, col2, y + 12);
  doc.text(`• HTTPS SSL: ${report.summaryMetrics.isHttps ? 'Valid' : 'Insecure'}`, col2, y + 18);

  doc.text(`• Local Schema: ${report.summaryMetrics.hasLocalSchema ? 'Configured' : 'Missing'}`, col3, y + 6);
  doc.text(`• Phone Number: ${report.summaryMetrics.hasPhone ? 'Visible' : 'Not detected'}`, col3, y + 12);
  doc.text(`• Address / Map: ${report.summaryMetrics.hasAddress ? 'Detected' : 'Not found'}`, col3, y + 18);

  doc.text(`• Viewport: ${report.summaryMetrics.hasViewport ? 'Responsive' : 'Missing'}`, col4, y + 6);
  doc.text(`• Redirects: ${report.summaryMetrics.redirectsCount} hops`, col4, y + 12);
  doc.text(`• Server Code: ${report.summaryMetrics.statusCode} OK`, col4, y + 18);

  y += 28;

  // --- FOOTER DISCLAIMER ---
  checkPageBreak(16);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Notice: This audit is an on-page and technical analysis based on direct HTTP crawling of public web pages. It provides diagnostic insights for best practices and does not claim to track proprietary Google keyword positions or private search analytics.',
    margin,
    y,
    { maxWidth: contentWidth }
  );

  if (!options?.skipSave) {
    const sanitizedDomain = report.domain.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`TapGrow_SEO_Audit_${sanitizedDomain}_${fileDateStr}.pdf`);
  }

  return doc;
}
