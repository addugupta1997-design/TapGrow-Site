import React, { useState, useEffect } from 'react';
import { CompetitorProfile, CompetitorObservation } from '../../types/competitor';
import {
  X,
  Building2,
  Globe,
  MapPin,
  Star,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Eye,
  FileText,
} from 'lucide-react';

interface AddEditCompetitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (competitor: CompetitorProfile) => void;
  competitorToEdit?: CompetitorProfile | null;
  defaultCity?: string;
  defaultCategory?: string;
}

export const AddEditCompetitorModal: React.FC<AddEditCompetitorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  competitorToEdit,
  defaultCity = '',
  defaultCategory = 'other_local',
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'observations'>('profile');

  // Form Fields
  const [businessName, setBusinessName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [cityOrArea, setCityOrArea] = useState('');
  const [category, setCategory] = useState('other_local');
  const [listingUrl, setListingUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [communicatedValueProp, setCommunicatedValueProp] = useState('');
  const [primaryCta, setPrimaryCta] = useState('');
  const [servicesInput, setServicesInput] = useState('');
  const [contentThemesInput, setContentThemesInput] = useState('');
  const [reviewRating, setReviewRating] = useState<string>('');
  const [reviewCount, setReviewCount] = useState<string>('');
  const [researchNotes, setResearchNotes] = useState('');

  // Observation Form inside Modal
  const [newObsWhatWell, setNewObsWhatWell] = useState('');
  const [newObsServices, setNewObsServices] = useState('');
  const [newObsThemes, setNewObsThemes] = useState('');
  const [newObsOffers, setNewObsOffers] = useState('');
  const [newObsDifferent, setNewObsDifferent] = useState('');
  const [newObsOpportunities, setNewObsOpportunities] = useState('');
  const [newObsSourceUrl, setNewObsSourceUrl] = useState('');
  const [newObsSourceType, setNewObsSourceType] = useState<'website' | 'social_media' | 'local_listing' | 'in_store' | 'manual_review'>('website');

  const [existingObservations, setExistingObservations] = useState<CompetitorObservation[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (competitorToEdit) {
      setBusinessName(competitorToEdit.businessName);
      setWebsiteUrl(competitorToEdit.websiteUrl || '');
      setCityOrArea(competitorToEdit.cityOrArea || defaultCity);
      setCategory(competitorToEdit.category || defaultCategory);
      setListingUrl(competitorToEdit.listingUrl || '');
      setShortDescription(competitorToEdit.shortDescription || '');
      setCommunicatedValueProp(competitorToEdit.communicatedValueProp || '');
      setPrimaryCta(competitorToEdit.primaryCta || '');
      setServicesInput(competitorToEdit.visibleServices?.join(', ') || '');
      setContentThemesInput(competitorToEdit.contentThemes?.join(', ') || '');
      setReviewRating(competitorToEdit.reviewRating ? String(competitorToEdit.reviewRating) : '');
      setReviewCount(competitorToEdit.reviewCount ? String(competitorToEdit.reviewCount) : '');
      setResearchNotes(competitorToEdit.researchNotes || '');
      setExistingObservations(competitorToEdit.observations || []);
    } else {
      setBusinessName('');
      setWebsiteUrl('');
      setCityOrArea(defaultCity);
      setCategory(defaultCategory);
      setListingUrl('');
      setShortDescription('');
      setCommunicatedValueProp('');
      setPrimaryCta('');
      setServicesInput('');
      setContentThemesInput('');
      setReviewRating('');
      setReviewCount('');
      setResearchNotes('');
      setExistingObservations([]);
    }
    setFormError(null);
    setActiveTab('profile');
  }, [competitorToEdit, defaultCity, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const handleAddObservation = () => {
    if (!newObsWhatWell.trim() && !newObsOpportunities.trim() && !newObsDifferent.trim()) {
      return;
    }

    const obs: CompetitorObservation = {
      id: `obs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      competitorId: competitorToEdit?.id || 'temp',
      dateObserved: new Date().toISOString(),
      sourceType: newObsSourceType,
      sourceUrl: newObsSourceUrl.trim() || undefined,
      whatTheyDoWell: newObsWhatWell.trim() || undefined,
      promotedServices: newObsServices.trim() || undefined,
      contentThemes: newObsThemes.trim() || undefined,
      publicOffers: newObsOffers.trim() || undefined,
      whatMakesThemDifferent: newObsDifferent.trim() || undefined,
      opportunitiesSeen: newObsOpportunities.trim() || undefined,
    };

    setExistingObservations([obs, ...existingObservations]);
    setNewObsWhatWell('');
    setNewObsServices('');
    setNewObsThemes('');
    setNewObsOffers('');
    setNewObsDifferent('');
    setNewObsOpportunities('');
    setNewObsSourceUrl('');
  };

  const handleDeleteObservation = (id: string) => {
    setExistingObservations(existingObservations.filter((o) => o.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setFormError('Please enter a business name for the competitor.');
      return;
    }

    const parsedServices = servicesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedThemes = contentThemesInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const comp: CompetitorProfile = {
      id: competitorToEdit?.id || `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      businessName: businessName.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      category,
      categoryLabel: category.replace(/_/g, ' '),
      cityOrArea: cityOrArea.trim() || defaultCity || 'Local Market',
      listingUrl: listingUrl.trim() || undefined,
      shortDescription: shortDescription.trim() || undefined,
      communicatedValueProp: communicatedValueProp.trim() || undefined,
      primaryCta: primaryCta.trim() || undefined,
      visibleServices: parsedServices.length > 0 ? parsedServices : undefined,
      contentThemes: parsedThemes.length > 0 ? parsedThemes : undefined,
      reviewRating: reviewRating ? parseFloat(reviewRating) : undefined,
      reviewCount: reviewCount ? parseInt(reviewCount, 10) : undefined,
      reviewSource: reviewRating ? 'Observed Public Listing' : undefined,
      researchNotes: researchNotes.trim() || undefined,
      dateAdded: competitorToEdit?.dateAdded || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      websitePresence: websiteUrl.trim() ? 'verified' : 'not_available',
      listingPresence: listingUrl.trim() ? 'verified' : 'not_checked',
      socialPresence: 'not_checked',
      observations: existingObservations,
    };

    onSave(comp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="flex flex-col w-full max-w-2xl max-h-[92vh] rounded-2xl border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="competitor-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#304650] px-6 py-4 bg-slate-50/70 dark:bg-[#172830]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#16866F] text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <h2 id="competitor-modal-title" className="text-base font-bold text-slate-900 dark:text-[#F2F7F5]">
                {competitorToEdit ? 'Edit Competitor Profile' : 'Add Competitor Profile'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#91A5A9]">
                Record public marketing signals and direct research observations
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

        {/* Tabs: Profile vs Observations */}
        <div className="flex border-b border-slate-200 dark:border-[#304650] px-6 pt-2 bg-white dark:bg-[#1D3039] gap-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-[#16866F] text-[#16866F] dark:text-[#65D6B2]'
                : 'border-transparent text-slate-500 dark:text-[#91A5A9] hover:text-slate-700'
            }`}
          >
            Business & Website Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('observations')}
            className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'observations'
                ? 'border-[#16866F] text-[#16866F] dark:text-[#65D6B2]'
                : 'border-transparent text-slate-500 dark:text-[#91A5A9] hover:text-slate-700'
            }`}
          >
            <span>Research Observations</span>
            <span className="rounded-full bg-slate-100 dark:bg-[#223640] px-1.5 text-[10px] text-slate-600 dark:text-[#B5C5C7]">
              {existingObservations.length}
            </span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Business Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Blue Ridge HVAC"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    City / Service Area
                  </label>
                  <input
                    type="text"
                    value={cityOrArea}
                    onChange={(e) => setCityOrArea(e.target.value)}
                    placeholder="e.g. Denver, CO"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Business Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  >
                    <option value="restaurant_cafe">Restaurant & Cafe</option>
                    <option value="retail">Retail Shop</option>
                    <option value="salon_wellness">Salon & Spa</option>
                    <option value="health_clinic">Health Clinic</option>
                    <option value="home_trades">Home Services & Trades</option>
                    <option value="professional_services">Professional Services</option>
                    <option value="fitness">Fitness Studio</option>
                    <option value="other_local">Other Local Business</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Stated Value Proposition / Brand Promise
                </label>
                <input
                  type="text"
                  value={communicatedValueProp}
                  onChange={(e) => setCommunicatedValueProp(e.target.value)}
                  placeholder="e.g. Over 15 years local service with 100% satisfaction guarantee"
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Primary Call to Action (CTA)
                  </label>
                  <input
                    type="text"
                    value={primaryCta}
                    onChange={(e) => setPrimaryCta(e.target.value)}
                    placeholder="e.g. Call (555) 019-2834 or Book Online"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Google / Public Listing Link
                  </label>
                  <input
                    type="text"
                    value={listingUrl}
                    onChange={(e) => setListingUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  Promoted Services (comma-separated)
                </label>
                <input
                  type="text"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  placeholder="e.g. Furnace Repair, AC Replacement, Heat Pump, Emergency Maintenance"
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Public Review Rating (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={reviewRating}
                    onChange={(e) => setReviewRating(e.target.value)}
                    placeholder="e.g. 4.8"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                    Total Review Count (Optional)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={reviewCount}
                    onChange={(e) => setReviewCount(e.target.value)}
                    placeholder="e.g. 150"
                    className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#F2F7F5] mb-1">
                  General Research Notes
                </label>
                <textarea
                  rows={2}
                  value={researchNotes}
                  onChange={(e) => setResearchNotes(e.target.value)}
                  placeholder="Any general thoughts or observations about their local presence..."
                  className="w-full rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#223640] px-3 py-2 text-xs text-slate-800 dark:text-[#F2F7F5] focus:outline-none focus:ring-2 focus:ring-[#16866F]"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Add New Observation Box */}
              <div className="rounded-xl border border-slate-200 dark:border-[#304650] bg-slate-50/70 dark:bg-[#223640] p-4 space-y-3">
                <span className="text-xs font-bold text-slate-900 dark:text-[#F2F7F5] block">
                  Add Research Observation
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#B5C5C7] mb-1">
                      What are they doing well?
                    </label>
                    <input
                      type="text"
                      value={newObsWhatWell}
                      onChange={(e) => setNewObsWhatWell(e.target.value)}
                      placeholder="e.g. Clean mobile navigation, huge phone button"
                      className="w-full rounded-md border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#B5C5C7] mb-1">
                      What makes their business different?
                    </label>
                    <input
                      type="text"
                      value={newObsDifferent}
                      onChange={(e) => setNewObsDifferent(e.target.value)}
                      placeholder="e.g. Free filter replacement with every tune-up"
                      className="w-full rounded-md border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-[#B5C5C7] mb-1">
                    What opportunities do you see for your business?
                  </label>
                  <input
                    type="text"
                    value={newObsOpportunities}
                    onChange={(e) => setNewObsOpportunities(e.target.value)}
                    placeholder="e.g. They lack online booking; we can win customers who dislike phone calls."
                    className="w-full rounded-md border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2.5 py-1.5 text-xs text-slate-800 dark:text-[#F2F7F5]"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={newObsSourceType}
                      onChange={(e: any) => setNewObsSourceType(e.target.value)}
                      className="rounded border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] px-2 py-1 text-[11px] text-slate-700 dark:text-[#F2F7F5]"
                    >
                      <option value="website">Source: Website</option>
                      <option value="social_media">Source: Social Media</option>
                      <option value="local_listing">Source: Google Listing</option>
                      <option value="in_store">Source: In-Store</option>
                      <option value="manual_review">Source: Manual Review</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddObservation}
                    className="inline-flex items-center gap-1 rounded-md bg-[#16866F] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0F5C4D]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Attach Observation</span>
                  </button>
                </div>
              </div>

              {/* List of Existing Observations */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 dark:text-[#F2F7F5] block">
                  Recorded Observations ({existingObservations.length})
                </span>

                {existingObservations.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-[#91A5A9] italic py-2">
                    No observations added yet. Use the form above to record what you notice about this competitor.
                  </p>
                ) : (
                  existingObservations.map((obs) => (
                    <div
                      key={obs.id}
                      className="rounded-lg border border-slate-200 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-3 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-800 dark:text-[#F2F7F5] uppercase tracking-wider text-[10px]">
                          {obs.sourceType.replace(/_/g, ' ')} · {new Date(obs.dateObserved).toLocaleDateString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteObservation(obs.id)}
                          className="text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>

                      {obs.whatTheyDoWell && (
                        <p className="text-slate-700 dark:text-[#B5C5C7]">
                          <strong className="text-slate-900 dark:text-[#F2F7F5]">Doing well:</strong> {obs.whatTheyDoWell}
                        </p>
                      )}
                      {obs.opportunitiesSeen && (
                        <p className="text-[#0F5C4D] dark:text-[#65D6B2] font-medium">
                          <strong>Opportunity:</strong> {obs.opportunitiesSeen}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-[#304650] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-medium text-slate-600 dark:text-[#B5C5C7] hover:bg-slate-100 dark:hover:bg-[#223640]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#16866F] px-5 py-2 text-xs font-bold text-white hover:bg-[#0F5C4D] shadow-xs"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{competitorToEdit ? 'Save Changes' : 'Add Competitor'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
