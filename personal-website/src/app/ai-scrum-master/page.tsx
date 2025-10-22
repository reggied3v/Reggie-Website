"use client"

import { motion } from "framer-motion"
import { Navigation } from "@/components/layout/navigation"
import { Sparkles, CheckCircle2, Clock, FileText, Mail, ArrowRight } from "lucide-react"
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
              <Sparkles className="w-5 h-5 text-accent" />
              <span className="text-sm font-medium text-accent">AI-Powered Assessment</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            >
              Discover Your Team&apos;s{" "}
              <span className="text-accent">Agile Potential</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            >
              Take my comprehensive AI-powered Scrum Master Assessment and receive personalized,
              actionable recommendations based on 19+ years of Agile coaching experience across
              global teams at Bosch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Button size="lg" className="text-lg px-8 py-6 group" asChild>
                <Link href="/ai-scrum-master/assessment">
                  Start Your Assessment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Free • 15 minutes • No credit card required
              </p>
            </motion.div>
          </div>
        </section>

        {/* What You'll Get Section */}
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
                What You&apos;ll Get
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                A comprehensive analysis of your team&apos;s Agile maturity with actionable next steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Sparkles,
                  title: "AI-Generated Insights",
                  description: "Powered by advanced AI to analyze your unique team context and provide tailored recommendations",
                  color: "accent"
                },
                {
                  icon: CheckCircle2,
                  title: "Actionable Priorities",
                  description: "Clear, prioritized action items you can implement immediately to improve your team's performance",
                  color: "accent-blue"
                },
                {
                  icon: FileText,
                  title: "Comprehensive Report",
                  description: "Downloadable PDF with detailed findings, visualizations, and strategic recommendations",
                  color: "accent-orange"
                },
                {
                  icon: Clock,
                  title: "15-Minute Assessment",
                  description: "Quick but thorough evaluation covering team context, stakeholders, pain points, and goals",
                  color: "accent"
                },
                {
                  icon: Mail,
                  title: "Email Delivery",
                  description: "Get your results instantly delivered to your inbox with a detailed PDF attachment",
                  color: "accent-blue"
                },
                {
                  icon: CheckCircle2,
                  title: "Proven Methodology",
                  description: "Based on 19+ years of experience scaling Agile teams and coaching at Bosch",
                  color: "accent-orange"
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
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                        style={{
                          backgroundColor: `var(--${feature.color})`,
                          opacity: 0.15
                        }}
                      >
                        <feature.icon className="w-6 h-6" style={{ color: `var(--${feature.color})` }} />
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
                  title: "Answer Questions",
                  description: "Complete a 15-minute assessment covering your team's setup, challenges, and goals"
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  description: "Our AI analyzes your responses using proven Agile coaching frameworks and best practices"
                },
                {
                  step: "3",
                  title: "Get Results",
                  description: "Receive personalized recommendations instantly on-screen and via email"
                },
                {
                  step: "4",
                  title: "Take Action",
                  description: "Download your PDF report and start implementing improvements right away"
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
                Ready to Level Up Your Team?
              </h2>
              <p className="text-xl text-muted-foreground mb-12">
                Join teams worldwide who have used this assessment to identify and overcome their biggest Agile challenges.
              </p>
              <Button size="lg" className="text-lg px-8 py-6 group" asChild>
                <Link href="/ai-scrum-master/assessment">
                  Start Your Free Assessment
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
