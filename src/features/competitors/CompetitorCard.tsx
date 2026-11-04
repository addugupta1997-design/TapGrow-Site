import React from 'react';
import { CompetitorProfile, CompetitorVerificationStatus } from '../../types/competitor';
import {
  Globe,
  MapPin,
  ExternalLink,
  Edit3,
  Trash2,
  Plus,
  Star,
  CheckCircle2,
  AlertCircle,
  Clock,
  Tag,
  ShieldCheck,
  Share2,
  FileText,
  HelpCircle,
  Eye,
} from 'lucide-react';

interface CompetitorCardProps {
  competitor: CompetitorProfile;
  onEdit: (competitor: CompetitorProfile) => void;
  onDelete: (id: string) => void;
  onAddObservation: (competitor: CompetitorProfile) => void;
}

export const CompetitorCard: React.FC<CompetitorCardProps> = ({
  competitor,
  onEdit,
  onDelete,
  onAddObservation,
}) => {
  const getStatusBadge = (status: CompetitorVerificationStatus) => {
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
            N/A
          </span>
        );
      default:
        return (
          <span className="rounded bg-slate-100 dark:bg-[#223640] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
            Not checked
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-5 shadow-xs transition-all hover:border-slate-300 dark:hover:border-[#3A535D]">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-[#B5C5C7]">
                {competitor.categoryLabel || competitor.category.replace(/_/g, ' ')}
              </span>
              {getStatusBadge(competitor.websitePresence)}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-[#F2F7F5] leading-snug">
              {competitor.businessName}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#91A5A9]">
              <MapPin className="h-3 w-3" />
              <span>{competitor.cityOrArea}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0 text-slate-400">
            <button
              type="button"
              onClick={() => onEdit(competitor)}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-[#223640] hover:text-slate-700 dark:hover:text-[#F2F7F5] transition-colors"
              title="Edit profile"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Remove ${competitor.businessName} from your competitor list?`)) {
                  onDelete(competitor.id);
                }
              }}
              className="p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 transition-colors"
              title="Delete competitor"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Short Description */}
        {competitor.shortDescription && (
          <p className="mt-3 text-xs text-slate-600 dark:text-[#B5C5C7] leading-relaxed line-clamp-2">
            {competitor.shortDescription}
          </p>
        )}

        {/* Website & Value Proposition Box */}
        <div className="mt-4 rounded-xl bg-slate-50 dark:bg-[#223640] p-3 space-y-2 border border-slate-200/60 dark:border-[#304650]/80 text-xs">
          {competitor.websiteUrl && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-[#91A5A9] font-medium flex items-center gap-1">
                <Globe className="h-3 w-3" /> Website:
              </span>
              <a
                href={competitor.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#16866F] dark:text-[#65D6B2] font-semibold hover:underline flex items-center gap-1 max-w-[170px] truncate"
              >
                <span className="truncate">{competitor.websiteUrl.replace(/^https?:\/\//, '')}</span>
                <ExternalLink className="h-2.5 w-2.5 shrink-0" />
              </a>
            </div>
          )}

          {competitor.communicatedValueProp && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9] block">
                Stated Value Proposition
              </span>
              <p className="text-slate-800 dark:text-[#F2F7F5] font-medium italic mt-0.5">
                "{competitor.communicatedValueProp}"
              </p>
            </div>
          )}

          {competitor.primaryCta && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/50 dark:border-[#304650]">
              <span className="text-slate-500 dark:text-[#91A5A9]">Primary CTA:</span>
              <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] truncate max-w-[180px]">
                {competitor.primaryCta}
              </span>
            </div>
          )}
        </div>

        {/* Public Review Signals (if observed) */}
        {competitor.reviewRating && (
          <div className="mt-3 flex items-center justify-between text-xs bg-amber-50/50 dark:bg-amber-950/20 rounded-lg px-2.5 py-1.5 border border-amber-200/60 dark:border-amber-900/40">
            <span className="flex items-center gap-1 font-bold text-amber-900 dark:text-[#E9A23B]">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {competitor.reviewRating} / 5.0
            </span>
            <span className="text-[11px] text-slate-500 dark:text-[#91A5A9]">
              ({competitor.reviewCount || 0} reviews)
            </span>
          </div>
        )}

        {/* Promoted Services Tags */}
        {competitor.visibleServices && competitor.visibleServices.length > 0 && (
          <div className="mt-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#91A5A9] block mb-1">
              Promoted Services
            </span>
            <div className="flex flex-wrap gap-1">
              {competitor.visibleServices.slice(0, 3).map((srv, idx) => (
                <span
                  key={idx}
                  className="rounded bg-slate-100 dark:bg-[#223640] px-2 py-0.5 text-[10px] text-slate-700 dark:text-[#B5C5C7]"
                >
                  {srv}
                </span>
              ))}
              {competitor.visibleServices.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{competitor.visibleServices.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer & Direct Observations */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#304650] flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-[#91A5A9] text-[11px]">
          {competitor.observations?.length || 0} research {competitor.observations?.length === 1 ? 'observation' : 'observations'}
        </span>

        <button
          type="button"
          onClick={() => onAddObservation(competitor)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#16866F] dark:text-[#65D6B2] hover:underline"
        >
          <Plus className="h-3 w-3" />
          <span>Add Observation</span>
        </button>
      </div>
    </div>
  );
};
