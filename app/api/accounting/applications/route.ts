import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAccountingTeamAuth, logAccountingAccess } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Verify accounting team authentication
    const authResult = await verifyAccountingTeamAuth(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get applications with pagination
    const { data: applications, error, count } = await supabaseAdmin
      .from('applications')
      .select('id, reference_number, entity_name, entity_type, contact_email, submitted_at, created_at', { count: 'exact' })
      .eq('is_submitted', true)
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to retrieve applications' }, { status: 500 })
    }

    // Log access
    await logAccountingAccess('list', authResult.userId!, 'list_applications', request)

    return NextResponse.json({
      applications: applications || [],
      pagination: {
        total: count || 0
      }
    })

  } catch (error) {
    console.error('Error retrieving applications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify accounting team authentication
    const authResult = await verifyAccountingTeamAuth(request)
    if (!authResult.valid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, applicationId, notes } = body

    if (!action || !applicationId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Log the action
    await logAccountingAccess(applicationId, authResult.userId!, action, request)

    // Handle different actions
    switch (action) {
      case 'mark_reviewed':
        const { error: updateError } = await supabaseAdmin
          .from('applications')
          .update({ 
            accounting_reviewed: true,
            accounting_reviewed_at: new Date().toISOString(),
            accounting_reviewed_by: authResult.userId
          })
          .eq('id', applicationId)

        if (updateError) {
          return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
        }
        break

      case 'add_notes':
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

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error processing accounting action:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 