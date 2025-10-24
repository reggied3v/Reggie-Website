"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Brain } from "lucide-react"
import { Card } from "@/components/ui/card"

export function OfferingComparison() {
  return (
    <section className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground">
            Start with a quick assessment or dive into continuous coaching
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Assessment */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full p-8 border-2 hover:border-accent/50 smooth-transition">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-accent/10">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Quick Assessment</h3>
                  <p className="text-sm text-accent font-medium">One-time snapshot</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: "Time Commitment", value: "15 minutes" },
                  { label: "Frequency", value: "One-time" },
                  { label: "Cost", value: "Free" },
                  { label: "Delivery", value: "Instant PDF report" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.label}:</span>
                      <span className="text-sm text-muted-foreground ml-2">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Best for:</strong> Teams wanting a quick health check and actionable recommendations to get started
                </p>
              </div>
            </Card>
          </motion.div>

          {/* AI Scrum Master */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full p-8 border-2 border-accent/30 hover:border-accent smooth-transition relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                RECOMMENDED
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-accent/10">
                  <Brain className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">AI Scrum Master</h3>
                  <p className="text-sm text-accent font-medium">Continuous platform</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  { label: "Time Commitment", value: "Upload meetings anytime" },
                  { label: "Frequency", value: "Every sprint" },
                  { label: "Cost", value: "Subscription" },
                  { label: "Delivery", value: "Email + PDF + Dashboard" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.label}:</span>
                      <span className="text-sm text-muted-foreground ml-2">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Best for:</strong> Teams committed to ongoing improvement with AI-powered coaching for every ceremony
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
