import React, { useState } from 'react';
import { AssessmentAnswers } from '../../types/assessment';
import {
  X,
  Search,
  MapPin,
  Building2,
  Compass,
  ExternalLink,
  Plus,
  Info,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface CompetitorDiscoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  answers?: AssessmentAnswers;
  onSelectManualAdd: (prefill?: { name?: string; category?: string; city?: string }) => void;
}

export const CompetitorDiscoveryModal: React.FC<CompetitorDiscoveryModalProps> = ({
  isOpen,
  onClose,
  answers,
  onSelectManualAdd,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const city = answers?.cityArea || 'Local City';
  const categoryLabel = answers?.category ? answers.category.replace(/_/g, ' ') : 'Local Business';

  if (!isOpen) return null;

  const googleMapsSearchUrl = `https://www.google.com/maps/search/${encodeURIComponent(
    `${searchTerm || categoryLabel} in ${city}`
  )}`;

  const yelpSearchUrl = `https://www.yelp.com/search?find_desc=${encodeURIComponent(
    searchTerm || categoryLabel
  )}&find_loc=${encodeURIComponent(city)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="flex flex-col w-full max-w-xl max-h-[90vh] rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="discovery-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/70 dark:bg-[#172830]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h2 id="discovery-modal-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                Competitor Discovery Assistant
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Find and track local businesses competing in {city}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-[#F2F7F5] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Transparency Notice */}
          <div className="rounded-xl border border-emerald-100 dark:border-[#304650] bg-[#E0F5EE]/40 dark:bg-[#16866F]/15 p-3.5 text-xs text-slate-600 dark:text-[#B5C5C7] flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800 dark:text-[#F2F7F5]">Authentic Local Research</p>
              <p className="mt-0.5 leading-relaxed">
                TapGrow never invents fake competitors or pretends to run ungrounded crawler searches. Discover real public businesses in your market using the direct query links below, then add them to your tracking set.
              </p>
            </div>
          </div>

          {/* Search Term Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
              Refine Search Terms (Optional)
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`e.g. ${categoryLabel} in ${city}`}
                className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] pl-9 pr-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
              />
            </div>
          </div>

          {/* Quick Query Tools */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-[#F2F7F5] block">
              Direct Public Discovery Queries
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={googleMapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#223640] p-3 text-xs hover:border-[#16866F] transition-all"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#16866F] dark:text-[#65D6B2]" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-[#F2F7F5] block">Google Maps Search</span>
                    <span className="text-[11px] text-slate-500 dark:text-[#91A5A9]">Find local businesses near {city}</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>

              <a
                href={yelpSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#223640] p-3 text-xs hover:border-[#16866F] transition-all"
              >
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-red-500" />
                  <div>
                    <span className="font-bold text-slate-800 dark:text-[#F2F7F5] block">Local Directory Search</span>
                    <span className="text-[11px] text-slate-500 dark:text-[#91A5A9]">Inspect reviews and offerings</span>
                  </div>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Recommended Competitor Criteria */}
          <div className="rounded-xl bg-slate-50 dark:bg-[#223640] p-4 text-xs space-y-2">
            <span className="font-bold text-slate-900 dark:text-[#F2F7F5] block">
              Which competitors should you track?
            </span>
            <ul className="space-y-1.5 text-slate-600 dark:text-[#B5C5C7]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2] shrink-0 mt-0.5" />
                <span><strong>The Local Market Leader:</strong> The highest-reviewed business in your exact city.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2] shrink-0 mt-0.5" />
                <span><strong>The Direct Price/Service Peer:</strong> A business of similar size with comparable offerings.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16866F] dark:text-[#65D6B2] shrink-0 mt-0.5" />
                <span><strong>The Digital Innovator:</strong> A competitor with a modern website or strong social presence.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/70 dark:bg-[#172830] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectManualAdd({ city, category: answers?.category });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-4 py-2 text-xs font-bold text-white hover:bg-[#0F5C4D] shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Competitor Manually</span>
          </button>
        </div>
      </div>
    </div>
  );
};
