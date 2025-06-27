'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step3Page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    contactEmail: '',
    contactPhone: '',
    preferredContactMethod: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (formData.contactEmail && formData.contactPhone && formData.preferredContactMethod) {
      localStorage.setItem('step3Data', JSON.stringify(formData));
      router.push('/application/step-4');
    }
  };

  const handlePrevious = () => {
    router.push('/application/step-2');
  };

  const isFormValid = formData.contactEmail && formData.contactPhone && formData.preferredContactMethod;

  const contactMethods = [
    { id: 'email', label: 'Email', description: 'Preferred for document delivery' },
    { id: 'phone', label: 'Phone', description: 'For urgent communications' },
    { id: 'both', label: 'Both', description: 'Email and phone as needed' }
  ];

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
        <ProgressIndicator totalSteps={6} currentStep={3} completedSteps={[1, 2]} />

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
            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">@</span>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 text-sm">📞</span>
                <input
                  type="tel"
                  placeholder="+61 4XX XXX XXX"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 focus:border-transparent"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                />
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Preferred Contact Method <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <div
                    key={method.id}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.preferredContactMethod === method.id 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('preferredContactMethod', method.id)}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {String.fromCharCode(65 + index)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{method.label}</div>
                      <div className="text-sm text-gray-500">{method.description}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.preferredContactMethod === method.id 
                          ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.preferredContactMethod === method.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Privacy Protection
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Your contact information will be used only for portfolio administration and client communications. We do not share your details with third parties without your consent.
                    </p>
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
