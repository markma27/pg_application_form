'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Button } from '@/components/ui/button';

export default function Step6Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    // Investment Administration Details
    annualReport: '' as string,
    meetingProxy: '' as string,
    investmentOffers: '' as string,
    // Dividend Reinvestment Plan
    dividendPreference: '',
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step6Data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: string, value: string | null) => {
    const updatedData = {
      ...formData,
      [field]: value || '', // Convert null to empty string
    };
    setFormData(updatedData);
    // Save to localStorage whenever data changes
    localStorage.setItem('step6Data', JSON.stringify(updatedData));
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }

    // Save form data to localStorage
    localStorage.setItem('step6Data', JSON.stringify(formData));
    router.push('/application/step-7');
  };

  const handlePrevious = () => {
    router.push('/application/step-5');
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
    setFormData({
      annualReport: '',
      meetingProxy: '',
      investmentOffers: '',
      dividendPreference: '',
    });
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
  };

  const isFormValid = () => {
    // All required fields must be filled
    if (!formData.annualReport || !formData.meetingProxy || 
        !formData.investmentOffers || !formData.dividendPreference) {
      return false;
    }

    return true;
  };

  // Required field marker component
  const RequiredMark = () => (
    <span className="text-red-500 ml-1">*</span>
  );

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
        <ProgressIndicator totalSteps={8} currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Investment Administration Details */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-4">
              Investment Administration Details
            </h2>
            <p className="text-gray-600 mb-6">
              Please advise where you would like us to send the following investment documents:
            </p>

            {/* Annual Report */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Report<RequiredMark />
              </label>
              <div className="grid grid-cols-4 gap-4">
                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.annualReport === 'MainContact' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('annualReport', formData.annualReport === 'MainContact' ? null : 'MainContact')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.annualReport === 'MainContact' ? 'text-gray-900' : 'text-gray-500'}`}>Main Contact</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.annualReport === 'MainContact' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.annualReport === 'MainContact' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.annualReport === 'Adviser' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('annualReport', formData.annualReport === 'Adviser' ? null : 'Adviser')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.annualReport === 'Adviser' ? 'text-gray-900' : 'text-gray-500'}`}>Adviser</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.annualReport === 'Adviser' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.annualReport === 'Adviser' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.annualReport === 'Both' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('annualReport', formData.annualReport === 'Both' ? null : 'Both')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.annualReport === 'Both' ? 'text-gray-900' : 'text-gray-500'}`}>Both</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.annualReport === 'Both' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.annualReport === 'Both' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.annualReport === 'NotRequired' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('annualReport', formData.annualReport === 'NotRequired' ? null : 'NotRequired')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.annualReport === 'NotRequired' ? 'text-gray-900' : 'text-gray-500'}`}>Not Required</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.annualReport === 'NotRequired' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.annualReport === 'NotRequired' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Proxy */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Proxy<RequiredMark />
              </label>
              <div className="grid grid-cols-4 gap-4">
                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.meetingProxy === 'MainContact' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('meetingProxy', formData.meetingProxy === 'MainContact' ? null : 'MainContact')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.meetingProxy === 'MainContact' ? 'text-gray-900' : 'text-gray-500'}`}>Main Contact</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.meetingProxy === 'MainContact' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.meetingProxy === 'MainContact' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.meetingProxy === 'Adviser' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('meetingProxy', formData.meetingProxy === 'Adviser' ? null : 'Adviser')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.meetingProxy === 'Adviser' ? 'text-gray-900' : 'text-gray-500'}`}>Adviser</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.meetingProxy === 'Adviser' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.meetingProxy === 'Adviser' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.meetingProxy === 'Both' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('meetingProxy', formData.meetingProxy === 'Both' ? null : 'Both')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.meetingProxy === 'Both' ? 'text-gray-900' : 'text-gray-500'}`}>Both</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.meetingProxy === 'Both' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.meetingProxy === 'Both' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.meetingProxy === 'NotRequired' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('meetingProxy', formData.meetingProxy === 'NotRequired' ? null : 'NotRequired')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.meetingProxy === 'NotRequired' ? 'text-gray-900' : 'text-gray-500'}`}>Not Required</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.meetingProxy === 'NotRequired' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.meetingProxy === 'NotRequired' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Offers */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Investment Offers<RequiredMark />
              </label>
              <div className="grid grid-cols-4 gap-4">
                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.investmentOffers === 'MainContact' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('investmentOffers', formData.investmentOffers === 'MainContact' ? null : 'MainContact')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.investmentOffers === 'MainContact' ? 'text-gray-900' : 'text-gray-500'}`}>Main Contact</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.investmentOffers === 'MainContact' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.investmentOffers === 'MainContact' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.investmentOffers === 'Adviser' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('investmentOffers', formData.investmentOffers === 'Adviser' ? null : 'Adviser')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.investmentOffers === 'Adviser' ? 'text-gray-900' : 'text-gray-500'}`}>Adviser</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.investmentOffers === 'Adviser' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.investmentOffers === 'Adviser' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.investmentOffers === 'Both' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('investmentOffers', formData.investmentOffers === 'Both' ? null : 'Both')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.investmentOffers === 'Both' ? 'text-gray-900' : 'text-gray-500'}`}>Both</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.investmentOffers === 'Both' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.investmentOffers === 'Both' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>

                <div
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    formData.investmentOffers === 'NotRequired' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('investmentOffers', formData.investmentOffers === 'NotRequired' ? null : 'NotRequired')}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.investmentOffers === 'NotRequired' ? 'text-gray-900' : 'text-gray-500'}`}>Not Required</div>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    formData.investmentOffers === 'NotRequired' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                  }`}>
                    {formData.investmentOffers === 'NotRequired' && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dividend Reinvestment Plan */}
            <div>
              <h2 className="text-2xl font-bold text-portfolio-green-600 mb-4">
                Dividend Reinvestment Plan
              </h2>
              <p className="text-gray-600 mb-6">
                If you invest in listed securities or unit trusts they may offer you the option to have the dividends/distributions paid in cash, or reinvested. Please advise us of your preference:
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dividend Preference<RequiredMark />
                </label>
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      formData.dividendPreference === 'Cash' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('dividendPreference', 'Cash')}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Receive in cash</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.dividendPreference === 'Cash' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                    }`}>
                      {formData.dividendPreference === 'Cash' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                      formData.dividendPreference === 'Reinvest' ? 'border-portfolio-green-500 bg-portfolio-green-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('dividendPreference', 'Reinvest')}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Re-invest</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.dividendPreference === 'Reinvest' ? 'border-portfolio-green-500 bg-portfolio-green-500' : 'border-gray-300'
                    }`}>
                      {formData.dividendPreference === 'Reinvest' && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
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
              Next
            </button>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={isConfirmationOpen}
          onConfirm={handleRestartConfirm}
          onCancel={handleRestartCancel}
          title="Restart Application"
          message="Are you sure you want to restart the application? All your progress will be lost."
        />
      </div>
    </div>
  );
} 
