"use client"

import { motion } from "framer-motion"
import { ExternalLink, Brain, UsersRound, Apple, Zap, Layout, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "Smart Information Hub",
    description: "Led end-to-end launch of internal Bosch smart information hub, scaling from concept to 20,000+ users in under two years. Defined product-market fit, established OKRs/KPIs, and achieved first external sale (5,000 licenses) within two months.",
    icon: Brain,
    technologies: ["Product Management", "OKR", "Go-to-Market", "Gen AI", "DIA Brain"],
    featured: true
  },
  {
    title: "Enterprise Scrum Scaling",
    description: "Scaled Enterprise Scrum to 12 IT Support teams supporting 20,000+ customers across the Americas. Served as Global Scrum Master and Agile Coach, building high-performing cross-functional teams across multiple countries.",
    icon: UsersRound,
    technologies: ["Scrum", "Agile Coaching", "JIRA", "Azure DevOps", "LeSS"],
    featured: true
  },
  {
    title: "Mac@Bosch Initiative",
    description: "Served as North America Responsible for the Mac@Bosch initiative, leading strategy and implementation across the region. Championed technology adoption and internal community building.",
    icon: Apple,
    technologies: ["IT Consulting", "Strategy", "Change Management", "Leadership"],
    featured: true
  },
  {
    title: "Power Platform Strategy",
    description: "Led Power Platform strategy and enablement in North America, implementing automation improvements across multiple regions.",
    icon: Zap,
    technologies: ["Power Platform", "Power Automate", "Automation", "Strategy"],
    featured: false
  },
  {
    title: "Curated Information Page",
    description: "Developed and deployed curated information page to 20,000+ desktops, improving user access to critical tools and resources across the Americas. Enhanced productivity and user experience company-wide.",
    icon: Layout,
    technologies: ["Deployment", "IT Support", "User Experience", "Scale"],
    featured: false
  },
  {
    title: "Customer-Centric Development",
    description: "Implemented a customer-centric development cycle leveraging user feedback, mockups, and iterative development to deliver measurable customer value in every sprint.",
    icon: Heart,
    technologies: ["Agile", "UX Design Thinking", "Iterative Development", "Customer Value"],
    featured: false
  }
]

export function ProjectsSection() {
  const featuredProjects = projects.filter(project => project.featured)
  const otherProjects = projects.filter(project => !project.featured)

  return (
    <section id="projects" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Key Achievements
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Highlights from my 19+ years at Bosch, leading digital transformation initiatives and delivering measurable business impact.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass hover:shadow-xl smooth-transition group overflow-hidden">
                <div className="relative overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                    <project.icon className="w-20 h-20 text-accent/40 group-hover:text-accent/60 smooth-transition group-hover:scale-110" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
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

        {/* Other Projects */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Additional Initiatives
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full glass hover:shadow-lg smooth-transition group">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 smooth-transition">
                      <project.icon className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  <CardDescription className="text-sm">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
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
          className="text-center mt-12"
        >
          <Button variant="secondary" size="lg" onClick={() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
          }}>
            <ExternalLink className="w-5 h-5 mr-2" />
            Get In Touch
          </Button>
        </motion.div>
      </div>
    </section>
  )
}