"use client"

import { motion } from "framer-motion"
import { Code2, Database, Globe, Smartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const skills = [
  {
    icon: Code2,
    title: "Agile & Scrum",
    description: "Certified Scrum Master, Product Owner, and Advanced Scrum Master, leading global teams and coaching Agile transformation with experience in scaled Scrum approaches.",
    technologies: ["JIRA", "Azure DevOps", "LeSS", "SAFe"],
    color: "accent"
  },
  {
    icon: Database,
    title: "AI & Automation",
    description: "AI Product Management and enablement, leveraging Microsoft Power Platform for automation solutions and integrating Gen AI experiences into platforms.",
    technologies: ["Gen AI", "Power Platform", "Power Automate", "Power BI"],
    color: "accent-blue"
  },
  {
    icon: Globe,
    title: "Analytics & UX",
    description: "Data-driven decision making with analytics tools and user-centered design thinking methodologies.",
    technologies: ["Google Analytics", "Power BI", "UX Design Thinking", "OKR Strategy"],
    color: "accent-orange"
  },
  {
    icon: Smartphone,
    title: "Digital Transformation",
    description: "Leading large-scale digitalization initiatives, product launches, and customer care support.",
    technologies: ["Product Management", "Customer Care", "Strategy", "Leadership"],
    color: "accent"
  }
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            About Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Dynamic and entrepreneurial leader with over 19 years at Bosch, specializing in Agile
            coaching across global service areas, IT Consulting, and Digital Transformation. Proven
            track record in leading large-scale digital transformation initiatives and coaching
            high-performing, cross-functional teams.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass hover:shadow-lg smooth-transition group">
                <CardHeader className="text-center">
                  <motion.div
                    className="mx-auto mb-4 p-3 rounded-full w-fit smooth-transition relative"
                    style={{
                      backgroundColor: `rgba(var(--${skill.color}-rgb), 0.1)`
                    }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <skill.icon className="w-8 h-8" style={{ color: `var(--${skill.color})` }} />
                  </motion.div>
                  <CardTitle className="text-xl mb-2">{skill.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {skill.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs rounded-md font-medium"
                        style={{
                          backgroundColor: `rgba(var(--${skill.color}-rgb), 0.15)`,
                          color: `var(--${skill.color})`
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto glass">
            <CardHeader>
              <CardTitle className="text-2xl">My Journey</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p className="text-muted-foreground mb-4">
                As Digital Delivery Lead & Scrum Master at Bosch, I led the end-to-end launch of a
                smart information hub, scaling it from concept to 20,000+ users in under two years.
                I defined product-market fit, established OKRs and KPIs, and implemented a repeatable
                go-to-market strategy—resulting in our first external sale (RBHU, 5,000 licenses) within two months.
              </p>
              <p className="text-muted-foreground mb-4">
                I&apos;ve served as Global Scrum Master and Agile Coach across multiple workstreams, building
                high-performing, cross-functional teams across countries. I drive strategic decisions—from
                budget allocation and team composition to course corrections—while fostering a culture of
                collaboration, growth, and innovation.
              </p>
              <p className="text-muted-foreground">
                Known for fostering collaboration, leading by example, and promoting sustainable team
                success through Agile principles and continuous improvement.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}