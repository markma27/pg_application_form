'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function ReviewPage() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    step1: string | null;
    step2: {
      entityName: string;
      taxFileNumber: string;
      australianBusinessNumber: string;
      isRegisteredForGST: boolean | null;
      holderIdentificationNumber: string;
      streetAddress: string;
      city: string;
      state: string;
      postCode: string;
    } | null;
    step3: {
      firstName: string;
      lastName: string;
      role: string;
      email: string;
      phone: string;
      preferredContact: string | null;
      hasSecondaryContact: boolean | null;
      secondaryFirstName: string;
      secondaryLastName: string;
      secondaryRole: string;
      secondaryEmail: string;
      secondaryPhone: string;
      secondaryPreferredContact: string | null;
    } | null;
    step4: {
      adviserName: string;
      companyName: string;
      address: string;
      telephone: string;
      email: string;
      isPrimaryContact: boolean | null;
      canAccessStatements: boolean | null;
      canDealDirect: boolean | null;
    } | null;
    step5: {
      annualReport: string;
      meetingProxy: string;
      investmentOffers: string;
      dividendPreference: string;
    } | null;
    step6: {
      accountName: string;
      bsb: string;
      accountNumber: string;
      signature1: string;
      signature2: string;
      date1: string;
      date2: string;
      hasAcknowledged: boolean;
    } | null;
    step7: {
      hasReadTerms: boolean;
      hasAcceptedPrivacy: boolean;
      hasConfirmedInformation: boolean;
      signature: string;
      signatureDate: string;
    } | null;
  }>({
    step1: null,
    step2: null,
    step3: null,
    step4: null,
    step5: null,
    step6: null,
    step7: null,
  });

  React.useEffect(() => {
    // Load all saved data
    const step1Data = localStorage.getItem('step1Data');
    const step2Data = localStorage.getItem('step2Data');
    const step3Data = localStorage.getItem('step3Data');
    const step4Data = localStorage.getItem('step4Data');
    const step5Data = localStorage.getItem('step5Data');
    const step6Data = localStorage.getItem('step6Data');
    const step7Data = localStorage.getItem('step7Data');

    setFormData({
      step1: step1Data ? JSON.parse(step1Data) : null,
      step2: step2Data ? JSON.parse(step2Data) : null,
      step3: step3Data ? JSON.parse(step3Data) : null,
      step4: step4Data ? JSON.parse(step4Data) : null,
      step5: step5Data ? JSON.parse(step5Data) : null,
      step6: step6Data ? JSON.parse(step6Data) : null,
      step7: step7Data ? JSON.parse(step7Data) : null,
    });
  }, []);

  const handleSubmit = async () => {
    try {
      // TODO: Submit all data to your backend
      // Clear all localStorage data after successful submission
      localStorage.removeItem('step1Data');
      localStorage.removeItem('step2Data');
      localStorage.removeItem('step3Data');
      localStorage.removeItem('step4Data');
      localStorage.removeItem('step5Data');
      localStorage.removeItem('step6Data');
      localStorage.removeItem('step7Data');
      
      // Redirect to thank you page
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting application:', error);
      // Handle error appropriately
    }
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
    
    // Reset current form state
    setFormData({
      step1: null,
      step2: null,
      step3: null,
      step4: null,
      step5: null,
      step6: null,
      step7: null,
    });
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
  };

  const handleEdit = (step: number) => {
    router.push(`/application/step-${step}`);
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
              width={200}
              height={200}
              className="rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator totalSteps={7} currentStep={7} completedSteps={[1, 2, 3, 4, 5, 6, 7]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mt-8">
          <h2 className="text-2xl font-bold text-portfolio-green-600 mb-6">
            Application Summary
          </h2>
          <p className="text-gray-600 mb-8">
            Please review the following information carefully. Click the &quot;Edit&quot; button for any section you wish to modify.
          </p>

          {/* Step 1 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 1: Entity Type</h3>
              <button
                onClick={() => handleEdit(1)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step1 && (
              <div className="text-gray-600">
                <p>Selected Entity Type: {formData.step1}</p>
              </div>
            )}
          </div>

          {/* Step 2 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 2: Entity Details</h3>
              <button
                onClick={() => handleEdit(2)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step2 && (
              <div className="text-gray-600">
                <p>Entity Name: {formData.step2.entityName}</p>
                <p>Tax File Number: {formData.step2.taxFileNumber}</p>
                <p>ABN: {formData.step2.australianBusinessNumber}</p>
                <p>GST Registered: {formData.step2.isRegisteredForGST ? 'Yes' : 'No'}</p>
                <p>HIN: {formData.step2.holderIdentificationNumber}</p>
                <p>Address: {formData.step2.streetAddress}, {formData.step2.city}, {formData.step2.state} {formData.step2.postCode}</p>
              </div>
            )}
          </div>

          {/* Step 3 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 3: Contact Details</h3>
              <button
                onClick={() => handleEdit(3)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step3 && (
              <div className="text-gray-600">
                <h4 className="font-medium mb-2">Primary Contact</h4>
                <p>Name: {formData.step3.firstName} {formData.step3.lastName}</p>
                <p>Role: {formData.step3.role}</p>
                <p>Email: {formData.step3.email}</p>
                <p>Phone: {formData.step3.phone}</p>
                <p>Preferred Contact Method: {formData.step3.preferredContact}</p>

                {formData.step3.hasSecondaryContact && (
                  <>
                    <h4 className="font-medium mt-4 mb-2">Secondary Contact</h4>
                    <p>Name: {formData.step3.secondaryFirstName} {formData.step3.secondaryLastName}</p>
                    <p>Role: {formData.step3.secondaryRole}</p>
                    <p>Email: {formData.step3.secondaryEmail}</p>
                    <p>Phone: {formData.step3.secondaryPhone}</p>
                    <p>Preferred Contact Method: {formData.step3.secondaryPreferredContact}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Step 4 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 4: Investment Adviser Details</h3>
              <button
                onClick={() => handleEdit(4)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step4 && (
              <div className="text-gray-600">
                <p>Adviser Name: {formData.step4.adviserName}</p>
                <p>Company Name: {formData.step4.companyName}</p>
                <p>Address: {formData.step4.address}</p>
                <p>Phone: {formData.step4.telephone}</p>
                <p>Email: {formData.step4.email}</p>
                <p>Primary Contact: {formData.step4.isPrimaryContact ? 'Yes' : 'No'}</p>
                <p>Access to Statements: {formData.step4.canAccessStatements ? 'Yes' : 'No'}</p>
                <p>Direct Contact: {formData.step4.canDealDirect ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>

          {/* Step 5 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 5: Investment Administration</h3>
              <button
                onClick={() => handleEdit(5)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step5 && (
              <div className="text-gray-600">
                <p>Annual Report Preference: {formData.step5.annualReport}</p>
                <p>Meeting Proxy Preference: {formData.step5.meetingProxy}</p>
                <p>Investment Offers Preference: {formData.step5.investmentOffers}</p>
                <p>Dividend Reinvestment Plan: {formData.step5.dividendPreference}</p>
              </div>
            )}
          </div>

          {/* Step 6 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 6: Direct Debit Authority</h3>
              <button
                onClick={() => handleEdit(6)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step6 && (
              <div className="text-gray-600">
                <p>Account Name: {formData.step6.accountName}</p>
                <p>BSB: {formData.step6.bsb}</p>
                <p>Account Number: {formData.step6.accountNumber}</p>
                <p>Signature 1: {formData.step6.signature1 ? 'Provided' : 'Not provided'}</p>
                <p>Date 1: {formData.step6.date1}</p>
                {formData.step6.signature2 && (
                  <>
                    <p>Signature 2: Provided</p>
                    <p>Date 2: {formData.step6.date2}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Step 7 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 7: Terms and Conditions</h3>
              <button
                onClick={() => handleEdit(7)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step7 && (
              <div className="text-gray-600">
                <p>Terms Read: {formData.step7.hasReadTerms ? 'Yes' : 'No'}</p>
                <p>Privacy Policy Accepted: {formData.step7.hasAcceptedPrivacy ? 'Yes' : 'No'}</p>
                <p>Information Confirmed: {formData.step7.hasConfirmedInformation ? 'Yes' : 'No'}</p>
                <p>Signature: {formData.step7.signature ? 'Provided' : 'Not provided'}</p>
                <p>Date: {formData.step7.signatureDate}</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => router.push('/application/step-7')}
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
              onClick={handleSubmit}
              className={`w-32 px-6 py-2 rounded-md font-medium transition-colors flex items-center justify-center ${
                formData.step1 && formData.step2 && formData.step3 && formData.step4 && formData.step5 && formData.step6 && formData.step7
                  ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit
            </button>
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
    </div>
  );
} 