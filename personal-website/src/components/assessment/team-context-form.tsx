"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"

interface TeamContextFormProps {
  data: Partial<AssessmentData>
  updateData: (data: Partial<AssessmentData>) => void
}

export function TeamContextForm({ data, updateData }: TeamContextFormProps) {
  const handleCheckboxChange = (field: 'currentTools' | 'currentEvents', value: string) => {
    const currentArray = data[field] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateData({ [field]: newArray })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Part 1: Team Context</h2>
        <p className="text-muted-foreground">Tell us about your team setup and current practices</p>
      </div>

      {/* Question 1: Team Setup */}
      <div className="space-y-3">
        <Label className="text-base font-medium">1. Team Setup *</Label>
        <div className="space-y-2">
          {[
            { value: "single-new", label: "Single team just starting Scrum" },
            { value: "single-experienced", label: "Single team with some Scrum experience" },
            { value: "multiple-2-5", label: "Multiple teams needing coordination (2-5 teams)" },
            { value: "scaled-6+", label: "Scaled approach needed (6+ teams)" },
            { value: "other", label: "Other" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="teamSetup"
                value={option.value}
                checked={data.teamSetup === option.value}
                onChange={(e) => updateData({ teamSetup: e.target.value })}
                className="w-4 h-4 text-accent bg-input border-border focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 2: Team Maturity */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          2. Team Maturity Level: {data.teamMaturity || 3}
        </Label>
        <input
          type="range"
          min="1"
          max="5"
          value={data.teamMaturity || 3}
          onChange={(e) => updateData({ teamMaturity: parseInt(e.target.value) })}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Brand new ({"<"}3 months)</span>
          <span>Learning basics (3-6mo)</span>
          <span>Practicing (6-12mo)</span>
          <span>Refining (1-2yr)</span>
          <span>Mature (2+ years)</span>
        </div>
      </div>

      {/* Question 3: Current Tools */}
      <div className="space-y-3">
        <Label className="text-base font-medium">3. Current Tools (select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "JIRA Cloud",
            "JIRA On-Premise",
            "Microsoft DevOps (Azure DevOps)",
            "Confluence",
            "Miro/Mural/Whiteboard",
            "Microsoft Teams",
            "Slack",
            "Other"
          ].map(tool => (
            <label key={tool} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.currentTools?.includes(tool) || false}
                onChange={() => handleCheckboxChange('currentTools', tool)}
                className="w-4 h-4 text-accent bg-input border-border rounded focus:ring-accent"
              />
              <span className="text-foreground">{tool}</span>
            </label>
          ))}
        </div>
        {data.currentTools?.includes("Other") && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.currentToolsOther || ""}
            onChange={(e) => updateData({ currentToolsOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>

      {/* Question 4: Team Distribution */}
      <div className="space-y-3">
        <Label className="text-base font-medium">4. Team Distribution *</Label>
        <div className="space-y-2">
          {[
            { value: "colocated", label: "Fully co-located" },
            { value: "hybrid", label: "Hybrid (some remote, some office)" },
            { value: "distributed-timezones", label: "Fully distributed across time zones" },
            { value: "distributed-similar", label: "Fully distributed within similar time zones" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="teamDistribution"
                value={option.value}
                checked={data.teamDistribution === option.value}
                onChange={(e) => updateData({ teamDistribution: e.target.value })}
                className="w-4 h-4 text-accent bg-input border-border focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 5: Current Scrum Events */}
      <div className="space-y-3">
        <Label className="text-base font-medium">5. Current Scrum Events (select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Daily Standup",
            "Sprint Planning",
            "Sprint Review",
            "Sprint Retrospective",
            "Backlog Refinement",
            "None currently",
            "Other"
          ].map(event => (
            <label key={event} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.currentEvents?.includes(event) || false}
                onChange={() => handleCheckboxChange('currentEvents', event)}
                className="w-4 h-4 text-accent bg-input border-border rounded focus:ring-accent"
              />
              <span className="text-foreground">{event}</span>
            </label>
          ))}
        </div>
        {data.currentEvents?.includes("Other") && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.currentEventsOther || ""}
            onChange={(e) => updateData({ currentEventsOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>
    </div>
  )
}
