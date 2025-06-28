import { supabaseAdmin } from './supabase'

export interface NotificationData {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}

export async function sendSecureNotification(notification: NotificationData) {
  try {
    // For now, we'll use a simple email service
    // In production, you might want to use Resend, SendGrid, or similar
    
    const emailContent = generateEmailContent(notification.template, notification.data)
    
    // Store notification in database for audit trail
    await supabaseAdmin
      .from('accounting_notifications')
      .insert([{
        to_email: notification.to,
        subject: notification.subject,
        template: notification.template,
        data: notification.data,
        status: 'sent',
        sent_at: new Date().toISOString()
      }])
    
    // In production, integrate with your email service here
    console.log('Notification sent:', {
      to: notification.to,
      subject: notification.subject,
      template: notification.template
    })
    
    return { success: true }
  } catch (error) {
    console.error('Failed to send notification:', error)
    return { success: false, error }
  }
}

function generateEmailContent(template: string, data: Record<string, any>): string {
  switch (template) {
    case 'new-application':
      return `
        <h2>New Application Submitted</h2>
        <p>A new application has been submitted and requires your review.</p>
        <ul>
          <li><strong>Application ID:</strong> ${data.applicationId}</li>
          <li><strong>Entity Name:</strong> ${data.entityName}</li>
          <li><strong>Entity Type:</strong> ${data.entityType}</li>
          <li><strong>Submitted:</strong> ${new Date(data.submittedAt).toLocaleString()}</li>
        </ul>
        <p><a href="${data.accessUrl}">View Application Details</a></p>
      `
    
    case 'application-updated':
      return `
        <h2>Application Updated</h2>
        <p>An application has been updated and may require your review.</p>
        <ul>
          <li><strong>Application ID:</strong> ${data.applicationId}</li>
          <li><strong>Updated:</strong> ${new Date(data.updatedAt).toLocaleString()}</li>
        </ul>
        <p><a href="${data.accessUrl}">View Application Details</a></p>
      `
    
    default:
      return `
        <h2>PortfolioGuardian Notification</h2>
        <p>You have received a notification from PortfolioGuardian.</p>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `
  }
}

export async function notifyAccountingTeam(applicationId: string, applicationData: any) {
  const notification: NotificationData = {
    to: process.env.ACCOUNTING_TEAM_EMAIL || 'accounting@portfolioguardian.com',
    subject: `New Application Submitted - ${applicationId}`,
    template: 'new-application',
    data: {
      applicationId,
      entityName: applicationData.entity_name,
      entityType: applicationData.entity_type,
      submittedAt: applicationData.submitted_at,
      accessUrl: `${process.env.NEXT_PUBLIC_APP_URL}/accounting/applications/${applicationId}`
    }
  }
  
  return await sendSecureNotification(notification)
} 