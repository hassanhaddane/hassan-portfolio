"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

/**
 * Parallax Background - Arrière-plan animé avec effet parallax
 * Crée une sensation de profondeur au scroll
 */
export function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 300])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300])

  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient de fond */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1B1B1E] via-[#1B1B1E] to-[#373F51]/20" />

      {/* Cercles animés */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-10 w-96 h-96 bg-[#58A4B0]/5 rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-[#A9BCD0]/5 rounded-full blur-3xl"
      />

      {/* Grille subtile */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(#58A4B0 1px, transparent 1px), linear-gradient(90deg, #58A4B0 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  )
}
