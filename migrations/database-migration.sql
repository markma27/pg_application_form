-- PortfolioGuardian Accounting Team Access System Database Migration
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Accounting Team Users Table
CREATE TABLE IF NOT EXISTS accounting_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'accounting_team',
  password_hash VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. API Keys for Accounting Team
CREATE TABLE IF NOT EXISTS accounting_api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES accounting_users(id) ON DELETE CASCADE,
  key_hash VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  last_used TIMESTAMP
);

-- 3. Enhanced Applications Table (add new fields)
ALTER TABLE applications ADD COLUMN IF NOT EXISTS accounting_reviewed BOOLEAN DEFAULT false;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS accounting_reviewed_at TIMESTAMP;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS accounting_reviewed_by UUID REFERENCES accounting_users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS accounting_status VARCHAR DEFAULT 'pending';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS accounting_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS priority VARCHAR DEFAULT 'normal';
ALTER TABLE applications ADD COLUMN IF NOT EXISTS last_updated_by UUID REFERENCES accounting_users(id);
ALTER TABLE applications ADD COLUMN IF NOT EXISTS bank_account_number JSONB;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS bsb JSONB;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS account_number JSONB;

-- 4. Accounting Notes Table
CREATE TABLE IF NOT EXISTS accounting_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accounting_users(id) ON DELETE CASCADE,
  notes TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Access Logs Table
CREATE TABLE IF NOT EXISTS accounting_access_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  user_id UUID REFERENCES accounting_users(id) ON DELETE CASCADE,
  action VARCHAR NOT NULL,
  accessed_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- 6. Notifications Table
CREATE TABLE IF NOT EXISTS accounting_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  to_email VARCHAR NOT NULL,
  subject VARCHAR NOT NULL,
  template VARCHAR NOT NULL,
  data JSONB,
  status VARCHAR DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT NOW()
);

-- 7. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event VARCHAR NOT NULL,
  application_id UUID,
  user_id VARCHAR,
  timestamp TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  details JSONB
);

-- Enable Row Level Security (RLS)
ALTER TABLE accounting_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounting_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_accounting_users_email ON accounting_users(email);
CREATE INDEX IF NOT EXISTS idx_accounting_users_active ON accounting_users(is_active);
CREATE INDEX IF NOT EXISTS idx_accounting_api_keys_hash ON accounting_api_keys(key_hash);
CREATE INDEX IF NOT EXISTS idx_accounting_api_keys_active ON accounting_api_keys(is_active);
CREATE INDEX IF NOT EXISTS idx_accounting_notes_application ON accounting_notes(application_id);
CREATE INDEX IF NOT EXISTS idx_accounting_notes_user ON accounting_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_accounting_access_logs_application ON accounting_access_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_accounting_access_logs_user ON accounting_access_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_accounting_access_logs_timestamp ON accounting_access_logs(accessed_at);
CREATE INDEX IF NOT EXISTS idx_accounting_notifications_application ON accounting_notifications(application_id);
CREATE INDEX IF NOT EXISTS idx_accounting_notifications_status ON accounting_notifications(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_application ON audit_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_applications_submitted ON applications(is_submitted);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON applications(submitted_at);

-- Create RLS Policies

-- Accounting Users - only service role can access
CREATE POLICY "accounting_users_service_role" ON accounting_users
  FOR ALL USING (auth.role() = 'service_role');

-- API Keys - only service role can access
CREATE POLICY "accounting_api_keys_service_role" ON accounting_api_keys
  FOR ALL USING (auth.role() = 'service_role');

-- Accounting Notes - users can only see notes for applications they have access to
CREATE POLICY "accounting_notes_view" ON accounting_notes
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "accounting_notes_insert" ON accounting_notes
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Access Logs - only service role can access
CREATE POLICY "accounting_access_logs_service_role" ON accounting_access_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Notifications - only service role can access
CREATE POLICY "accounting_notifications_service_role" ON accounting_notifications
  FOR ALL USING (auth.role() = 'service_role');

-- Audit Logs - only service role can access
CREATE POLICY "audit_logs_service_role" ON audit_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Applications - enhanced policies for accounting team
CREATE POLICY "applications_accounting_view" ON applications
  FOR SELECT USING (
    auth.role() = 'service_role' OR 
    (is_submitted = true AND auth.role() = 'authenticated')
  );

CREATE POLICY "applications_accounting_update" ON applications
  FOR UPDATE USING (auth.role() = 'service_role');

-- Insert sample accounting user (password: admin123)
INSERT INTO accounting_users (email, name, role, password_hash) VALUES 
('admin@portfolioguardian.com', 'Admin User', 'admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9')
ON CONFLICT (email) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_accounting_users_updated_at 
  BEFORE UPDATE ON accounting_users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accounting_notes_updated_at 
  BEFORE UPDATE ON accounting_notes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Clean up access logs older than 7 years
  DELETE FROM accounting_access_logs 
  WHERE accessed_at < NOW() - INTERVAL '7 years';
  
  -- Clean up audit logs older than 7 years
  DELETE FROM audit_logs 
  WHERE timestamp < NOW() - INTERVAL '7 years';
  
  -- Clean up notifications older than 1 year
  DELETE FROM accounting_notifications 
  WHERE sent_at < NOW() - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE accounting_users IS 'Accounting team users with access to application data';
COMMENT ON TABLE accounting_api_keys IS 'API keys for programmatic access to accounting data';
COMMENT ON TABLE accounting_notes IS 'Notes added by accounting team for applications';
COMMENT ON TABLE accounting_access_logs IS 'Audit trail of all accounting team access to applications';
COMMENT ON TABLE accounting_notifications IS 'Notifications sent to accounting team';
COMMENT ON TABLE audit_logs IS 'General audit trail for all system events';

-- Add missing columns to applications table for full form compatibility
ALTER TABLE applications ADD COLUMN IF NOT EXISTS tax_file_number VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS street_address TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS city VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS state VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS post_code VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_type VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_individual_first_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_individual_last_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_joint_first_name1 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_joint_last_name1 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_joint_first_name2 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_joint_last_name2 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_corporate_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS trustee_corporate_acn VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS main_contact_first_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS main_contact_last_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS main_contact_role VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS main_contact_preferred_contact VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS has_secondary_contact BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secondary_first_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secondary_last_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secondary_role VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secondary_email VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secondary_phone VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS secondary_preferred_contact VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_company_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_address VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_telephone VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_email VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_is_primary_contact BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_can_access_statements BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS adviser_can_deal_direct BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS annual_report VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS meeting_proxy VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS investment_offers VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS dividend_preference VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS account_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS bank_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS branch_name VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS signature1 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS signature2 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS date1 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS date2 VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS has_acknowledged BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS has_read_terms BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS has_accepted_privacy BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS has_confirmed_information BOOLEAN;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS final_signature VARCHAR;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS final_signature_date VARCHAR;

-- Add reference_number column for human readable IDs
ALTER TABLE applications ADD COLUMN IF NOT EXISTS reference_number VARCHAR UNIQUE;

-- Add account_number and bsb columns if they don't exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS account_number JSONB;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS bsb JSONB; 