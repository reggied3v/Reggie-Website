"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function BuiltWithSection() {
  const tools = [
    {
      name: "Claude Code",
      logo: "/logos/claude-code.svg",
      url: "https://claude.com/claude-code",
      fallbackBg: "from-purple-500/10 to-blue-500/10"
    },
    {
      name: "Vercel",
      logo: "/logos/vercel.svg",
      url: "https://vercel.com",
      fallbackBg: "from-gray-900/10 to-gray-700/10"
    },
    {
      name: "Supabase",
      logo: "/logos/supabase.svg",
      url: "https://supabase.com",
      fallbackBg: "from-green-500/10 to-emerald-500/10"
    },
    {
      name: "GitHub",
      logo: "/logos/github.svg",
      url: "https://github.com",
      fallbackBg: "from-gray-800/10 to-gray-600/10"
    }
  ]

  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground mb-6">Built with</p>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {tools.map((tool, index) => (
              <motion.a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center gap-2 smooth-transition"
                whileHover={{ y: -4 }}
              >
                <div className={`relative w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${tool.fallbackBg} group-hover:scale-110 smooth-transition`}>
                  {/* Using div with background color as fallback since logos may not exist yet */}
                  <span className="text-xl font-bold text-foreground/80 group-hover:text-foreground">
                    {tool.name.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground smooth-transition">
                  {tool.name}
                </span>
              </motion.a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            © {new Date().getFullYear()} Reggie Ragsdale. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
