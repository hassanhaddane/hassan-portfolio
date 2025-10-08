"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, X, Code2, Calendar, Zap } from "lucide-react"

/**
 * Developer Toolbox - Panneau latéral avec informations techniques
 * Affiche la stack, version du site, dernière mise à jour
 */
export function DeveloperToolbox() {
  const [isOpen, setIsOpen] = useState(false)

  const techStack = ["Next.js 15", "React 19", "TypeScript", "Tailwind CSS v4", "Framer Motion", "shadcn/ui"]

  return (
    <>
      {/* Bouton flottant */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed bottom-24 right-8 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          variant="outline"
          className="rounded-full w-12 h-12 shadow-lg border-[#58A4B0] hover:bg-[#58A4B0]/10"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </motion.div>

      {/* Panneau latéral */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[100]"
            >
              <Card className="h-full rounded-none border-l border-[#58A4B0] bg-[#1B1B1E]">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-[#373F51]">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-[#58A4B0]" />
                      <h2 className="text-lg font-bold font-mono text-[#D8DBE2]">Developer Info</h2>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-[#373F51]">
                      <X className="w-5 h-5 text-[#A9BCD0]" />
                    </Button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Version */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-[#58A4B0]" />
                        <h3 className="font-semibold font-mono text-[#D8DBE2]">Version</h3>
                      </div>
                      <Badge variant="outline" className="border-[#58A4B0] text-[#58A4B0]">
                        v1.0.0
                      </Badge>
                    </div>

                    {/* Last Update */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-[#58A4B0]" />
                        <h3 className="font-semibold font-mono text-[#D8DBE2]">Last Update</h3>
                      </div>
                      <p className="text-sm text-[#A9BCD0] font-mono">
                        {new Date().toLocaleDateString("fr-FR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Tech Stack */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Code2 className="w-4 h-4 text-[#58A4B0]" />
                        <h3 className="font-semibold font-mono text-[#D8DBE2]">Tech Stack</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {techStack.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="bg-[#373F51] text-[#D8DBE2] border-[#58A4B0]/30"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Build Info */}
                    <div className="p-4 bg-[#373F51]/30 rounded-lg border border-[#58A4B0]/20">
                      <p className="text-xs font-mono text-[#A9BCD0] mb-2">Build Info:</p>
                      <div className="space-y-1 text-xs font-mono text-[#D8DBE2]">
                        <p>Environment: Production</p>
                        <p>Deployed on: Vercel</p>
                        <p>Performance: Optimized</p>
                      </div>
                    </div>

                    {/* Easter Egg Hint */}
                    <div className="p-4 bg-[#58A4B0]/10 rounded-lg border border-[#58A4B0]/30">
                      <p className="text-xs font-mono text-[#58A4B0]">
                        💡 Tip: Press <kbd className="px-2 py-1 bg-[#373F51] rounded">~</kbd> to open terminal
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
