"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Upload,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Users,
  Target,
  Lightbulb,
  Settings
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"

export default function TeamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const teamId = params.id as string

  const [team, setTeam] = useState<any>(null)
  const [meetings, setMeetings] = useState<any[]>([])
  const [actionItems, setActionItems] = useState<any[]>([])
  const [coachingSuggestions, setCoachingSuggestions] = useState<any[]>([])
  const [healthSnapshots, setHealthSnapshots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamData()
  }, [teamId])

  const loadTeamData = async () => {
    const supabase = createClient()

    // Load team
    const { data: teamData, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .single()

    if (teamError || !teamData) {
      console.error('Error loading team:', teamError)
      router.push('/dashboard')
      return
    }

    setTeam(teamData)

    // Load meetings
    const { data: meetingsData } = await supabase
      .from('meetings')
      .select('*')
      .eq('team_id', teamId)
      .order('meeting_date', { ascending: false })
      .limit(10)

    if (meetingsData) setMeetings(meetingsData)

    // Load open action items
    const { data: actionItemsData } = await supabase
      .from('action_items')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (actionItemsData) setActionItems(actionItemsData)

    // Load pending coaching suggestions
    const { data: suggestionsData } = await supabase
      .from('coaching_suggestions')
      .select('*')
      .eq('team_id', teamId)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .limit(5)

    if (suggestionsData) setCoachingSuggestions(suggestionsData)

    // Load health snapshots
    const { data: snapshotsData } = await supabase
      .from('team_health_snapshots')
      .select('*')
      .eq('team_id', teamId)
      .order('period_start', { ascending: false })
      .limit(8)

    if (snapshotsData) setHealthSnapshots(snapshotsData)

    setLoading(false)
  }

  const getMeetingTypeName = (type: string) => {
    const types: Record<string, string> = {
      'standup': 'Standup',
      'planning': 'Planning',
      'review': 'Review',
      'retrospective': 'Retro',
      'refinement': 'Refinement',
      'other': 'Meeting'
    }
    return types[type] || type
  }

  const getTrendIcon = (trend?: string) => {
    if (trend === 'improving') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (trend === 'declining') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-muted-foreground" />
  }

  const getAverageHealthScore = () => {
    if (meetings.length === 0) return null
    const completedMeetings = meetings.filter(m => m.analysis_status === 'completed' && m.overall_health_score)
    if (completedMeetings.length === 0) return null
    const sum = completedMeetings.reduce((acc, m) => acc + m.overall_health_score, 0)
    return Math.round(sum / completedMeetings.length)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading team...</p>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Team not found</p>
      </div>
    )
  }

  const avgHealthScore = getAverageHealthScore()

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
                <h1 className="text-4xl font-bold text-foreground mb-2">{team.name}</h1>
                {team.description && (
                  <p className="text-muted-foreground">{team.description}</p>
                )}
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                  {team.team_size && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {team.team_size} members
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created {new Date(team.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild>
                  <Link href="/dashboard/upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Meeting
                  </Link>
                </Button>
                <Button variant="outline" size="icon">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Average Health Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">
                  {avgHealthScore || '--'}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {meetings.filter(m => m.analysis_status === 'completed').length} meetings analyzed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Meetings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{meetings.length}</div>
                <p className="text-xs text-muted-foreground mt-1">all time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Open Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{actionItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Coaching Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{coachingSuggestions.length}</div>
                <p className="text-xs text-muted-foreground mt-1">pending review</p>
              </CardContent>
            </Card>
          </div>

          {/* Health Trend */}
          {healthSnapshots.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  Team Health Trend
                </CardTitle>
                <CardDescription>Weekly health scores over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthSnapshots.map((snapshot) => (
                    <div key={snapshot.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        {getTrendIcon(snapshot.trend_direction)}
                        <div>
                          <p className="font-semibold text-foreground">
                            {new Date(snapshot.period_start).toLocaleDateString()} - {new Date(snapshot.period_end).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {snapshot.meetings_count} meetings • {snapshot.action_items_completed}/{snapshot.action_items_created} action items completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-accent">{snapshot.avg_health_score}</div>
                        <p className="text-xs text-muted-foreground">avg health</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Meetings & Action Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Meetings */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Meetings</CardTitle>
                      <CardDescription>Latest analyzed meetings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {meetings.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No meetings yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Upload your first meeting transcript to get started
                      </p>
                      <Button asChild>
                        <Link href="/dashboard/upload">Upload Meeting</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {meetings.map((meeting) => (
                        <Link
                          key={meeting.id}
                          href={`/dashboard/meetings/${meeting.id}`}
                          className="block p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">
                                  {getMeetingTypeName(meeting.meeting_type)}
                                </h4>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  meeting.analysis_status === 'completed'
                                    ? 'bg-green-500/10 text-green-500'
                                    : meeting.analysis_status === 'processing'
                                    ? 'bg-blue-500/10 text-blue-500'
                                    : meeting.analysis_status === 'failed'
                                    ? 'bg-red-500/10 text-red-500'
                                    : 'bg-gray-500/10 text-gray-500'
                                }`}>
                                  {meeting.analysis_status}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(meeting.meeting_date).toLocaleDateString()}
                                {meeting.duration_minutes && ` • ${meeting.duration_minutes} min`}
                              </p>
                            </div>
                            {meeting.overall_health_score && (
                              <div className="ml-4 text-right">
                                <div className="text-xl font-bold text-accent">{meeting.overall_health_score}</div>
                                <p className="text-xs text-muted-foreground">health</p>
                              </div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Open Action Items */}
              {actionItems.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-accent" />
                      Open Action Items ({actionItems.length})
                    </CardTitle>
                    <CardDescription>Tasks that need attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {actionItems.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-3 border border-border rounded-lg">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="font-semibold text-foreground">{item.title}</h4>
                            {item.priority && (
                              <span className={`text-xs font-semibold ${
                                item.priority === 'high' ? 'text-red-500' :
                                item.priority === 'medium' ? 'text-orange-500' :
                                'text-blue-500'
                              }`}>
                                {item.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {item.assigned_to && <span>Assigned: {item.assigned_to}</span>}
                            {item.due_date && (
                              <span>Due: {new Date(item.due_date).toLocaleDateString()}</span>
                            )}
                          </div>
                        </div>
                      ))}
                      {actionItems.length > 5 && (
                        <p className="text-sm text-muted-foreground text-center">
                          And {actionItems.length - 5} more...
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Coaching Suggestions */}
            <div className="space-y-6">
              {coachingSuggestions.length > 0 && (
                <Card className="border-accent/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-accent" />
                      Coaching Suggestions
                    </CardTitle>
                    <CardDescription>AI recommendations for your team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {coachingSuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="p-3 border-2 border-accent/20 bg-accent/5 rounded-lg"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold px-2 py-1 bg-accent/20 text-accent rounded">
                              {suggestion.category.replace('_', ' ').toUpperCase()}
                            </span>
                            {suggestion.priority && (
                              <span className={`text-xs font-semibold ${
                                suggestion.priority === 'high' ? 'text-red-500' :
                                suggestion.priority === 'medium' ? 'text-orange-500' :
                                'text-blue-500'
                              }`}>
                                {suggestion.priority.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-foreground mb-1">{suggestion.title}</h4>
                          <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Team Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Team Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Anonymization</span>
                      <span className="font-semibold">
                        {team.anonymization_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Timezone</span>
                      <span className="font-semibold">{team.timezone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subscription</span>
                      <span className="font-semibold capitalize">{team.subscription_status}</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Settings
                    </Button>
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
