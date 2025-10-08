"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Terminal } from "lucide-react"

/**
 * Terminal Easter Egg - Terminal interactif activé par la touche ~
 * Affiche des informations sur le développeur dans un style terminal
 */
export function TerminalEasterEgg() {
  const [isOpen, setIsOpen] = useState(false)
  const [displayedText, setDisplayedText] = useState("")

  const terminalContent = `> npx hassanhaddane info

Hassan Haddane - Développeur Web Full-Stack
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location:      Rennes, France
💼 Status:        Disponible CDI / Freelance
🎓 Education:     Master Ingénierie Informatique (Bac+5)
🛠️  Stack:         React, Next.js, TypeScript, Node.js
📧 Contact:       hassanhaddane33s@gmail.com
🔗 LinkedIn:      linkedin.com/in/hassanhaddane
💻 GitHub:        github.com/lowkyz

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ "Code with passion, build with purpose"
`

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "~" || e.key === "`") {
        setIsOpen((prev) => !prev)
        if (!isOpen) {
          setDisplayedText("")
        }
      }
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && displayedText.length < terminalContent.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(terminalContent.slice(0, displayedText.length + 1))
      }, 10)
      return () => clearTimeout(timeout)
    }
  }, [isOpen, displayedText, terminalContent])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="w-full max-w-2xl bg-[#1B1B1E] border-[#58A4B0] shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-[#373F51]">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-[#58A4B0]" />
                  <span className="font-mono text-sm text-[#D8DBE2]">hassan@portfolio:~$</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-[#373F51]">
                  <X className="w-4 h-4 text-[#A9BCD0]" />
                </Button>
              </div>
              <div className="p-6 font-mono text-sm text-[#D8DBE2] whitespace-pre-wrap max-h-[70vh] overflow-y-auto">
                {displayedText}
                <span className="inline-block w-2 h-4 bg-[#58A4B0] animate-pulse ml-1" />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
