"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { StepIndicator } from "./step-indicator"
import { TeamContextForm } from "./team-context-form"
import { StakeholderForm } from "./stakeholder-form"
import { PainPointsForm } from "./pain-points-form"
import { ContactForm } from "./contact-form-assessment"

export interface AssessmentData {
  // Part 1: Team Context
  teamSetup: string
  teamMaturity: number
  currentTools: string[]
  currentToolsOther?: string
  teamDistribution: string
  currentEvents: string[]
  currentEventsOther?: string

  // Part 2: Stakeholder & Success
  stakeholderCommitment: number
  poAvailability: string
  poAvailabilityOther?: string
  successDefinition: string
  currentMetrics: string[]
  currentMetricsOther?: string

  // Part 3: Pain Points & Improvement
  biggestChallenge: string
  biggestChallengeOther?: string
  workChallenges: {
    discoveryVsExecution: number
    backlogClarity: number
    unexpectedBlockers: number
  }
  transparencyScores: {
    teamAwareness: number
    openDiscussion: number
    stakeholderVisibility: number
  }
  teamDynamics: string[]
  automationUsage: string[]
  automationUsageOther?: string
  improvementGoals: string

  // Part 4: Contact & Context
  role: string
  roleOther?: string
  organizationContext: string
  name: string
  email: string
  companyTeam?: string
  optedInCommunications: boolean
}

const STEPS = [
  { number: 1, title: "Team Context", description: "Setup and maturity" },
  { number: 2, title: "Stakeholders", description: "Success & metrics" },
  { number: 3, title: "Pain Points", description: "Challenges & goals" },
  { number: 4, title: "Contact Info", description: "Get your results" }
]

export function AssessmentForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<AssessmentData>>({
    teamMaturity: 3,
    currentTools: [],
    currentEvents: [],
    stakeholderCommitment: 3,
    currentMetrics: [],
    workChallenges: {
      discoveryVsExecution: 3,
      backlogClarity: 3,
      unexpectedBlockers: 3
    },
    transparencyScores: {
      teamAwareness: 3,
      openDiscussion: 3,
      stakeholderVisibility: 3
    },
    teamDynamics: [],
    automationUsage: [],
    optedInCommunications: false
  })

  const updateFormData = (data: Partial<AssessmentData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Save to database
      const response = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Failed to submit assessment:', error)
        alert('Failed to submit assessment. Please try again.')
        setIsSubmitting(false)
        return
      }

      const result = await response.json()

      // Store assessment ID and results in sessionStorage for results page
      sessionStorage.setItem('assessmentId', result.assessmentId)
      sessionStorage.setItem('assessmentData', JSON.stringify(formData))
      sessionStorage.setItem('assessmentResults', JSON.stringify({
        overallScore: result.overallScore,
        maturityLevel: result.maturityLevel
      }))

      // Navigate to results page
      router.push('/ai-scrum-master/results')
    } catch (error) {
      console.error('Error submitting assessment:', error)
      alert('An error occurred while submitting your assessment. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <Card className="glass p-8">
        {currentStep === 1 && (
          <TeamContextForm
            data={formData}
            updateData={updateFormData}
          />
        )}
        {currentStep === 2 && (
          <StakeholderForm
            data={formData}
            updateData={updateFormData}
          />
        )}
        {currentStep === 3 && (
          <PainPointsForm
            data={formData}
            updateData={updateFormData}
          />
        )}
        {currentStep === 4 && (
          <ContactForm
            data={formData}
            updateData={updateFormData}
          />
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="flex items-center"
              disabled={isSubmitting}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing Your Responses...
                </>
              ) : (
                <>
                  Get My Results
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
