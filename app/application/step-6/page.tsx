'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step6Page() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [signatureData, setSignatureData] = React.useState('');
  const [entityType, setEntityType] = React.useState('');

  // Load data from localStorage on client side
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setEntityType(localStorage.getItem('entityType') || 'Not specified');
    }
  }, []);

  const handleSubmit = async () => {
    if (!acceptedTerms) return;
    
    setIsSubmitting(true);
    try {
      // Collect all form data from localStorage
      const formData = {
        entityType: localStorage.getItem('entityType'),
        step2Data: JSON.parse(localStorage.getItem('step2Data') || '{}'),
        step3Data: JSON.parse(localStorage.getItem('step3Data') || '{}'),
        step5Data: JSON.parse(localStorage.getItem('step5Data') || '{}'),
        signature: signatureData,
        submittedAt: new Date().toISOString()
      };

      // Submit to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem('entityType');
        localStorage.removeItem('step2Data');
        localStorage.removeItem('step3Data');
        localStorage.removeItem('step5Data');
        
        // Navigate to thank you page
        router.push('/thank-you');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    router.push('/application/step-5');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="PortfolioGuardian Logo"
              width={72}
              height={72}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator totalSteps={6} currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Review & Submit Application
            </h2>
            <p className="text-gray-600">
              Please review your information and submit your application.
            </p>
          </div>

          <div className="space-y-6">
            {/* Application Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Entity Type:</span>
                  <span className="ml-2 text-gray-900">{entityType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="ml-2 text-green-600">Ready to Submit</span>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Terms and Conditions</h3>
              
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="text-sm text-gray-700 space-y-3">
                  <p><strong>1. Application Accuracy</strong></p>
                  <p>I confirm that all information provided in this application is true, accurate, and complete to the best of my knowledge.</p>
                  
                  <p><strong>2. Identity Verification</strong></p>
                  <p>I consent to identity verification checks and understand that additional documentation may be required.</p>
                  
                  <p><strong>3. Service Agreement</strong></p>
                  <p>I understand that this application is for portfolio administration and reporting services, and that acceptance is subject to PortfolioGuardian&apos;s terms and conditions.</p>
                  
                  <p><strong>4. Privacy and Data Protection</strong></p>
                  <p>I consent to the collection, use, and storage of my personal information as outlined in PortfolioGuardian&apos;s Privacy Policy.</p>
                  
                  <p><strong>5. Regulatory Compliance</strong></p>
                  <p>I acknowledge that services are subject to applicable financial regulations and compliance requirements.</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="accept-terms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="w-4 h-4 text-portfolio-green-600 bg-gray-100 border-gray-300 rounded focus:ring-portfolio-green-500 focus:ring-2"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="accept-terms" className="text-gray-700">
                    I have read and agree to the terms and conditions, and I consent to the processing of my personal data. <span className="text-red-500">*</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Digital Signature</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    By submitting this application, you are providing your digital signature and consent to all terms and conditions.
                  </p>
                </div>
              </div>
            </div>

            {/* Final Notices */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    What happens next?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Your application will be reviewed within 2-3 business days</li>
                      <li>You&apos;ll receive email confirmation and updates on your application status</li>
                      <li>Additional documentation may be requested if needed</li>
                                              <li>Once approved, you&apos;ll receive onboarding instructions</li>
                    </ul>
                  </div>
                </div>
              </div>
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
              onClick={handleSubmit}
              disabled={!acceptedTerms || isSubmitting}
              className={`px-8 py-2 rounded-md font-medium transition-colors ${
                acceptedTerms && !isSubmitting
                  ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
