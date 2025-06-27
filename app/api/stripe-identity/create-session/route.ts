import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { return_url } = body;

    if (!return_url) {
      return NextResponse.json(
        { error: 'Return URL is required' },
        { status: 400 }
      );
    }

    // TODO: Implement Stripe Identity session creation
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // 
    // const session = await stripe.identity.verificationSessions.create({
    //   type: 'document',
    //   metadata: {
    //     user_id: 'user_123', // Replace with actual user ID
    //   },
    //   return_url: return_url,
    // });

    // For now, return a mock response
    const mockSession = {
      id: `vs_${Date.now()}`,
      url: `https://verify.stripe.com/start/test_${Date.now()}`,
      status: 'requires_input',
    };

    return NextResponse.json({
      id: mockSession.id,
      url: mockSession.url,
    });

  } catch (error) {
    console.error('Error creating Stripe Identity session:', error);
    return NextResponse.json(
      { error: 'Failed to create verification session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      );
    }

    // TODO: Retrieve Stripe Identity session status
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const session = await stripe.identity.verificationSessions.retrieve(sessionId);

    // For now, return a mock response
    const mockSession = {
      id: sessionId,
      status: 'verified',
      last_verification_report: {
        type: 'document',
        document: {
          status: 'verified',
        },
        selfie: {
          status: 'verified',
        },
      },
    };

    return NextResponse.json(mockSession);

  } catch (error) {
    console.error('Error retrieving Stripe Identity session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve verification session' },
      { status: 500 }
    );
  }
} 