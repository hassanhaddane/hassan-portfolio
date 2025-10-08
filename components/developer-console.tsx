"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Terminal, X } from "lucide-react"
import { useUIStore } from "@/lib/stores/use-ui-store"
import { Button } from "@/components/ui/button"

const commands = {
  whoami:
    "Hassan Haddane - Full-Stack Web Developer\nBased in Rennes, France\nSpecializing in React, Next.js, and modern web technologies",
  projects:
    "Featured Projects:\n• iAudiogram - Medical web application (3 years)\n• Biosency - Connected medical monitoring platform\n• Association Santé respiratoire France - Institutional website\n\nType 'github' to see my repositories",
  contact:
    "Contact Information:\n• Email: hassanhaddane33s@gmail.com\n• Phone: 0760582674\n• LinkedIn: linkedin.com/in/hassanhaddane\n• Location: Rennes, France",
  skills:
    "Technical Skills:\n• Frontend: React, Next.js, TypeScript, Tailwind CSS\n• Backend: Node.js, Python, Django\n• Database: PostgreSQL, MySQL, MongoDB\n• Tools: Docker, Git, CI/CD, Framer Motion",
  github: "Opening GitHub profile...\n→ github.com/hassanhaddane",
  help: "Available commands:\n• whoami - About Hassan\n• projects - View projects\n• contact - Contact information\n• skills - Technical skills\n• github - GitHub profile\n• clear - Clear terminal\n• exit - Close terminal",
  clear: "CLEAR",
  exit: "EXIT",
}

export function DeveloperConsole() {
  const { isTerminalOpen, toggleTerminal } = useUIStore()
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Array<{ type: "input" | "output"; text: string }>>([
    { type: "output", text: "Hassan Haddane Portfolio Terminal v1.2.3\nType 'help' for available commands." },
  ])
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "~" || (e.ctrlKey && e.key === "k")) {
        e.preventDefault()
        toggleTerminal()
      }
      if (e.key === "Escape" && isTerminalOpen) {
        toggleTerminal()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isTerminalOpen, toggleTerminal])

  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isTerminalOpen])

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase()

    if (trimmedCmd === "clear") {
      setHistory([])
      return
    }

    if (trimmedCmd === "exit") {
      toggleTerminal()
      return
    }

    const output =
      commands[trimmedCmd as keyof typeof commands] || `Command not found: ${cmd}\nType 'help' for available commands.`

    setHistory((prev) => [...prev, { type: "input", text: cmd }, { type: "output", text: output }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleCommand(input)
      setInput("")
    }
  }

  return (
    <AnimatePresence>
      {isTerminalOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:h-[500px] z-50 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono text-foreground">hassan@portfolio:~$</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleTerminal} className="h-8 w-8">
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Terminal content */}
          <div ref={historyRef} className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2">
            {history.map((item, index) => (
              <div key={index} className={item.type === "input" ? "text-primary" : "text-muted-foreground"}>
                {item.type === "input" && <span className="text-foreground">$ </span>}
                <span className="whitespace-pre-wrap">{item.text}</span>
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border flex items-center gap-2">
            <span className="text-foreground font-mono text-sm">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-sm"
              placeholder="Type a command..."
              autoComplete="off"
            />
            <span className="typing-cursor text-primary">|</span>
          </form>

          {/* Hint */}
          <div className="px-4 pb-2 text-xs text-muted-foreground font-mono">Press ESC or type 'exit' to close</div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
