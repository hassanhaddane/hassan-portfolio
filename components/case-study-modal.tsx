"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Download, Check } from "lucide-react"

interface CaseStudyData {
  title: string
  problem: string
  context: string
  constraints: string[]
  role: string
  approach: string[]
  keyDecisions: string[]
  results: string[]
  stack: string[]
  takeaways: string[]
}

interface CaseStudyModalProps {
  isOpen: boolean
  onClose: () => void
  data: CaseStudyData
}

export function CaseStudyModal({ isOpen, onClose, data }: CaseStudyModalProps) {
  const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact")
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    const text = `
${data.title}

Problem: ${data.problem}
Context: ${data.context}
Role: ${data.role}

Approach:
${data.approach.join("\n")}

Results:
${data.results.join("\n")}

Stack: ${data.stack.join(", ")}
    `.trim()

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadPDF = () => {
    // Simple print-based PDF generation
    window.print()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[90vh] bg-[#373F51] border border-[#58A4B0]/20 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#58A4B0]/10">
              <h2 className="text-xl font-mono text-[#D8DBE2]">{data.title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-[#58A4B0]/10 rounded-lg transition-colors">
                <X className="w-5 h-5 text-[#A9BCD0]" />
              </button>
            </div>

            {/* Actions bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#1B1B1E]/30 border-b border-[#58A4B0]/10">
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode("compact")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    viewMode === "compact"
                      ? "bg-[#58A4B0] text-[#1B1B1E]"
                      : "bg-[#373F51] text-[#A9BCD0] hover:bg-[#58A4B0]/20"
                  }`}
                >
                  Compact
                </button>
                <button
                  onClick={() => setViewMode("detailed")}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    viewMode === "detailed"
                      ? "bg-[#58A4B0] text-[#1B1B1E]"
                      : "bg-[#373F51] text-[#A9BCD0] hover:bg-[#58A4B0]/20"
                  }`}
                >
                  Detailed
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1 bg-[#373F51] hover:bg-[#58A4B0]/20 text-[#A9BCD0] rounded text-xs font-mono transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-2 px-3 py-1 bg-[#58A4B0] hover:bg-[#58A4B0]/80 text-[#1B1B1E] rounded text-xs font-mono transition-colors"
                >
                  <Download className="w-3 h-3" />
                  PDF
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Problem & Context */}
              <div>
                <h3 className="text-sm font-mono text-[#58A4B0] mb-2">Problem & Context</h3>
                <p className="text-sm text-[#D8DBE2] mb-2">{data.problem}</p>
                <p className="text-sm text-[#A9BCD0]">{data.context}</p>
              </div>

              {/* Role */}
              <div>
                <h3 className="text-sm font-mono text-[#58A4B0] mb-2">My Role</h3>
                <p className="text-sm text-[#D8DBE2]">{data.role}</p>
              </div>

              {/* Approach */}
              <div>
                <h3 className="text-sm font-mono text-[#58A4B0] mb-2">Approach</h3>
                <ul className="space-y-2">
                  {(viewMode === "compact" ? data.approach.slice(0, 3) : data.approach).map((item, i) => (
                    <li key={i} className="text-sm text-[#D8DBE2] flex gap-2">
                      <span className="text-[#58A4B0]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Results */}
              <div>
                <h3 className="text-sm font-mono text-[#58A4B0] mb-2">Results & Impact</h3>
                <ul className="space-y-2">
                  {(viewMode === "compact" ? data.results.slice(0, 3) : data.results).map((item, i) => (
                    <li key={i} className="text-sm text-[#D8DBE2] flex gap-2">
                      <span className="text-[#58A4B0]">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Stack */}
              <div>
                <h3 className="text-sm font-mono text-[#58A4B0] mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {data.stack.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-[#1B1B1E]/50 border border-[#58A4B0]/20 rounded text-xs font-mono text-[#A9BCD0]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {viewMode === "detailed" && (
                <>
                  {/* Key Decisions */}
                  <div>
                    <h3 className="text-sm font-mono text-[#58A4B0] mb-2">Key Decisions</h3>
                    <ul className="space-y-2">
                      {data.keyDecisions.map((item, i) => (
                        <li key={i} className="text-sm text-[#D8DBE2] flex gap-2">
                          <span className="text-[#58A4B0]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Takeaways */}
                  <div>
                    <h3 className="text-sm font-mono text-[#58A4B0] mb-2">Key Takeaways</h3>
                    <ul className="space-y-2">
                      {data.takeaways.map((item, i) => (
                        <li key={i} className="text-sm text-[#D8DBE2] flex gap-2">
                          <span className="text-[#58A4B0]">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
