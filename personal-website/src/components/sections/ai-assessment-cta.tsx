"use client"

import { motion } from "framer-motion"
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export function AIAssessmentCTA() {
  return (
    <section className="py-24 bg-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Card className="relative overflow-hidden border-2 border-accent/20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

            <div className="relative p-8 md:p-12 lg:p-16">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Content */}
                <div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6"
                  >
                    <Sparkles className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium text-accent">AI-Powered Assessment</span>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
                  >
                    How Agile Is Your Team?
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-lg text-muted-foreground mb-8"
                  >
                    Take my AI-powered Scrum Master Assessment and receive personalized,
                    actionable recommendations to improve your team&apos;s agile practices.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="space-y-3 mb-8"
                  >
                    {[
                      "15-minute comprehensive assessment",
                      "AI-generated personalized recommendations",
                      "Downloadable PDF report with actionable insights",
                      "Based on 10+ years Agile experience and 20+ years IT experience and consulting"
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                  >
                    <Button size="lg" className="text-lg px-8 py-6 group" asChild>
                      <Link href="/ai-scrum-master">
                        Take the Assessment
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">
                      Free • No credit card required • Get results immediately
                    </p>
                  </motion.div>
                </div>

                {/* Right side - Visual/Stats */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="hidden lg:block"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="p-6 bg-card/50 backdrop-blur">
                      <div className="text-4xl font-bold text-accent mb-2">20K+</div>
                      <div className="text-sm text-muted-foreground">Users Supported</div>
                    </Card>
                    <Card className="p-6 bg-card/50 backdrop-blur">
                      <div className="text-4xl font-bold text-accent mb-2">12</div>
                      <div className="text-sm text-muted-foreground">Teams Scaled</div>
                    </Card>
                    <Card className="p-6 bg-card/50 backdrop-blur">
                      <div className="text-4xl font-bold text-accent mb-2">19+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </Card>
                    <Card className="p-6 bg-card/50 backdrop-blur">
                      <div className="text-4xl font-bold text-accent mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">AI-Powered</div>
                    </Card>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
