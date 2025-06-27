import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ApplicationFormData {
  // Step 1: Basic Info
  entityType: 'individual' | 'smsf' | 'company' | 'trust' | '';
  
  // Step 2: Entity Details
  entityName: string;
  australianBusinessNumber: string;
  isRegisteredForGST: boolean | null;
  holderIdentificationNumber: string;
  registeredAddress: string;
  
  // Step 3: Contact Details
  contactEmail: string;
  contactPhone: string;
  preferredContactMethod: 'email' | 'phone' | '';
  
  // Step 4: Identity Verification
  stripeIdentitySessionId: string;
  identityVerificationStatus: 'pending' | 'verified' | 'failed' | '';
  
  // Step 5: Investment Profile
  investmentExperience: 'beginner' | 'intermediate' | 'advanced' | '';
  riskTolerance: 'conservative' | 'moderate' | 'aggressive' | '';
  portfolioSize: string;
  investmentObjectives: string[];
  
  // Step 6: Additional Information
  taxResidency: string;
  beneficialOwnership: string;
  sourceOfFunds: string;
  additionalDocuments: File[];
  
  // Consent and Terms
  privacyPolicyAccepted: boolean;
  termsOfServiceAccepted: boolean;
  dataProcessingConsent: boolean;
  
  // Session Data
  sessionId: string;
  currentStep: number;
  isSubmitted: boolean;
  submittedAt: string | null;
}

interface ApplicationStore {
  formData: ApplicationFormData;
  updateFormData: (data: Partial<ApplicationFormData>) => void;
  resetForm: () => void;
  setCurrentStep: (step: number) => void;
  canProceedToStep: (step: number) => boolean;
}

const initialFormData: ApplicationFormData = {
  entityType: '',
  entityName: '',
  australianBusinessNumber: '',
  isRegisteredForGST: null,
  holderIdentificationNumber: '',
  registeredAddress: '',
  contactEmail: '',
  contactPhone: '',
  preferredContactMethod: '',
  stripeIdentitySessionId: '',
  identityVerificationStatus: '',
  investmentExperience: '',
  riskTolerance: '',
  portfolioSize: '',
  investmentObjectives: [],
  taxResidency: '',
  beneficialOwnership: '',
  sourceOfFunds: '',
  additionalDocuments: [],
  privacyPolicyAccepted: false,
  termsOfServiceAccepted: false,
  dataProcessingConsent: false,
  sessionId: '',
  currentStep: 1,
  isSubmitted: false,
  submittedAt: null,
};

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,
      
      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data }
        })),
      
      resetForm: () =>
        set({ formData: initialFormData }),
      
      setCurrentStep: (step) =>
        set((state) => ({
          formData: { ...state.formData, currentStep: step }
        })),
      
      canProceedToStep: (step) => {
        const { formData } = get();
        
        switch (step) {
          case 1:
            return true;
          case 2:
            return !!(formData.privacyPolicyAccepted && 
                     formData.termsOfServiceAccepted && 
                     formData.dataProcessingConsent);
          case 3:
            return !!(formData.entityType && 
                     formData.entityName && 
                     formData.isRegisteredForGST !== null && 
                     formData.registeredAddress);
          case 4:
            return !!(formData.contactEmail && 
                     formData.contactPhone && 
                     formData.preferredContactMethod);
          case 5:
            return formData.identityVerificationStatus === 'verified';
          case 6:
            return !!(formData.investmentExperience && 
                     formData.riskTolerance && 
                     formData.portfolioSize);
          default:
            return false;
        }
      },
    }),
    {
      name: 'portfolio-guardian-application',
      partialize: (state) => ({ formData: state.formData }),
    }
  )
); 