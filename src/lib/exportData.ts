import { SavedPlanState } from '../types/storage';
import { formatDate } from '../locales/i18n';

/**
 * Initiates a browser download of the plan as a clean JSON file.
 */
export function exportPlanToJson(plan: SavedPlanState): void {
  try {
    const bizName = plan.answers.businessName
      ? plan.answers.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30)
      : 'local_business';
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${bizName}_growth_plan_${dateStr}.json`;

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  } catch (err) {
    console.error('Failed to export JSON:', err);
    throw new Error('Unable to trigger file download in this browser.');
  }
}

/**
 * Generates a standalone, beautiful HTML report that can be opened in any browser
 * and printed or saved as PDF natively with Ctrl+P / Cmd+P.
 */
export function generatePrintableHtml(plan: SavedPlanState): string {
  const bizName = plan.answers.businessName?.trim() || 'Local Business';
  const location = [plan.answers.cityArea, plan.answers.country].filter(Boolean).join(', ');
  const dateFormatted = formatDate(plan.lastUpdated);

  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const progressPct = plan.tasks.length > 0 ? Math.round((completedCount / plan.tasks.length) * 100) : 0;

  const taskRows = plan.tasks
    .map((task, idx) => {
      const isDone = task.status === 'completed';
      const stepsHtml = task.instructions.map((step) => `<li>${step}</li>`).join('');
      const noteHtml = task.notes ? `<div class="note"><strong>Personal Note:</strong> ${task.notes}</div>` : '';

      return `
        <div class="task-card ${isDone ? 'task-done' : ''}">
          <div class="task-header">
            <div>
              <span class="task-priority priority-${task.priority.toLowerCase()}">${task.priority} Priority</span>
              <span class="task-meta">${task.category} · Effort: ${task.estimatedEffort} · ${task.suggestedTimeToComplete}</span>
            </div>
            <div class="task-status">${isDone ? '✓ Completed' : task.status === 'in_progress' ? '⏳ In Progress' : '○ Not Started'}</div>
          </div>
          <h3 class="task-title">${idx + 1}. ${task.title}</h3>
          <p class="task-summary">${task.summary}</p>
          <div class="task-why"><strong>Why it matters:</strong> ${task.whyItMatters}</div>
          <div class="task-steps">
            <strong>Action Steps:</strong>
            <ol>${stepsHtml}</ol>
          </div>
          <div class="task-criteria"><strong>Completion Criteria:</strong> ${task.completionCriteria}</div>
          ${noteHtml}
        </div>
      `;
    })
    .join('');

  const strengthsHtml = plan.scoreResult.strengths
    .map((s) => `<li>✓ ${s}</li>`)
    .join('');

  const gapsHtml = plan.scoreResult.gaps
    .map((g) => `<li>→ ${g}</li>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${bizName} – Local Marketing Growth Plan</title>
  <style>
    @page { margin: 1.5cm; size: A4; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #17242B;
      background: #FFFFFF;
      line-height: 1.5;
      padding: 20px;
      max-width: 900px;
      margin: 0 auto;
    }
    .header {
      border-bottom: 2px solid #16866F;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .biz-name { font-size: 26px; font-weight: 800; color: #142A36; margin: 0; }
    .doc-subtitle { font-size: 13px; color: #64727A; margin-top: 4px; }
    .kpi-row {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }
    .kpi-card {
      flex: 1;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 12px 16px;
      background: #F8FAFC;
    }
    .kpi-title { font-size: 11px; text-transform: uppercase; color: #64727A; font-weight: 700; }
    .kpi-val { font-size: 22px; font-weight: 800; color: #142A36; margin-top: 2px; }
    .section-title { font-size: 16px; font-weight: 700; color: #142A36; margin-top: 28px; margin-bottom: 12px; border-bottom: 1px solid #E2E8F0; padding-bottom: 6px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .box { border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px; font-size: 12px; }
    .box h4 { margin: 0 0 8px 0; font-size: 13px; }
    .box ul { margin: 0; padding-left: 18px; color: #475569; }
    .task-card {
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 14px;
      page-break-inside: avoid;
      background: #FFFFFF;
    }
    .task-done { background: #F0FDF4; border-color: #86EFAC; }
    .task-header { display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; }
    .task-priority { font-weight: 700; margin-right: 8px; }
    .priority-high { color: #DC2626; }
    .priority-medium { color: #D97706; }
    .priority-low { color: #475569; }
    .task-meta { color: #64727A; }
    .task-status { font-weight: 700; color: #16866F; }
    .task-title { margin: 0 0 6px 0; font-size: 15px; color: #0F172A; }
    .task-summary { font-size: 12px; color: #334155; margin-bottom: 8px; }
    .task-why { font-size: 11px; color: #475569; background: #F1F5F9; padding: 6px 10px; border-radius: 6px; margin-bottom: 8px; }
    .task-steps { font-size: 11px; color: #334155; margin-bottom: 8px; }
    .task-steps ol { margin: 4px 0 0 0; padding-left: 20px; }
    .task-criteria { font-size: 11px; color: #64727A; }
    .note { font-size: 11px; margin-top: 8px; padding: 6px 10px; background: #FEF9C3; border-radius: 6px; color: #854D0E; }
    .footer { margin-top: 32px; border-top: 1px solid #E2E8F0; padding-top: 12px; text-align: center; font-size: 11px; color: #94A3B8; }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="biz-name">${bizName}</h1>
    <div class="doc-subtitle">
      Local Business Marketing Growth Plan · Location: ${location || 'Local Service'} · Generated: ${dateFormatted}
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi-card">
      <div class="kpi-title">Readiness Score</div>
      <div class="kpi-val">${plan.scoreResult.totalScore} / 100</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Action Items</div>
      <div class="kpi-val">${plan.tasks.length} Recommended</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-title">Completed Progress</div>
      <div class="kpi-val">${completedCount} of ${plan.tasks.length} (${progressPct}%)</div>
    </div>
  </div>

  <div class="grid-2">
    <div class="box">
      <h4 style="color: #16866F;">✓ Verified Marketing Strengths</h4>
      <ul>${strengthsHtml || '<li>No foundational strengths recorded yet.</li>'}</ul>
    </div>
    <div class="box">
      <h4 style="color: #D97706;">→ High-Priority Growth Gaps</h4>
      <ul>${gapsHtml || '<li>No critical gaps identified.</li>'}</ul>
    </div>
  </div>

  <h2 class="section-title">Prioritized Action Checklist</h2>
  <div class="tasks-container">
    ${taskRows}
  </div>

  <div class="footer">
    Generated with TapGrow · Plan • Improve • Grow · Free Local Business Marketing Workspace
  </div>

  <script>
    // Auto-trigger print dialog if opened in a dedicated window
    if (window.location.search.includes('autoprint=1')) {
      window.onload = function() { window.print(); };
    }
  </script>
</body>
</html>`;
}

/**
 * Downloads a standalone, styled HTML report that can be opened in any web browser
 * and printed / saved to PDF with 100% fidelity without any iframe restrictions.
 */
export function downloadPrintableHtmlReport(plan: SavedPlanState): void {
  try {
    const html = generatePrintableHtml(plan);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const bizName = plan.answers.businessName
      ? plan.answers.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30)
      : 'local_business';
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${bizName}_marketing_report_${dateStr}.html`;

    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', fileName);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    console.error('Failed to download printable HTML report:', err);
    throw new Error('Unable to download printable report file.');
  }
}

/**
 * Triggers browser print dialog for printing or Save as PDF.
 * Returns true if execution succeeded without throwing, or false if blocked by browser/iframe.
 */
export function printPlanReport(): boolean {
  if (typeof window !== 'undefined') {
    try {
      window.print();
      return true;
    } catch (err) {
      console.warn('Direct window.print() failed or blocked by iframe environment:', err);
      return false;
    }
  }
  return false;
}
