"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface ContactFormProps {
  data: Partial<AssessmentData>
  updateData: (data: Partial<AssessmentData>) => void
}

export function ContactForm({ data, updateData }: ContactFormProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Part 4: Contact & Context</h2>
        <p className="text-muted-foreground">We need your contact information to send you the results</p>
      </div>

      {/* Question 16: Your Role */}
      <div className="space-y-3">
        <Label className="text-base font-medium">16. Your Role *</Label>
        <RadioGroup value={data.role} onValueChange={(value) => updateData({ role: value })}>
          {[
            { value: "scrum-master", label: "Scrum Master" },
            { value: "agile-coach", label: "Agile Coach" },
            { value: "product-owner", label: "Product Owner" },
            { value: "team-member", label: "Team Member" },
            { value: "manager", label: "Manager/Leader" },
            { value: "other", label: "Other" }
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={`role-${option.value}`} />
              <Label htmlFor={`role-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {data.role === "other" && (
          <Input
            placeholder="Please specify..."
            value={data.roleOther || ""}
            onChange={(e) => updateData({ roleOther: e.target.value })}
          />
        )}
      </div>

      {/* Question 17: Organization Context */}
      <div className="space-y-3">
        <Label className="text-base font-medium">17. Organization Context (optional)</Label>
        <RadioGroup value={data.organizationContext} onValueChange={(value) => updateData({ organizationContext: value })}>
          {[
            { value: "bosch", label: "Working at Bosch" },
            { value: "external", label: "External organization" },
            { value: "prefer-not-say", label: "Prefer not to say" }
          ].map(option => (
            <div key={option.value} className="flex items-center space-x-3">
              <RadioGroupItem value={option.value} id={`orgContext-${option.value}`} />
              <Label htmlFor={`orgContext-${option.value}`} className="font-normal cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Question 18: Contact Information */}
      <div className="space-y-6">
        <Label className="text-base font-medium">18. Contact Information *</Label>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Name *</Label>
            <Input
              id="name"
              type="text"
              value={data.name || ""}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyTeam" className="text-sm">Company/Team Name (optional)</Label>
            <Input
              id="companyTeam"
              type="text"
              value={data.companyTeam || ""}
              onChange={(e) => updateData({ companyTeam: e.target.value })}
              placeholder="Your company or team name"
            />
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="optedInCommunications"
              checked={data.optedInCommunications || false}
              onCheckedChange={(checked) => updateData({ optedInCommunications: checked as boolean })}
              className="mt-1"
            />
            <Label htmlFor="optedInCommunications" className="text-sm font-normal cursor-pointer">
              I&apos;d like to receive occasional insights and resources about Agile coaching
            </Label>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Ready to Get Your Results?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you submit, you&apos;ll receive:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start">
            <span className="text-accent mr-2">✓</span>
            <span>Instant AI-generated recommendations on-screen</span>
          </li>
          <li className="flex items-start">
            <span className="text-accent mr-2">✓</span>
            <span>Detailed PDF report emailed to you</span>
          </li>
          <li className="flex items-start">
            <span className="text-accent mr-2">✓</span>
            <span>Actionable next steps tailored to your team&apos;s context</span>
          </li>
          <li className="flex items-start">
            <span className="text-accent mr-2">✓</span>
            <span>Resource recommendations based on your pain points</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
