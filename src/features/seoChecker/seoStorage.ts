import { SeoAuditReport, AuditComparison, AuditFinding } from '../../types/seoChecker';

export const SEO_AUDIT_STORAGE_KEY = 'tapgrow_seo_audits_v1';

// In-memory fallback if localStorage is disabled/restricted
let inMemoryAudits: SeoAuditReport[] = [];

/**
 * Checks if localStorage is available safely
 */
function isStorageAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const testKey = '__tapgrow_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads all saved SEO audit reports, newest first
 */
export function loadSavedAudits(): SeoAuditReport[] {
  if (isStorageAvailable()) {
    try {
      const raw = window.localStorage.getItem(SEO_AUDIT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        }
      }
    } catch (err) {
      console.warn('Failed to parse saved SEO audits from localStorage:', err);
    }
  }
  return [...inMemoryAudits].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

/**
 * Saves or updates an audit report in storage
 */
export function saveAuditReport(report: SeoAuditReport): void {
  const existing = loadSavedAudits();
  const filtered = existing.filter((a) => a.id !== report.id);
  const updatedList = [report, ...filtered].slice(0, 30); // Keep last 30 reports

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(SEO_AUDIT_STORAGE_KEY, JSON.stringify(updatedList));
      return;
    } catch (err) {
      console.warn('Failed to save SEO audit to localStorage:', err);
    }
  }

  inMemoryAudits = updatedList;
}

/**
 * Gets a specific audit by ID
 */
export function getAuditById(id: string): SeoAuditReport | null {
  const audits = loadSavedAudits();
  return audits.find((a) => a.id === id) || null;
}

/**
 * Deletes a specific audit report
 */
export function deleteAuditReport(id: string): void {
  const existing = loadSavedAudits();
  const updatedList = existing.filter((a) => a.id !== id);

  if (isStorageAvailable()) {
    try {
      window.localStorage.setItem(SEO_AUDIT_STORAGE_KEY, JSON.stringify(updatedList));
      return;
    } catch (err) {
      console.warn('Failed to delete SEO audit from localStorage:', err);
    }
  }

  inMemoryAudits = updatedList;
}

/**
 * Clears all saved audit reports
 */
export function clearAuditStorage(): void {
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(SEO_AUDIT_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear SEO audits:', err);
    }
  }
  inMemoryAudits = [];
}

/**
 * Compares two audit reports (e.g. before & after fixing issues)
 */
export function compareAudits(previousReport: SeoAuditReport, currentReport: SeoAuditReport): AuditComparison {
  const scoreDelta = currentReport.overallScore - previousReport.overallScore;

  const prevFindingsMap = new Map(previousReport.findings.map((f) => [f.id, f]));
  const currFindingsMap = new Map(currentReport.findings.map((f) => [f.id, f]));

  const fixedFindings: AuditFinding[] = [];
  const newFindings: AuditFinding[] = [];
  const remainingIssues: AuditFinding[] = [];

  // Check which previous non-passing issues are now passed
  for (const [id, prev] of prevFindingsMap.entries()) {
    const curr = currFindingsMap.get(id);
    if ((prev.status === 'issue' || prev.status === 'warning') && curr && curr.status === 'pass') {
      fixedFindings.push(curr);
    } else if ((prev.status === 'issue' || prev.status === 'warning') && curr && (curr.status === 'issue' || curr.status === 'warning')) {
      remainingIssues.push(curr);
    }
  }

  // Check if any check went from pass/info to issue/warning
  for (const [id, curr] of currFindingsMap.entries()) {
    const prev = prevFindingsMap.get(id);
    if ((curr.status === 'issue' || curr.status === 'warning') && (!prev || prev.status === 'pass')) {
      newFindings.push(curr);
    }
  }

  return {
    previousReport,
    currentReport,
    scoreDelta,
    fixedFindings,
    newFindings,
    remainingIssues,
  };
}
