import React from 'react';
import { CompetitorProfile, CompetitorVerificationStatus } from '../../types/competitor';
import { AssessmentAnswers } from '../../types/assessment';
import { SeoAuditReport } from '../../types/seoChecker';
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Star,
  Globe,
  Building2,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';

interface CompetitorComparisonTableProps {
  answers?: AssessmentAnswers;
  competitors: CompetitorProfile[];
  latestSeoAudit?: SeoAuditReport | null;
  onEditCompetitor: (competitor: CompetitorProfile) => void;
}

export const CompetitorComparisonTable: React.FC<CompetitorComparisonTableProps> = ({
  answers,
  competitors,
  latestSeoAudit,
  onEditCompetitor,
}) => {
  const userBizName = answers?.businessName || 'Your Business (You)';
  const userWebsite = answers?.websiteUrl || latestSeoAudit?.url || '';

  const renderBadge = (status: CompetitorVerificationStatus) => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-[#E0F5EE] dark:bg-[#16866F]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#16866F] dark:text-[#65D6B2]">
            <CheckCircle2 className="h-2.5 w-2.5" /> Verified
          </span>
        );
      case 'manually_entered':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-sky-100 dark:bg-sky-950/40 px-1.5 py-0.5 text-[10px] font-bold text-sky-800 dark:text-sky-300">
            Manual
          </span>
        );
      case 'not_available':
        return (
          <span className="rounded bg-slate-100 dark:bg-[#223640] px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:text-[#91A5A9]">
            Not Available
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-100 dark:bg-[#223640] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            Not Checked
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] overflow-hidden shadow-xs">
      <div className="p-4 border-b border-slate-200 dark:border-[#304650] bg-slate-50/60 dark:bg-[#172830] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#F2F7F5]">
            Side-by-Side Competitive Matrix
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
            Comparing publicly observable signals and user-entered research observations
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-[#91A5A9]">
          <span className="flex items-center gap-1">{renderBadge('verified')} Real Audit / Public</span>
          <span className="flex items-center gap-1">{renderBadge('manually_entered')} User Research</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#304650] bg-slate-50/30 dark:bg-[#223640]/50">
              <th className="py-3.5 px-4 font-bold text-slate-700 dark:text-[#F2F7F5] w-48">
                Marketing Attribute
              </th>
              {/* User Business Column */}
              <th className="py-3.5 px-4 font-bold text-[#16866F] dark:text-[#65D6B2] bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 border-x border-emerald-100 dark:border-[#304650] min-w-[200px]">
                <div className="flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#16866F] text-white text-[10px]">★</span>
                  <span>{userBizName}</span>
                </div>
              </th>
              {/* Competitor Columns */}
              {competitors.map((comp) => (
                <th
                  key={comp.id}
                  className="py-3.5 px-4 font-bold text-slate-900 dark:text-[#F2F7F5] min-w-[190px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate max-w-[140px]">{comp.businessName}</span>
                    <button
                      type="button"
                      onClick={() => onEditCompetitor(comp)}
                      className="text-[10px] text-slate-400 hover:text-[#16866F] font-normal"
                    >
                      Edit
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-[#304650]">
            {/* 1. SECTION: BUSINESS PRESENCE */}
            <tr className="bg-slate-50/80 dark:bg-[#172830]">
              <td colSpan={competitors.length + 2} className="py-2 px-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
                A. Public Business Presence
              </td>
            </tr>

            {/* Website URL */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Website Presence</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                {userWebsite ? (
                  <div className="flex items-center gap-1.5">
                    {renderBadge('verified')}
                    <span className="truncate max-w-[140px]">{userWebsite.replace(/^https?:\/\//, '')}</span>
                  </div>
                ) : (
                  renderBadge('not_available')
                )}
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.websiteUrl ? (
                    <div className="flex items-center gap-1.5">
                      {renderBadge(comp.websitePresence)}
                      <a
                        href={comp.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#16866F] dark:text-[#65D6B2] hover:underline truncate max-w-[130px] flex items-center gap-1"
                      >
                        <span>{comp.websiteUrl.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                      </a>
                    </div>
                  ) : (
                    renderBadge('not_available')
                  )}
                </td>
              ))}
            </tr>

            {/* Google Business Listing */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Public Google Listing</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                {answers?.hasBusinessListing === 'yes' ? (
                  <span className="text-[#16866F] dark:text-[#65D6B2] font-semibold">✓ Claimed & Active</span>
                ) : (
                  <span className="text-amber-600 font-medium">Unclaimed / Pending</span>
                )}
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.listingUrl ? (
                    <a
                      href={comp.listingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#16866F] dark:text-[#65D6B2] hover:underline flex items-center gap-1"
                    >
                      <span>Public Listing</span>
                      <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                    </a>
                  ) : (
                    renderBadge(comp.listingPresence)
                  )}
                </td>
              ))}
            </tr>

            {/* 2. SECTION: WEBSITE & CONVERSION SIGNALS */}
            <tr className="bg-slate-50/80 dark:bg-[#172830]">
              <td colSpan={competitors.length + 2} className="py-2 px-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
                B. Website & Conversion Signals
              </td>
            </tr>

            {/* Primary CTA */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Primary Conversion CTA</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                {latestSeoAudit?.rawHighlights.detectedCtas?.[0] ? (
                  <span className="font-semibold text-slate-900 dark:text-[#F2F7F5]">
                    "{latestSeoAudit.rawHighlights.detectedCtas[0]}"
                  </span>
                ) : (
                  <span className="text-slate-500 italic">Call or Contact Form</span>
                )}
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.primaryCta ? (
                    <span className="font-medium text-slate-800 dark:text-[#F2F7F5]">"{comp.primaryCta}"</span>
                  ) : (
                    renderBadge('not_checked')
                  )}
                </td>
              ))}
            </tr>

            {/* Mobile Viewport */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Mobile Responsive</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                {latestSeoAudit?.summaryMetrics.hasViewport ? (
                  <span className="text-[#16866F] dark:text-[#65D6B2] font-semibold">✓ Verified Mobile-Ready</span>
                ) : (
                  <span className="text-slate-500">Not Audited</span>
                )}
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.mobileResponsive ? renderBadge(comp.mobileResponsive) : renderBadge('not_checked')}
                </td>
              ))}
            </tr>

            {/* 3. SECTION: POSITIONING & DIFFERENTIATION */}
            <tr className="bg-slate-50/80 dark:bg-[#172830]">
              <td colSpan={competitors.length + 2} className="py-2 px-4 font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
                C. Positioning & Brand Signals
              </td>
            </tr>

            {/* Value Proposition */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Communicated Value Proposition</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                <span className="italic text-slate-700 dark:text-[#B5C5C7]">
                  {answers?.targetCustomers || 'Reliable local service with community focus.'}
                </span>
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.communicatedValueProp ? (
                    <span className="italic text-slate-700 dark:text-[#B5C5C7]">"{comp.communicatedValueProp}"</span>
                  ) : (
                    renderBadge('not_checked')
                  )}
                </td>
              ))}
            </tr>

            {/* Public Review Ratings */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Public Review Proof</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                <span className="text-slate-700 dark:text-[#B5C5C7]">
                  {answers?.askForReviews === 'yes' ? 'Actively Collecting Reviews' : 'Developing Social Proof'}
                </span>
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.reviewRating ? (
                    <span className="font-semibold text-amber-700 dark:text-[#E9A23B] flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {comp.reviewRating}★ ({comp.reviewCount || 0})
                    </span>
                  ) : (
                    renderBadge('not_checked')
                  )}
                </td>
              ))}
            </tr>

            {/* Promoted Offers & Special Hooks */}
            <tr>
              <td className="py-3 px-4 font-semibold text-slate-700 dark:text-[#B5C5C7]">Promoted Offers / Hooks</td>
              <td className="py-3 px-4 bg-[#E0F5EE]/20 dark:bg-[#16866F]/10 border-x border-emerald-100 dark:border-[#304650]">
                <span className="text-slate-500 italic">Configure in Workspace</span>
              </td>
              {competitors.map((comp) => (
                <td key={comp.id} className="py-3 px-4">
                  {comp.promotedOffers ? (
                    <span className="font-medium text-[#16866F] dark:text-[#65D6B2]">{comp.promotedOffers}</span>
                  ) : (
                    renderBadge('not_available')
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
