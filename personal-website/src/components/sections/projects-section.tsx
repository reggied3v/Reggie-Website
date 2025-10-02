"use client"

import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "E-Commerce Platform",
    description: "A modern, full-stack e-commerce platform built with Next.js, featuring real-time inventory management, secure payments, and an intuitive admin dashboard.",
    image: "/api/placeholder/600/400",
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com/reggied3v/ecommerce-platform",
    demo: "https://demo-ecommerce.reggied3v.com",
    featured: true
  },
  {
    title: "Task Management App",
    description: "A collaborative task management application with real-time updates, team collaboration features, and advanced project analytics.",
    image: "/api/placeholder/600/400",
    technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
    github: "https://github.com/reggied3v/task-manager",
    demo: "https://tasks.reggied3v.com",
    featured: true
  },
  {
    title: "AI-Powered Analytics Dashboard",
    description: "An intelligent analytics dashboard that provides actionable insights using machine learning algorithms and beautiful data visualizations.",
    image: "/api/placeholder/600/400",
    technologies: ["Python", "FastAPI", "React", "D3.js", "TensorFlow"],
    github: "https://github.com/reggied3v/ai-analytics",
    demo: "https://analytics.reggied3v.com",
    featured: true
  },
  {
    title: "Mobile Fitness Tracker",
    description: "A cross-platform mobile app for fitness tracking with workout plans, progress monitoring, and social features.",
    image: "/api/placeholder/600/400",
    technologies: ["React Native", "Expo", "Firebase", "Redux", "Chart.js"],
    github: "https://github.com/reggied3v/fitness-tracker",
    demo: "https://fitness.reggied3v.com",
    featured: false
  },
  {
    title: "Real-time Chat Application",
    description: "A feature-rich chat application with file sharing, voice messages, and end-to-end encryption.",
    image: "/api/placeholder/600/400",
    technologies: ["Vue.js", "Socket.io", "Node.js", "Redis", "WebRTC"],
    github: "https://github.com/reggied3v/chat-app",
    demo: "https://chat.reggied3v.com",
    featured: false
  },
  {
    title: "Blockchain Voting System",
    description: "A secure, transparent voting system built on blockchain technology ensuring election integrity and voter privacy.",
    image: "/api/placeholder/600/400",
    technologies: ["Solidity", "Web3.js", "React", "Ethereum", "IPFS"],
    github: "https://github.com/reggied3v/blockchain-voting",
    demo: "https://vote.reggied3v.com",
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
            Featured Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Here are some of my recent projects that showcase my skills and passion for creating innovative solutions.
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
                    <span className="text-accent/60 text-sm">Project Image</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 smooth-transition flex items-center justify-center">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary" asChild>
                        <a href={project.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                      <Button size="sm" variant="secondary" asChild>
                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 mr-2" />
                          Code
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
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
            Other Notable Projects
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
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 smooth-transition">
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent smooth-transition"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-accent smooth-transition"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <CardDescription className="text-sm">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 text-xs text-muted-foreground">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
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
          <Button variant="secondary" size="lg" asChild>
            <a href="https://github.com/reggied3v" target="_blank" rel="noopener noreferrer">
              <Github className="w-5 h-5 mr-2" />
              View All Projects on GitHub
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}