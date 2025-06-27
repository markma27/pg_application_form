import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.entityType || !body.step2Data || !body.step3Data) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate application ID
    const applicationId = `PG-${Date.now().toString(36).toUpperCase()}`;
    
    // Here you would typically save to database
    // For now, we'll just simulate a successful submission
    const applicationData = {
      id: applicationId,
      entityType: body.entityType,
      entityName: body.step2Data.entityName,
      australianBusinessNumber: body.step2Data.australianBusinessNumber,
      isRegisteredForGST: body.step2Data.isRegisteredForGST,
      holderIdentificationNumber: body.step2Data.holderIdentificationNumber,
      registeredAddress: body.step2Data.registeredAddress,
      contactEmail: body.step3Data.contactEmail,
      contactPhone: body.step3Data.contactPhone,
      preferredContactMethod: body.step3Data.preferredContactMethod,
      investmentExperience: body.step5Data?.investmentExperience,
      riskTolerance: body.step5Data?.riskTolerance,
      portfolioSize: body.step5Data?.portfolioSize,
      investmentObjectives: body.step5Data?.investmentObjectives || [],
      signature: body.signature,
      submittedAt: body.submittedAt,
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };

    // TODO: Save to Supabase database
    // const { data, error } = await supabase
    //   .from('applications')
    //   .insert([applicationData]);
    
    // TODO: Send confirmation email
    // await sendConfirmationEmail(applicationData);
    
    // TODO: Log audit trail
    // await logAuditEvent('application_submitted', applicationData.id);

    return NextResponse.json({
      success: true,
      applicationId: applicationId,
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

    // TODO: Retrieve from Supabase database
    // const { data, error } = await supabase
    //   .from('applications')
    //   .select('*')
    //   .eq('id', applicationId)
    //   .single();

    // For now, return a mock response
    return NextResponse.json({
      id: applicationId,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error retrieving application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 