'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function Step1Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [selectedEntity, setSelectedEntity] = React.useState<string>('');

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedEntity = localStorage.getItem('step1Data');
    if (savedEntity) {
      setSelectedEntity(JSON.parse(savedEntity));
    }
  }, []);

  const entityTypes = [
    { id: 'individual', label: 'Individual', description: 'Personal investment account' },
    { id: 'trust', label: 'Trust', description: 'Family trust or unit trust' },
    { id: 'company', label: 'Company', description: 'Corporate entity' },
    { id: 'foundation', label: 'Foundation', description: 'Charitable or non-profit foundation' },
    { id: 'smsf', label: 'SMSF', description: 'Self-managed super fund' },
    { id: 'joint', label: 'Joint', description: 'Shared investment account between two or more parties' },
  ];

  const handleEntitySelect = (entityId: string) => {
    setSelectedEntity(entityId);
    // Save to localStorage whenever selection changes
    localStorage.setItem('step1Data', JSON.stringify(entityId));
  };

  const isFormValid = () => {
    // Entity type must be selected
    return selectedEntity !== '';
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }

    // Save form data to localStorage
    localStorage.setItem('step1Data', JSON.stringify(selectedEntity));
    router.push('/application/step-2');
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
    setSelectedEntity('');
    
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
        <ProgressIndicator totalSteps={8} currentStep={1} completedSteps={[]} />

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

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Select the entity type for the application <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-3">
              {entityTypes.map((entity, index) => (
                <div
                  key={entity.id}
                  className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                    selectedEntity === entity.id 
                      ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleEntitySelect(entity.id)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                      {String.fromCharCode(65 + index)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{entity.label}</div>
                    <div className="text-sm text-gray-500">{entity.description}</div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedEntity === entity.id 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedEntity === entity.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <div className="invisible">
              {/* Placeholder for Previous button to maintain layout */}
              <button className="w-32 px-6 py-2 bg-gray-600 text-white rounded-md font-medium flex items-center justify-center">
                Previous
              </button>
            </div>

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
