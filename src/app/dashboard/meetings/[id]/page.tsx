"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Users,
  Target,
  FileText,
  Download
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"

export default function MeetingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const meetingId = params.id as string

  const [meeting, setMeeting] = useState<any>(null)
  const [team, setTeam] = useState<any>(null)
  const [actionItems, setActionItems] = useState<any[]>([])
  const [coachingSuggestions, setCoachingSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [downloadingPDF, setDownloadingPDF] = useState(false)

  useEffect(() => {
    loadMeetingData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meetingId])

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true)
    try {
      const response = await fetch(`/api/meetings/${meetingId}/pdf`)
      if (!response.ok) throw new Error('Failed to download PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meeting-analysis-${meetingId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setDownloadingPDF(false)
    }
  }

  const loadMeetingData = async () => {
    const supabase = createClient()

    // Load meeting
    const { data: meetingData, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('id', meetingId)
      .single()

    if (meetingError || !meetingData) {
      console.error('Error loading meeting:', meetingError)
      router.push('/dashboard')
      return
    }

    setMeeting(meetingData)

    // Load team
    const { data: teamData } = await supabase
      .from('teams')
      .select('*')
      .eq('id', meetingData.team_id)
      .single()

    if (teamData) setTeam(teamData)

    // Load action items
    const { data: actionItemsData } = await supabase
      .from('action_items')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('priority', { ascending: false })

    if (actionItemsData) setActionItems(actionItemsData)

    // Load coaching suggestions
    const { data: suggestionsData } = await supabase
      .from('coaching_suggestions')
      .select('*')
      .eq('meeting_id', meetingId)
      .order('priority', { ascending: false })

    if (suggestionsData) setCoachingSuggestions(suggestionsData)

    setLoading(false)
  }

  const getMeetingTypeName = (type: string) => {
    const types: Record<string, string> = {
      'standup': 'Daily Standup',
      'planning': 'Sprint Planning',
      'review': 'Sprint Review',
      'retrospective': 'Retrospective',
      'refinement': 'Backlog Refinement',
      'other': 'Meeting'
    }
    return types[type] || type
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; text: string }> = {
      'pending': { color: 'bg-yellow-500/10 text-yellow-500', text: 'Pending' },
      'processing': { color: 'bg-blue-500/10 text-blue-500', text: 'Processing' },
      'completed': { color: 'bg-green-500/10 text-green-500', text: 'Completed' },
      'failed': { color: 'bg-red-500/10 text-red-500', text: 'Failed' }
    }
    const badge = badges[status] || badges['pending']
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'high': 'text-red-500',
      'medium': 'text-orange-500',
      'low': 'text-blue-500'
    }
    return colors[priority] || 'text-muted-foreground'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <Skeleton className="h-10 w-32 mb-4" />
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-10 w-96 mb-2" />
                  <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-40" />
              </div>
            </div>

            {/* Info Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                    <Skeleton className="h-4 w-4 mr-2" />
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-6 w-20" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-6 w-48" />
                      </div>
                      <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[1, 2, 3].map((j) => (
                          <div key={j} className="flex gap-3">
                            <Skeleton className="h-4 w-4 mt-1" />
                            <Skeleton className="h-4 flex-1" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                          <Skeleton className="h-4 w-4 mt-1" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Meeting not found</p>
      </div>
    )
  }

  const insights = meeting.insights || {}

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    {getMeetingTypeName(meeting.meeting_type)}
                  </h1>
                  {getStatusBadge(meeting.analysis_status)}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(meeting.meeting_date).toLocaleDateString()}
                  </span>
                  {meeting.duration_minutes && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {meeting.duration_minutes} minutes
                    </span>
                  )}
                  {team && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {team.name}
                    </span>
                  )}
                </div>
              </div>

              {meeting.analysis_status === 'completed' && (
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {downloadingPDF ? 'Generating...' : 'Download PDF'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {meeting.analysis_status === 'processing' && (
            <Card className="mb-8 border-blue-500/30 bg-blue-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin">
                    <TrendingUp className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">AI Analysis in Progress</p>
                    <p className="text-sm text-muted-foreground">
                      Your meeting is being analyzed. This usually takes 30-60 seconds.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.analysis_status === 'failed' && (
            <Card className="mb-8 border-red-500/30 bg-red-500/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <p className="font-semibold text-foreground">Analysis Failed</p>
                    <p className="text-sm text-muted-foreground">
                      There was an error analyzing this meeting. Please try uploading again.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {meeting.analysis_status === 'completed' && (
            <>
              {/* Health Scores */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Overall Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-accent">
                      {meeting.overall_health_score || '--'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">out of 100</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Engagement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {meeting.engagement_score || '--'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">participation level</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Transparency
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {meeting.transparency_score || '--'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">openness score</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Collaboration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground">
                      {meeting.collaboration_score || '--'}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">teamwork quality</p>
                  </CardContent>
                </Card>
              </div>

              {/* Summary */}
              {insights.summary && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-accent" />
                      Meeting Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{insights.summary}</p>
                  </CardContent>
                </Card>
              )}

              {/* Key Insights, Positive, Areas for Improvement */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Key Insights */}
                {insights.key_insights && insights.key_insights.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Lightbulb className="w-5 h-5 text-accent" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {insights.key_insights.map((insight: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <span className="text-accent mt-0.5">•</span>
                            <span className="text-muted-foreground">{insight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Positive Observations */}
                {insights.positive_observations && insights.positive_observations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        Positive Observations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {insights.positive_observations.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Areas for Improvement */}
                {insights.areas_for_improvement && insights.areas_for_improvement.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Areas for Improvement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {insights.areas_for_improvement.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Action Items */}
              {actionItems.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" />
                      Action Items ({actionItems.length})
                    </CardTitle>
                    <CardDescription>Tasks extracted from this meeting</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {actionItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-foreground">{item.title}</h4>
                              {item.priority && (
                                <span className={`text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                                  {item.priority.toUpperCase()}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {item.assigned_to && (
                                <span>Assigned to: {item.assigned_to}</span>
                              )}
                              {item.due_date && (
                                <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <div className="ml-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              item.status === 'completed'
                                ? 'bg-green-500/10 text-green-500'
                                : item.status === 'in_progress'
                                ? 'bg-blue-500/10 text-blue-500'
                                : 'bg-gray-500/10 text-gray-500'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Coaching Suggestions */}
              {coachingSuggestions.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      Coaching Suggestions ({coachingSuggestions.length})
                    </CardTitle>
                    <CardDescription>AI-generated recommendations for improvement</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {coachingSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-4 border-2 border-accent/20 bg-accent/5 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold px-2 py-1 bg-accent/20 text-accent rounded">
                                  {suggestion.category.replace('_', ' ').toUpperCase()}
                                </span>
                                {suggestion.priority && (
                                  <span className={`text-xs font-semibold ${getPriorityColor(suggestion.priority)}`}>
                                    {suggestion.priority.toUpperCase()} PRIORITY
                                  </span>
                                )}
                              </div>
                              <h4 className="font-semibold text-foreground text-lg">{suggestion.title}</h4>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
                          {suggestion.action_steps && suggestion.action_steps.length > 0 && (
                            <div className="mt-3 pl-4 border-l-2 border-accent/30">
                              <p className="text-xs font-semibold text-foreground mb-2">Action Steps:</p>
                              <ol className="list-decimal list-inside space-y-1">
                                {suggestion.action_steps.map((step: string, index: number) => (
                                  <li key={index} className="text-xs text-muted-foreground">{step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Patterns Detected */}
              {insights.patterns_detected && insights.patterns_detected.length > 0 && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Patterns Detected
                    </CardTitle>
                    <CardDescription>Recurring themes identified by AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.patterns_detected.map((pattern: any, index: number) => (
                        <div key={index} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold px-2 py-1 bg-muted rounded">
                              {pattern.type.replace('_', ' ').toUpperCase()}
                            </span>
                            {pattern.severity && (
                              <span className={`text-xs font-semibold ${getPriorityColor(pattern.severity)}`}>
                                {pattern.severity.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{pattern.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Transcript */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Original Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/30 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">
                  {meeting.transcript_text}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
