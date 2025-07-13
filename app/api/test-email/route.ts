import { NextRequest, NextResponse } from 'next/server'
import { 
  sendSecureNotification, 
  notifyApplicationSubmission
} from '@/lib/notifications'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, testData } = body

    // Basic validation
    if (!type) {
      return NextResponse.json({ error: 'Email type is required' }, { status: 400 })
    }

    // Default test data
    const defaultTestData = {
      referenceNumber: 'PG-TEST-2024',
      contact_email: to || 'test@example.com',
    }

    const mergedData = { ...defaultTestData, ...testData }

    let result: any

    switch (type) {
      case 'application-submission':
        // Test both client and admin emails
        result = await notifyApplicationSubmission('test-app-123', mergedData)
        break

      case 'client-thank-you':
        if (!to) {
          return NextResponse.json({ error: 'To email is required for client thank you emails' }, { status: 400 })
        }
        result = await sendSecureNotification({
          to,
          subject: `Application Received - Reference ${mergedData.referenceNumber}`,
          template: 'client-thank-you',
          data: mergedData
        })
        break

      case 'admin-notification':
        result = await sendSecureNotification({
          to: to || 'hello@portfolioguardian.com.au',
          subject: `New Application Submitted - ${mergedData.referenceNumber}`,
          template: 'admin-notification',
          data: mergedData
        })
        break

      case 'custom':
        if (!to) {
          return NextResponse.json({ error: 'To email is required for custom emails' }, { status: 400 })
        }
        result = await sendSecureNotification({
          to,
          subject: mergedData.subject || 'Test Email from PortfolioGuardian',
          template: mergedData.template || 'default',
          data: mergedData
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid email type. Use: application-submission, client-thank-you, admin-notification, or custom' }, { status: 400 })
    }

    const responseData: any = {
      success: result.success,
      message: result.success ? 'Email sent successfully' : 'Email failed to send',
      error: result.error || null
    }

    // Handle different response types
    if (result.data) {
      responseData.data = result.data
    }

    if (result.clientEmail || result.adminEmail) {
      responseData.details = {
        clientEmail: result.clientEmail,
        adminEmail: result.adminEmail
      }
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error sending test email:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
} 