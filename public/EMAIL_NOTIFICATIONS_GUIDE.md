# 📧 Email Notification System Guide

## 📋 Overview

PortfolioGuardian application now includes a simple and secure email notification system. When someone submits an application, the system automatically sends:

1. **Thank you email** to the client's main contact email with reference ID only
2. **Notification email** to hello@portfolioguardian.com.au with reference ID only

**Security Note**: Neither email contains application details for security purposes.

## 🚀 Features

- ✅ **Automatic Notifications**: Emails sent automatically when applications are submitted
- ✅ **Security First**: No sensitive application details in emails
- ✅ **Professional Templates**: Clean, branded HTML email templates
- ✅ **Dual Notifications**: Both client and admin receive appropriate notifications
- ✅ **Audit Trail**: Complete email sending logs for compliance
- ✅ **Reliable Delivery**: Uses Resend service for high deliverability

## 🔧 Setup Instructions

### 1. Environment Configuration

Add the following environment variables to your `.env.local` file:

```env
# Resend API Key (Required)
RESEND_API_KEY=your_resend_api_key_here

# From Email Address (Required)
FROM_EMAIL=noreply@portfolioguardian.com

# Application URL (Required)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Get Resend API Key

1. Visit [Resend.com](https://resend.com)
2. Create an account and sign in
3. Go to API Keys section
4. Create a new API Key
5. Copy the API Key and add to environment variables

### 3. Domain Configuration

In the Resend console:
1. Add your sending domain (e.g., `portfolioguardian.com`)
2. Complete domain verification (add DNS records)
3. Ensure domain status shows "Verified"

### 4. Database Migration

Run the email notifications database migration in your Supabase SQL editor:

```sql
-- Run the migration file
database-migration-email-notifications.sql
```

## 📧 Email Types

### 1. Client Thank You Email
- **Sent to**: Client's main contact email
- **Triggered**: When application is submitted
- **Subject**: "Application Received - Reference [REFERENCE_ID]"
- **Content**: 
  - Thank you message
  - Reference number only
  - Next steps information
  - No application details

### 2. Admin Notification Email
- **Sent to**: hello@portfolioguardian.com.au
- **Triggered**: When application is submitted
- **Subject**: "New Application Submitted - [REFERENCE_ID]"
- **Content**:
  - New application notification
  - Reference number only
  - Admin portal reminder
  - No application details

## 🛠️ Testing the System

### Test Individual Email Types

```bash
# Test client thank you email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "client-thank-you",
    "to": "client@example.com",
    "testData": {
      "referenceNumber": "PG-TEST-2024"
    }
  }'

# Test admin notification email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "admin-notification",
    "to": "admin@example.com",
    "testData": {
      "referenceNumber": "PG-TEST-2024"
    }
  }'

# Test both emails (application submission)
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "type": "application-submission",
    "testData": {
      "referenceNumber": "PG-TEST-2024",
      "contact_email": "client@example.com"
    }
  }'
```

## 🔍 How It Works

### Application Submission Flow

1. **User submits application** through the form
2. **Application saved** to database with reference number
3. **Two emails sent automatically**:
   - Thank you email to client's contact email
   - Notification email to hello@portfolioguardian.com.au
4. **Email logs stored** in database for audit purposes

### Code Integration

The email system is automatically triggered in the application submission API:

```typescript
// In app/api/applications/route.ts
import { notifyApplicationSubmission } from '@/lib/notifications'

// After saving application to database
try {
  await notifyApplicationSubmission(applicationId, applicationData);
} catch (notificationError) {
  console.error('Failed to send notifications:', notificationError);
  // Application submission continues even if email fails
}
```

## 📊 Monitoring and Logs

### View Email Logs

```sql
-- View recent email notifications
SELECT 
  to_email,
  subject,
  template,
  status,
  sent_at,
  resend_id
FROM accounting_notifications 
ORDER BY sent_at DESC 
LIMIT 50;

-- Check for failed emails
SELECT * FROM accounting_notifications 
WHERE status = 'failed' 
ORDER BY sent_at DESC;
```

### Email Statistics

The system tracks email sending statistics for monitoring:

```sql
-- View daily email statistics
SELECT * FROM email_statistics 
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

## 🔧 Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check Resend API key is correct
   - Verify sending domain is verified in Resend
   - Check environment variables are set

2. **Emails going to spam**
   - Ensure domain verification is complete
   - Add SPF and DKIM records as instructed by Resend
   - Monitor sending reputation

3. **Missing emails**
   - Check email logs in database
   - Verify email addresses are valid
   - Check Resend dashboard for delivery status

### Debug Steps

```bash
# 1. Check environment variables
echo $RESEND_API_KEY
echo $FROM_EMAIL

# 2. Test email sending
npm run dev
# Then use the test API endpoints above

# 3. Check application logs
tail -f logs/application.log
```

## 🎯 Best Practices

### Security
- Never include sensitive application data in emails
- Only include reference numbers for identification
- Log all email activity for audit purposes
- Use encrypted environment variables in production

### Deliverability
- Use verified sending domains
- Monitor bounce and complaint rates
- Keep email content simple and professional
- Include clear unsubscribe options if required

### Error Handling
- Application submission should never fail due to email issues
- Log all email failures for investigation
- Implement retry mechanisms for critical notifications
- Monitor email delivery rates

## 📈 Performance Considerations

### Email Sending
- Emails are sent asynchronously to avoid delaying application submission
- Failed emails are logged but don't prevent application processing
- Consider rate limiting for high-volume periods

### Database
- Email logs are stored for audit purposes
- Consider archiving old email logs periodically
- Index email tables for better query performance

## 🔒 Security & Compliance

### Data Protection
- No personal data in email content
- Only reference numbers shared
- Full application details secured in admin portal
- Complete audit trail maintained

### GDPR Compliance
- Email notifications are operational necessity
- Client consent obtained during application process
- Clear data handling policies communicated

## 📚 API Reference

### Send Test Email

**Endpoint**: `POST /api/test-email`

**Parameters**:
- `type`: Email type (`client-thank-you`, `admin-notification`, `application-submission`)
- `to`: Recipient email address (optional for some types)
- `testData`: Additional test data (optional)

**Response**:
```json
{
  "success": true,
  "message": "Email sent successfully",
  "data": {
    "id": "resend_email_id"
  }
}
```

## 🆘 Support

For technical support:

1. Check this documentation
2. Review application logs
3. Test email functionality using provided endpoints
4. Contact development team if issues persist

---

**Production Checklist**:
- [ ] Resend API key configured
- [ ] Sending domain verified
- [ ] Database migration completed
- [ ] Email templates tested
- [ ] Monitoring configured
- [ ] Error handling verified 