import { Resend } from 'resend'
import { supabaseAdmin } from './supabase'

// Initialize Resend client only when needed to avoid build-time errors
function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

export interface NotificationData {
  to: string | string[]
  subject: string
  template: string
  data: Record<string, any>
}

export async function sendSecureNotification(notification: NotificationData) {
  try {
    const emailContent = generateEmailContent(notification.template, notification.data)
    
    // Send email using Resend
    const resend = getResendClient()
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@portfolioguardian.com',
      to: Array.isArray(notification.to) ? notification.to : [notification.to],
      subject: notification.subject,
      html: emailContent,
    })
    
    if (emailError) {
      console.error('Failed to send email:', emailError)
      throw new Error('Email delivery failed')
    }
    
    // Store notification in database for audit trail
    await supabaseAdmin
      .from('accounting_notifications')
      .insert([{
        to_email: Array.isArray(notification.to) ? notification.to.join(',') : notification.to,
        subject: notification.subject,
        template: notification.template,
        data: notification.data,
        status: 'sent',
        sent_at: new Date().toISOString(),
        resend_id: emailData?.id || null
      }])
    
    console.log('Email sent successfully:', {
      to: notification.to,
      subject: notification.subject,
      template: notification.template,
      resend_id: emailData?.id
    })
    
    return { success: true, data: emailData }
  } catch (error) {
    console.error('Failed to send notification:', error)
    
    // Store failed notification in database
    try {
      await supabaseAdmin
        .from('accounting_notifications')
        .insert([{
          to_email: Array.isArray(notification.to) ? notification.to.join(',') : notification.to,
          subject: notification.subject,
          template: notification.template,
          data: notification.data,
          status: 'failed',
          sent_at: new Date().toISOString(),
          error_message: error instanceof Error ? error.message : 'Unknown error'
        }])
    } catch (dbError) {
      console.error('Failed to log failed notification:', dbError)
    }
    
    return { success: false, error }
  }
}

function generateEmailContent(template: string, data: Record<string, any>): string {
  const baseStyles = `
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
  `
  
  const header = `
    <div class="header">
      <h1>PortfolioGuardian</h1>
      <p>Investment Management & Reporting Services</p>
    </div>
  `
  
  const footer = `
    <div class="footer">
      <p><strong>PortfolioGuardian Investment Management</strong></p>
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>If you need assistance, please contact us at hello@portfolioguardian.com.au</p>
    </div>
  `
  
  switch (template) {
    case 'client-thank-you':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Application Received</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <h2>Thank You for Your Application</h2>
              <p>We have successfully received your application and it is now being processed by our team.</p>
              
              <div class="reference-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Your Reference Number:</p>
                <p class="reference-number">${data.referenceNumber}</p>
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
            ${footer}
          </div>
        </body>
        </html>
      `
    
    case 'admin-notification':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Application Received</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <h2>New Application Received</h2>
              <p>A new client application has been submitted and is ready for review.</p>
              
              <div class="reference-box">
                <p style="margin: 0; color: #666; font-size: 14px;">Reference Number:</p>
                <p class="reference-number">${data.referenceNumber}</p>
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
            ${footer}
          </div>
        </body>
        </html>
      `
    

    default:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>PortfolioGuardian Notification</title>
          ${baseStyles}
        </head>
        <body>
          <div class="container">
            ${header}
            <div class="content">
              <h2>Notification from PortfolioGuardian</h2>
              <p>You have received a notification from PortfolioGuardian.</p>
              
              <div class="reference-box">
                <p>Reference: ${data.referenceNumber || 'N/A'}</p>
              </div>
            </div>
            ${footer}
          </div>
        </body>
        </html>
      `
  }
}

export async function notifyApplicationSubmission(applicationId: string, applicationData: any) {
  try {
    const referenceNumber = applicationData.reference_number;
    const clientEmail = applicationData.contact_email;

    // Send thank you email to client
    const clientNotification: NotificationData = {
      to: clientEmail,
      subject: `Application Received - Reference ${referenceNumber}`,
      template: 'client-thank-you',
      data: {
        referenceNumber
      }
    }

    // Send notification email to admin
    const adminNotification: NotificationData = {
      to: 'hello@portfolioguardian.com.au',
      subject: `New Application Submitted - ${referenceNumber}`,
      template: 'admin-notification',
      data: {
        referenceNumber
      }
    }

    // Send both emails
    const clientResult = await sendSecureNotification(clientNotification)
    const adminResult = await sendSecureNotification(adminNotification)

    return {
      success: clientResult.success && adminResult.success,
      clientEmail: clientResult,
      adminEmail: adminResult
    }

  } catch (error) {
    console.error('Failed to send application submission notifications:', error)
    return { success: false, error }
  }
}

// Legacy function for backward compatibility
export async function notifyAccountingTeam(applicationId: string, applicationData: any) {
  return await notifyApplicationSubmission(applicationId, applicationData)
}

 