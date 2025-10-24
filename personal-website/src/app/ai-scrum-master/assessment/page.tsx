"use client"

import { Navigation } from "@/components/layout/navigation"
import { AssessmentForm } from "@/components/assessment/assessment-form"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              AI Scrum Master Assessment
            </h1>
            <p className="text-lg text-muted-foreground">
              Complete this 15-minute assessment to receive personalized recommendations
            </p>
          </div>

          <AssessmentForm />
        </div>
      </main>
    </div>
  )
}
