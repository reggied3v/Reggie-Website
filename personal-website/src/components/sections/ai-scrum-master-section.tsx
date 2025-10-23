"use client"

import { motion } from "framer-motion"
import { Brain, BarChart3, Target, MessageSquare, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export function AIScrumMasterSection() {
  return (
    <section id="ai-scrum-master" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <Brain className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium text-accent">AI-Powered Platform</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            AI Scrum Master
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your Agile ceremonies with continuous AI-powered insights. Upload meeting transcripts and get instant analysis, health tracking, and personalized coaching.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: MessageSquare,
              title: "Meeting Analysis",
              description: "AI analyzes every standup, retro, and planning session"
            },
            {
              icon: BarChart3,
              title: "Health Tracking",
              description: "Monitor team engagement and collaboration over time"
            },
            {
              icon: Target,
              title: "Action Items",
              description: "Auto-extract and track tasks with priorities"
            },
            {
              icon: Brain,
              title: "Smart Coaching",
              description: "Get personalized suggestions to improve"
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
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" className="text-lg px-8 py-3 group" asChild>
            <Link href="/ai-scrum-master">
              Explore AI Scrum Master
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
