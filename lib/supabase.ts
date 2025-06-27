import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role key
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
export interface Application {
  id: string
  session_id: string
  entity_type: string
  entity_name: string
  australian_business_number?: string
  is_registered_for_gst: boolean
  holder_identification_number?: string
  registered_address: string
  contact_email: string
  contact_phone: string
  preferred_contact_method: string
  stripe_identity_session_id?: string
  identity_verification_status: string
  investment_experience?: string
  risk_tolerance?: string
  portfolio_size?: string
  investment_objectives?: string[]
  tax_residency?: string
  beneficial_ownership?: string
  source_of_funds?: string
  privacy_policy_accepted: boolean
  terms_of_service_accepted: boolean
  data_processing_consent: boolean
  is_submitted: boolean
  submitted_at?: string
  created_at: string
  updated_at: string
}

export interface ApplicationDocument {
  id: string
  application_id: string
  document_type: string
  file_path: string
  file_name: string
  file_size: number
  mime_type: string
  uploaded_at: string
} 