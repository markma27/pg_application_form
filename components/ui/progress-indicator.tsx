'use client'

import React from 'react';

interface ProgressIndicatorProps {
  totalSteps: number;
  currentStep: number;
  completedSteps: number[];
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  totalSteps,
  currentStep,
  completedSteps
}) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-700">
          Page {currentStep} of {totalSteps} ({Math.round(progressPercentage)}%)
        </span>
      </div>
      
      <div className="relative">
        {/* Progress bar background */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="progress-bar h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = completedSteps.includes(stepNumber);
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;
            
            return (
              <div key={stepNumber} className="flex flex-col items-center">
                <div className={`
                  step-indicator
                  ${isCurrent ? 'active' : ''}
                  ${isCompleted ? 'completed' : ''}
                  ${isPending ? 'pending' : ''}
                `}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  Step {stepNumber}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}; 