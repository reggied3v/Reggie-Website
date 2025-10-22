"use client"

import { AssessmentData } from "./assessment-form"
import { Label } from "@/components/ui/label"

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
        <div className="space-y-2">
          {[
            { value: "scrum-master", label: "Scrum Master" },
            { value: "agile-coach", label: "Agile Coach" },
            { value: "product-owner", label: "Product Owner" },
            { value: "team-member", label: "Team Member" },
            { value: "manager", label: "Manager/Leader" },
            { value: "other", label: "Other" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={data.role === option.value}
                onChange={(e) => updateData({ role: e.target.value })}
                className="w-4 h-4 text-accent bg-input border-border focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
        {data.role === "other" && (
          <input
            type="text"
            placeholder="Please specify..."
            value={data.roleOther || ""}
            onChange={(e) => updateData({ roleOther: e.target.value })}
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
          />
        )}
      </div>

      {/* Question 17: Organization Context */}
      <div className="space-y-3">
        <Label className="text-base font-medium">17. Organization Context (optional)</Label>
        <div className="space-y-2">
          {[
            { value: "bosch", label: "Working at Bosch" },
            { value: "external", label: "External organization" },
            { value: "prefer-not-say", label: "Prefer not to say" }
          ].map(option => (
            <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="organizationContext"
                value={option.value}
                checked={data.organizationContext === option.value}
                onChange={(e) => updateData({ organizationContext: e.target.value })}
                className="w-4 h-4 text-accent bg-input border-border focus:ring-accent"
              />
              <span className="text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Question 18: Contact Information */}
      <div className="space-y-6">
        <Label className="text-base font-medium">18. Contact Information *</Label>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm">Name *</Label>
            <input
              id="name"
              type="text"
              value={data.name || ""}
              onChange={(e) => updateData({ name: e.target.value })}
              placeholder="Your full name"
              className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm">Email *</Label>
            <input
              id="email"
              type="email"
              value={data.email || ""}
              onChange={(e) => updateData({ email: e.target.value })}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyTeam" className="text-sm">Company/Team Name (optional)</Label>
            <input
              id="companyTeam"
              type="text"
              value={data.companyTeam || ""}
              onChange={(e) => updateData({ companyTeam: e.target.value })}
              placeholder="Your company or team name"
              className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={data.optedInCommunications || false}
                onChange={(e) => updateData({ optedInCommunications: e.target.checked })}
                className="w-4 h-4 mt-1 text-accent bg-input border-border rounded focus:ring-accent"
              />
              <span className="text-sm text-foreground">
                I'd like to receive occasional insights and resources about Agile coaching
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-2">Ready to Get Your Results?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Once you submit, you'll receive:
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
            <span>Actionable next steps tailored to your team's context</span>
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
