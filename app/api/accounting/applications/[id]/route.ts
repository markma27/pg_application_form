import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyAccountingTeamAuth, logAccountingAccess } from '@/lib/auth'
import { decryptApplicationData } from '@/lib/encryption'

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
    
    // Get application with documents
    const { data: application, error } = await supabaseAdmin
      .from('applications')
      .select(`
        *,
        application_documents (
          id,
          document_type,
          file_name,
          file_size,
          uploaded_at
        ),
        accounting_notes (
          id,
          notes,
          created_at,
          accounting_users!inner(name)
        )
      `)
      .eq('id', applicationId)
      .single()
    
    if (error || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }
    
    // Decrypt sensitive fields
    const decryptedApplication = decryptApplicationData(application)
    
    // Log access
    await logAccountingAccess(applicationId, authResult.userId!, 'view_application', request)
    
    return NextResponse.json({ 
      data: decryptedApplication,
      accessedBy: authResult.user?.name || 'Unknown',
      accessedAt: new Date().toISOString()
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
    
    // Only allow certain fields to be updated by accounting team
    const allowedUpdates: any = {}
    
    if (body.accounting_status !== undefined) {
      allowedUpdates.accounting_status = body.accounting_status
    }
    
    if (body.accounting_notes !== undefined) {
      allowedUpdates.accounting_notes = body.accounting_notes
    }
    
    if (body.priority !== undefined) {
      allowedUpdates.priority = body.priority
    }
    
    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
    }
    
    // Add audit fields
    allowedUpdates.updated_at = new Date().toISOString()
    allowedUpdates.last_updated_by = authResult.userId
    
    // Update application
    const { error: updateError } = await supabaseAdmin
      .from('applications')
      .update(allowedUpdates)
      .eq('id', applicationId)
    
    if (updateError) {
      console.error('Update error:', updateError)
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
    }
    
    // Log the update
    await logAccountingAccess(applicationId, authResult.userId!, 'update_application', request)
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Error updating application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 