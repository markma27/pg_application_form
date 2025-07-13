import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAccountingTeamAuth, logAccountingAccess } from '@/lib/auth'
import { decryptApplicationData } from '@/lib/encryption'
import { notifyAccountingTeam } from '@/lib/notifications'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify accounting team authentication
    const authResult = await verifyAccountingTeamAuth(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applicationId = params.id

    // Get application details
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Get application notes
    const { data: notes } = await supabaseAdmin
      .from('accounting_notes')
      .select('*')
      .eq('application_id', applicationId)
      .order('created_at', { ascending: false })

    // Log access
    await logAccountingAccess(applicationId, authResult.userId!, 'view_application', request)

    return NextResponse.json({
      application,
      notes: notes || []
    })

  } catch (error) {
    console.error('Error retrieving application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify accounting team authentication
    const authResult = await verifyAccountingTeamAuth(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applicationId = params.id
    const body = await request.json()
    const { action, status, notes, reason } = body

    // Get current application data
    const { data: application, error: fetchError } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Log the action
    await logAccountingAccess(applicationId, authResult.userId!, action, request)

    // Handle different actions
    switch (action) {
      case 'approve':
        // Update application status
        const { error: updateError } = await supabaseAdmin
          .from('applications')
          .update({ 
            accounting_status: 'approved',
            accounting_reviewed: true,
            accounting_reviewed_at: new Date().toISOString(),
            accounting_reviewed_by: authResult.userId,
            last_updated_by: authResult.userId
          })
          .eq('id', applicationId)

        if (updateError) {
          return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        // Note: Client approval notifications are handled separately if needed

        // Add approval note
        if (notes) {
          await supabaseAdmin
            .from('accounting_notes')
            .insert([{
              application_id: applicationId,
              user_id: authResult.userId,
              notes: `Application approved. ${notes}`,
              created_at: new Date().toISOString()
            }])
        }

        break

      case 'reject':
        // Update application status
        const { error: rejectError } = await supabaseAdmin
          .from('applications')
          .update({ 
            accounting_status: 'additional_info_required',
            accounting_reviewed: true,
            accounting_reviewed_at: new Date().toISOString(),
            accounting_reviewed_by: authResult.userId,
            last_updated_by: authResult.userId
          })
          .eq('id', applicationId)

        if (rejectError) {
          return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        // Note: Client rejection notifications are handled separately if needed

        // Add rejection note
        await supabaseAdmin
          .from('accounting_notes')
          .insert([{
            application_id: applicationId,
            user_id: authResult.userId,
            notes: `Additional information required. Reason: ${reason}. ${notes || ''}`,
            created_at: new Date().toISOString()
          }])

        break

      case 'update_status':
        // Update application status
        const { error: statusError } = await supabaseAdmin
          .from('applications')
          .update({ 
            accounting_status: status,
            accounting_reviewed: true,
            accounting_reviewed_at: new Date().toISOString(),
            accounting_reviewed_by: authResult.userId,
            last_updated_by: authResult.userId
          })
          .eq('id', applicationId)

        if (statusError) {
          return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }

        // Add status update note
        if (notes) {
          await supabaseAdmin
            .from('accounting_notes')
            .insert([{
              application_id: applicationId,
              user_id: authResult.userId,
              notes: `Status updated to: ${status}. ${notes}`,
              created_at: new Date().toISOString()
            }])
        }

        break

      case 'add_notes':
        // Add notes to application
        const { error: notesError } = await supabaseAdmin
          .from('accounting_notes')
          .insert([{
            application_id: applicationId,
            user_id: authResult.userId,
            notes,
            created_at: new Date().toISOString()
          }])

        if (notesError) {
          return NextResponse.json({ error: 'Failed to add notes' }, { status: 500 })
        }

        break

      case 'resend_notification':
        // Resend notification to accounting team
        try {
          await notifyAccountingTeam(applicationId, application)
        } catch (notificationError) {
          console.error('Failed to resend notification:', notificationError)
          return NextResponse.json({ error: 'Failed to resend notification' }, { status: 500 })
        }

        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing application update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 