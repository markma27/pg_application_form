import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { encryptApplicationData } from '@/lib/encryption';
import { notifyApplicationSubmission } from '@/lib/notifications';
import crypto from 'crypto';

// Add current time to dates if they don't have it
function addCurrentTime(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('T')) return dateStr; // Already has time
  
  const now = new Date();
  const date = new Date(dateStr + 'T00:00:00');
  date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
  return date.toISOString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Correct step mapping after inserting FATCA/CRS at step 4
    const step1 = body.step1;
    const step2 = body.step2 || {};
    const step3 = body.step3 || {};
    const step4 = body.step4 || []; // NEW: FATCA/CRS Details (BeneficialOwner array)
    const step5 = body.step5 || {}; // Adviser Information (previously step 4)
    const step6 = body.step6 || {}; // Investment Preferences (previously step 5)
    const step7 = body.step7 || {}; // Bank Details (previously step 6)
    const step8 = body.step8 || {}; // Terms & Conditions (previously step 7)

    // Generate UUID for application ID
    const applicationId = crypto.randomUUID();
    // Generate a human readable reference number
    const referenceNumber = `PG-${Date.now().toString(36).toUpperCase()}`;

    // Prepare application data
    const applicationData = {
      id: applicationId,
      reference_number: referenceNumber,
      session_id: body.sessionId || `session_${Date.now()}`,
      
      // Step 1: Entity Type
      entity_type: step1 || '',
      
      // Step 2: Entity Details
      entity_name: step2.entityName || '',
      australian_business_number: step2.australianBusinessNumber || '',
      is_registered_for_gst: step2.isRegisteredForGST ?? null,
      holder_identification_number: step2.holderIdentificationNumber || '',
      tax_file_number: step2.taxFileNumber || '',
      street_address: step2.streetAddress || '',
      city: step2.city || '',
      state: step2.state || '',
      post_code: step2.postCode || '',
      trustee_type: step2.trusteeType || '',
      trustee_individual_first_name: step2.trusteeIndividualFirstName || '',
      trustee_individual_last_name: step2.trusteeIndividualLastName || '',
      trustee_joint_first_name1: step2.trusteeJointFirstName1 || '',
      trustee_joint_last_name1: step2.trusteeJointLastName1 || '',
      trustee_joint_first_name2: step2.trusteeJointFirstName2 || '',
      trustee_joint_last_name2: step2.trusteeJointLastName2 || '',
      trustee_corporate_name: step2.trusteeCorporateName || '',
      trustee_corporate_acn: step2.trusteeCorporateACN || '',
      
      // Step 3: Contact Information
      main_contact_first_name: step3.firstName || '',
      main_contact_last_name: step3.lastName || '',
      main_contact_role: step3.role || '',
      contact_email: step3.email || '',
      contact_phone: step3.phone || '',
      main_contact_preferred_contact: step3.preferredContact || '',
      has_secondary_contact: step3.hasSecondaryContact ?? null,
      secondary_first_name: step3.secondaryFirstName || '',
      secondary_last_name: step3.secondaryLastName || '',
      secondary_role: step3.secondaryRole || '',
      secondary_email: step3.secondaryEmail || '',
      secondary_phone: step3.secondaryPhone || '',
      secondary_preferred_contact: step3.secondaryPreferredContact || '',
      
      // Step 4: FATCA/CRS Details (NEW)
      fatca_crs_owners: Array.isArray(step4) ? step4 : [],
      
      // Step 5: Adviser Information (previously step 4)
      adviser_name: step5.adviserName || '',
      adviser_company_name: step5.companyName || '',
      adviser_address: step5.address || '',
      adviser_telephone: step5.telephone || '',
      adviser_email: step5.email || '',
      adviser_is_primary_contact: step5.isPrimaryContact ?? null,
      adviser_can_access_statements: step5.canAccessStatements ?? null,
      adviser_can_deal_direct: step5.canDealDirect ?? null,
      
      // Step 6: Investment Preferences (previously step 5)
      annual_report: step6.annualReport || '',
      meeting_proxy: step6.meetingProxy || '',
      investment_offers: step6.investmentOffers || '',
      dividend_preference: step6.dividendPreference || '',
      
      // Step 7: Bank Details (previously step 6)
      account_name: step7.accountName || '',
      bank_name: step7.bankName || '',
      branch_name: step7.branchName || '',
      account_number: step7.accountNumber || '',
      bsb: step7.bsb || '',
      signature1: step7.signature1 || '',
      signature2: step7.signature2 || '',
      date1: addCurrentTime(step7.date1),
      date2: addCurrentTime(step7.date2),
      has_acknowledged: step7.hasAcknowledged ?? null,
      
      // Step 8: Terms & Conditions (previously step 7)
      has_read_terms: step8.hasReadTerms ?? null,
      has_accepted_privacy: step8.hasAcceptedPrivacy ?? null,
      has_confirmed_information: step8.hasConfirmedInformation ?? null,
      final_signature: step8.signature || '',
      final_signature_date: addCurrentTime(step8.signatureDate),
      
      // Legacy fields for compatibility
      privacy_policy_accepted: step8.hasAcceptedPrivacy ?? false,
      terms_of_service_accepted: step8.hasReadTerms ?? false,
      data_processing_consent: step8.hasAcceptedPrivacy ?? false,
      
      // System fields
      is_submitted: true,
      submitted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Encrypt sensitive data if needed
    const encryptedData = encryptApplicationData(applicationData);

    // Save to Supabase database
    const { data, error } = await supabaseAdmin
      .from('applications')
      .insert([encryptedData])
      .select()
      .single();
    
    if (error) {
      console.error('Database error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        data: encryptedData
      });
      return NextResponse.json(
        { 
          error: 'Failed to save application',
          details: error.message,
          code: error.code 
        },
        { status: 500 }
      );
    }
    
    // Send notification to accounting team
    try {
      await notifyApplicationSubmission(applicationId, applicationData);
    } catch (notificationError) {
      console.error('Failed to notify accounting team:', notificationError);
      // Don't fail the application submission if notification fails
    }
    
    // Log audit trail
    try {
      await supabaseAdmin
        .from('audit_logs')
        .insert([{
          event: 'application_submitted',
          application_id: applicationId,
          user_id: 'system',
          timestamp: new Date().toISOString(),
          ip_address: request.headers.get('x-forwarded-for') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        }]);
    } catch (auditError) {
      console.error('Failed to log audit trail:', auditError);
    }

    return NextResponse.json({
      success: true,
      applicationId: applicationId,
      reference_number: referenceNumber,
      message: 'Application submitted successfully'
    });

  } catch (error) {
    console.error('Error processing application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    
    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID required' },
        { status: 400 }
      );
    }

    // Retrieve from Supabase database
    const { data, error } = await supabaseAdmin
      .from('applications')
      .select('*')
      .eq('id', applicationId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: data.id,
      status: data.is_submitted ? 'submitted' : 'draft',
      submittedAt: data.submitted_at,
      entityName: data.entity_name,
      entityType: data.entity_type
    });

  } catch (error) {
    console.error('Error retrieving application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 