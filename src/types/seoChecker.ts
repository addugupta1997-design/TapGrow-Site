export type AuditStatus = 'pass' | 'warning' | 'issue' | 'info';

export type AuditCategory = 'health' | 'on_page' | 'technical' | 'local_seo' | 'content';

export type AuditImpact = 'high' | 'medium' | 'low';

export interface AuditFinding {
  id: string;
  category: AuditCategory;
  title: string;
  status: AuditStatus;
  impact: AuditImpact;
  observed: string;
  explanation: string;
  recommendation: string;
  howToFix: string[];
  effort: string;
  aiActionType?: 'meta_description' | 'title' | 'local_service_page' | 'technical_explainer';
}

export interface CategoryScore {
  category: AuditCategory;
  label: string;
  score: number; // 0 to 100
  weight: number; // e.g. 0.20
  passedCount: number;
  warningCount: number;
  issueCount: number;
  summary: string;
}

export interface RawAuditHighlights {
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  h1s: string[];
  h2Count: number;
  h3Count: number;
  totalImages: number;
  imagesMissingAlt: number;
  internalLinksCount: number;
  externalLinksCount: number;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  viewportTag?: string;
  charset?: string;
  lang?: string;
  detectedSchemas: string[]; // e.g. ['LocalBusiness', 'Organization']
  detectedPhone?: string;
  detectedEmail?: string;
  hasAddressIndicator: boolean;
  hasMapIndicator: boolean;
  hasContactPageLink: boolean;
  detectedCtas: string[];
  wordCount: number;
}

export interface SeoSummaryMetrics {
  responseTimeMs: number;
  isHttps: boolean;
  statusCode: number;
  wordCount: number;
  imagesCount: number;
  imagesMissingAlt: number;
  h1Count: number;
  hasRobotsTxt: boolean;
  hasSitemapXml: boolean;
  hasLocalSchema: boolean;
  hasPhone: boolean;
  hasAddress: boolean;
  hasViewport: boolean;
  redirectsCount: number;
}

export interface SeoAuditReport {
  id: string;
  url: string;
  normalizedUrl: string;
  domain: string;
  timestamp: string;
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  businessProfileUsed?: {
    name: string;
    cityArea: string;
    category: string;
  };
  categoryScores: Record<AuditCategory, CategoryScore>;
  findings: AuditFinding[];
  summaryMetrics: SeoSummaryMetrics;
  rawHighlights: RawAuditHighlights;
}

export interface AuditComparison {
  previousReport: SeoAuditReport;
  currentReport: SeoAuditReport;
  scoreDelta: number;
  fixedFindings: AuditFinding[];
  newFindings: AuditFinding[];
  remainingIssues: AuditFinding[];
}
