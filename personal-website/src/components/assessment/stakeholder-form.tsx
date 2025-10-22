"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"

interface StakeholderFormProps {
  data: Partial<AssessmentData>
  updateData: (data: Partial<AssessmentData>) => void
}

export function StakeholderForm({ data, updateData }: StakeholderFormProps) {
  const handleCheckboxChange = (field: 'currentMetrics', value: string) => {
    const currentArray = data[field] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateData({ [field]: newArray })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Part 2: Stakeholder & Success</h2>
        <p className="text-muted-foreground">Help us understand your stakeholder engagement and success metrics</p>
      </div>

      {/* Question 6: Stakeholder Commitment */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          6. Stakeholder Commitment Level: {data.stakeholderCommitment || 3}
        </Label>
        <p className="text-sm text-muted-foreground">
          "Our key stakeholders actively participate in Sprint Reviews and provide timely feedback"
        </p>
        <input
          type="range"
          min="1"
          max="5"
          value={data.stakeholderCommitment || 3}
          onChange={(e) => updateData({ stakeholderCommitment: parseInt(e.target.value) })}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Strongly Disagree</span>
          <span>Disagree</span>
          <span>Neutral</span>
          <span>Agree</span>
          <span>Strongly Agree</span>
        </div>
      </div>

      {/* Question 7: Product Owner Availability */}
      <div className="space-y-3">
        <Label className="text-base font-medium">7. Product Owner Availability *</Label>
        <div className="space-y-2">
          {[
            { value: "dedicated", label: "Dedicated PO (100% available to team)" },
            { value: "shared", label: "Shared PO (splits time across teams)" },
            { value: "committee", label: "PO by committee (multiple stakeholders)" },
            { value: "none", label: "No clear PO identified" },
            { value: "other", label: "Other" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="poAvailability"
                value={option.value}
                checked={data.poAvailability === option.value}
                onChange={(e) => updateData({ poAvailability: e.target.value })}
                className="w-4 h-4 text-accent bg-input border-border focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
        {data.poAvailability === "other" && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.poAvailabilityOther || ""}
            onChange={(e) => updateData({ poAvailabilityOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>

      {/* Question 8: Definition of Success */}
      <div className="space-y-3">
        <Label className="text-base font-medium">
          8. What does success look like for your stakeholders? *
        </Label>
        <p className="text-sm text-muted-foreground">
          What metrics or outcomes matter most? (500 characters max)
        </p>
        <textarea
          value={data.successDefinition || ""}
          onChange={(e) => updateData({ successDefinition: e.target.value })}
          maxLength={500}
          rows={4}
          placeholder="Describe what success looks like..."
          className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
        />
        <div className="text-xs text-muted-foreground text-right">
          {(data.successDefinition || "").length}/500 characters
        </div>
      </div>

      {/* Question 9: Current Metrics Tracked */}
      <div className="space-y-3">
        <Label className="text-base font-medium">9. Current Metrics Tracked (select all that apply)</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            "Velocity",
            "Sprint Goal Achievement",
            "Team Happiness/Satisfaction",
            "Cycle Time",
            "Lead Time",
            "Business Value Delivered",
            "Customer Satisfaction (Net Promoter Score, Customer Satisfaction Score)",
            "OKRs (Objectives & Key Results)",
            "None currently",
            "Other"
          ].map(metric => (
            <label key={metric} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.currentMetrics?.includes(metric) || false}
                onChange={() => handleCheckboxChange('currentMetrics', metric)}
                className="w-4 h-4 text-accent bg-input border-border rounded focus:ring-accent"
              />
              <span className="text-foreground">{metric}</span>
            </label>
          ))}
        </div>
        {data.currentMetrics?.includes("Other") && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.currentMetricsOther || ""}
            onChange={(e) => updateData({ currentMetricsOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>
    </div>
  )
}
