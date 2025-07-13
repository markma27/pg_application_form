'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

interface BeneficialOwner {
  fullLegalName: string;
  residentialAddress: string;
  dateOfBirth: string;
  position: string;
  ownershipPercentage: string;
  countryOfTaxResidence: string;
  taxFileNumber: string;
}

const defaultBeneficialOwner: BeneficialOwner = {
  fullLegalName: '',
  residentialAddress: '',
  dateOfBirth: '',
  position: '',
  ownershipPercentage: '',
  countryOfTaxResidence: 'Australia',
  taxFileNumber: ''
};

export default function Step4Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [beneficialOwners, setBeneficialOwners] = React.useState<BeneficialOwner[]>([defaultBeneficialOwner]);

  // Load saved data when component mounts
  React.useEffect(() => {
    try {
      const savedData = localStorage.getItem('step4Data');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setBeneficialOwners(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading step 4 data:', error);
      setBeneficialOwners([defaultBeneficialOwner]);
    }
  }, []);

  const handleInputChange = (index: number, field: keyof BeneficialOwner, value: string) => {
    const updatedOwners = [...beneficialOwners];
    updatedOwners[index] = {
      ...updatedOwners[index],
      [field]: value
    };
    setBeneficialOwners(updatedOwners);
    localStorage.setItem('step4Data', JSON.stringify(updatedOwners));
  };

  const addBeneficialOwner = () => {
    if (beneficialOwners.length >= 8) {
      return;
    }
    setBeneficialOwners([...beneficialOwners, { ...defaultBeneficialOwner }]);
  };

  const removeBeneficialOwner = (index: number) => {
    const updatedOwners = beneficialOwners.filter((_, i) => i !== index);
    setBeneficialOwners(updatedOwners);
    localStorage.setItem('step4Data', JSON.stringify(updatedOwners));
  };

  const isFormValid = () => {
    return beneficialOwners.every(owner => {
      // All fields are optional now
      if (!owner.fullLegalName && !owner.residentialAddress && !owner.dateOfBirth &&
          !owner.position && !owner.ownershipPercentage && !owner.countryOfTaxResidence &&
          !owner.taxFileNumber) {
        return true;
      }

      // If any field is filled, validate the format
      if (owner.ownershipPercentage && owner.ownershipPercentage.trim() !== '') {
        const percentage = parseFloat(owner.ownershipPercentage);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
          return false;
        }
      }

      if (owner.dateOfBirth && owner.dateOfBirth.trim() !== '') {
        const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
        if (!dateRegex.test(owner.dateOfBirth)) {
          return false;
        }
      }

      return true;
    });
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }
    
    // Filter out empty beneficial owners (only have default values)
    const filteredBeneficialOwners = beneficialOwners.filter(owner => {
      // Check if any field other than the default countryOfTaxResidence is filled
      return owner.fullLegalName?.trim() !== '' || 
             owner.residentialAddress?.trim() !== '' || 
             owner.dateOfBirth?.trim() !== '' || 
             owner.position?.trim() !== '' || 
             owner.ownershipPercentage?.trim() !== '' || 
             owner.taxFileNumber?.trim() !== '' ||
             (owner.countryOfTaxResidence?.trim() !== '' && owner.countryOfTaxResidence !== 'Australia');
    });
    
    localStorage.setItem('step4Data', JSON.stringify(filteredBeneficialOwners));
    router.push('/application/step-5');
  };

  const handlePrevious = () => {
    router.push('/application/step-3');
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
    setBeneficialOwners([defaultBeneficialOwner]);
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
  };

  const getTotalOwnershipPercentage = () => {
    return beneficialOwners.reduce((total, owner) => total + parseFloat(owner.ownershipPercentage), 0);
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
        <ProgressIndicator totalSteps={8} currentStep={4} completedSteps={[1, 2, 3]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              FATCA / CRS Details (Optional)
            </h2>
            <p className="text-gray-600">
              Due to the requirements imposed by the Common Reporting Standard (CRS) and the Foreign Account Tax Compliance Act (FATCA), we may be required to complete the CRS/FATCA forms based on the investments you hold. This may include providing details of the beneficial owners or controlling persons. If this information is not provided, tax will be withheld from any income payments.
              <br/><br/>
              To help us complete these forms efficiently on your behalf, please provide the details of the beneficial owners or controlling persons (up to 8). All fields in this section are optional. If you prefer not to provide this information, we will forward the CRS/FATCA forms to you for completion and submission.
            </p>
          </div>

          {beneficialOwners.map((owner, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-portfolio-green-600">
                  Beneficial Owner / Controlling Person {index + 1}
                </h3>
                {beneficialOwners.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeBeneficialOwner(index)}
                    className="text-red-600 hover:text-red-700 focus:outline-none"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-6">
                {/* Full Legal Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={owner.fullLegalName}
                    onChange={(e) => handleInputChange(index, 'fullLegalName', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter full legal name"
                  />
                </div>

                {/* Residential Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Residential Address
                  </label>
                  <input
                    type="text"
                    value={owner.residentialAddress}
                    onChange={(e) => handleInputChange(index, 'residentialAddress', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter residential address"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={owner.dateOfBirth}
                    onChange={(e) => handleInputChange(index, 'dateOfBirth', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="dd/mm/yyyy"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={owner.position}
                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter position"
                  />
                </div>

                {/* Ownership Percentage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ownership Percentage
                  </label>
                  <input
                    type="text"
                    value={owner.ownershipPercentage}
                    onChange={(e) => handleInputChange(index, 'ownershipPercentage', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter ownership percentage"
                  />
                </div>

                {/* Country of Tax Residence */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country of Tax Residence
                  </label>
                  <input
                    type="text"
                    value={owner.countryOfTaxResidence}
                    onChange={(e) => handleInputChange(index, 'countryOfTaxResidence', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter country of tax residence"
                  />
                </div>

                {/* Tax File Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax File Number
                  </label>
                  <input
                    type="text"
                    value={owner.taxFileNumber}
                    onChange={(e) => handleInputChange(index, 'taxFileNumber', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter tax file number"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Another Beneficial Owner Button */}
          <div className="mt-8">
            {beneficialOwners.length < 8 ? (
              <button
                type="button"
                onClick={addBeneficialOwner}
                className="w-full px-6 py-2 border border-portfolio-green-500 text-portfolio-green-600 rounded-md font-medium hover:bg-portfolio-green-50 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 transition-colors flex items-center justify-center"
              >
                Add Another Beneficial Owner / Controlling Person
              </button>
            ) : (
              <p className="text-center text-gray-500 text-sm">
                Maximum of 8 beneficial owners allowed
              </p>
            )}
          </div>

          {/* Total Ownership Percentage Warning */}
          {getTotalOwnershipPercentage() > 100 && (
            <div className="mt-4 text-red-600 text-sm text-center">
              Total ownership percentage cannot exceed 100%
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrevious}
              className="w-32 px-6 py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors flex items-center justify-center"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleRestartClick}
              className="w-32 px-6 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors flex items-center justify-center"
            >
              Restart
            </button>

            <button
              type="button"
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
  );
} 