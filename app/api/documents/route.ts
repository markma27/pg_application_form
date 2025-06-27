import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const documentType = formData.get('documentType') as string;
    const applicationId = formData.get('applicationId') as string;

    if (!file || !documentType || !applicationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type and size
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Generate secure filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2);
    const fileExtension = file.name.split('.').pop();
    const secureFilename = `${applicationId}_${documentType}_${timestamp}_${randomString}.${fileExtension}`;

    // TODO: Upload to Supabase Storage
    // const { data, error } = await supabase.storage
    //   .from('application-documents')
    //   .upload(secureFilename, file, {
    //     cacheControl: '3600',
    //     upsert: false
    //   });

    // TODO: Save document metadata to database
    // const { data: docData, error: docError } = await supabase
    //   .from('application_documents')
    //   .insert([{
    //     application_id: applicationId,
    //     document_type: documentType,
    //     file_path: secureFilename,
    //     file_name: file.name,
    //     file_size: file.size,
    //     mime_type: file.type,
    //   }]);

    return NextResponse.json({
      success: true,
      filename: secureFilename,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('applicationId');

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID required' },
        { status: 400 }
      );
    }

    // TODO: Retrieve documents from database
    // const { data, error } = await supabase
    //   .from('application_documents')
    //   .select('*')
    //   .eq('application_id', applicationId);

    // For now, return mock data
    const mockDocuments = [
      {
        id: 1,
        document_type: 'identity',
        file_name: 'passport.pdf',
        file_size: 1024000,
        uploaded_at: new Date().toISOString(),
      },
    ];

    return NextResponse.json({
      documents: mockDocuments,
    });

  } catch (error) {
    console.error('Error retrieving documents:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve documents' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('id');

    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID required' },
        { status: 400 }
      );
    }

    // TODO: Delete from Supabase Storage and database
    // const { data: doc } = await supabase
    //   .from('application_documents')
    //   .select('file_path')
    //   .eq('id', documentId)
    //   .single();
    
    // if (doc) {
    //   await supabase.storage
    //     .from('application-documents')
    //     .remove([doc.file_path]);
    // }
    
    // await supabase
    //   .from('application_documents')
    //   .delete()
    //   .eq('id', documentId);

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 