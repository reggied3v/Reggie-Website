import { Navigation } from "@/components/layout/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { AIAssessmentCTA } from "@/components/sections/ai-assessment-cta"
import { AIScrumMasterSection } from "@/components/sections/ai-scrum-master-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { HomepageSidebar } from "@/components/homepage-sidebar"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <HomepageSidebar />
        <AIScrumMasterSection />
        <AIAssessmentCTA />
        <ContactSection />
      </main>
    </div>
  )
}
