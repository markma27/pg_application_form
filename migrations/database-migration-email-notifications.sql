-- PortfolioGuardian Email Notifications Database Migration
-- Run this in your Supabase SQL editor to add email notification support

-- Add new fields to accounting_notifications table
ALTER TABLE accounting_notifications 
ADD COLUMN IF NOT EXISTS resend_id VARCHAR,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS retry_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_retry_at TIMESTAMP;

-- Update accounting_notifications table to support multiple recipients
ALTER TABLE accounting_notifications 
ALTER COLUMN to_email TYPE TEXT;

-- Create email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name VARCHAR NOT NULL UNIQUE,
  subject_template TEXT NOT NULL,
  html_template TEXT NOT NULL,
  text_template TEXT,
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create email queue table for failed emails
CREATE TABLE IF NOT EXISTS email_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  template TEXT NOT NULL,
  data JSONB NOT NULL,
  status VARCHAR DEFAULT 'pending',
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  next_retry_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  error_message TEXT
);

-- Create email statistics table
CREATE TABLE IF NOT EXISTS email_statistics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_name VARCHAR NOT NULL,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  complaint_count INTEGER DEFAULT 0,
  delivery_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(template_name, date)
);

-- Insert default email templates
INSERT INTO email_templates (template_name, subject_template, html_template, text_template, variables, is_active) VALUES
('client-thank-you', 
 'Application Received - Reference {{referenceNumber}}',
 '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Application Received</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background-color: white; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    .header { 
      background-color: #22c55e; 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 300; 
    }
    .header p { 
      margin: 5px 0 0 0; 
      font-size: 14px; 
      opacity: 0.9; 
    }
    .content { 
      padding: 40px 30px; 
    }
    .content h2 { 
      color: #22c55e; 
      margin-top: 0; 
      font-size: 24px; 
    }
    .reference-box { 
      background-color: #f8f9fa; 
      border-left: 4px solid #22c55e; 
      padding: 20px; 
      margin: 25px 0; 
      border-radius: 4px; 
    }
    .reference-number { 
      font-size: 20px; 
      font-weight: bold; 
      color: #22c55e; 
      margin: 0; 
    }
    .footer { 
      background-color: #f8f9fa; 
      padding: 20px 30px; 
      text-align: center; 
      color: #666; 
      font-size: 14px; 
      border-top: 1px solid #eee; 
    }
    .footer p { 
      margin: 5px 0; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PortfolioGuardian</h1>
      <p>Investment Management & Reporting Services</p>
    </div>
    <div class="content">
      <h2>Thank You for Your Application</h2>
      <p>We have successfully received your application and it is now being processed by our team.</p>
      
      <div class="reference-box">
        <p style="margin: 0; color: #666; font-size: 14px;">Your Reference Number:</p>
        <p class="reference-number">{{referenceNumber}}</p>
      </div>
      
      <p>Please keep this reference number for your records. You may need it for future correspondence.</p>
      
      <p><strong>What happens next?</strong></p>
      <ul>
        <li>Our team will review your application</li>
        <li>We will contact you if additional information is required</li>
        <li>You will receive an update on your application status soon</li>
      </ul>
      
      <p>Thank you for choosing PortfolioGuardian for your investment management needs.</p>
    </div>
    <div class="footer">
      <p><strong>PortfolioGuardian Investment Management</strong></p>
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>If you need assistance, please contact us at support@portfolioguardian.com.au</p>
    </div>
  </div>
</body>
</html>',
 'Application Received - Reference {{referenceNumber}}

Thank you for your application.

We have successfully received your application and it is now being processed by our team.

Your Reference Number: {{referenceNumber}}

Please keep this reference number for your records. You may need it for future correspondence.

What happens next?
- Our team will review your application
- We will contact you if additional information is required
- You will receive an update on your application status soon

Thank you for choosing PortfolioGuardian for your investment management needs.

---
PortfolioGuardian Investment Management
This is an automated notification. Please do not reply to this email.
If you need assistance, please contact us at support@portfolioguardian.com.au',
 '["referenceNumber"]'::jsonb,
 true),

('admin-notification',
 'New Application Submitted - {{referenceNumber}}',
 '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Application Received</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      line-height: 1.6; 
      color: #333; 
      margin: 0; 
      padding: 0; 
      background-color: #f5f5f5; 
    }
    .container { 
      max-width: 600px; 
      margin: 20px auto; 
      background-color: white; 
      border-radius: 8px; 
      overflow: hidden; 
      box-shadow: 0 2px 10px rgba(0,0,0,0.1); 
    }
    .header { 
      background-color: #22c55e; 
      color: white; 
      padding: 30px 20px; 
      text-align: center; 
    }
    .header h1 { 
      margin: 0; 
      font-size: 28px; 
      font-weight: 300; 
    }
    .header p { 
      margin: 5px 0 0 0; 
      font-size: 14px; 
      opacity: 0.9; 
    }
    .content { 
      padding: 40px 30px; 
    }
    .content h2 { 
      color: #22c55e; 
      margin-top: 0; 
      font-size: 24px; 
    }
    .reference-box { 
      background-color: #f8f9fa; 
      border-left: 4px solid #22c55e; 
      padding: 20px; 
      margin: 25px 0; 
      border-radius: 4px; 
    }
    .reference-number { 
      font-size: 20px; 
      font-weight: bold; 
      color: #22c55e; 
      margin: 0; 
    }
    .footer { 
      background-color: #f8f9fa; 
      padding: 20px 30px; 
      text-align: center; 
      color: #666; 
      font-size: 14px; 
      border-top: 1px solid #eee; 
    }
    .footer p { 
      margin: 5px 0; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>PortfolioGuardian</h1>
      <p>Investment Management & Reporting Services</p>
    </div>
    <div class="content">
      <h2>New Application Received</h2>
      <p>A new client application has been submitted and is ready for review.</p>
      
      <div class="reference-box">
        <p style="margin: 0; color: #666; font-size: 14px;">Reference Number:</p>
        <p class="reference-number">{{referenceNumber}}</p>
      </div>
      
      <p>Please log into the admin portal to review the application details.</p>
      
      <p><strong>Next Steps:</strong></p>
      <ul>
        <li>Review the application in the admin portal</li>
        <li>Verify any submitted documents</li>
        <li>Contact the client if additional information is needed</li>
        <li>Process the application according to company procedures</li>
      </ul>
    </div>
    <div class="footer">
      <p><strong>PortfolioGuardian Investment Management</strong></p>
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>If you need assistance, please contact us at support@portfolioguardian.com.au</p>
    </div>
  </div>
</body>
</html>',
 'New Application Submitted - {{referenceNumber}}

A new client application has been submitted and is ready for review.

Reference Number: {{referenceNumber}}

Please log into the admin portal to review the application details.

Next Steps:
- Review the application in the admin portal
- Verify any submitted documents
- Contact the client if additional information is needed
- Process the application according to company procedures

---
PortfolioGuardian Investment Management
This is an automated notification. Please do not reply to this email.
If you need assistance, please contact us at support@portfolioguardian.com.au',
 '["referenceNumber"]'::jsonb,
 true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);
CREATE INDEX IF NOT EXISTS idx_email_queue_next_retry ON email_queue(next_retry_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_created_at ON email_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_email_statistics_template_date ON email_statistics(template_name, date);
CREATE INDEX IF NOT EXISTS idx_accounting_notifications_resend_id ON accounting_notifications(resend_id);
CREATE INDEX IF NOT EXISTS idx_accounting_notifications_status ON accounting_notifications(status);

-- Enable Row Level Security (RLS)
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_statistics ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "email_templates_service_role" ON email_templates
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "email_queue_service_role" ON email_queue
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "email_statistics_service_role" ON email_statistics
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update email statistics
CREATE OR REPLACE FUNCTION update_email_statistics(
  p_template_name VARCHAR,
  p_event_type VARCHAR
)
RETURNS void AS $$
BEGIN
  INSERT INTO email_statistics (template_name, sent_count, failed_count, bounce_count, complaint_count, delivery_count, open_count, click_count)
  VALUES (p_template_name, 
          CASE WHEN p_event_type = 'sent' THEN 1 ELSE 0 END,
          CASE WHEN p_event_type = 'failed' THEN 1 ELSE 0 END,
          CASE WHEN p_event_type = 'bounce' THEN 1 ELSE 0 END,
          CASE WHEN p_event_type = 'complaint' THEN 1 ELSE 0 END,
          CASE WHEN p_event_type = 'delivery' THEN 1 ELSE 0 END,
          CASE WHEN p_event_type = 'open' THEN 1 ELSE 0 END,
          CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END)
  ON CONFLICT (template_name, date)
  DO UPDATE SET
    sent_count = email_statistics.sent_count + CASE WHEN p_event_type = 'sent' THEN 1 ELSE 0 END,
    failed_count = email_statistics.failed_count + CASE WHEN p_event_type = 'failed' THEN 1 ELSE 0 END,
    bounce_count = email_statistics.bounce_count + CASE WHEN p_event_type = 'bounce' THEN 1 ELSE 0 END,
    complaint_count = email_statistics.complaint_count + CASE WHEN p_event_type = 'complaint' THEN 1 ELSE 0 END,
    delivery_count = email_statistics.delivery_count + CASE WHEN p_event_type = 'delivery' THEN 1 ELSE 0 END,
    open_count = email_statistics.open_count + CASE WHEN p_event_type = 'open' THEN 1 ELSE 0 END,
    click_count = email_statistics.click_count + CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create function to retry failed emails
CREATE OR REPLACE FUNCTION retry_failed_emails()
RETURNS void AS $$
BEGIN
  UPDATE email_queue
  SET status = 'pending',
      next_retry_at = NOW() + INTERVAL '1 hour'
  WHERE status = 'failed' 
    AND retry_count < max_retries 
    AND (next_retry_at IS NULL OR next_retry_at <= NOW());
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_email_templates_updated_at 
  BEFORE UPDATE ON email_templates 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT ALL ON email_templates TO anon, authenticated;
GRANT ALL ON email_queue TO anon, authenticated;
GRANT ALL ON email_statistics TO anon, authenticated;

-- Comments for documentation
COMMENT ON TABLE email_templates IS 'Stores email templates for different notification types';
COMMENT ON TABLE email_queue IS 'Queue for managing email sending and retries';
COMMENT ON TABLE email_statistics IS 'Tracks email sending statistics and performance';
COMMENT ON COLUMN accounting_notifications.resend_id IS 'ID returned by Resend service';
COMMENT ON COLUMN accounting_notifications.error_message IS 'Error message if email sending failed';
COMMENT ON COLUMN accounting_notifications.retry_count IS 'Number of retry attempts';
COMMENT ON COLUMN accounting_notifications.last_retry_at IS 'Timestamp of last retry attempt'; 