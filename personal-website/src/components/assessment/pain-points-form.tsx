"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"

interface PainPointsFormProps {
  data: Partial<AssessmentData>
  updateData: (data: Partial<AssessmentData>) => void
}

export function PainPointsForm({ data, updateData }: PainPointsFormProps) {
  const handleCheckboxChange = (field: 'teamDynamics' | 'automationUsage', value: string) => {
    const currentArray = data[field] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateData({ [field]: newArray })
  }

  const updateWorkChallenge = (field: keyof AssessmentData['workChallenges'], value: number) => {
    updateData({
      workChallenges: {
        ...data.workChallenges,
        [field]: value
      } as AssessmentData['workChallenges']
    })
  }

  const updateTransparencyScore = (field: keyof AssessmentData['transparencyScores'], value: number) => {
    updateData({
      transparencyScores: {
        ...data.transparencyScores,
        [field]: value
      } as AssessmentData['transparencyScores']
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Part 3: Pain Points & Improvement</h2>
        <p className="text-muted-foreground">Tell us about your biggest challenges and what you want to improve</p>
      </div>

      {/* Question 10: Biggest Challenge */}
      <div className="space-y-3">
        <Label className="text-base font-medium">10. Biggest Current Challenge *</Label>
        <div className="space-y-2">
          {[
            { value: "unclear-priorities", label: "Unclear priorities / constantly changing scope" },
            { value: "stakeholder-engagement", label: "Limited stakeholder engagement" },
            { value: "technical-debt", label: "Technical debt slowing us down" },
            { value: "team-coordination", label: "Team coordination issues" },
            { value: "estimation", label: "Difficulty estimating work" },
            { value: "definition-done", label: "Incomplete Definition of Done" },
            { value: "lack-autonomy", label: "Lack of team autonomy" },
            { value: "ceremonies-waste", label: "Ceremonies feel like a waste of time" },
            { value: "other", label: "Other" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="biggestChallenge"
                value={option.value}
                checked={data.biggestChallenge === option.value}
                onChange={(e) => updateData({ biggestChallenge: e.target.value })}
                className="w-4 h-4 text-accent bg-input border-border focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
        {data.biggestChallenge === "other" && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.biggestChallengeOther || ""}
            onChange={(e) => updateData({ biggestChallengeOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>

      {/* Question 11: Type of Work Challenges */}
      <div className="space-y-6">
        <Label className="text-base font-medium">11. Type of Work Challenges</Label>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground">
                We struggle to differentiate between &apos;figuring things out&apos; vs &apos;executing known work&apos;
              </p>
              <span className="text-accent font-medium">{data.workChallenges?.discoveryVsExecution || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.workChallenges?.discoveryVsExecution || 3}
              onChange={(e) => updateWorkChallenge('discoveryVsExecution', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground">
                Our backlog items are often too large or unclear
              </p>
              <span className="text-accent font-medium">{data.workChallenges?.backlogClarity || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.workChallenges?.backlogClarity || 3}
              onChange={(e) => updateWorkChallenge('backlogClarity', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground">
                We frequently encounter unexpected blockers mid-sprint
              </p>
              <span className="text-accent font-medium">{data.workChallenges?.unexpectedBlockers || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.workChallenges?.unexpectedBlockers || 3}
              onChange={(e) => updateWorkChallenge('unexpectedBlockers', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>
      </div>

      {/* Question 12: Transparency & Communication */}
      <div className="space-y-6">
        <Label className="text-base font-medium">12. Transparency & Communication</Label>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground">
                Everyone on the team knows what everyone else is working on
              </p>
              <span className="text-accent font-medium">{data.transparencyScores?.teamAwareness || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.transparencyScores?.teamAwareness || 3}
              onChange={(e) => updateTransparencyScore('teamAwareness', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground">
                We openly discuss problems and impediments
              </p>
              <span className="text-accent font-medium">{data.transparencyScores?.openDiscussion || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.transparencyScores?.openDiscussion || 3}
              onChange={(e) => updateTransparencyScore('openDiscussion', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-sm text-foreground">
                Our progress is visible to stakeholders
              </p>
              <span className="text-accent font-medium">{data.transparencyScores?.stakeholderVisibility || 3}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={data.transparencyScores?.stakeholderVisibility || 3}
              onChange={(e) => updateTransparencyScore('stakeholderVisibility', parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground pt-2">
            <span>Strongly Disagree</span>
            <span>Strongly Agree</span>
          </div>
        </div>
      </div>

      {/* Question 13: Team Dynamics */}
      <div className="space-y-3">
        <Label className="text-base font-medium">13. Team Dynamics (select up to 3)</Label>
        <div className="space-y-2">
          {[
            { value: "lack-trust", label: "Lack of trust among team members" },
            { value: "fear-conflict", label: "Fear of conflict / avoiding difficult conversations" },
            { value: "low-commitment", label: "Low commitment to decisions" },
            { value: "avoidance-accountability", label: "Avoidance of accountability" },
            { value: "individual-goals", label: "Inattention to team results (individual goals prioritized)" },
            { value: "strong-cohesion", label: "Strong team cohesion (no major issues)" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.teamDynamics?.includes(option.value) || false}
                onChange={() => handleCheckboxChange('teamDynamics', option.value)}
                className="w-4 h-4 text-accent bg-input border-border rounded focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 14: Automation & AI Usage */}
      <div className="space-y-3">
        <Label className="text-base font-medium">14. Automation & AI Usage (select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "AI tools for coding assistance (Copilot, etc.)",
            "Automated CI/CD pipelines",
            "Automation for testing",
            "Digital collaboration tools effectively",
            "Automated reporting/dashboards",
            "Minimal automation currently",
            "Other"
          ].map(option => (
            <label key={option} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.automationUsage?.includes(option) || false}
                onChange={() => handleCheckboxChange('automationUsage', option)}
                className="w-4 h-4 text-accent bg-input border-border rounded focus:ring-accent"
              />
              <span className="text-foreground">{option}</span>
            </label>
          ))}
        </div>
        {data.automationUsage?.includes("Other") && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.automationUsageOther || ""}
            onChange={(e) => updateData({ automationUsageOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>

      {/* Question 15: What You Want to Improve */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          15. What do you want to improve? *
        </Label>
        <p className="text-sm text-muted-foreground">
          Describe the top 2-3 things you&apos;d like to improve about your team&apos;s way of working (750 characters max)
        </p>
        <textarea
          value={data.improvementGoals || ""}
          onChange={(e) => updateData({ improvementGoals: e.target.value })}
          maxLength={750}
          rows={6}
          placeholder="Describe what you&apos;d like to improve..."
          className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
          required
        />
        <div className="text-xs text-muted-foreground text-right">
          {(data.improvementGoals || "").length}/750 characters
        </div>
      </div>
    </div>
  )
}
