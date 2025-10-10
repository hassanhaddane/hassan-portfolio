"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Settings, X, Zap, Package, Calendar, Palette } from "lucide-react"
import { useThemeStore } from "@/lib/stores/use-theme-store"

export function SystemPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [fps, setFps] = useState(60)
  const { isDark, setTheme } = useThemeStore()

  // FPS counter
  useEffect(() => {
    let frameCount = 0
    let lastTime = performance.now()

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(measureFPS)
    }

    const rafId = requestAnimationFrame(measureFPS)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const buildDate = new Date().toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })

  return (
    <>
      {/* Toggle button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 right-8 z-50 p-3 bg-[#373F51]/80 backdrop-blur-md border border-[#58A4B0]/20 rounded-full hover:bg-[#373F51] transition-colors shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Settings className="w-5 h-5 text-[#58A4B0]" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel content */}
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-[#373F51]/95 backdrop-blur-xl border-l border-[#58A4B0]/20 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-mono text-[#D8DBE2]">System Panel</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-[#58A4B0]/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-[#A9BCD0]" />
                  </button>
                </div>

                {/* Stack info */}
                <div className="space-y-4">
                  <div className="p-4 bg-[#1B1B1E]/50 rounded-lg border border-[#58A4B0]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Package className="w-4 h-4 text-[#58A4B0]" />
                      <span className="text-sm font-mono text-[#D8DBE2]">Tech Stack</span>
                    </div>
                    <div className="space-y-2 text-xs font-mono text-[#A9BCD0]">
                      <div className="flex justify-between">
                        <span>Next.js</span>
                        <span className="text-[#58A4B0]">15.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>React</span>
                        <span className="text-[#58A4B0]">19.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TypeScript</span>
                        <span className="text-[#58A4B0]">5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Framer Motion</span>
                        <span className="text-[#58A4B0]">11.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Build info */}
                  <div className="p-4 bg-[#1B1B1E]/50 rounded-lg border border-[#58A4B0]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-[#58A4B0]" />
                      <span className="text-sm font-mono text-[#D8DBE2]">Build Info</span>
                    </div>
                    <div className="space-y-2 text-xs font-mono text-[#A9BCD0]">
                      <div className="flex justify-between">
                        <span>Version</span>
                        <span className="text-[#58A4B0]">2.0.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Build Date</span>
                        <span className="text-[#58A4B0]">{buildDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="p-4 bg-[#1B1B1E]/50 rounded-lg border border-[#58A4B0]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-4 h-4 text-[#58A4B0]" />
                      <span className="text-sm font-mono text-[#D8DBE2]">Performance</span>
                    </div>
                    <div className="space-y-2 text-xs font-mono text-[#A9BCD0]">
                      <div className="flex justify-between items-center">
                        <span>FPS</span>
                        <span
                          className={`${fps >= 55 ? "text-green-400" : fps >= 30 ? "text-yellow-400" : "text-red-400"}`}
                        >
                          {fps}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Bundle Size</span>
                        <span className="text-[#58A4B0]">~180KB</span>
                      </div>
                    </div>
                  </div>

                  {/* Theme selector */}
                  <div className="p-4 bg-[#1B1B1E]/50 rounded-lg border border-[#58A4B0]/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Palette className="w-4 h-4 text-[#58A4B0]" />
                      <span className="text-sm font-mono text-[#D8DBE2]">Theme</span>
                    </div>
                    <div className="space-y-2">
                      {["light", "dark"].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t === "dark")}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-mono text-left transition-colors ${
                            (t === "dark" && isDark) || (t === "light" && !isDark)
                              ? "bg-[#58A4B0] text-[#1B1B1E]"
                              : "bg-[#373F51]/50 text-[#A9BCD0] hover:bg-[#373F51]"
                          }`}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
