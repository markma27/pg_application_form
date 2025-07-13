'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

// 获取今天的日期，格式为YYYY-MM-DD
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function Step7Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    accountName: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    bsb: '',
    signature1: '',
    signature2: '',
    date1: '',
    date2: '',
    hasAcknowledged: false
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step7Data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      
      // Convert ISO dates back to YYYY-MM-DD format for date inputs
      if (parsedData.date1) {
        parsedData.date1 = new Date(parsedData.date1).toISOString().split('T')[0];
      }
      if (parsedData.date2) {
        parsedData.date2 = new Date(parsedData.date2).toISOString().split('T')[0];
      }
      
      setFormData(parsedData);
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    let finalValue = value;
    
    // If this is a date field, add current time
    if (field === 'date1' || field === 'date2') {
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
    if ((field === 'date1' || field === 'date2') && typeof value === 'string' && value) {
      setFormData({
        ...formData,
        [field]: value // Keep the YYYY-MM-DD format in the state for the input
      });
    } else {
      setFormData(updatedData);
    }
    
    // For storage: store the full data including ISO date strings
    localStorage.setItem('step7Data', JSON.stringify(updatedData));
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }

    // Save form data to localStorage
    localStorage.setItem('step7Data', JSON.stringify(formData));
    router.push('/application/step-8');
  };

  const handlePrevious = () => {
    router.push('/application/step-6');
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
      accountName: '',
      bankName: '',
      branchName: '',
      accountNumber: '',
      bsb: '',
      signature1: '',
      signature2: '',
      date1: '',
      date2: '',
      hasAcknowledged: false
    });
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
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
        <ProgressIndicator totalSteps={8} currentStep={7} completedSteps={[1, 2, 3, 4, 5, 6]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
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