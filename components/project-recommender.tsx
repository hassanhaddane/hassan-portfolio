"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X, RefreshCw } from "lucide-react"
import Link from "next/link"

interface RecommendationRule {
  condition: string
  projects: string[]
  message: string
}

const recommendationRules: RecommendationRule[] = [
  {
    condition: "frontend",
    projects: ["iAudiogram Platform", "Biosency Medical Dashboard"],
    message: "Based on your interest in frontend development",
  },
  {
    condition: "fullstack",
    projects: ["iAudiogram Platform", "E-commerce Platform"],
    message: "You might like these full-stack projects",
  },
  {
    condition: "medical",
    projects: ["iAudiogram Platform", "Biosency Medical Dashboard"],
    message: "Interested in healthcare tech?",
  },
]

export function ProjectRecommender() {
  const [userSignals, setUserSignals] = useState<{
    sectionsViewed: string[]
    dwellTime: Record<string, number>
    clickedTags: string[]
  }>({
    sectionsViewed: [],
    dwellTime: {},
    clickedTags: [],
  })

  const [recommendation, setRecommendation] = useState<RecommendationRule | null>(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [showCard, setShowCard] = useState(false)

  // Track section views
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            setUserSignals((prev) => ({
              ...prev,
              sectionsViewed: [...new Set([...prev.sectionsViewed, sectionId])],
            }))
          }
        })
      },
      { threshold: 0.5 },
    )

    document.querySelectorAll("section[id]").forEach((section) => {
      observer.observe(section)
    })

    return () => observer.disconnect()
  }, [])

  // Generate recommendation after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSignals.sectionsViewed.length > 2) {
        // Simple heuristic: if user viewed skills or projects section
        const hasViewedSkills = userSignals.sectionsViewed.includes("skills")
        const hasViewedProjects = userSignals.sectionsViewed.includes("projects")

        if (hasViewedSkills || hasViewedProjects) {
          const rule = recommendationRules[Math.floor(Math.random() * recommendationRules.length)]
          setRecommendation(rule)
          setShowCard(true)
        }
      }
    }, 1200)

    return () => clearTimeout(timer)
  }, [userSignals.sectionsViewed])

  const handleShowAnother = () => {
    if (recommendation) {
      setCurrentProjectIndex((prev) => (prev + 1) % recommendation.projects.length)
    }
  }

  if (!recommendation) return null

  const currentProject = recommendation.projects[currentProjectIndex]

  return (
    <AnimatePresence>
      {showCard && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-8 right-8 z-40 w-80 bg-[#373F51]/95 backdrop-blur-xl border border-[#58A4B0]/20 rounded-lg shadow-2xl p-4"
        >
          <button
            onClick={() => setShowCard(false)}
            className="absolute top-2 right-2 p-1 hover:bg-[#58A4B0]/10 rounded transition-colors"
          >
            <X className="w-4 h-4 text-[#A9BCD0]" />
          </button>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-[#58A4B0]/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-[#58A4B0]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#A9BCD0] font-mono mb-2">{recommendation.message}</p>
              <Link
                href="#projects"
                className="text-sm font-medium text-[#D8DBE2] hover:text-[#58A4B0] transition-colors"
              >
                {currentProject}
              </Link>
              <button
                onClick={handleShowAnother}
                className="mt-3 flex items-center gap-2 text-xs text-[#58A4B0] hover:text-[#D8DBE2] transition-colors font-mono"
              >
                <RefreshCw className="w-3 h-3" />
                Show another
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
