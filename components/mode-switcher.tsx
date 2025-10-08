"use client"

import { motion } from "framer-motion"
import { Code2, Briefcase } from "lucide-react"
import { useModeStore } from "@/lib/stores/use-mode-store"

export function ModeSwitcher() {
  const { mode, setMode } = useModeStore()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-8 z-50 hidden md:block"
    >
      <div className="bg-[#373F51]/80 backdrop-blur-md border border-[#58A4B0]/20 rounded-full p-1 shadow-lg">
        <div className="flex gap-1">
          <button
            onClick={() => setMode("dev")}
            className={`relative px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
              mode === "dev" ? "text-[#1B1B1E]" : "text-[#A9BCD0] hover:text-[#D8DBE2]"
            }`}
          >
            {mode === "dev" && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 bg-[#58A4B0] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              Dev Mode
            </span>
          </button>
          <button
            onClick={() => setMode("product")}
            className={`relative px-4 py-2 rounded-full text-sm font-mono transition-all duration-300 ${
              mode === "product" ? "text-[#1B1B1E]" : "text-[#A9BCD0] hover:text-[#D8DBE2]"
            }`}
          >
            {mode === "product" && (
              <motion.div
                layoutId="mode-indicator"
                className="absolute inset-0 bg-[#58A4B0] rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Product Mode
            </span>
          </button>
        </div>
      </div>

      {/* Mode description tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-3 text-xs text-[#A9BCD0] font-mono text-center"
      >
        {mode === "dev" ? "Technical insights & architecture" : "Business impact & UX outcomes"}
      </motion.div>
    </motion.div>
  )
}
