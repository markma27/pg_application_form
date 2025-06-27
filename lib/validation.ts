import { z } from 'zod'

// Step 1 validation
export const step1Schema = z.object({
  entityType: z.enum(['individual', 'smsf', 'company', 'trust'], {
    required_error: "Please select an entity type"
  })
})

// Step 2 validation
export const step2Schema = z.object({
  entityName: z.string().min(1, "Entity name is required").max(255),
  australianBusinessNumber: z.string().optional(),
  isRegisteredForGST: z.boolean({
    required_error: "Please specify GST registration status"
  }),
  holderIdentificationNumber: z.string().optional(),
  registeredAddress: z.string().min(1, "Registered address is required").max(500)
})

// Step 3 validation
export const step3Schema = z.object({
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(1, "Phone number is required").regex(
    /^[\+]?[1-9][\d]{0,15}$/,
    "Invalid phone number format"
  ),
  preferredContactMethod: z.enum(['email', 'phone', 'both'], {
    required_error: "Please select a preferred contact method"
  })
})

// Step 5 validation
export const step5Schema = z.object({
  investmentExperience: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: "Please select your investment experience level"
  }),
  riskTolerance: z.enum(['conservative', 'moderate', 'aggressive'], {
    required_error: "Please select your risk tolerance"
  }),
  portfolioSize: z.enum(['under-100k', '100k-500k', '500k-1m', '1m-5m', 'over-5m'], {
    required_error: "Please select your expected portfolio size"
  }),
  investmentObjectives: z.array(z.string()).optional()
})

// Complete application validation
export const applicationSchema = z.object({
  entityType: z.string(),
  step2Data: step2Schema,
  step3Data: step3Schema,
  step5Data: step5Schema,
  signature: z.string().optional(),
  privacyPolicyAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the privacy policy"
  }),
  termsOfServiceAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms of service"
  }),
  dataProcessingConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to data processing"
  })
})

export type Step1Data = z.infer<typeof step1Schema>
export type Step2Data = z.infer<typeof step2Schema>
export type Step3Data = z.infer<typeof step3Schema>
export type Step5Data = z.infer<typeof step5Schema>
export type ApplicationData = z.infer<typeof applicationSchema> 