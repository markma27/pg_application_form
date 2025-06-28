'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function Step4Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    adviserName: '',
    companyName: '',
    address: '',
    telephone: '',
    email: '',
    isPrimaryContact: null as boolean | null,
    canAccessStatements: null as boolean | null,
    canDealDirect: null as boolean | null
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step4Data');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean | null) => {
    const updatedData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedData);
    // Save to localStorage whenever data changes
    localStorage.setItem('step4Data', JSON.stringify(updatedData));
  };

  const isFormValid = () => {
    // If no adviser information is provided, the form is valid
    if (!formData.adviserName && !formData.companyName && !formData.address && 
        !formData.telephone && !formData.email && formData.isPrimaryContact === null &&
        formData.canAccessStatements === null && formData.canDealDirect === null) {
      return true;
    }

    // If any adviser information is provided, validate all fields
    if (formData.adviserName || formData.companyName || formData.address || 
        formData.telephone || formData.email || formData.isPrimaryContact !== null ||
        formData.canAccessStatements !== null || formData.canDealDirect !== null) {
      
      // All fields must be filled if any field is filled
      if (!formData.adviserName || !formData.companyName || !formData.address || 
          !formData.telephone || !formData.email || formData.isPrimaryContact === null ||
          formData.canAccessStatements === null || formData.canDealDirect === null) {
        return false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        return false;
      }

      // Phone validation (Australian format)
      const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
      if (!phoneRegex.test(formData.telephone)) {
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    // Save form data to localStorage (even if empty)
    localStorage.setItem('step4Data', JSON.stringify(formData));
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
    
    // Reset current form state
    setFormData({
      adviserName: '',
      companyName: '',
      address: '',
      telephone: '',
      email: '',
      isPrimaryContact: null,
      canAccessStatements: null,
      canDealDirect: null
    });
    
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
        <ProgressIndicator totalSteps={7} currentStep={4} completedSteps={[1, 2, 3]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Investment Adviser Details
            </h2>
            <p className="text-gray-600">
              You may provide your investment adviser&apos;s information (optional).
            </p>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Adviser Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adviser Name
                </label>
                <input
                  type="text"
                  value={formData.adviserName}
                  onChange={(e) => handleInputChange('adviserName', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter adviser&apos;s name"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter company name"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                placeholder="Enter business address"
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Telephone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => handleInputChange('telephone', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter telephone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Authorizations */}
            <div className="space-y-6">
              {/* Primary Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Do you nominate your Investment Adviser as the primary contact for your portfolio?
                </label>
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.isPrimaryContact === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('isPrimaryContact', formData.isPrimaryContact === true ? null : true)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.isPrimaryContact === true ? 'text-gray-900' : 'text-gray-500'}`}>Yes</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.isPrimaryContact === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.isPrimaryContact === true && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.isPrimaryContact === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('isPrimaryContact', formData.isPrimaryContact === false ? null : false)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.isPrimaryContact === false ? 'text-gray-900' : 'text-gray-500'}`}>No</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.isPrimaryContact === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.isPrimaryContact === false && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Access to Statements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Do you authorise your Investment Adviser to access your financial statements online?
                </label>
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.canAccessStatements === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('canAccessStatements', formData.canAccessStatements === true ? null : true)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.canAccessStatements === true ? 'text-gray-900' : 'text-gray-500'}`}>Yes</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.canAccessStatements === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.canAccessStatements === true && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.canAccessStatements === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('canAccessStatements', formData.canAccessStatements === false ? null : false)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.canAccessStatements === false ? 'text-gray-900' : 'text-gray-500'}`}>No</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.canAccessStatements === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.canAccessStatements === false && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Dealing */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Do you authorise us to deal with your Investment Adviser directly?
                </label>
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.canDealDirect === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('canDealDirect', formData.canDealDirect === true ? null : true)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.canDealDirect === true ? 'text-gray-900' : 'text-gray-500'}`}>Yes</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.canDealDirect === true 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.canDealDirect === true && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.canDealDirect === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('canDealDirect', formData.canDealDirect === false ? null : false)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.canDealDirect === false ? 'text-gray-900' : 'text-gray-500'}`}>No</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.canDealDirect === false 
                        ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {formData.canDealDirect === false && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
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
              className="w-32 px-6 py-2 rounded-md font-medium transition-colors bg-portfolio-green-600 text-white hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-portfolio-green-500 flex items-center justify-center"
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
