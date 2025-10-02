"use client"

import { motion } from "framer-motion"
import { Code2, Database, Globe, Smartphone } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const skills = [
  {
    icon: Globe,
    title: "Web Development",
    description: "Building modern, responsive web applications with React, Next.js, and TypeScript.",
    technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS"]
  },
  {
    icon: Database,
    title: "Backend Development",
    description: "Creating robust APIs and server-side applications with Node.js and Python.",
    technologies: ["Node.js", "Python", "PostgreSQL", "MongoDB"]
  },
  {
    icon: Smartphone,
    title: "Mobile Development",
    description: "Developing cross-platform mobile applications with React Native and Flutter.",
    technologies: ["React Native", "Flutter", "iOS", "Android"]
  },
  {
    icon: Code2,
    title: "DevOps & Tools",
    description: "Streamlining development workflows with modern tools and cloud platforms.",
    technologies: ["Docker", "AWS", "Git", "CI/CD"]
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
            I'm a passionate developer with a love for creating innovative solutions.
            With expertise across the full stack, I enjoy turning complex problems
            into simple, elegant designs that deliver exceptional user experiences.
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
                    className="mx-auto mb-4 p-3 rounded-full bg-accent/10 w-fit group-hover:bg-accent/20 smooth-transition"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <skill.icon className="w-8 h-8 text-accent" />
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
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto glass">
            <CardHeader>
              <CardTitle className="text-2xl">My Journey</CardTitle>
            </CardHeader>
            <CardContent className="text-left">
              <p className="text-muted-foreground mb-4">
                My journey in technology began with curiosity and has evolved into a passion for creating
                digital experiences that matter. I believe in the power of clean code, thoughtful design,
                and continuous learning.
              </p>
              <p className="text-muted-foreground mb-4">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source
                projects, or sharing knowledge with the developer community. I'm always excited to tackle
                new challenges and collaborate on meaningful projects.
              </p>
              <p className="text-muted-foreground">
                Let's build something amazing together!
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}