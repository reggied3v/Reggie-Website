"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Upload, FileText, ClipboardList } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { StructuredNotesForm } from "@/components/meetings/structured-notes-form"

export default function UploadPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<any[]>([])
  const [inputMode, setInputMode] = useState<'transcript' | 'structured'>('transcript')
  const [formData, setFormData] = useState({
    teamId: "",
    meetingType: "standup",
    meetingDate: new Date().toISOString().split('T')[0],
    durationMinutes: "",
    transcriptText: "",
    transcriptSource: "manual"
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadTeams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadTeams = async () => {
    setLoading(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setTeams(data)
      if (data.length > 0 && !formData.teamId) {
        setFormData({ ...formData, teamId: data[0].id })
      }
    }
    setLoading(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setFormData({ ...formData, transcriptText: text })
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert("You must be logged in to upload transcripts")
        router.push('/login')
        return
      }

      // Call API to create meeting and trigger analysis
      const response = await fetch('/api/meetings/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: formData.teamId,
          meetingType: formData.meetingType,
          meetingDate: formData.meetingDate,
          durationMinutes: formData.durationMinutes ? parseInt(formData.durationMinutes) : null,
          transcriptText: formData.transcriptText,
          transcriptSource: formData.transcriptSource,
          uploadedBy: user.id
        })
      })

      if (!response.ok) {
        const error = await response.json()
        alert('Failed to upload transcript: ' + (error.error || 'Unknown error'))
        setUploading(false)
        return
      }

      const result = await response.json()

      // Redirect to meeting detail page
      router.push(`/dashboard/meetings/${result.meetingId}`)
    } catch (error) {
      console.error('Error uploading transcript:', error)
      alert('An error occurred while uploading the transcript')
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl flex items-center gap-2">
                <Upload className="w-8 h-8 text-accent" />
                Upload Meeting Transcript
              </CardTitle>
              <CardDescription>
                Upload a transcript from your Scrum ceremony for AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Team Selection */}
                <div className="space-y-2">
                  <Label htmlFor="teamId" className="text-base font-medium">
                    Team *
                  </Label>
                  <select
                    id="teamId"
                    value={formData.teamId}
                    onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
                    className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    required
                  >
                    {teams.length === 0 ? (
                      <option value="">No teams available</option>
                    ) : (
                      teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))
                    )}
                  </select>
                  {teams.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      <Link href="/dashboard/teams/new" className="text-accent hover:underline">
                        Create a team
                      </Link>
                      {" "}first to upload transcripts
                    </p>
                  )}
                </div>

                {/* Meeting Type */}
                <div className="space-y-2">
                  <Label htmlFor="meetingType" className="text-base font-medium">
                    Meeting Type *
                  </Label>
                  <select
                    id="meetingType"
                    value={formData.meetingType}
                    onChange={(e) => setFormData({ ...formData, meetingType: e.target.value })}
                    className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    required
                  >
                    <option value="standup">Daily Standup</option>
                    <option value="planning">Sprint Planning</option>
                    <option value="review">Sprint Review</option>
                    <option value="retrospective">Retrospective</option>
                    <option value="refinement">Backlog Refinement</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Meeting Date */}
                <div className="space-y-2">
                  <Label htmlFor="meetingDate" className="text-base font-medium">
                    Meeting Date *
                  </Label>
                  <input
                    id="meetingDate"
                    type="date"
                    value={formData.meetingDate}
                    onChange={(e) => setFormData({ ...formData, meetingDate: e.target.value })}
                    className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="durationMinutes" className="text-base font-medium">
                    Duration (minutes)
                  </Label>
                  <input
                    id="durationMinutes"
                    type="number"
                    min="1"
                    max="480"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: e.target.value })}
                    placeholder="e.g., 15"
                    className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                  />
                </div>

                {/* Input Mode Toggle */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Input Method</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setInputMode('transcript')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        inputMode === 'transcript'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <FileText className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="font-semibold text-sm text-foreground">Full Transcript</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Upload or paste meeting transcript
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('structured')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        inputMode === 'structured'
                          ? 'border-accent bg-accent/10'
                          : 'border-border hover:border-accent/50'
                      }`}
                    >
                      <ClipboardList className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="font-semibold text-sm text-foreground">Structured Notes</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fill out guided template
                      </p>
                    </button>
                  </div>
                </div>

                {inputMode === 'transcript' ? (
                  <>
                    {/* Transcript Source */}
                    <div className="space-y-2">
                      <Label htmlFor="transcriptSource" className="text-base font-medium">
                        Transcript Source
                      </Label>
                      <select
                        id="transcriptSource"
                        value={formData.transcriptSource}
                        onChange={(e) => setFormData({ ...formData, transcriptSource: e.target.value })}
                        className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                      >
                        <option value="manual">Manual Entry</option>
                        <option value="zoom">Zoom</option>
                        <option value="teams">Microsoft Teams</option>
                        <option value="google-meet">Google Meet</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* File Upload or Text Input */}
                    <div className="space-y-2">
                      <Label className="text-base font-medium">
                        Transcript *
                      </Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6">
                    <div className="text-center mb-4">
                      <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Upload a text file or paste transcript below
                      </p>
                      <input
                        type="file"
                        accept=".txt,.vtt,.srt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose File
                      </Button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={formData.transcriptText}
                        onChange={(e) => setFormData({ ...formData, transcriptText: e.target.value })}
                        placeholder="Paste your meeting transcript here..."
                        rows={12}
                        className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent resize-none font-mono text-sm"
                        required
                      />
                      <div className="text-xs text-muted-foreground mt-2">
                        {formData.transcriptText.length} characters
                      </div>
                    </div>
                  </div>
                </div>
                  </>
                ) : (
                  <StructuredNotesForm
                    meetingType={formData.meetingType}
                    onNotesChange={(notes) => {
                      setFormData({ ...formData, transcriptText: notes, transcriptSource: 'structured-notes' })
                    }}
                  />
                )}

                {/* Submit */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1"
                    disabled={uploading || teams.length === 0}
                  >
                    {uploading ? "Uploading & Analyzing..." : "Upload & Analyze"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    asChild
                    disabled={uploading}
                  >
                    <Link href="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
