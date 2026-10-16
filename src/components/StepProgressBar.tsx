import { Check } from 'lucide-react';
import type { SimulationStep } from '../types';

interface StepProgressBarProps {
  currentStep: SimulationStep;
}

const steps = [
  { number: 1, label: 'Início' },
  { number: 2, label: 'Dados do Cliente' },
  { number: 3, label: 'Configuração' },
  { number: 4, label: 'Resultado' },
];

export function StepProgressBar({ currentStep }: StepProgressBarProps) {
  return (
    <div className="no-print bg-white border-b border-divider">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;
            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-700 text-white'
                        : isCurrent
                        ? 'bg-gold-500 text-white'
                        : 'bg-divider text-text-muted'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                  </div>
                  <span
                    className={`hidden sm:block text-sm font-medium transition-colors duration-300 ${
                      isCurrent
                        ? 'text-green-900'
                        : isCompleted
                        ? 'text-green-700'
                        : 'text-text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 rounded transition-colors duration-300 ${
                      isCompleted ? 'bg-green-700' : 'bg-divider'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
