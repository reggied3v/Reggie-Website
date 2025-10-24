"use client"

import { useEffect, useState, Suspense } from "react"

export const dynamic = 'force-dynamic'
import { motion } from "framer-motion"
import { Navigation } from "@/components/layout/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Download,
  Mail,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  BookOpen,
  ArrowRight
} from "lucide-react"
import Link from "next/link"

// Mock AI-generated recommendations based on assessment data
const generateMockRecommendations = () => {
  return {
    overallScore: 68,
    maturityLevel: "Practicing",
    strengths: [
      "Strong stakeholder engagement in Sprint Reviews",
      "Team has established core Scrum events",
      "Good use of collaboration tools (JIRA, Confluence)",
      "Clear Definition of Done in place"
    ],
    challenges: [
      "Unclear priorities and frequently changing scope",
      "Limited Product Owner availability",
      "Backlog items often too large or unclear",
      "Team coordination issues across distributed members"
    ],
    recommendations: [
      {
        priority: "High",
        category: "Product Backlog Management",
        title: "Implement Backlog Refinement Cadence",
        description: "Your team struggles with unclear and oversized backlog items. Establish a bi-weekly refinement session where the team collaborates with the PO to break down stories, clarify acceptance criteria, and estimate work.",
        actionSteps: [
          "Schedule 90-minute refinement sessions mid-sprint",
          "Use INVEST criteria to evaluate story quality",
          "Ensure stories are small enough to complete in 2-3 days",
          "Document acceptance criteria using Given-When-Then format"
        ],
        expectedImpact: "Reduce mid-sprint blockers by 40% and improve sprint predictability",
        resources: [
          { title: "Mike Cohn's User Story guide", url: "https://www.mountaingoatsoftware.com/agile/user-stories" },
          { title: "INVEST criteria checklist", url: "https://agileforall.com/resources/how-to-split-a-user-story/" }
        ]
      },
      {
        priority: "High",
        category: "Product Owner Availability",
        title: "Establish PO Office Hours",
        description: "With a shared Product Owner, the team needs predictable access. Create dedicated 'PO Office Hours' where the team knows they can get quick decisions and clarifications.",
        actionSteps: [
          "Block 2-hour windows on PO calendar (e.g., Tue/Thu 2-4pm)",
          "Create a shared queue for questions needing PO input",
          "Empower team to make minor decisions without PO approval",
          "Document decision-making authority boundaries"
        ],
        expectedImpact: "Reduce waiting time for decisions from days to hours",
        resources: [
          { title: "Roman Pichler's Product Owner patterns", url: "https://www.romanpichler.com/blog/10-tips-product-owner-scrum/" },
          { title: "Delegation Poker from Management 3.0", url: "https://management30.com/practice/delegation-poker/" }
        ]
      },
      {
        priority: "Medium",
        category: "Scope Management",
        title: "Create Sprint Goal Contract",
        description: "To address constantly changing priorities, establish a 'Sprint Goal Contract' that protects the team&apos;s focus during the sprint while allowing flexibility for true emergencies.",
        actionSteps: [
          "Define Sprint Goal at Planning with clear success criteria",
          "Create 'Definition of Emergency' with stakeholders",
          "Implement change request process for mid-sprint additions",
          "Track and visualize cost of scope changes in retrospectives"
        ],
        expectedImpact: "Increase sprint goal achievement from ~50% to 80%+",
        resources: [
          { title: "Scrum Guide on Sprint Goals", url: "https://scrumguides.org/scrum-guide.html#sprint-goal" },
          { title: "Henrik Kniberg's Scope Change patterns", url: "https://blog.crisp.se/2013/02/25/henrikkniberg/spotify-engineering-culture-part-1" }
        ]
      },
      {
        priority: "Medium",
        category: "Distributed Team Coordination",
        title: "Enhance Virtual Collaboration",
        description: "Your hybrid/distributed setup needs better visual management and asynchronous communication practices to keep everyone aligned.",
        actionSteps: [
          "Use Miro/Mural for shared visual workspace",
          "Implement 'async standups' via Slack/Teams for updates",
          "Record key meetings for timezone-shifted members",
          "Create team working agreements for response times"
        ],
        expectedImpact: "Improve team awareness scores and reduce coordination overhead",
        resources: [
          { title: "Atlassian's Remote Work playbook", url: "https://www.atlassian.com/blog/teamwork/remote-team-best-practices" },
          { title: "Distributed Scrum patterns", url: "https://less.works/less/framework/distributed-scrum.html" }
        ]
      },
      {
        priority: "Low",
        category: "Team Dynamics",
        title: "Build Psychological Safety",
        description: "Your assessment indicates some hesitation around conflict and accountability. Focus on building trust through structured retrospective formats.",
        actionSteps: [
          "Try 'Sailboat' or 'Hot Air Balloon' retro formats",
          "Use anonymous feedback tools (RetroTool, EasyRetro)",
          "Celebrate failures as learning opportunities",
          "Implement 'Appreciation Round' in retrospectives"
        ],
        expectedImpact: "Increase open discussion scores and team engagement",
        resources: [
          { title: "The Five Dysfunctions of a Team", url: "https://www.tablegroup.com/product/dysfunctions/" },
          { title: "Retromat - Retrospective ideas", url: "https://retromat.org/" }
        ]
      }
    ],
    nextSteps: [
      "Review these recommendations with your Scrum Master and Product Owner",
      "Discuss top 2 priorities in your next retrospective",
      "Create action items with owners and timelines",
      "Reassess progress in 2-3 sprints"
    ],
    resources: [
      {
        title: "Scrum Guide 2020",
        url: "https://scrumguides.org",
        description: "The definitive guide to Scrum"
      },
      {
        title: "LeSS (Large-Scale Scrum)",
        url: "https://less.works",
        description: "Scaling patterns for multiple teams"
      },
      {
        title: "Agile Coaching Resources",
        url: "#",
        description: "Curated coaching materials and templates"
      }
    ]
  }
}

function ResultsContent() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get results from sessionStorage
    const storedResults = sessionStorage.getItem('assessmentResults')

    // Simulate AI processing delay
    const timer = setTimeout(() => {
      const mockResults = generateMockRecommendations()

      // If we have real results from the database, use them
      if (storedResults) {
        const realResults = JSON.parse(storedResults)
        mockResults.overallScore = realResults.overallScore
        mockResults.maturityLevel = realResults.maturityLevel
      }

      setResults(mockResults)
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-500"
      case "Medium":
        return "text-orange-500"
      case "Low":
        return "text-blue-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getPriorityBg = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500/10 border-red-500/30"
      case "Medium":
        return "bg-orange-500/10 border-orange-500/30"
      case "Low":
        return "bg-blue-500/10 border-blue-500/30"
      default:
        return "bg-muted"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Skeleton */}
            <div className="text-center mb-12">
              <Skeleton className="h-12 w-96 mx-auto mb-4" />
              <Skeleton className="h-6 w-64 mx-auto" />
            </div>

            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32 mb-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-16 rounded-full mb-4" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recommendations Skeleton */}
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-3" />
                        <Skeleton className="h-5 w-full mb-2" />
                        <Skeleton className="h-5 w-3/4" />
                      </div>
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <div className="space-y-2">
                        {[1, 2, 3].map((j) => (
                          <Skeleton key={j} className="h-4 w-full" />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">Assessment Complete</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Your Agile Maturity Report
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Based on your team&apos;s assessment, here are personalized recommendations to improve your Scrum practices
            </p>
          </motion.div>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="mb-8 border-2 border-accent/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-2">Overall Maturity Score</p>
                    <div className="text-6xl font-bold text-accent">{results.overallScore}</div>
                    <p className="text-sm text-muted-foreground mt-2">out of 100</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Maturity Level</p>
                    <div className="text-2xl font-bold text-foreground">{results.maturityLevel}</div>
                    <p className="text-sm text-muted-foreground mt-2">6-12 months experience</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="lg" className="w-full">
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF Report
                    </Button>
                    <Button variant="secondary" size="lg" className="w-full">
                      <Mail className="w-5 h-5 mr-2" />
                      Email Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Strengths & Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <CardTitle>Key Strengths</CardTitle>
                  </div>
                  <CardDescription>What your team is doing well</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-muted-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 text-orange-500" />
                    <CardTitle>Areas for Improvement</CardTitle>
                  </div>
                  <CardDescription>Challenges identified in your assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {results.challenges.map((challenge: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-1" />
                        <span className="text-sm text-muted-foreground">{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="w-8 h-8 text-accent" />
              <div>
                <h2 className="text-3xl font-bold text-foreground">AI-Generated Recommendations</h2>
                <p className="text-muted-foreground">Personalized action plan for your team</p>
              </div>
            </div>

            <div className="space-y-6">
              {results.recommendations.map((rec: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Card className={`border-2 ${getPriorityBg(rec.priority)}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${getPriorityBg(rec.priority)} ${getPriorityColor(rec.priority)}`}>
                              {rec.priority} Priority
                            </span>
                            <span className="text-xs text-muted-foreground">{rec.category}</span>
                          </div>
                          <CardTitle className="text-xl mb-2">{rec.title}</CardTitle>
                          <CardDescription className="text-base">{rec.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-accent" />
                          Action Steps
                        </h4>
                        <ol className="list-decimal list-inside space-y-2 ml-6">
                          {rec.actionSteps.map((step: string, stepIndex: number) => (
                            <li key={stepIndex} className="text-sm text-muted-foreground">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-1">Expected Impact:</p>
                        <p className="text-sm text-muted-foreground">{rec.expectedImpact}</p>
                      </div>

                      {rec.resources.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-accent" />
                            Recommended Resources
                          </h4>
                          <ul className="space-y-1">
                            {rec.resources.map((resource: any, resIndex: number) => (
                              <li key={resIndex} className="text-sm flex items-center gap-2">
                                <ArrowRight className="w-3 h-3 text-accent flex-shrink-0" />
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent hover:text-accent/80 hover:underline transition-colors"
                                >
                                  {resource.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="border-2 border-accent/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6 text-accent" />
                  <CardTitle>Recommended Next Steps</CardTitle>
                </div>
                <CardDescription>How to put these recommendations into action</CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {results.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent font-semibold text-sm flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-foreground mb-4">Additional Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.resources.map((resource: any, index: number) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    <CardDescription>{resource.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="secondary" size="sm" asChild className="w-full">
                      <Link href={resource.url} target="_blank">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* AI Scrum Master Platform CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-accent/10 via-accent-blue/10 to-accent-orange/10 border-2 border-accent/30">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 rounded-full mb-4">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <span className="text-sm font-semibold text-accent">Next Level</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                    Ready for Continuous Team Health Monitoring?
                  </h3>
                  <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                    This one-time assessment gives you a snapshot. The <strong className="text-foreground">AI Scrum Master Platform</strong> provides
                    ongoing insights by analyzing your meeting transcripts, tracking patterns over time, and delivering
                    personalized coaching suggestions sprint after sprint.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Upload Transcripts</h4>
                    <p className="text-sm text-muted-foreground">
                      Standups, Retros, Planning - upload any meeting transcript
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-accent-blue" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Track Over Time</h4>
                    <p className="text-sm text-muted-foreground">
                      See patterns, trends, and team health evolve sprint-by-sprint
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-accent-orange/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lightbulb className="w-6 h-6 text-accent-orange" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">Get Coaching AI</h4>
                    <p className="text-sm text-muted-foreground">
                      Personalized interventions, action item tracking, 1-on-1 prep
                    </p>
                  </div>
                </div>

                <div className="bg-card/50 backdrop-blur border border-border rounded-lg p-6 mb-8">
                  <h4 className="font-semibold text-foreground mb-4">What You&apos;ll Get:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      "Meeting-by-meeting AI analysis",
                      "Team health score tracking",
                      "Pattern recognition across sprints",
                      "Action item completion monitoring",
                      "Coaching suggestion generator",
                      "Weekly automated reports",
                      "Multi-team dashboard",
                      "Privacy-first (anonymization built-in)"
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full mb-4">
                    <span className="text-sm font-medium text-accent">Beta Launch - Join the Waitlist</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="text-lg px-8 py-6" asChild>
                      <Link href="/#contact">
                        Join Beta Waitlist
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                    <Button variant="secondary" size="lg" className="text-lg px-8 py-6" asChild>
                      <Link href="/ai-scrum-master">
                        Learn More About AI Scrum Master
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coaching CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <Card className="bg-accent/5 border-2 border-accent/20">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Prefer 1-on-1 Coaching?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  I also offer personalized coaching sessions to help implement these recommendations with your team.
                  Let&apos;s discuss how I can support your Agile transformation journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/#contact">
                      Schedule a Consultation
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/ai-scrum-master/assessment">
                      Take Assessment Again
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
