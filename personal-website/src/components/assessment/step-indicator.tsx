"use client"

import { CheckCircle2 } from "lucide-react"

interface Step {
  number: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number

          return (
            <div key={step.number} className="flex-1 relative">
              <div className="flex flex-col items-center">
                {/* Step circle */}
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2
                  transition-all duration-300
                  ${isCompleted ? 'bg-accent text-accent-foreground' : ''}
                  ${isCurrent ? 'bg-accent text-accent-foreground ring-4 ring-accent/30' : ''}
                  ${!isCurrent && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    step.number
                  )}
                </div>

                {/* Step label */}
                <div className="text-center">
                  <div className={`
                    text-sm font-medium
                    ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}
                  `}>
                    {step.title}
                  </div>
                  <div className="text-xs text-muted-foreground hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="absolute top-6 left-1/2 w-full h-0.5 -z-10 hidden md:block">
                  <div className={`
                    h-full transition-all duration-300
                    ${isCompleted ? 'bg-accent' : 'bg-border'}
                  `} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
