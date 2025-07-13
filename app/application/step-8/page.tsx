'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

// Helper function to get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

export default function Step8Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // Identity Verification
    hasReadTerms: false,
    hasAcceptedPrivacy: false,
    hasConfirmedInformation: false,
    signature: '',
    signatureDate: getTodayDate(), // 设置今天的日期作为默认值
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step8Data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Convert ISO date back to YYYY-MM-DD format for date input
      if (parsedData.signatureDate) {
        parsedData.signatureDate = new Date(parsedData.signatureDate).toISOString().split('T')[0];
      } else {
        parsedData.signatureDate = getTodayDate(); // 如果没有保存的日期，使用今天的日期
      }
      
      setFormData(parsedData);
    }
  }, []);

  const handleInputChange = (field: string, value: boolean | string) => {
    let finalValue = value;
    
    // If this is a date field, add current time
    if (field === 'signatureDate') {
      if (typeof value === 'string' && value) {
        // For storage: combine the date with current time
        const date = new Date(value + 'T00:00:00');
        const now = new Date();
        date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        finalValue = date.toISOString();
      }
    }
    
    const updatedData = {
      ...formData,
      [field]: finalValue
    };
    
    // For display: if it's a date field, keep the YYYY-MM-DD format in the state
    if (field === 'signatureDate' && typeof value === 'string' && value) {
      setFormData({
        ...formData,
        [field]: value // Keep the YYYY-MM-DD format in the state for the input
      });
    } else {
      setFormData(updatedData);
    }
    
    // For storage: store the full data including ISO date string
    localStorage.setItem('step8Data', JSON.stringify(updatedData));
  };

  const isFormValid = () => {
    // All required fields must be filled
    return formData.hasReadTerms && 
           formData.hasAcceptedPrivacy && 
           formData.hasConfirmedInformation &&
           formData.signature?.trim() !== '' &&
           formData.signatureDate?.trim() !== '';
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }

    // Save form data to localStorage
    localStorage.setItem('step8Data', JSON.stringify(formData));
    router.push('/application/review');
  };

  const handlePrevious = () => {
    router.push('/application/step-7');
  };

  const handleRestartClick = () => {
    setIsConfirmationOpen(true);
  };

  const handleRestartConfirm = () => {
    // Clear all localStorage data
    localStorage.removeItem('step1Data');
    localStorage.removeItem('step2Data');
    localStorage.removeItem('step3Data');
    localStorage.removeItem('step4Data');
    localStorage.removeItem('step5Data');
    localStorage.removeItem('step6Data');
    localStorage.removeItem('step7Data');
    localStorage.removeItem('step8Data');
    
    // Reset current form state
    const resetFormData = {
      hasReadTerms: false,
      hasAcceptedPrivacy: false,
      hasConfirmedInformation: false,
      signature: '',
      signatureDate: getTodayDate()
    };
    
    setFormData(resetFormData);
    
    // Clear any form input values that might be cached by browser
    setTimeout(() => {
      const signatureInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (signatureInput) {
        signatureInput.value = '';
      }
    }, 0);
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
  };

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
        <ProgressIndicator totalSteps={8} currentStep={8} completedSteps={[1, 2, 3, 4, 5, 6, 7]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Terms and Conditions
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
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.signatureDate}
                onChange={(e) => handleInputChange('signatureDate', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
              />
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePrevious}
              className="w-32 px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center justify-center"
            >
              Previous
            </button>

            <button
              onClick={handleRestartClick}
              className="w-32 px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors flex items-center justify-center"
            >
              Restart
            </button>

            <button
              onClick={handleNext}
              disabled={!isFormValid()}
              className={`w-32 px-6 py-2 rounded-md font-medium transition-colors flex items-center justify-center ${
                isFormValid()
                  ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Review
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isConfirmationOpen}
          title="Restart Application"
          message="Are you sure you want to restart the application? This will erase all completed information."
          onConfirm={handleRestartConfirm}
          onCancel={handleRestartCancel}
        />
      </div>
    </div>
  );
} 