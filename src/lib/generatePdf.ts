import { jsPDF } from 'jspdf';
import { SavedPlanState } from '../types/storage';
import { formatDate } from '../locales/i18n';

/**
 * Generates and downloads a pixel-perfect, professionally aligned PDF file directly from the browser.
 * Works 100% offline and bypasses all iframe/print dialog restrictions.
 */
export function generatePdfReport(
  plan: SavedPlanState,
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

  const bizName = plan.answers.businessName?.trim() || 'Local Business';
  const location = [plan.answers.cityArea, plan.answers.country].filter(Boolean).join(', ');
  const dateStr = formatDate(plan.lastUpdated) || new Date().toISOString().split('T')[0];
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
    doc.text('TAPGROW · PLAN • IMPROVE • GROW · ACTION REPORT', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(dateStr, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  // --- 1. COVER / HEADER BLOCK ---
  doc.setFillColor(16, 29, 36); // TapGrow Dark Navy #101D24
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text(bizName, margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(101, 214, 178); // Mint Accent #65D6B2
  doc.text(
    `TapGrow Action Plan · ${location || 'Local Business'} · Generated: ${dateStr}`,
    margin + 6,
    y + 16
  );

  y += 28;

  // --- 2. EXECUTIVE METRICS STRIP ---
  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const progressPct = plan.tasks.length > 0 ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  const colGap = 4;
  const colWidth = (contentWidth - colGap * 2) / 3;

  // Metric 1: Readiness Score
  doc.setFillColor(246, 248, 247);
  doc.roundedRect(margin, y, colWidth, 19, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, colWidth, 19, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 114, 122);
  doc.text('READINESS SCORE', margin + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(22, 134, 111); // Primary Green
  doc.text(`${plan.scoreResult.totalScore} / 100`, margin + 4, y + 14);

  // Metric 2: Total Actions
  const col2X = margin + colWidth + colGap;
  doc.setFillColor(246, 248, 247);
  doc.roundedRect(col2X, y, colWidth, 19, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col2X, y, colWidth, 19, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 114, 122);
  doc.text('RECOMMENDED TASKS', col2X + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(20, 42, 54);
  doc.text(`${plan.tasks.length} Actions`, col2X + 4, y + 14);

  // Metric 3: Progress
  const col3X = col2X + colWidth + colGap;
  doc.setFillColor(246, 248, 247);
  doc.roundedRect(col3X, y, colWidth, 19, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(col3X, y, colWidth, 19, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 114, 122);
  doc.text('PLAN PROGRESS', col3X + 4, y + 5.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(22, 134, 111);
  doc.text(`${progressPct}% (${completedCount}/${plan.tasks.length})`, col3X + 4, y + 14);

  y += 24;

  // --- 3. SCORE INTERPRETATION ---
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  const interpLines = doc.splitTextToSize(plan.scoreResult.interpretation, contentWidth);
  doc.text(interpLines, margin, y);
  y += interpLines.length * 4.2 + 3;

  // --- 4. STRENGTHS & GAPS (Dynamic Height, Proper Text Wrapping) ---
  checkPageBreak(40);
  const cardGap = 5;
  const halfWidth = (contentWidth - cardGap) / 2;
  const innerTextWidth = halfWidth - 8;

  const topStrengths = plan.scoreResult.strengths.slice(0, 3);
  const topGaps = plan.scoreResult.gaps.slice(0, 3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);

  // Measure wrapped heights
  let strengthWrappedLinesTotal = 0;
  if (topStrengths.length > 0) {
    topStrengths.forEach((s) => {
      const lines = doc.splitTextToSize(`• ${s}`, innerTextWidth);
      strengthWrappedLinesTotal += lines.length;
    });
  } else {
    strengthWrappedLinesTotal = 1;
  }

  let gapWrappedLinesTotal = 0;
  if (topGaps.length > 0) {
    topGaps.forEach((g) => {
      const lines = doc.splitTextToSize(`• ${g}`, innerTextWidth);
      gapWrappedLinesTotal += lines.length;
    });
  } else {
    gapWrappedLinesTotal = 1;
  }

  const maxLines = Math.max(strengthWrappedLinesTotal, gapWrappedLinesTotal, 2);
  const boxHeight = Math.max(28, 11 + maxLines * 4.2);

  // Strengths column
  doc.setFillColor(240, 253, 244); // light green
  doc.roundedRect(margin, y, halfWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(187, 247, 208);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, halfWidth, boxHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(22, 101, 52);
  doc.text('STRENGTHS IDENTIFIED', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  let strY = y + 11;
  if (topStrengths.length > 0) {
    topStrengths.forEach((s) => {
      const lines = doc.splitTextToSize(`• ${s}`, innerTextWidth);
      doc.text(lines, margin + 4, strY);
      strY += lines.length * 4.2;
    });
  } else {
    doc.text('No established foundations recorded yet.', margin + 4, strY);
  }

  // Gaps column
  const gapX = margin + halfWidth + cardGap;
  doc.setFillColor(254, 243, 199); // light amber
  doc.roundedRect(gapX, y, halfWidth, boxHeight, 2, 2, 'F');
  doc.setDrawColor(253, 230, 138);
  doc.setLineWidth(0.3);
  doc.roundedRect(gapX, y, halfWidth, boxHeight, 2, 2, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(146, 64, 14);
  doc.text('KEY GROWTH OPPORTUNITIES', gapX + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  let gapY = y + 11;
  if (topGaps.length > 0) {
    topGaps.forEach((g) => {
      const lines = doc.splitTextToSize(`• ${g}`, innerTextWidth);
      doc.text(lines, gapX + 4, gapY);
      gapY += lines.length * 4.2;
    });
  } else {
    doc.text('No critical gaps identified.', gapX + 4, gapY);
  }

  y += boxHeight + 8;

  // --- 5. ACTION ITEMS TITLE ---
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 42, 54);
  doc.text('ACTION CHECKLIST & IMPLEMENTATION STEPS', margin, y);
  y += 2.5;
  doc.setDrawColor(22, 134, 111);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 45, y);
  y += 6;

  // --- 6. RENDER EACH TASK ---
  plan.tasks.forEach((task, index) => {
    // Measure task contents
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const summaryLines = doc.splitTextToSize(task.summary, contentWidth - 8);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    const whyLines = doc.splitTextToSize(`Why it matters: ${task.whyItMatters}`, contentWidth - 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    let stepLinesCount = 0;
    const splitSteps = task.instructions.map((step, sIdx) => {
      const lines = doc.splitTextToSize(`${sIdx + 1}) ${step}`, contentWidth - 14);
      stepLinesCount += lines.length;
      return lines;
    });

    let noteLines: string[] = [];
    if (task.notes && task.notes.trim()) {
      noteLines = doc.splitTextToSize(`My Notes: ${task.notes.trim()}`, contentWidth - 12);
    }

    const totalTaskHeight =
      8 + // header row
      5 + // title
      summaryLines.length * 4 + 2 +
      (whyLines.length * 3.8 + 5) +
      4 + // action steps label
      stepLinesCount * 3.8 + 2 +
      (noteLines.length > 0 ? noteLines.length * 3.8 + 6 : 0) +
      4; // padding

    checkPageBreak(Math.min(totalTaskHeight, 60));

    const isCompleted = task.status === 'completed';
    const cardStartY = y;

    // Task card background
    doc.setFillColor(isCompleted ? 240 : 255, isCompleted ? 253 : 255, isCompleted ? 244 : 255);
    doc.setDrawColor(isCompleted ? 134 : 226, isCompleted ? 239 : 232, isCompleted ? 172 : 240);
    doc.setLineWidth(0.3);

    // Header row: Priority tag & Status
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (task.priority === 'High') {
      doc.setTextColor(220, 38, 38);
    } else if (task.priority === 'Medium') {
      doc.setTextColor(217, 119, 6);
    } else {
      doc.setTextColor(71, 85, 105);
    }
    doc.text(`[${task.priority.toUpperCase()} PRIORITY]`, margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 114, 122);
    doc.text(`·  ${task.category}  ·  Est. ${task.estimatedEffort}  ·  ${task.suggestedTimeToComplete}`, margin + 35, y + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    if (isCompleted) {
      doc.setTextColor(22, 134, 111);
      doc.text('✓ COMPLETED', pageWidth - margin - 4, y + 5, { align: 'right' });
    } else if (task.status === 'in_progress') {
      doc.setTextColor(217, 119, 6);
      doc.text('IN PROGRESS', pageWidth - margin - 4, y + 5, { align: 'right' });
    } else {
      doc.setTextColor(148, 163, 184);
      doc.text('NOT STARTED', pageWidth - margin - 4, y + 5, { align: 'right' });
    }

    y += 9;

    // Task Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${index + 1}. ${task.title}`, margin + 4, y);
    y += 4.5;

    // Summary
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    doc.text(summaryLines, margin + 4, y);
    y += summaryLines.length * 4 + 1;

    // Why it matters
    doc.setFillColor(241, 245, 249);
    const whyBoxHeight = whyLines.length * 3.8 + 3;
    doc.rect(margin + 4, y, contentWidth - 8, whyBoxHeight, 'F');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(whyLines, margin + 6, y + 3);
    y += whyBoxHeight + 3;

    // Action Steps
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text('Action Steps:', margin + 4, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    splitSteps.forEach((lines) => {
      checkPageBreak(lines.length * 3.8 + 2);
      doc.text(lines, margin + 7, y);
      y += lines.length * 3.8 + 0.5;
    });

    // Notes if any
    if (noteLines.length > 0) {
      y += 1.5;
      doc.setFillColor(254, 249, 195);
      const noteBoxHeight = noteLines.length * 3.8 + 3;
      doc.rect(margin + 4, y, contentWidth - 8, noteBoxHeight, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(133, 77, 14);
      doc.text(noteLines, margin + 6, y + 3);
      y += noteBoxHeight + 2;
    }

    // Draw boundary box around task
    const cardHeight = y - cardStartY + 3;
    doc.setDrawColor(isCompleted ? 134 : 226, isCompleted ? 239 : 232, isCompleted ? 172 : 240);
    doc.roundedRect(margin, cardStartY, contentWidth, cardHeight, 1.5, 1.5, 'S');

    y += 6;
  });

  // --- 7. ADD PAGE NUMBERS TO ALL PAGES ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Page ${i} of ${totalPages} · Local Business Growth Planner · 100% Client-Side Privacy`,
      pageWidth / 2,
      pageHeight - 8,
      { align: 'center' }
    );
  }

  // Trigger real file download unless skipSave is requested
  const cleanBizName = bizName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 25);
  const pdfFileName = `${cleanBizName}_growth_plan_${fileDateStr}.pdf`;
  if (!options?.skipSave) {
    doc.save(pdfFileName);
  }

  return doc;
}
