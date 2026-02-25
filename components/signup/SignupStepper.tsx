'use client';

import { Check } from 'lucide-react';

interface SignupStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function SignupStepper({ currentStep, totalSteps }: SignupStepperProps) {
  const steps = ['Organization', 'Role', 'Details', 'Confirmation'];

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <div className="flex items-center justify-between mb-8">
        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white transition-all ${
                    isCompleted
                      ? 'bg-[#27AE60]'
                      : isCurrent
                      ? 'bg-[#E74C3C]'
                      : 'bg-gray-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </div>
                <p className={`text-xs font-medium mt-2 text-center ${
                  isCurrent ? 'text-[#E74C3C]' : isCompleted ? 'text-[#27AE60]' : 'text-gray-500'
                }`}>
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {stepNumber < totalSteps && (
                <div
                  className={`h-1 flex-1 mx-2 transition-all ${
                    isCompleted ? 'bg-[#27AE60]' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E74C3C] transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
