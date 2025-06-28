'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleStartApplication = () => {
    // Clear all localStorage data
    localStorage.removeItem('step1Data');
    localStorage.removeItem('step2Data');
    localStorage.removeItem('step3Data');
    localStorage.removeItem('step4Data');
    localStorage.removeItem('step5Data');
    localStorage.removeItem('step6Data');
    localStorage.removeItem('step7Data');
    
    // Navigate to step 1
    router.push('/application/step-1');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center page-transition">
        {/* Logo */}
        <div className="mb-8">
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

        {/* Welcome Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Client Application Form
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Onboard new clients for investment portfolio administration and reporting services.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Secure Application Process
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Your data is protected with bank-level security. This application uses end-to-end encryption to ensure your information remains safe.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-left space-y-3 mb-6">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Identity verification with document upload</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Investment profile assessment</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">Secure document storage</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-700">GDPR compliant data handling</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <button 
            onClick={handleStartApplication}
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-portfolio-green-600 hover:bg-portfolio-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-portfolio-green-500 transition-colors duration-200 button-hover"
          >
            Start Application
            <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Estimated completion time: 10-15 minutes
          </p>
        </div>
      </div>
    </div>
  );
} 
