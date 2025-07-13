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
    step4: Array<{
      fullLegalName: string;
      residentialAddress: string;
      dateOfBirth: string;
      position: string;
      ownershipPercentage: string;
      countryOfTaxResidence: string;
      taxFileNumber: string;
    }> | null;
    step5: {
      adviserName: string;
      companyName: string;
      address: string;
      telephone: string;
      email: string;
      isPrimaryContact: boolean | null;
      canAccessStatements: boolean | null;
      canDealDirect: boolean | null;
    } | null;
    step6: {
      annualReport: string;
      meetingProxy: string;
      investmentOffers: string;
      dividendPreference: string;
    } | null;
    step7: {
      accountName: string;
      bsb: string;
      accountNumber: string;
      signature1: string;
      signature2: string;
      date1: string;
      date2: string;
      hasAcknowledged: boolean;
    } | null;
    step8: {
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
    step8: null,
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
    const step8Data = localStorage.getItem('step8Data');

    setFormData({
      step1: step1Data ? JSON.parse(step1Data) : null,
      step2: step2Data ? JSON.parse(step2Data) : null,
      step3: step3Data ? JSON.parse(step3Data) : null,
      step4: step4Data ? JSON.parse(step4Data) : null,
      step5: step5Data ? JSON.parse(step5Data) : null,
      step6: step6Data ? JSON.parse(step6Data) : null,
      step7: step7Data ? JSON.parse(step7Data) : null,
      step8: step8Data ? JSON.parse(step8Data) : null,
    });
  }, []);

  const handleSubmit = async () => {
    try {
      // Compose the payload from all steps
      const payload = {
        step1: formData.step1,
        step2: formData.step2,
        step3: formData.step3,
        step4: formData.step4,
        step5: formData.step5,
        step6: formData.step6,
        step7: formData.step7,
        step8: formData.step8,
      };
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      const data = await response.json();
      // Save reference number to localStorage for thank you page
      localStorage.setItem('reviewData', JSON.stringify({
        reference_number: data.reference_number
      }));
      // Clear all localStorage data after successful submission
      localStorage.removeItem('step1Data');
      localStorage.removeItem('step2Data');
      localStorage.removeItem('step3Data');
      localStorage.removeItem('step4Data');
      localStorage.removeItem('step5Data');
      localStorage.removeItem('step6Data');
      localStorage.removeItem('step7Data');
      localStorage.removeItem('step8Data');
      // Redirect to thank you page
      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting application:', error);
      // Optionally show an error message to the user
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
    localStorage.removeItem('step8Data');
    
    // Reset current form state
    setFormData({
      step1: null,
      step2: null,
      step3: null,
      step4: null,
      step5: null,
      step6: null,
      step7: null,
      step8: null,
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
        <ProgressIndicator totalSteps={8} currentStep={8} completedSteps={[1, 2, 3, 4, 5, 6, 7, 8]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
              <h3 className="text-lg font-semibold text-gray-900">Step 4: FATCA / CRS Details (Optional)</h3>
              <button
                onClick={() => handleEdit(4)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step4 && formData.step4.length > 0 ? (
              <div className="space-y-4">
                {formData.step4.map((owner, index) => {
                  // Check if any field is filled
                  const hasData = Object.values(owner).some(value => value && value.trim() !== '');
                  
                  if (!hasData) return null;

                  return (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Beneficial Owner / Controlling Person {index + 1}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {owner.fullLegalName && (
                          <div>
                            <span className="text-gray-600 text-sm">Full Legal Name:</span>
                            <p className="text-gray-900">{owner.fullLegalName}</p>
                          </div>
                        )}
                        {owner.residentialAddress && (
                          <div>
                            <span className="text-gray-600 text-sm">Residential Address:</span>
                            <p className="text-gray-900">{owner.residentialAddress}</p>
                          </div>
                        )}
                        {owner.dateOfBirth && (
                          <div>
                            <span className="text-gray-600 text-sm">Date of Birth:</span>
                            <p className="text-gray-900">{owner.dateOfBirth}</p>
                          </div>
                        )}
                        {owner.position && (
                          <div>
                            <span className="text-gray-600 text-sm">Position:</span>
                            <p className="text-gray-900">{owner.position}</p>
                          </div>
                        )}
                        {owner.ownershipPercentage && (
                          <div>
                            <span className="text-gray-600 text-sm">Ownership Percentage:</span>
                            <p className="text-gray-900">{owner.ownershipPercentage}%</p>
                          </div>
                        )}
                        {owner.countryOfTaxResidence && (
                          <div>
                            <span className="text-gray-600 text-sm">Country of Tax Residence:</span>
                            <p className="text-gray-900">{owner.countryOfTaxResidence}</p>
                          </div>
                        )}
                        {owner.taxFileNumber && (
                          <div>
                            <span className="text-gray-600 text-sm">Tax File Number:</span>
                            <p className="text-gray-900">{owner.taxFileNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-600 italic">No FATCA/CRS details provided (optional)</p>
            )}
          </div>

          {/* Step 5 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 5: Investment Adviser Details</h3>
              <button
                onClick={() => handleEdit(5)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step5 && (
              <div className="text-gray-600">
                <p>Adviser Name: {formData.step5.adviserName}</p>
                <p>Company Name: {formData.step5.companyName}</p>
                <p>Address: {formData.step5.address}</p>
                <p>Phone: {formData.step5.telephone}</p>
                <p>Email: {formData.step5.email}</p>
                <p>Primary Contact: {formData.step5.isPrimaryContact ? 'Yes' : 'No'}</p>
                <p>Access to Statements: {formData.step5.canAccessStatements ? 'Yes' : 'No'}</p>
                <p>Direct Contact: {formData.step5.canDealDirect ? 'Yes' : 'No'}</p>
              </div>
            )}
          </div>

          {/* Step 6 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 6: Investment Administration</h3>
              <button
                onClick={() => handleEdit(6)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step6 && (
              <div className="text-gray-600">
                <p>Annual Report Preference: {formData.step6.annualReport}</p>
                <p>Meeting Proxy Preference: {formData.step6.meetingProxy}</p>
                <p>Investment Offers Preference: {formData.step6.investmentOffers}</p>
                <p>Dividend Reinvestment Plan: {formData.step6.dividendPreference}</p>
              </div>
            )}
          </div>

          {/* Step 7 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 7: Direct Debit Authority</h3>
              <button
                onClick={() => handleEdit(7)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step7 && (
              <div className="text-gray-600">
                <p>Account Name: {formData.step7.accountName}</p>
                <p>BSB: {formData.step7.bsb}</p>
                <p>Account Number: {formData.step7.accountNumber}</p>
                <p>Signature 1: {formData.step7.signature1 ? 'Provided' : 'Not provided'}</p>
                <p>Date 1: {formData.step7.date1}</p>
                {formData.step7.signature2 && (
                  <>
                    <p>Signature 2: Provided</p>
                    <p>Date 2: {formData.step7.date2}</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Step 8 Summary */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Step 8: Terms and Conditions</h3>
              <button
                onClick={() => handleEdit(8)}
                className="text-portfolio-green-600 hover:text-portfolio-green-700 font-medium"
              >
                Edit
              </button>
            </div>
            {formData.step8 && (
              <div className="text-gray-600">
                <p>Terms Read: {formData.step8.hasReadTerms ? 'Yes' : 'No'}</p>
                <p>Privacy Policy Accepted: {formData.step8.hasAcceptedPrivacy ? 'Yes' : 'No'}</p>
                <p>Information Confirmed: {formData.step8.hasConfirmedInformation ? 'Yes' : 'No'}</p>
                <p>Signature: {formData.step8.signature ? 'Provided' : 'Not provided'}</p>
                <p>Date: {formData.step8.signatureDate}</p>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => router.push('/application/step-8')}
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
                formData.step1 && formData.step2 && formData.step3 && formData.step4 && formData.step5 && formData.step6 && formData.step7 && formData.step8
                  ? 'bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Submit
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