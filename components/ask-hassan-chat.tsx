"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"
import { useUIStore } from "@/lib/stores/use-ui-store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  type: "user" | "assistant"
  text: string
}

const faqs = {
  technologies: {
    keywords: ["tech", "stack", "technologies", "tools", "languages", "framework"],
    response:
      "I work primarily with:\n• Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion\n• Backend: Node.js, Python, Django\n• Database: PostgreSQL, MySQL, MongoDB\n• DevOps: Docker, Git, CI/CD",
  },
  freelance: {
    keywords: ["freelance", "available", "hire", "contract", "mission"],
    response:
      "Yes! I'm available for freelance projects and contract work. I'm particularly interested in modern web applications, SaaS products, and innovative tech projects. Feel free to reach out!",
  },
  cdi: {
    keywords: ["cdi", "full-time", "permanent", "job", "position", "employment"],
    response:
      "I'm actively looking for a CDI (permanent position) as a Full-Stack or Front-End Developer in Rennes or remote. I'm interested in innovative projects with strong product vision and collaborative teams.",
  },
  projects: {
    keywords: ["project", "work", "portfolio", "experience", "built"],
    response:
      "My main project is iAudiogram, a medical web application where I worked for 3 years developing innovative features. I've also worked on Biosency (connected medical monitoring) and various other web applications. Check out my Projects section for more details!",
  },
  contact: {
    keywords: ["contact", "email", "reach", "phone", "linkedin"],
    response:
      "You can reach me at:\n• Email: hassanhaddane33s@gmail.com\n• Phone: 0760582674\n• LinkedIn: linkedin.com/in/hassanhaddane\n\nI usually respond within 24 hours!",
  },
  location: {
    keywords: ["location", "where", "based", "rennes", "remote"],
    response:
      "I'm based in Rennes, France. I'm open to on-site, hybrid, or fully remote positions. I'm also available for occasional travel if needed.",
  },
  experience: {
    keywords: ["experience", "years", "background", "career"],
    response:
      "I have 3+ years of professional experience in web development, including a 3-year position at iAudiogram. I recently completed my Master's degree in Computer Engineering from EPSI.",
  },
}

function findBestMatch(query: string): string {
  const lowerQuery = query.toLowerCase()

  for (const [, faq] of Object.entries(faqs)) {
    if (faq.keywords.some((keyword) => lowerQuery.includes(keyword))) {
      return faq.response
    }
  }

  return "I'm not sure I understand your question. You can ask me about:\n• My technologies and skills\n• Freelance availability\n• CDI opportunities\n• My projects and experience\n• How to contact me\n• My location and remote work"
}

export function AskHassanChat() {
  const { isChatOpen, toggleChat } = useUIStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      text: "Hi! I'm Hassan's AI assistant. Ask me anything about his skills, experience, or availability!",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = findBestMatch(input)
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      text: response,
    }

    setMessages((prev) => [...prev, assistantMessage])
    setIsTyping(false)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button onClick={toggleChat} size="lg" className="rounded-full h-14 w-14 shadow-lg">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[380px] h-[500px] z-50 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-semibold text-foreground">Ask Hassan</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div ref={scrollRef} className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-foreground/50 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-muted border-none outline-none rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
