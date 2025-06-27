'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step4Page() {
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = React.useState<'pending' | 'in-progress' | 'verified' | 'failed'>('pending');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStartVerification = async () => {
    setIsLoading(true);
    try {
      // 临时注释掉 Stripe 验证逻辑
      /*
      const response = await fetch('/api/stripe-identity/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          return_url: `${window.location.origin}/application/step-4?session_complete=true`
        }),
      });

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
      */
      
      // 直接设置为验证中状态
      setVerificationStatus('in-progress');
      // 模拟验证过程
      setTimeout(() => {
        setVerificationStatus('verified');
      }, 1500);
    } catch (error) {
      console.error('Error creating verification session:', error);
      setVerificationStatus('failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipVerification = () => {
    setVerificationStatus('verified');
  };

  const handleNext = () => {
    if (verificationStatus === 'verified') {
      router.push('/application/step-5');
    }
  };

  const handlePrevious = () => {
    router.push('/application/step-3');
  };

  // Check if returning from Stripe
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('session_complete') === 'true') {
      setVerificationStatus('verified');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="PortfolioGuardian Logo"
              width={200}
              height={200}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator totalSteps={6} currentStep={4} completedSteps={[1, 2, 3]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Identity Verification
            </h2>
            <p className="text-gray-600">
              Please verify your identity by uploading a government-issued ID and taking a selfie.
            </p>
          </div>

          <div className="space-y-6">
            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-blue-800">
                    Secure Identity Verification
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p className="mb-2">
                      We use Stripe Identity, a bank-grade identity verification service, to securely verify your identity.
                    </p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your documents are encrypted and securely processed</li>
                      <li>Personal information is not stored on our servers</li>
                      <li>Verification typically takes 2-3 minutes</li>
                      <li>Accepted documents: Passport, Driver&apos;s License, National ID</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="text-center">
              {verificationStatus === 'pending' && (
                <div className="space-y-4">
                  <button
                    onClick={handleStartVerification}
                    disabled={isLoading}
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-portfolio-green-600 hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portfolio-green-500 transition-colors button-hover"
                  >
                    {isLoading ? 'Starting...' : 'Start Verification'}
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={handleSkipVerification}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Skip Verification (Development Only)
                    </button>
                  </div>
                </div>
              )}

              {verificationStatus === 'in-progress' && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-portfolio-green-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Verification in progress...</p>
                </div>
              )}

              {verificationStatus === 'verified' && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="mt-4 text-lg font-medium text-gray-900">Identity Verified</p>
                  <p className="mt-2 text-sm text-gray-500">You can now proceed to the next step</p>
                </div>
              )}

              {verificationStatus === 'failed' && (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="mt-4 text-lg font-medium text-gray-900">Verification Failed</p>
                  <p className="mt-2 text-sm text-gray-500">Please try again or contact support</p>
                  <button
                    onClick={handleStartVerification}
                    className="mt-4 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-portfolio-green-600 hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portfolio-green-500 transition-colors button-hover"
                  >
                    Try Again
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={handleSkipVerification}
                      className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                      Skip Verification (Development Only)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              className="px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={verificationStatus !== 'verified'}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                verificationStatus === 'verified'
                  ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
