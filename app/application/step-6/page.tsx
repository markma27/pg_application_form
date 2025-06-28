'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step6Page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    accountName: '',
    bsb: '',
    accountNumber: '',
    signature1: '',
    signature2: '',
    date1: '',
    date2: '',
    hasAcknowledged: false
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step6Data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    localStorage.setItem('step6Data', JSON.stringify(updatedData));
  };

  const handleNext = () => {
    router.push('/application/step-7');
  };

  const handlePrevious = () => {
    router.push('/application/step-5');
  };

  const isFormValid = () => {
    return (
      formData.accountName?.trim() !== '' &&
      formData.bsb?.trim() !== '' &&
      formData.accountNumber?.trim() !== '' &&
      formData.signature1?.trim() !== '' &&
      formData.date1?.trim() !== '' &&
      formData.hasAcknowledged
    );
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
        <ProgressIndicator totalSteps={7} currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-4">
              Direct Debit Authority
            </h2>
            <p className="text-gray-600 mb-6">
              Please provide your bank account details for direct debit arrangements.
            </p>

            {/* Bank Account Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name<RequiredMark />
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange('accountName', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter account name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BSB<RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={formData.bsb}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleInputChange('bsb', value);
                    }}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter BSB (6 digits)"
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number<RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={formData.accountNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 9);
                      handleInputChange('accountNumber', value);
                    }}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter account number"
                    maxLength={9}
                  />
                </div>
              </div>

              {/* Direct Debit Authority Text */}
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-6">
                <p className="text-sm text-gray-700 mb-4">
                  We request and authorise through PortfolioGuardian (User ID 419702) to arrange for any amount PortfolioGuardian may debit or charge to be debited through the Bulk Electronic Clearing System from the nominated bank account, subject to the terms and conditions of the Direct Debit Request Service Agreement.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  By signing this Direct Debit Authority I/we acknowledge having read and understood the terms and conditions governing the debit arrangements between us and PortfolioGuardian as set out in this Authority and in the Direct Debit Request Service Agreement (outlined herein).
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  I/we authorise PortfolioGuardian to debit the nominated bank account, of which the details have been provided to PortfolioGuardian.
                </p>
                <p className="text-sm text-gray-700">
                  I/we acknowledge that the first debit will occur within one month of signing the PortfolioGuardian application form, based on the relevant fee category as outlined in this client pack.
                </p>
              </div>

              {/* Acknowledgment Checkbox */}
              <div className="mt-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.hasAcknowledged}
                    onChange={(e) => handleInputChange('hasAcknowledged', e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-portfolio-green-600 focus:ring-portfolio-green-500"
                  />
                  <span className="text-sm text-gray-700">
                    I acknowledge and agree to the Direct Debit Authority terms and conditions<RequiredMark />
                  </span>
                </label>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature 1<RequiredMark />
                  </label>
                  <input
                    type="text"
                    value={formData.signature1}
                    onChange={(e) => handleInputChange('signature1', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter full name as signature"
                  />
                  <input
                    type="date"
                    value={formData.date1}
                    onChange={(e) => handleInputChange('date1', e.target.value)}
                    className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature 2 (if applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.signature2}
                    onChange={(e) => handleInputChange('signature2', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter full name as signature"
                  />
                  <input
                    type="date"
                    value={formData.date2}
                    onChange={(e) => handleInputChange('date2', e.target.value)}
                    className="mt-2 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  />
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
