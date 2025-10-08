"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * Intro Animation Component
 * Displays an immersive loading animation before revealing the main portfolio
 * Features: typing effect, glitch transition, smooth fade out
 */
export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("")
  const fullText = "Initializing portfolio..."

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setTimeout(() => {
          onComplete()
        }, 800)
      }
    }, 60) // Faster typing speed

    return () => clearInterval(typingInterval)
  }, [onComplete, fullText])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1B1B1E]"
    >
      <div className="text-center">
        <div className="font-mono text-2xl sm:text-3xl md:text-4xl">
          <span className="text-[#58A4B0]">&gt;</span> <span className="text-[#D8DBE2]">{text}</span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
            className="text-[#58A4B0]"
          >
            _
          </motion.span>
        </div>

        {/* Loading bar */}
        <div className="mt-8 h-1 bg-[#373F51] rounded-full overflow-hidden max-w-md mx-auto">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-[#58A4B0] rounded-full"
          />
        </div>
      </div>
    </motion.div>
  )
}
