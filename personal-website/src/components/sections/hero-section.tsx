"use client"

import { motion } from "framer-motion"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

// Generate consistent random values for background circles
const backgroundCircles = [
  { width: 250, height: 180, left: 15, top: 20, x: -30, y: 40, duration: 15 },
  { width: 320, height: 240, left: 70, top: 60, x: 50, y: -30, duration: 18 },
  { width: 180, height: 280, left: 40, top: 10, x: -20, y: 60, duration: 20 },
  { width: 200, height: 150, left: 85, top: 75, x: 30, y: -40, duration: 16 },
  { width: 280, height: 200, left: 25, top: 85, x: -40, y: 20, duration: 22 },
]

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background" />

      {/* Animated background elements */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {backgroundCircles.map((circle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-accent/5"
              style={{
                width: circle.width,
                height: circle.height,
                left: `${circle.left}%`,
                top: `${circle.top}%`,
              }}
              animate={{
                x: [0, circle.x],
                y: [0, circle.y],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: circle.duration,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Hi, I&apos;m{" "}
            <motion.span
              className="text-accent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Reggie Ragsdale
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Digital Delivery Lead • Scrum Master • Agile Coach
          </motion.p>

          <motion.p
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Dynamic leader with 20+ years of industry experience, specializing in Agile coaching, digital transformation, and building high-performing cross-functional teams. I help organizations scale through AI-powered enhancements, continuous coaching, and proven methodologies and principles that deliver measurable business impact across global service areas.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("offerings")}
              className="text-lg px-8 py-3"
            >
              View My Offerings
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="text-lg px-8 py-3"
            >
              Get In Touch
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center space-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <motion.a
              href="https://github.com/reggied3v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent smooth-transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/reggied3v"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent smooth-transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-6 h-6" />
            </motion.a>
            <motion.a
              href="mailto:ReggieD3V@gmail.com"
              className="text-muted-foreground hover:text-accent smooth-transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="w-6 h-6" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <motion.button
            onClick={() => scrollToSection("about")}
            className="flex flex-col items-center text-muted-foreground hover:text-accent smooth-transition"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-sm mb-2">Scroll down</span>
            <ArrowDown className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}