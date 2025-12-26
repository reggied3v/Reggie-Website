"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/layout/navigation"
import { Brain, TrendingUp, Users, Target, BarChart3, MessageSquare, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function AIScrumMasterPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-background to-background" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-8"
            >
              <Brain className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Agile Coaching</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            >
              Your Team&apos;s{" "}
              <span className="text-accent">AI Scrum Master</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            >
              Transform your Agile ceremonies with continuous AI-powered insights. Upload meeting transcripts and get instant analysis, health scores, action items, and personalized coaching suggestions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button size="lg" className="text-lg px-8 py-6 group" asChild>
                <Link href="/dashboard">
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6 group" asChild>
                <Link href="/ai-scrum-master/assessment">
                  Try Assessment
                  <Sparkles className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Platform Features Section */}
        <section className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Continuous Agile Coaching
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                AI-powered analysis for every meeting, helping your team improve sprint after sprint
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: MessageSquare,
                  title: "Meeting Analysis",
                  description: "Upload transcripts from standups, retrospectives, planning sessions, and more. Get instant AI-powered insights on team dynamics, engagement, and effectiveness.",
                  color: "accent"
                },
                {
                  icon: BarChart3,
                  title: "Team Health Tracking",
                  description: "Monitor engagement, transparency, and collaboration scores over time. Identify trends and patterns across your team's Agile ceremonies.",
                  color: "accent"
                },
                {
                  icon: Target,
                  title: "Action Items",
                  description: "Automatically extract and track action items from meeting transcripts. Assign owners, set priorities, and monitor completion status.",
                  color: "accent"
                },
                {
                  icon: Brain,
                  title: "Smart Coaching",
                  description: "Receive personalized coaching suggestions tailored to your team's specific challenges, from facilitation tips to process improvements.",
                  color: "accent"
                },
                {
                  icon: TrendingUp,
                  title: "Pattern Detection",
                  description: "Identify recurring blockers, communication gaps, and positive trends across multiple meetings to address root causes.",
                  color: "accent"
                },
                {
                  icon: Users,
                  title: "Team Management",
                  description: "Manage multiple teams, track their health metrics, and compare performance across sprints to optimize your Agile practice.",
                  color: "accent"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full glass hover:shadow-xl smooth-transition">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-accent/10">
                        <feature.icon className="w-6 h-6 text-accent" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                How It Works
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Upload Transcripts",
                  description: "Upload meeting transcripts or use our structured notes template for any Agile ceremony"
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  description: "Advanced AI analyzes team dynamics, engagement, transparency, and collaboration patterns"
                },
                {
                  step: "3",
                  title: "Get Insights",
                  description: "Receive health scores, action items, coaching suggestions, and pattern detection via email"
                },
                {
                  step: "4",
                  title: "Track Progress",
                  description: "Monitor improvements over time and refine your Agile practice sprint after sprint"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-2xl font-bold">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-border" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-accent/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
                Transform Your Team&apos;s Agile Practice
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Start getting AI-powered coaching insights from every meeting. Improve team health, track progress, and accelerate your Agile maturity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg px-8 py-6 group" asChild>
                  <Link href="/dashboard">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 group" asChild>
                  <Link href="/ai-scrum-master/assessment">
                    Try Quick Assessment
                    <Sparkles className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
