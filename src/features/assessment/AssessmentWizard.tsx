import React, { useState } from 'react';
import { AssessmentAnswers, ValidationError } from '../../types/assessment';
import { SavedPlanState } from '../../types/storage';
import { Step1Basics } from './Step1Basics';
import { Step2OnlinePresence } from './Step2OnlinePresence';
import { Step3Foundations } from './Step3Foundations';
import { Step4Goals } from './Step4Goals';
import { ProgressBar } from '../../components/ProgressBar';
import { validateStep1, validateStep2, validateStep3, validateStep4, sanitizeText } from '../../lib/validation';
import { calculateReadinessScore } from '../recommendations/scoring';
import { generateRecommendations } from '../recommendations/generateRecommendations';
import { savePlanToStorage } from '../../lib/storage';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { AssessmentStepIllustration } from '../../components/graphics/AssessmentStepIllustration';

interface AssessmentWizardProps {
  initialAnswers?: AssessmentAnswers;
  onComplete: (plan: SavedPlanState) => void;
  onCancel: () => void;
}

export const AssessmentWizard: React.FC<AssessmentWizardProps> = ({
  initialAnswers,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<Partial<AssessmentAnswers>>(() => {
    return (
      initialAnswers || {
        category: 'retail',
        country: '',
        cityArea: '',
        businessModel: 'physical',
        hasWebsite: 'yes',
        hasBusinessListing: 'yes',
        socialPresence: 'one',
        discoveryMethods: ['word_of_mouth', 'walk_in'],
        contactConsistent: 'yes',
        askForReviews: 'no',
        websiteDetailsClear: 'not_sure',
        clearConversionAction: 'yes',
        publishesContent: 'no',
        tracksMarketing: 'no',
        mainGoal: 'local_visibility',
        weeklyHours: '1_to_3h',
        budgetPreference: 'free_only',
        preferredFocus: 'all',
      }
    );
  });

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const handleFieldChange = (field: keyof AssessmentAnswers, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for field if fixed
    setValidationErrors((prev) => prev.filter((e) => e.field !== field));
  };

  const handleNext = () => {
    let errors: ValidationError[] = [];
    if (currentStep === 1) {
      errors = validateStep1(formData);
    } else if (currentStep === 2) {
      errors = validateStep2(formData);
    } else if (currentStep === 3) {
      errors = validateStep3(formData);
    } else if (currentStep === 4) {
      errors = validateStep4(formData);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finalize and generate plan
      submitAssessment();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setValidationErrors([]);
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  const submitAssessment = () => {
    const cleanAnswers: AssessmentAnswers = {
      businessName: sanitizeText(formData.businessName),
      category: formData.category || 'retail',
      country: sanitizeText(formData.country),
      cityArea: sanitizeText(formData.cityArea),
      businessModel: formData.businessModel || 'physical',
      targetCustomers: sanitizeText(formData.targetCustomers),
      hasWebsite: formData.hasWebsite || 'yes',
      websiteUrl: formData.websiteUrl?.trim() || '',
      hasBusinessListing: formData.hasBusinessListing || 'yes',
      socialPresence: formData.socialPresence || 'one',
      mainSocialPlatforms: formData.mainSocialPlatforms || [],
      discoveryMethods: formData.discoveryMethods || ['word_of_mouth'],
      contactConsistent: formData.contactConsistent || 'yes',
      askForReviews: formData.askForReviews || 'no',
      websiteDetailsClear: formData.websiteDetailsClear || 'not_sure',
      publishesContent: formData.publishesContent || 'no',
      tracksMarketing: formData.tracksMarketing || 'no',
      clearConversionAction: formData.clearConversionAction || 'yes',
      mainGoal: formData.mainGoal || 'local_visibility',
      weeklyHours: formData.weeklyHours || '1_to_3h',
      budgetPreference: formData.budgetPreference || 'free_only',
      preferredFocus: formData.preferredFocus || 'all',

      // Category-specific conditional answers
      restaurantOnlineMenu: formData.restaurantOnlineMenu,
      restaurantHoursLocationClear: formData.restaurantHoursLocationClear,
      restaurantDietaryOptionsListed: formData.restaurantDietaryOptionsListed,
      salonServicePriceListOnline: formData.salonServicePriceListOnline,
      salonOnlineBookingAvailable: formData.salonOnlineBookingAvailable,
      clinicAppointmentInfoClear: formData.clinicAppointmentInfoClear,
      clinicCredentialsInsuranceClear: formData.clinicCredentialsInsuranceClear,
      homeServiceAreaClarified: formData.homeServiceAreaClarified,
      homeServiceEmergencyOrQuoteForm: formData.homeServiceEmergencyOrQuoteForm,
      retailProductDiscoveryOnline: formData.retailProductDiscoveryOnline,
      retailStoreHoursParkingClear: formData.retailStoreHoursParkingClear,
      professionalCaseStudiesOrBio: formData.professionalCaseStudiesOrBio,
      professionalInitialConsultationOffer: formData.professionalInitialConsultationOffer,

      completedAt: new Date().toISOString(),
    };

    // Calculate score & recommendations deterministically
    const scoreResult = calculateReadinessScore(cleanAnswers);
    const tasks = generateRecommendations(cleanAnswers);

    const planState: SavedPlanState = {
      schemaVersion: 1,
      lastUpdated: new Date().toISOString(),
      answers: cleanAnswers,
      scoreResult,
      tasks,
    };

    savePlanToStorage(planState);
    onComplete(planState);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Top progress and back button */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#91A5A9] hover:text-slate-800 dark:hover:text-[#F2F7F5] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>
          <div className="flex items-center gap-2">
            <AssessmentStepIllustration step={currentStep as 1 | 2 | 3 | 4} size={32} />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-[#91A5A9]">
              Step {currentStep} of 4
            </span>
          </div>
        </div>
        <ProgressBar currentStep={currentStep} totalSteps={4} />
      </div>

      {/* Step Container */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-[#304650] bg-white dark:bg-[#1D3039] p-6 shadow-sm sm:p-8">
        {currentStep === 1 && (
          <Step1Basics
            data={formData}
            errors={validationErrors}
            onChange={handleFieldChange}
          />
        )}
        {currentStep === 2 && (
          <Step2OnlinePresence
            data={formData}
            errors={validationErrors}
            onChange={handleFieldChange}
          />
        )}
        {currentStep === 3 && (
          <Step3Foundations
            data={formData}
            errors={validationErrors}
            onChange={handleFieldChange}
          />
        )}
        {currentStep === 4 && (
          <Step4Goals
            data={formData}
            errors={validationErrors}
            onChange={handleFieldChange}
          />
        )}

        {/* Form Navigation Controls */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-100 dark:border-[#304650] pt-6">
          <button
            type="button"
            onClick={handleBack}
            className="h-10 inline-flex items-center justify-center rounded-lg border border-slate-300 dark:border-[#304650] bg-white dark:bg-[#223640] px-4 text-xs font-semibold text-slate-700 dark:text-[#F2F7F5] hover:bg-slate-50 dark:hover:bg-[#29404A] transition-colors sm:text-sm"
          >
            {currentStep === 1 ? 'Back to Overview' : 'Previous Step'}
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#16866F] px-5 text-xs font-semibold text-white shadow-sm hover:bg-[#0F5C4D] dark:hover:bg-[#1A9B80] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16866F] sm:text-sm"
          >
            {currentStep === 4 ? (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate My Plan</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
