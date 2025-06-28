'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step5Page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    // Investment Administration Details
    annualReport: '',
    meetingProxy: '',
    investmentOffers: '',
    // Dividend Reinvestment Plan
    dividendPreference: '',
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step5Data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: string, value: string) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    // Save to localStorage whenever data changes
    localStorage.setItem('step5Data', JSON.stringify(updatedData));
  };

  const handleNext = () => {
    router.push('/application/step-6');
  };

  const handlePrevious = () => {
    router.push('/application/step-4');
  };

  const isFormValid = () => {
    return formData.annualReport !== '' &&
           formData.meetingProxy !== '' &&
           formData.investmentOffers !== '' &&
           formData.dividendPreference !== '';
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
        <ProgressIndicator totalSteps={7} currentStep={5} completedSteps={[1, 2, 3, 4]} />

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
                  onClick={() => handleInputChange('annualReport', 'MainContact')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Main Contact</div>
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
                  onClick={() => handleInputChange('annualReport', 'Adviser')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Adviser</div>
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
                  onClick={() => handleInputChange('annualReport', 'Both')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Both</div>
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
                  onClick={() => handleInputChange('annualReport', 'NotRequired')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Not Required</div>
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
                  onClick={() => handleInputChange('meetingProxy', 'MainContact')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Main Contact</div>
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
                  onClick={() => handleInputChange('meetingProxy', 'Adviser')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Adviser</div>
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
                  onClick={() => handleInputChange('meetingProxy', 'Both')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Both</div>
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
                  onClick={() => handleInputChange('meetingProxy', 'NotRequired')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Not Required</div>
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
                  onClick={() => handleInputChange('investmentOffers', 'MainContact')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Main Contact</div>
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
                  onClick={() => handleInputChange('investmentOffers', 'Adviser')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Adviser</div>
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
                  onClick={() => handleInputChange('investmentOffers', 'Both')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Both</div>
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
                  onClick={() => handleInputChange('investmentOffers', 'NotRequired')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Not Required</div>
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
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={handlePrevious}
            className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isFormValid()}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isFormValid()
                ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
} 
