"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "#about", label: "À propos" },
    { href: "#projects", label: "Projets" },
    { href: "#skills", label: "Compétences" },
    { href: "#experience", label: "Expérience" },
    { href: "#education", label: "Formation" },
    { href: "#contact", label: "Contact" },
  ]

  const handleNavClick = (href: string) => {
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-[#1B1B1E]/95 backdrop-blur-md border-b border-[#58A4B0]/20 shadow-lg" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Nom */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={() => handleNavClick("#hero")}
              className="flex items-center gap-2 text-xl font-bold text-[#58A4B0] hover:text-[#A9BCD0] transition-colors font-mono"
            >
              <span className="hidden sm:inline">Hassan Haddane</span>
              <span className="sm:hidden">HH</span>
            </button>
          </motion.div>

          {/* Navigation desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavClick(item.href)}
                  className="text-[#D8DBE2] hover:text-[#58A4B0] px-3 py-2 rounded-sm text-sm font-medium transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#58A4B0] transition-all group-hover:w-full" />
                </motion.button>
              ))}

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 }}
              >
                <Button
                  onClick={() =>
                    window.open(
                      "https://www.canva.com/design/DAG0kGKt3XE/3fmYO14hbkmxtD7AMlvvWw/view?utm_content=DAG0kGKt3XE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h813810c1df",
                      "_blank",
                    )
                  }
                  size="sm"
                  className="bg-[#58A4B0] hover:bg-[#58A4B0]/80 text-[#1B1B1E]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Consulter le CV
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-[#58A4B0]/10 text-[#D8DBE2]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 bg-[#1B1B1E]/95 backdrop-blur-md border-b border-[#58A4B0]/20">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="text-[#D8DBE2] hover:text-[#58A4B0] hover:bg-[#58A4B0]/10 block px-3 py-2 rounded-sm text-base font-medium w-full text-left transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  onClick={() => {
                    window.open(
                      "https://www.canva.com/design/DAG0kGKt3XE/3fmYO14hbkmxtD7AMlvvWw/view?utm_content=DAG0kGKt3XE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h813810c1df",
                      "_blank",
                    )
                    setIsOpen(false)
                  }}
                  size="sm"
                  className="mt-2 w-full bg-[#58A4B0] hover:bg-[#58A4B0]/80 text-[#1B1B1E]"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Consulter le CV
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
