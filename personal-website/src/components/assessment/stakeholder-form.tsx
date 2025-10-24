"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

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
          &quot;Our key stakeholders actively participate in Sprint Reviews and provide timely feedback&quot;
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
        <RadioGroup value={data.poAvailability} onValueChange={(value) => updateData({ poAvailability: value })}>
          {[
            { value: "dedicated", label: "Dedicated PO (100% available to team)" },
            { value: "shared", label: "Shared PO (splits time across teams)" },
            { value: "committee", label: "PO by committee (multiple stakeholders)" },
            { value: "none", label: "No clear PO identified" },
            { value: "other", label: "Other" }
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={`poAvail-${option.value}`} />
              <Label htmlFor={`poAvail-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {data.poAvailability === "other" && (
          <Input
            placeholder="Please specify..."
            value={data.poAvailabilityOther || ""}
            onChange={(e) => updateData({ poAvailabilityOther: e.target.value })}
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
        <Textarea
          value={data.successDefinition || ""}
          onChange={(e) => updateData({ successDefinition: e.target.value })}
          maxLength={500}
          rows={4}
          placeholder="Describe what success looks like..."
          required
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
            <div key={metric} className="flex items-center space-x-3">
              <Checkbox
                id={`metric-${metric}`}
                checked={data.currentMetrics?.includes(metric) || false}
                onCheckedChange={() => handleCheckboxChange('currentMetrics', metric)}
              />
              <Label htmlFor={`metric-${metric}`} className="font-normal cursor-pointer">
                {metric}
              </Label>
            </div>
          ))}
        </div>
        {data.currentMetrics?.includes("Other") && (
          <Input
            placeholder="Please specify..."
            value={data.currentMetricsOther || ""}
            onChange={(e) => updateData({ currentMetricsOther: e.target.value })}
          />
        )}
      </div>
    </div>
  )
}
