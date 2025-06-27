'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step2Page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    entityName: '',
    australianBusinessNumber: '',
    isRegisteredForGST: null as boolean | null,
    holderIdentificationNumber: '',
    registeredAddress: ''
  });

  const handleInputChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    // Validate required fields
    if (formData.entityName && formData.isRegisteredForGST !== null && formData.registeredAddress) {
      // Store form data and navigate to next step
      localStorage.setItem('step2Data', JSON.stringify(formData));
      router.push('/application/step-3');
    }
  };

  const handlePrevious = () => {
    router.push('/application/step-1');
  };

  const isFormValid = formData.entityName && formData.isRegisteredForGST !== null && formData.registeredAddress;

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
        <ProgressIndicator totalSteps={6} currentStep={2} completedSteps={[1]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              New Client Application Form
            </h2>
            <p className="text-gray-600">
              Onboard new clients for investment portfolio administration and reporting service.
            </p>
          </div>

          <div className="space-y-6">
            {/* Entity Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter the full legal name of the entity <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">T</span>
                <input
                  type="text"
                  placeholder="Entity Name"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent"
                  value={formData.entityName}
                  onChange={(e) => handleInputChange('entityName', e.target.value)}
                />
              </div>
            </div>

            {/* Australian Business Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Australian Business Number if applicable
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">T</span>
                <input
                  type="text"
                  placeholder="00 000 000 000"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent"
                  value={formData.australianBusinessNumber}
                  onChange={(e) => handleInputChange('australianBusinessNumber', e.target.value)}
                />
              </div>
            </div>

            {/* GST Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Is the entity registered for GST? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                    formData.isRegisteredForGST === true 
                      ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('isRegisteredForGST', true)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                      A
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Yes</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.isRegisteredForGST === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.isRegisteredForGST === true && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                    formData.isRegisteredForGST === false 
                      ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('isRegisteredForGST', false)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                      B
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">No</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.isRegisteredForGST === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.isRegisteredForGST === false && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Holder Identification Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Holder Identification Number for portfolio if available
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">T</span>
                <input
                  type="text"
                  placeholder="HIN"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent"
                  value={formData.holderIdentificationNumber}
                  onChange={(e) => handleInputChange('holderIdentificationNumber', e.target.value)}
                />
              </div>
            </div>

            {/* Registered Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered address of the entity <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Street address, City, State, Postcode"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent resize-none"
                value={formData.registeredAddress}
                onChange={(e) => handleInputChange('registeredAddress', e.target.value)}
              />
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
              disabled={!isFormValid}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                isFormValid
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
