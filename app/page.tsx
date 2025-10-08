"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IntroAnimation } from "@/components/intro-animation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ProjectsSection } from "@/components/projects-section"
import { SkillsSection } from "@/components/skills-section"
import { ExperienceSection } from "@/components/experience-section"
import { EducationSection } from "@/components/education-section"
import { ContactSection } from "@/components/contact-section"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

/**
 * Page principale du portfolio de Hassan Haddane
 * Structure en sections avec navigation fluide et animations immersives
 */
export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      const hasSeenIntro = sessionStorage.getItem("hasSeenIntro")
      if (hasSeenIntro) {
        setShowIntro(false)
      }
    }
  }, [isHydrated])

  const handleIntroComplete = () => {
    sessionStorage.setItem("hasSeenIntro", "true")
    setShowIntro(false)
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && <IntroAnimation key="intro" onComplete={handleIntroComplete} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showIntro ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background"
      >
        {/* Navigation fixe en haut */}
        <Navigation />

        {/* Contenu principal avec sections */}
        <main className="relative">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <EducationSection />
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer />
      </motion.div>
    </>
  )
}
