'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export default function Step3Page() {
  const router = useRouter();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    role: '',
    email: '',
    phone: '',
    preferredContact: null as string | null,
    hasSecondaryContact: null as boolean | null,
    secondaryFirstName: '',
    secondaryLastName: '',
    secondaryRole: '',
    secondaryEmail: '',
    secondaryPhone: '',
    secondaryPreferredContact: null as string | null
  });

  // Load saved data when component mounts
  React.useEffect(() => {
    const savedData = localStorage.getItem('step3Data');
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
    localStorage.setItem('step3Data', JSON.stringify(updatedData));
  };

  const isFormValid = () => {
    // Basic field validation
    if (!formData.firstName || !formData.lastName || !formData.role || 
        !formData.email || !formData.phone || !formData.preferredContact ||
        formData.hasSecondaryContact === null) {
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return false;
    }

    // Phone validation (Australian format)
    const phoneRegex = /^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/;
    if (!phoneRegex.test(formData.phone)) {
      return false;
    }

    // If user selected to add secondary contact, validate secondary contact fields
    if (formData.hasSecondaryContact === true) {
      if (!formData.secondaryFirstName || !formData.secondaryLastName || 
          !formData.secondaryRole || !formData.secondaryEmail || 
          !formData.secondaryPhone || !formData.secondaryPreferredContact) {
        return false;
      }

      // Validate secondary email
      if (!emailRegex.test(formData.secondaryEmail)) {
        return false;
      }

      // Validate secondary phone
      if (!phoneRegex.test(formData.secondaryPhone)) {
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (!isFormValid()) {
      return;
    }

    // Save form data to localStorage
    localStorage.setItem('step3Data', JSON.stringify(formData));
    router.push('/application/step-4');
  };

  const handlePrevious = () => {
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
    
    // Reset current form state
    setFormData({
      firstName: '',
      lastName: '',
      role: '',
      email: '',
      phone: '',
      preferredContact: null,
      hasSecondaryContact: null,
      secondaryFirstName: '',
      secondaryLastName: '',
      secondaryRole: '',
      secondaryEmail: '',
      secondaryPhone: '',
      secondaryPreferredContact: null
    });
    
    // Close dialog and redirect to home page
    setIsConfirmationOpen(false);
    router.push('/');
  };

  const handleRestartCancel = () => {
    setIsConfirmationOpen(false);
  };

  const contactMethods = [
    'Email',
    'Phone',
    'Both'
  ];

  const roles = [
    'Individual',
    'Individual Trustee',
    'Director of Corporate Trustee',
    'Company Director',
    'Company Secretary',
    'Other'
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
        <ProgressIndicator totalSteps={8} currentStep={3} completedSteps={[1, 2]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Contact Details
            </h2>
            <p className="text-gray-600">
              Please provide details for the main contact person for this account.
            </p>
          </div>

          <div className="space-y-6">
            {/* Main Contact Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter first name"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 appearance-none h-[50px] bg-white pr-10 transition-colors"
                >
                  <option value="">Select role</option>
                  <option value="Individual">Individual</option>
                  <option value="Individual Trustee">Individual Trustee</option>
                  <option value="Director of Corporate Trustee">Director of Corporate Trustee</option>
                  <option value="Company Director">Company Director</option>
                  <option value="Company Secretary">Company Secretary</option>
                  <option value="Other">Other</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Contact Preference and Authorised Signatory */}
            <div className="space-y-6">
              {/* Preferred Contact Method */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Preferred Contact Method <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  {['Phone', 'Email', 'Both'].map((method) => (
                    <div
                      key={method}
                      className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                        formData.preferredContact === method.toLowerCase()
                          ? 'border-portfolio-green-500 bg-portfolio-green-50'
                          : 'border-gray-200'
                      }`}
                      onClick={() => handleInputChange('preferredContact', method.toLowerCase())}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{method}</div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.preferredContact === method.toLowerCase()
                          ? 'border-portfolio-green-500 bg-portfolio-green-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.preferredContact === method.toLowerCase() && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Secondary Contact Question */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Do you want to add a secondary contact person? <span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-4">
                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.hasSecondaryContact === true
                        ? 'border-portfolio-green-500 bg-portfolio-green-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('hasSecondaryContact', formData.hasSecondaryContact === true ? null : true)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.hasSecondaryContact === true ? 'text-gray-900' : 'text-gray-500'}`}>Yes</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.hasSecondaryContact === true
                        ? 'border-portfolio-green-500 bg-portfolio-green-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.hasSecondaryContact === true && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.hasSecondaryContact === false
                        ? 'border-portfolio-green-500 bg-portfolio-green-50'
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('hasSecondaryContact', formData.hasSecondaryContact === false ? null : false)}
                  >
                    <div className="flex-1">
                      <div className={`font-medium ${formData.hasSecondaryContact === false ? 'text-gray-900' : 'text-gray-500'}`}>No</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      formData.hasSecondaryContact === false
                        ? 'border-portfolio-green-500 bg-portfolio-green-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.hasSecondaryContact === false && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Contact Details */}
              {formData.hasSecondaryContact && (
                <div className="mt-6 space-y-6 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900">Secondary Contact Details</h3>
                  
                  {/* Secondary Contact Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryFirstName}
                        onChange={(e) => handleInputChange('secondaryFirstName', e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                        placeholder="Enter first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.secondaryLastName}
                        onChange={(e) => handleInputChange('secondaryLastName', e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.secondaryRole}
                        onChange={(e) => handleInputChange('secondaryRole', e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 appearance-none h-[50px] bg-white pr-10 transition-colors"
                      >
                        <option value="">Select role</option>
                        <option value="Individual">Individual</option>
                        <option value="Individual Trustee">Individual Trustee</option>
                        <option value="Director of Corporate Trustee">Director of Corporate Trustee</option>
                        <option value="Company Director">Company Director</option>
                        <option value="Company Secretary">Company Secretary</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.secondaryEmail}
                        onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                        placeholder="Enter email address"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.secondaryPhone}
                        onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                        className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-portfolio-green-500 transition-colors"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Preferred Contact Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Preferred Contact Method <span className="text-red-500">*</span>
                    </label>
                    <div className="flex space-x-4">
                      {['Phone', 'Email', 'Both'].map((method) => (
                        <div
                          key={method}
                          className={`flex-1 relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                            formData.secondaryPreferredContact === method.toLowerCase()
                              ? 'border-portfolio-green-500 bg-portfolio-green-50'
                              : 'border-gray-200'
                          }`}
                          onClick={() => handleInputChange('secondaryPreferredContact', method.toLowerCase())}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{method}</div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            formData.secondaryPreferredContact === method.toLowerCase()
                              ? 'border-portfolio-green-500 bg-portfolio-green-500'
                              : 'border-gray-300'
                          }`}>
                            {formData.secondaryPreferredContact === method.toLowerCase() && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
