'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function Step2Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [entityType, setEntityType] = React.useState<string>('');
  const [formData, setFormData] = React.useState({
    entityName: '',
    taxFileNumber: '',
    australianBusinessNumber: '',
    isRegisteredForGST: null as boolean | null,
    holderIdentificationNumber: '',
    streetAddress: '',
    city: '',
    state: '',
    postCode: '',
    trusteeType: '',
    trusteeIndividualFirstName: '',
    trusteeIndividualLastName: '',
    trusteeJointFirstName1: '',
    trusteeJointLastName1: '',
    trusteeJointFirstName2: '',
    trusteeJointLastName2: '',
    trusteeCorporateName: '',
    trusteeCorporateACN: ''
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step2Data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    const step1Data = localStorage.getItem('step1Data');
    if (step1Data) {
      setEntityType(JSON.parse(step1Data));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean | null) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    // Save to localStorage whenever data changes
    localStorage.setItem('step2Data', JSON.stringify(updatedData));
  };

  const isFormValid = () => {
    // All required fields must be filled
    if (!formData.entityName || !formData.taxFileNumber || 
        formData.isRegisteredForGST === null || !formData.streetAddress || 
        !formData.city || !formData.state || !formData.postCode) {
      return false;
    }

    // ABN validation (11 digits) - only if ABN is provided
    const abnRegex = /^\d{11}$/;
    if (formData.australianBusinessNumber && !abnRegex.test(formData.australianBusinessNumber)) {
      return false;
    }

    // TFN validation (8 or 9 digits)
    const tfnRegex = /^\d{8,9}$/;
    if (!tfnRegex.test(formData.taxFileNumber.replace(/\s/g, ''))) {
      return false;
    }

    // Postcode validation (4 digits)
    const postcodeRegex = /^\d{4}$/;
    if (!postcodeRegex.test(formData.postCode)) {
      return false;
    }

    // trustee 校验
    if (["trust", "smsf", "foundation"].includes(entityType)) {
      if (!formData.trusteeType) return false;
      if (formData.trusteeType === 'individual') {
        if (!formData.trusteeIndividualFirstName || !formData.trusteeIndividualLastName) return false;
      } else if (formData.trusteeType === 'joint') {
        if (!formData.trusteeJointFirstName1 || !formData.trusteeJointLastName1 || !formData.trusteeJointFirstName2 || !formData.trusteeJointLastName2) return false;
      } else if (formData.trusteeType === 'corporate') {
        if (!formData.trusteeCorporateName || !formData.trusteeCorporateACN) return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }

    // Save form data to localStorage
    localStorage.setItem('step2Data', JSON.stringify(formData));
    router.push('/application/step-3');
  };

  const handlePrevious = () => {
    // Data is already saved in localStorage through handleInputChange
    router.push('/application/step-1');
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
      entityName: '',
      taxFileNumber: '',
      australianBusinessNumber: '',
      isRegisteredForGST: null,
      holderIdentificationNumber: '',
      streetAddress: '',
      city: '',
      state: '',
      postCode: '',
      trusteeType: '',
      trusteeIndividualFirstName: '',
      trusteeIndividualLastName: '',
      trusteeJointFirstName1: '',
      trusteeJointLastName1: '',
      trusteeJointFirstName2: '',
      trusteeJointLastName2: '',
      trusteeCorporateName: '',
      trusteeCorporateACN: ''
    });
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
  };

  const states = [
    'ACT',
    'NSW',
    'NT',
    'QLD',
    'SA',
    'TAS',
    'VIC',
    'WA'
  ];

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
        <ProgressIndicator totalSteps={8} currentStep={2} completedSteps={[1]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Investment Entity Details
            </h2>
            <p className="text-gray-600">
              Onboard new clients for investment portfolio administration and reporting service.
            </p>
          </div>

          <div className="space-y-6">
            {/* Entity Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.entityName}
                onChange={(e) => handleInputChange('entityName', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                placeholder="Enter full legal name"
              />
            </div>

            {/* Tax File Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax File Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.taxFileNumber}
                onChange={(e) => handleInputChange('taxFileNumber', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                placeholder="Enter tax file number"
              />
              <p className="mt-1 text-sm text-gray-500">This information is required for tax reporting purposes</p>
            </div>

            {/* Trustee 字段（仅 trust/smsf/foundation 显示） */}
            {['trust', 'smsf', 'foundation'].includes(entityType) && (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trustee Type <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`flex-1 p-3 border rounded-lg font-medium transition-colors ${formData.trusteeType === 'individual' ? 'border-portfolio-green-500 bg-portfolio-green-50 text-gray-900' : 'border-gray-200 text-gray-500'}`}
                    onClick={() => handleInputChange('trusteeType', 'individual')}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    className={`flex-1 p-3 border rounded-lg font-medium transition-colors ${formData.trusteeType === 'joint' ? 'border-portfolio-green-500 bg-portfolio-green-50 text-gray-900' : 'border-gray-200 text-gray-500'}`}
                    onClick={() => handleInputChange('trusteeType', 'joint')}
                  >
                    Joint Individuals
                  </button>
                  <button
                    type="button"
                    className={`flex-1 p-3 border rounded-lg font-medium transition-colors ${formData.trusteeType === 'corporate' ? 'border-portfolio-green-500 bg-portfolio-green-50 text-gray-900' : 'border-gray-200 text-gray-500'}`}
                    onClick={() => handleInputChange('trusteeType', 'corporate')}
                  >
                    Corporate
                  </button>
                </div>
                {/* Trustee 详细信息 */}
                {formData.trusteeType === 'individual' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeIndividualFirstName} onChange={e => handleInputChange('trusteeIndividualFirstName', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeIndividualLastName} onChange={e => handleInputChange('trusteeIndividualLastName', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter last name" />
                    </div>
                  </div>
                )}
                {formData.trusteeType === 'joint' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name 1 <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeJointFirstName1} onChange={e => handleInputChange('trusteeJointFirstName1', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name 1 <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeJointLastName1} onChange={e => handleInputChange('trusteeJointLastName1', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter last name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name 2 <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeJointFirstName2} onChange={e => handleInputChange('trusteeJointFirstName2', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter first name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name 2 <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeJointLastName2} onChange={e => handleInputChange('trusteeJointLastName2', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter last name" />
                    </div>
                  </div>
                )}
                {formData.trusteeType === 'corporate' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeCorporateName} onChange={e => handleInputChange('trusteeCorporateName', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter company name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company ACN <span className="text-red-500">*</span></label>
                      <input type="text" value={formData.trusteeCorporateACN} onChange={e => handleInputChange('trusteeCorporateACN', e.target.value)} className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors" placeholder="Enter company ACN" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ABN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Australian Business Number (Optional)
              </label>
              <input
                type="text"
                value={formData.australianBusinessNumber}
                onChange={(e) => handleInputChange('australianBusinessNumber', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                placeholder="Enter ABN if applicable"
              />
            </div>

            {/* GST Registration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                GST Registration <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-4">
                <div
                  className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                    formData.isRegisteredForGST === true 
                      ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('isRegisteredForGST', formData.isRegisteredForGST === true ? null : true)}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.isRegisteredForGST === true ? 'text-gray-900' : 'text-gray-500'}`}>Yes</div>
                  </div>
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

                <div
                  className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                    formData.isRegisteredForGST === false 
                      ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                      : 'border-gray-200'
                  }`}
                  onClick={() => handleInputChange('isRegisteredForGST', formData.isRegisteredForGST === false ? null : false)}
                >
                  <div className="flex-1">
                    <div className={`font-medium ${formData.isRegisteredForGST === false ? 'text-gray-900' : 'text-gray-500'}`}>No</div>
                  </div>
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

            {/* HIN */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holder Identification Number (Optional)
              </label>
              <input
                type="text"
                value={formData.holderIdentificationNumber}
                onChange={(e) => handleInputChange('holderIdentificationNumber', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                placeholder="Enter HIN if applicable"
              />
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.streetAddress}
                  onChange={(e) => handleInputChange('streetAddress', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter street address"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter city"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 appearance-none h-[50px] bg-white pr-10 transition-colors"
                    >
                      <option value="">Select state</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Post Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postCode}
                    onChange={(e) => handleInputChange('postCode', e.target.value)}
                    className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                    placeholder="Enter post code"
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
