"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Upload, Users, TrendingUp, FileText, Calendar, LogOut } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [teams, setTeams] = useState<any[]>([])

  useEffect(() => {
    checkAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)
    loadTeams()
    setLoading(false)
  }

  const loadTeams = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from('teams')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) {
      setTeams(data)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <Skeleton className="h-10 w-96 mb-2" />
                <Skeleton className="h-5 w-64" />
              </div>
              <Skeleton className="h-10 w-24" />
            </div>

            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-12 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                      </div>
                      <Skeleton className="h-10 w-32" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg">
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-2" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-9 w-16" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-11 w-full" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                AI Scrum Master Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Teams</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teams.length}</div>
                <p className="text-xs text-muted-foreground">Active teams</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meetings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">This week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Health</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Average score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Open items</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Teams & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Teams */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Your Teams</CardTitle>
                      <CardDescription>Manage your Scrum teams</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/dashboard/teams/new">
                        <Users className="w-4 h-4 mr-2" />
                        Create Team
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {teams.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No teams yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first team to start analyzing meetings
                      </p>
                      <Button asChild>
                        <Link href="/dashboard/teams/new">Create Your First Team</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-foreground">{team.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {team.team_size ? `${team.team_size} members` : 'No size set'}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" asChild>
                            <Link href={`/dashboard/teams/${team.id}`}>View</Link>
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Meetings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Meetings</CardTitle>
                  <CardDescription>Latest analyzed meetings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No meetings yet</h3>
                    <p className="text-muted-foreground">
                      Upload your first meeting transcript to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Upload & Quick Links */}
            <div className="space-y-6">
              {/* Upload Transcript */}
              <Card className="border-2 border-accent/20 bg-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent" />
                    Upload Transcript
                  </CardTitle>
                  <CardDescription>
                    Analyze a new meeting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    size="lg"
                    asChild
                    disabled={teams.length === 0}
                  >
                    <Link href="/dashboard/upload">
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Meeting
                    </Link>
                  </Button>
                  {teams.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Create a team first
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>Quick guide to using the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
                        1
                      </span>
                      <span className="text-sm text-muted-foreground pt-0.5">
                        Create a team for your Scrum team
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
                        2
                      </span>
                      <span className="text-sm text-muted-foreground pt-0.5">
                        Upload meeting transcripts (Zoom, Teams, etc.)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
                        3
                      </span>
                      <span className="text-sm text-muted-foreground pt-0.5">
                        Review AI-generated insights and coaching
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
                        4
                      </span>
                      <span className="text-sm text-muted-foreground pt-0.5">
                        Track team health over time
                      </span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Trial Status */}
              <Card className="border-accent/30">
                <CardHeader>
                  <CardTitle className="text-sm">Trial Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-semibold text-accent">Active Trial</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Days Remaining</span>
                      <span className="font-semibold">14 days</span>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      View Plans
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
