import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full bg-card border-b sticky top-0 z-10 shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2 relative">
                  <div
                    className={cn(
                      'flex items-center justify-center rounded-full w-10 h-10 border-2 transition-all duration-300',
                      isCompleted && 'bg-primary border-primary',
                      isActive && 'bg-primary border-primary',
                      !isActive && !isCompleted && 'bg-background border-border'
                    )}
                    data-testid={`step-indicator-${step.number}`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-primary-foreground" />
                    ) : (
                      <span
                        className={cn(
                          'text-sm font-semibold',
                          isActive && 'text-primary-foreground',
                          !isActive && 'text-muted-foreground'
                        )}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium hidden sm:block absolute top-12 whitespace-nowrap',
                      isActive && 'text-foreground',
                      !isActive && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 h-0.5 mx-2 transition-all duration-300',
                      isCompleted ? 'bg-primary' : 'bg-border'
                    )}
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
