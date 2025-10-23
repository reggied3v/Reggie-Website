"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, X } from "lucide-react"

interface StructuredNotesFormProps {
  meetingType: string
  onNotesChange: (notes: string) => void
}

export function StructuredNotesForm({ meetingType, onNotesChange }: StructuredNotesFormProps) {
  const [notes, setNotes] = useState({
    participants: [] as string[],
    teamUpdates: [] as { member: string; update: string }[],
    discussionTopics: [] as string[],
    decisionsMade: [] as { decision: string; rationale: string }[],
    openQuestions: [] as string[],
    blockers: [] as { blocker: string; impact: string }[],
    actionItems: [] as { title: string; assignedTo: string; dueDate: string }[],
    sentiment: 3, // 1-5 scale
    additionalNotes: ""
  })

  const updateNotes = (updates: Partial<typeof notes>) => {
    const updatedNotes = { ...notes, ...updates }
    setNotes(updatedNotes)

    // Convert structured notes to formatted text for AI analysis
    const formattedText = formatNotesAsText(updatedNotes, meetingType)
    onNotesChange(formattedText)
  }

  return (
    <div className="space-y-6">
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
        <p className="text-sm text-muted-foreground">
          <strong>Tip:</strong> Fill out this structured template instead of uploading a transcript.
          The AI will analyze your notes the same way it would analyze a full transcript.
        </p>
      </div>

      {/* Participants */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Participants</Label>
        <p className="text-sm text-muted-foreground">Who attended this meeting?</p>
        {notes.participants.map((participant, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={participant}
              onChange={(e) => {
                const updated = [...notes.participants]
                updated[index] = e.target.value
                updateNotes({ participants: updated })
              }}
              placeholder="Name or role"
              className="flex-1 px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = notes.participants.filter((_, i) => i !== index)
                updateNotes({ participants: updated })
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateNotes({ participants: [...notes.participants, ""] })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Participant
        </Button>
      </div>

      {/* Team Updates */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Team Updates</Label>
        <p className="text-sm text-muted-foreground">What did team members share?</p>
        {notes.teamUpdates.map((update, index) => (
          <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
            <input
              type="text"
              value={update.member}
              onChange={(e) => {
                const updated = [...notes.teamUpdates]
                updated[index].member = e.target.value
                updateNotes({ teamUpdates: updated })
              }}
              placeholder="Team member name"
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <textarea
              value={update.update}
              onChange={(e) => {
                const updated = [...notes.teamUpdates]
                updated[index].update = e.target.value
                updateNotes({ teamUpdates: updated })
              }}
              placeholder="What they shared (e.g., completed work, current work, blockers)"
              rows={3}
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = notes.teamUpdates.filter((_, i) => i !== index)
                updateNotes({ teamUpdates: updated })
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateNotes({ teamUpdates: [...notes.teamUpdates, { member: "", update: "" }] })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Update
        </Button>
      </div>

      {/* Discussion Topics (for retros, planning, etc.) */}
      {meetingType !== 'standup' && (
        <div className="space-y-2">
          <Label className="text-base font-medium">Discussion Topics</Label>
          <p className="text-sm text-muted-foreground">What topics were discussed?</p>
          {notes.discussionTopics.map((topic, index) => (
            <div key={index} className="flex gap-2">
              <textarea
                value={topic}
                onChange={(e) => {
                  const updated = [...notes.discussionTopics]
                  updated[index] = e.target.value
                  updateNotes({ discussionTopics: updated })
                }}
                placeholder="Topic and key points discussed"
                rows={2}
                className="flex-1 px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const updated = notes.discussionTopics.filter((_, i) => i !== index)
                  updateNotes({ discussionTopics: updated })
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => updateNotes({ discussionTopics: [...notes.discussionTopics, ""] })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Topic
          </Button>
        </div>
      )}

      {/* Decisions Made */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Decisions Made</Label>
        <p className="text-sm text-muted-foreground">What decisions were reached?</p>
        {notes.decisionsMade.map((decision, index) => (
          <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
            <input
              type="text"
              value={decision.decision}
              onChange={(e) => {
                const updated = [...notes.decisionsMade]
                updated[index].decision = e.target.value
                updateNotes({ decisionsMade: updated })
              }}
              placeholder="The decision"
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <textarea
              value={decision.rationale}
              onChange={(e) => {
                const updated = [...notes.decisionsMade]
                updated[index].rationale = e.target.value
                updateNotes({ decisionsMade: updated })
              }}
              placeholder="Why this decision was made"
              rows={2}
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = notes.decisionsMade.filter((_, i) => i !== index)
                updateNotes({ decisionsMade: updated })
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateNotes({ decisionsMade: [...notes.decisionsMade, { decision: "", rationale: "" }] })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Decision
        </Button>
      </div>

      {/* Open Questions */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Open Questions</Label>
        <p className="text-sm text-muted-foreground">What questions need to be answered?</p>
        {notes.openQuestions.map((question, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => {
                const updated = [...notes.openQuestions]
                updated[index] = e.target.value
                updateNotes({ openQuestions: updated })
              }}
              placeholder="Unresolved question"
              className="flex-1 px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = notes.openQuestions.filter((_, i) => i !== index)
                updateNotes({ openQuestions: updated })
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateNotes({ openQuestions: [...notes.openQuestions, ""] })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </Button>
      </div>

      {/* Blockers */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Blockers / Impediments</Label>
        <p className="text-sm text-muted-foreground">What's slowing the team down?</p>
        {notes.blockers.map((blocker, index) => (
          <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
            <input
              type="text"
              value={blocker.blocker}
              onChange={(e) => {
                const updated = [...notes.blockers]
                updated[index].blocker = e.target.value
                updateNotes({ blockers: updated })
              }}
              placeholder="The blocker or impediment"
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <input
              type="text"
              value={blocker.impact}
              onChange={(e) => {
                const updated = [...notes.blockers]
                updated[index].impact = e.target.value
                updateNotes({ blockers: updated })
              }}
              placeholder="Impact on the team"
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = notes.blockers.filter((_, i) => i !== index)
                updateNotes({ blockers: updated })
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateNotes({ blockers: [...notes.blockers, { blocker: "", impact: "" }] })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Blocker
        </Button>
      </div>

      {/* Action Items */}
      <div className="space-y-2">
        <Label className="text-base font-medium">Action Items</Label>
        <p className="text-sm text-muted-foreground">What needs to be done and by whom?</p>
        {notes.actionItems.map((item, index) => (
          <div key={index} className="space-y-2 p-3 border border-border rounded-lg">
            <input
              type="text"
              value={item.title}
              onChange={(e) => {
                const updated = [...notes.actionItems]
                updated[index].title = e.target.value
                updateNotes({ actionItems: updated })
              }}
              placeholder="What needs to be done"
              className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={item.assignedTo}
                onChange={(e) => {
                  const updated = [...notes.actionItems]
                  updated[index].assignedTo = e.target.value
                  updateNotes({ actionItems: updated })
                }}
                placeholder="Assigned to"
                className="px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              />
              <input
                type="date"
                value={item.dueDate}
                onChange={(e) => {
                  const updated = [...notes.actionItems]
                  updated[index].dueDate = e.target.value
                  updateNotes({ actionItems: updated })
                }}
                className="px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const updated = notes.actionItems.filter((_, i) => i !== index)
                updateNotes({ actionItems: updated })
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => updateNotes({ actionItems: [...notes.actionItems, { title: "", assignedTo: "", dueDate: "" }] })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Action Item
        </Button>
      </div>

      {/* Meeting Sentiment */}
      <div className="space-y-2">
        <Label htmlFor="sentiment" className="text-base font-medium">
          Overall Meeting Energy/Sentiment: {notes.sentiment}/5
        </Label>
        <p className="text-sm text-muted-foreground">How would you rate the overall tone and energy?</p>
        <input
          id="sentiment"
          type="range"
          min="1"
          max="5"
          value={notes.sentiment}
          onChange={(e) => updateNotes({ sentiment: parseInt(e.target.value) })}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-accent"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Very Low</span>
          <span>Low</span>
          <span>Neutral</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="text-base font-medium">
          Additional Notes (Optional)
        </Label>
        <p className="text-sm text-muted-foreground">Anything else worth noting?</p>
        <textarea
          id="additionalNotes"
          value={notes.additionalNotes}
          onChange={(e) => updateNotes({ additionalNotes: e.target.value })}
          placeholder="Any additional context, observations, or notes..."
          rows={4}
          className="w-full px-3 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none"
        />
      </div>
    </div>
  )
}

// Format structured notes as readable text for AI analysis
function formatNotesAsText(notes: any, meetingType: string): string {
  const sections: string[] = []

  sections.push(`MEETING TYPE: ${meetingType}`)
  sections.push('')

  if (notes.participants.length > 0) {
    sections.push('PARTICIPANTS:')
    notes.participants.forEach((p: string) => p && sections.push(`- ${p}`))
    sections.push('')
  }

  if (notes.teamUpdates.length > 0) {
    sections.push('TEAM UPDATES:')
    notes.teamUpdates.forEach((u: any) => {
      if (u.member || u.update) {
        sections.push(`${u.member}:`)
        sections.push(u.update)
        sections.push('')
      }
    })
  }

  if (notes.discussionTopics.length > 0) {
    sections.push('DISCUSSION TOPICS:')
    notes.discussionTopics.forEach((t: string) => t && sections.push(`- ${t}`))
    sections.push('')
  }

  if (notes.decisionsMade.length > 0) {
    sections.push('DECISIONS MADE:')
    notes.decisionsMade.forEach((d: any) => {
      if (d.decision) {
        sections.push(`Decision: ${d.decision}`)
        if (d.rationale) sections.push(`Rationale: ${d.rationale}`)
        sections.push('')
      }
    })
  }

  if (notes.openQuestions.length > 0) {
    sections.push('OPEN QUESTIONS:')
    notes.openQuestions.forEach((q: string) => q && sections.push(`- ${q}`))
    sections.push('')
  }

  if (notes.blockers.length > 0) {
    sections.push('BLOCKERS / IMPEDIMENTS:')
    notes.blockers.forEach((b: any) => {
      if (b.blocker) {
        sections.push(`Blocker: ${b.blocker}`)
        if (b.impact) sections.push(`Impact: ${b.impact}`)
        sections.push('')
      }
    })
  }

  if (notes.actionItems.length > 0) {
    sections.push('ACTION ITEMS:')
    notes.actionItems.forEach((a: any) => {
      if (a.title) {
        sections.push(`- ${a.title}`)
        if (a.assignedTo) sections.push(`  Assigned to: ${a.assignedTo}`)
        if (a.dueDate) sections.push(`  Due: ${a.dueDate}`)
      }
    })
    sections.push('')
  }

  sections.push(`MEETING SENTIMENT: ${notes.sentiment}/5`)
  sections.push('')

  if (notes.additionalNotes) {
    sections.push('ADDITIONAL NOTES:')
    sections.push(notes.additionalNotes)
  }

  return sections.join('\n')
}
