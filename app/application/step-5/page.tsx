'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ProgressIndicator } from '@/components/ui/progress-indicator';

export default function Step5Page() {
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    investmentExperience: '',
    riskTolerance: '',
    portfolioSize: '',
    investmentObjectives: [] as string[],
    timeHorizon: '',
    liquidityNeeds: ''
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleObjectiveToggle = (objective: string) => {
    const current = formData.investmentObjectives;
    const updated = current.includes(objective)
      ? current.filter(obj => obj !== objective)
      : [...current, objective];
    handleInputChange('investmentObjectives', updated);
  };

  const handleNext = () => {
    if (formData.investmentExperience && formData.riskTolerance && formData.portfolioSize) {
      localStorage.setItem('step5Data', JSON.stringify(formData));
      router.push('/application/step-6');
    }
  };

  const handlePrevious = () => {
    router.push('/application/step-4');
  };

  const isFormValid = formData.investmentExperience && formData.riskTolerance && formData.portfolioSize;

  const experienceLevels = [
    { id: 'beginner', label: 'Beginner', description: 'Less than 2 years investment experience' },
    { id: 'intermediate', label: 'Intermediate', description: '2-10 years investment experience' },
    { id: 'advanced', label: 'Advanced', description: 'More than 10 years investment experience' }
  ];

  const riskLevels = [
    { id: 'conservative', label: 'Conservative', description: 'Prefer capital preservation over growth' },
    { id: 'moderate', label: 'Moderate', description: 'Balanced approach to risk and return' },
    { id: 'aggressive', label: 'Aggressive', description: 'Willing to accept higher risk for potential higher returns' }
  ];

  const portfolioSizes = [
    { id: 'under-100k', label: 'Under $100,000' },
    { id: '100k-500k', label: '$100,000 - $500,000' },
    { id: '500k-1m', label: '$500,000 - $1,000,000' },
    { id: '1m-5m', label: '$1,000,000 - $5,000,000' },
    { id: 'over-5m', label: 'Over $5,000,000' }
  ];

  const objectives = [
    'Capital Growth',
    'Income Generation',
    'Capital Preservation',
    'Tax Minimization',
    'Retirement Planning',
    'Estate Planning',
    'Diversification',
    'ESG/Sustainable Investing'
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
        <ProgressIndicator totalSteps={6} currentStep={5} completedSteps={[1, 2, 3, 4]} />

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-portfolio-green-600 mb-2">
              Investment Profile Assessment
            </h2>
            <p className="text-gray-600">
              Help us understand your investment goals and risk tolerance to provide better service.
            </p>
          </div>

          <div className="space-y-8">
            {/* Investment Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Investment Experience Level <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {experienceLevels.map((level, index) => (
                  <div
                    key={level.id}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.investmentExperience === level.id 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('investmentExperience', level.id)}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {String.fromCharCode(65 + index)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.investmentExperience === level.id 
                          ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.investmentExperience === level.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Risk Tolerance <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {riskLevels.map((risk, index) => (
                  <div
                    key={risk.id}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.riskTolerance === risk.id 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('riskTolerance', risk.id)}
                  >
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {String.fromCharCode(65 + index)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{risk.label}</div>
                      <div className="text-sm text-gray-500">{risk.description}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.riskTolerance === risk.id 
                          ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.riskTolerance === risk.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Expected Portfolio Size <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {portfolioSizes.map((size) => (
                  <div
                    key={size.id}
                    className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.portfolioSize === size.id 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleInputChange('portfolioSize', size.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{size.label}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.portfolioSize === size.id 
                          ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.portfolioSize === size.id && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Investment Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Investment Objectives (Select all that apply)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {objectives.map((objective) => (
                  <div
                    key={objective}
                    className={`relative flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 form-element-hover ${
                      formData.investmentObjectives.includes(objective) 
                        ? 'border-portfolio-green-500 bg-portfolio-green-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => handleObjectiveToggle(objective)}
                  >
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">{objective}</div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded border ${
                        formData.investmentObjectives.includes(objective) 
                          ? 'border-portfolio-green-500 bg-portfolio-green-500' 
                          : 'border-gray-300'
                      }`}>
                        {formData.investmentObjectives.includes(objective) && (
                          <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Information Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Investment Suitability Assessment
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      This information helps us ensure our services are suitable for your investment needs and comply with regulatory requirements. You may be contacted for additional clarification if needed.
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
