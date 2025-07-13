'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ThankYouPage() {
  const [applicationId, setApplicationId] = useState('Loading...');

  useEffect(() => {
    // Get the reference number from localStorage only on client side
    const reviewData = localStorage.getItem('reviewData');
    if (reviewData) {
      const parsedData = JSON.parse(reviewData);
      setApplicationId(parsedData.reference_number);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 page-transition">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 text-center page-transition">
          {/* Success Icon */}
          <div className="mb-8 success-animation">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for choosing PortfolioGuardian for your investment needs.
            </p>
          </div>

          {/* Application Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 card-hover">
            <h2 className="text-lg font-semibold text-green-800 mb-2">
              Application Reference
            </h2>
            <p className="text-2xl font-mono font-bold text-green-700 mb-2">
              {applicationId}
            </p>
            <p className="text-sm text-green-600">
              Please save this reference number for your records
            </p>
          </div>

          {/* Next Steps */}
          <div className="text-left mb-8 page-transition" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What happens next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-portfolio-green-100 rounded-full flex items-center justify-center">
                    <span className="text-portfolio-green-600 font-semibold text-sm">1</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Application Review</h4>
                  <p className="text-sm text-gray-600">Our team will review your application within 2-3 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-portfolio-green-100 rounded-full flex items-center justify-center">
                    <span className="text-portfolio-green-600 font-semibold text-sm">2</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Email Confirmation</h4>
                  <p className="text-sm text-gray-600">You&apos;ll receive email updates on your application status.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-portfolio-green-100 rounded-full flex items-center justify-center">
                    <span className="text-portfolio-green-600 font-semibold text-sm">3</span>
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900">Onboarding</h4>
                  <p className="text-sm text-gray-600">Once approved, you&apos;ll receive detailed onboarding instructions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-700 mb-3">
              If you have any questions about your application, please contact us:
            </p>
            <div className="space-y-2 text-sm text-blue-700">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>hello@portfolioguardian.com</span>
              </div>
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>1300 722 942</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-center space-x-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 button-hover"
          >
            Return to Home
          </Link>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-portfolio-green-600 hover:bg-portfolio-green-700 button-hover"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Confirmation
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <Image
              src="/logo.svg"
              alt="PortfolioGuardian Logo"
              width={200}
              height={200}
              className="rounded-lg mr-3"
            />
          </div>
          <p className="text-sm text-gray-500">
            Secure investment portfolio administration and reporting services
          </p>
        </div>
      </div>
    </div>
  );
} 
