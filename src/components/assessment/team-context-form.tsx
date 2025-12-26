"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

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
        <RadioGroup value={data.teamSetup} onValueChange={(value) => updateData({ teamSetup: value })}>
          {[
            { value: "single-new", label: "Single team just starting Scrum" },
            { value: "single-experienced", label: "Single team with some Scrum experience" },
            { value: "multiple-2-5", label: "Multiple teams needing coordination (2-5 teams)" },
            { value: "scaled-6+", label: "Scaled approach needed (6+ teams)" },
            { value: "other", label: "Other" }
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={`teamSetup-${option.value}`} />
              <Label htmlFor={`teamSetup-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            <div key={tool} className="flex items-center space-x-3">
              <Checkbox
                id={`tool-${tool}`}
                checked={data.currentTools?.includes(tool) || false}
                onCheckedChange={() => handleCheckboxChange('currentTools', tool)}
              />
              <Label htmlFor={`tool-${tool}`} className="font-normal cursor-pointer">
                {tool}
              </Label>
            </div>
          ))}
        </div>
        {data.currentTools?.includes("Other") && (
          <Input
            placeholder="Please specify..."
            value={data.currentToolsOther || ""}
            onChange={(e) => updateData({ currentToolsOther: e.target.value })}
          />
        )}
      </div>

      {/* Question 4: Team Distribution */}
      <div className="space-y-3">
        <Label className="text-base font-medium">4. Team Distribution *</Label>
        <RadioGroup value={data.teamDistribution} onValueChange={(value) => updateData({ teamDistribution: value })}>
          {[
            { value: "colocated", label: "Fully co-located" },
            { value: "hybrid", label: "Hybrid (some remote, some office)" },
            { value: "distributed-timezones", label: "Fully distributed across time zones" },
            { value: "distributed-similar", label: "Fully distributed within similar time zones" }
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={`teamDist-${option.value}`} />
              <Label htmlFor={`teamDist-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Question 5: Current Scrum Events */}
      <div className="space-y-3">
        <Label className="text-base font-medium">5. Current Scrum Events (select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Daily Standup",
            "Sprint Planning",
            "Sprint Review",
            "Sprint Retrospective",
            "Backlog Refinement",
            "None currently",
            "Other"
          ].map(event => (
            <div key={event} className="flex items-center space-x-3">
              <Checkbox
                id={`event-${event}`}
                checked={data.currentEvents?.includes(event) || false}
                onCheckedChange={() => handleCheckboxChange('currentEvents', event)}
              />
              <Label htmlFor={`event-${event}`} className="font-normal cursor-pointer">
                {event}
              </Label>
            </div>
          ))}
        </div>
        {data.currentEvents?.includes("Other") && (
          <Input
            placeholder="Please specify..."
            value={data.currentEventsOther || ""}
            onChange={(e) => updateData({ currentEventsOther: e.target.value })}
          />
        )}
      </div>
    </div>
  )
}
