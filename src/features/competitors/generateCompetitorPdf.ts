import { jsPDF } from 'jspdf';
import { CompetitorProfile, CompetitiveOpportunity } from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';
import { formatDate } from '../../locales/i18n';

/**
 * Generates and downloads a branded PDF competitor intelligence report directly from the client.
 */
export function generateCompetitorPdfReport(
  answers: AssessmentAnswers,
  competitors: CompetitorProfile[],
  opportunities: CompetitiveOpportunity[],
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

  const bizName = answers.businessName || 'Local Business';
  const location = answers.cityArea || 'Local Market';
  const fileDateStr = new Date().toISOString().split('T')[0];
  const dateStr = formatDate(new Date().toISOString());

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
    doc.text('TAPGROW · COMPETITOR INTELLIGENCE & OPPORTUNITY REPORT', margin, y);
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
  doc.text(`Competitor Intelligence: ${bizName}`, margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(101, 214, 178); // Emerald #65D6B2
  const categoryLabel = (answers.category || 'Local Business').replace(/_/g, ' ');
  doc.text(`Market Area: ${location} · Industry: ${categoryLabel}`, margin + 6, y + 15);

  doc.setFontSize(8);
  doc.setTextColor(145, 165, 169);
  doc.text(
    `Researched on ${dateStr} · Tracking ${competitors.length} competitors · ${opportunities.length} market opportunities identified`,
    margin + 6,
    y + 20
  );

  y += 32;

  // --- 2. EXECUTIVE SUMMARY ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 42, 54);
  doc.text('Competitive Landscape Summary', margin + 6, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `This report analyzes public marketing signals, website offerings, and user observations across ${competitors.length} competitors in ${location}. Use these differentiation opportunities to capture more high-intent local customers.`,
    margin + 6,
    y + 13,
    { maxWidth: contentWidth - 12 }
  );

  y += 28;

  // --- 3. COMPETITOR PROFILES TABLE ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text('Tracked Competitors Overview', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Competitor Business', margin + 3, y + 5);
  doc.text('Website & Status', margin + 60, y + 5);
  doc.text('Primary CTA', margin + 115, y + 5);
  doc.text('Reviews (Observed)', margin + 152, y + 5);
  y += 7;

  for (const comp of competitors) {
    checkPageBreak(12);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, margin + contentWidth, y);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(20, 42, 54);
    doc.text(comp.businessName.slice(0, 30), margin + 3, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text(comp.websiteUrl ? comp.websiteUrl.replace(/^https?:\/\//, '').slice(0, 28) : 'No website', margin + 60, y + 4.5);

    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text(comp.primaryCta ? comp.primaryCta.slice(0, 22) : 'Not specified', margin + 115, y + 4.5);

    doc.text(
      comp.reviewRating ? `${comp.reviewRating}★ (${comp.reviewCount || 0})` : 'Not checked',
      margin + 152,
      y + 4.5
    );

    y += 7;
  }
  doc.line(margin, y, margin + contentWidth, y);
  y += 9;

  // --- 4. OPPORTUNITY ANALYSIS FINDINGS ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text('Strategic Differentiation Opportunities', margin, y);
  y += 6;

  for (const opp of opportunities) {
    checkPageBreak(32);

    const isHigh = opp.priority === 'high';
    doc.setFillColor(isHigh ? 254 : 255, isHigh ? 242 : 251, isHigh ? 242 : 235);
    doc.setDrawColor(isHigh ? 254 : 253, isHigh ? 202 : 230, isHigh ? 202 : 138);
    doc.roundedRect(margin, y, contentWidth, 26, 1.5, 1.5, 'FD');

    // Priority badge
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(isHigh ? 185 : 180, isHigh ? 28 : 83, isHigh ? 28 : 9);
    doc.text(`${opp.priority.toUpperCase()} PRIORITY`, margin + 4, y + 5.5);

    // Title
    doc.setFontSize(9);
    doc.setTextColor(20, 42, 54);
    doc.text(opp.title, margin + 35, y + 5.5);

    // Observation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Observation: ${opp.observation}`, margin + 4, y + 10.5, { maxWidth: contentWidth - 8 });

    // Suggested Action
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 134, 111);
    doc.text('Recommended Action:', margin + 4, y + 16);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(opp.suggestedAction, margin + 40, y + 16, { maxWidth: contentWidth - 44 });

    // Est. Effort
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Est. Effort: ${opp.estimatedEffort}`, margin + contentWidth - 28, y + 23);

    y += 29;
  }

  // --- FOOTER DISCLAIMER & LIMITATIONS ---
  checkPageBreak(18);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Important Limitations & Notice: This competitor intelligence report is compiled from publicly accessible website data, public local business listings, and user-entered research observations. It does not access private search analytics, proprietary ad spend, internal sales data, or private revenue metrics. All comparisons evaluate publicly verifiable information only.',
    margin,
    y,
    { maxWidth: contentWidth }
  );

  if (!options?.skipSave) {
    const sanitizedBiz = bizName.replace(/[^a-zA-Z0-9_-]/g, '_');
    doc.save(`TapGrow_Competitor_Intelligence_${sanitizedBiz}_${fileDateStr}.pdf`);
  }

  return doc;
}
