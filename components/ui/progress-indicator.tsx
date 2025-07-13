'use client'

import React from 'react';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number | string;
  completedSteps: (number | string)[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  completedSteps
}) => {
  // Convert step numbers to numerical positions for calculation
  const getStepPosition = (step: number | string): number => {
    if (typeof step === 'number') return step;
    if (step === '3b') return 3.5;
    return parseInt(step.toString());
  };

  const currentPosition = getStepPosition(currentStep);
  const progressPercentage = ((currentPosition - 1) / (totalSteps - 1)) * 100;

  // Format the current step number for display
  const formatStepNumber = (step: number | string): string => {
    return step.toString();
  };

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Page {formatStepNumber(currentStep)} of {totalSteps} ({Math.round(progressPercentage)}%)
        </span>
      </div>
      
      <div className="relative">
        {/* Progress bar background */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-portfolio-green-600 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}; 