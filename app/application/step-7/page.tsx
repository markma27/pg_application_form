'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step7Page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    hasReadTerms: false,
    hasAcceptedPrivacy: false,
    hasConfirmedInformation: false,
    signature: '',
    signatureDate: new Date().toISOString().split('T')[0]
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step7Data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: string, value: boolean | string) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    localStorage.setItem('step7Data', JSON.stringify(updatedData));
  };

  const handleSubmit = async () => {
    if (isFormValid) {
      // Collect all form data from localStorage
      const allFormData = {
        step1: JSON.parse(localStorage.getItem('step1Data') || '{}'),
        step2: JSON.parse(localStorage.getItem('step2Data') || '{}'),
        step3: JSON.parse(localStorage.getItem('step3Data') || '{}'),
        step4: JSON.parse(localStorage.getItem('step4Data') || '{}'),
        step5: JSON.parse(localStorage.getItem('step5Data') || '{}'),
        step6: JSON.parse(localStorage.getItem('step6Data') || '{}'),
        step7: formData
      };

      try {
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(allFormData),
        });

        if (response.ok) {
          // Clear all form data from localStorage
          localStorage.removeItem('step1Data');
          localStorage.removeItem('step2Data');
          localStorage.removeItem('step3Data');
          localStorage.removeItem('step4Data');
          localStorage.removeItem('step5Data');
          localStorage.removeItem('step6Data');
          localStorage.removeItem('step7Data');

          // Redirect to thank you page
          router.push('/thank-you');
        } else {
          throw new Error('Failed to submit application');
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        // Handle error (show error message to user)
      }
    }
  };

  const handlePrevious = () => {
    router.push('/application/step-6');
  };

  const isFormValid = formData.hasReadTerms && 
                     formData.hasAcceptedPrivacy && 
                     formData.hasConfirmedInformation &&
                     formData.signature;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 page-transition">
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
        <ProgressIndicator totalSteps={7} currentStep={7} completedSteps={[1, 2, 3, 4, 5, 6]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Review and Submit
            </h2>
            <p className="text-gray-600">
              Please review the terms and conditions before submitting your application.
            </p>
          </div>

          <div className="space-y-6">
            {/* Terms and Conditions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <p className="mb-4">
                  By submitting this application, you acknowledge and agree to the following terms:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4">
                  <li>All information provided is accurate and complete to the best of your knowledge.</li>
                  <li>You authorize PortfolioGuardian to verify any information provided in this application.</li>
                  <li>You understand that false or misleading information may result in the rejection of your application.</li>
                  <li>You agree to notify PortfolioGuardian of any material changes to the information provided.</li>
                  <li>You understand that submission of this application does not guarantee acceptance.</li>
                </ul>
                <p>
                  For complete terms and conditions, please refer to our full service agreement.
                </p>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={formData.hasReadTerms}
                    onChange={(e) => handleInputChange('hasReadTerms', e.target.checked)}
                    className="w-4 h-4 text-portfolio-green-600 border-gray-300 rounded focus:ring-portfolio-green-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm text-gray-700">
                    I have read and understood the terms and conditions
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={formData.hasAcceptedPrivacy}
                    onChange={(e) => handleInputChange('hasAcceptedPrivacy', e.target.checked)}
                    className="w-4 h-4 text-portfolio-green-600 border-gray-300 rounded focus:ring-portfolio-green-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm text-gray-700">
                    I agree to the privacy policy and consent to the collection and use of my personal information
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={formData.hasConfirmedInformation}
                    onChange={(e) => handleInputChange('hasConfirmedInformation', e.target.checked)}
                    className="w-4 h-4 text-portfolio-green-600 border-gray-300 rounded focus:ring-portfolio-green-500"
                  />
                </div>
                <div className="ml-3">
                  <label className="text-sm text-gray-700">
                    I confirm that all information provided in this application is true and accurate
                  </label>
                </div>
              </div>
            </div>

            {/* Digital Signature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Digital Signature <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.signature}
                onChange={(e) => handleInputChange('signature', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                placeholder="Type your full name as signature"
              />
              <p className="mt-2 text-sm text-gray-500">
                By typing your name above, you are signing this application electronically.
              </p>
            </div>

            {/* Signature Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.signatureDate}
                onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                readOnly
              />
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
            onClick={() => router.push('/application/review')}
            disabled={!formData.hasReadTerms || !formData.hasConfirmedInformation}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              formData.hasReadTerms && formData.hasConfirmedInformation
                ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Review Application
          </button>
        </div>
      </div>
    </div>
  );
} 