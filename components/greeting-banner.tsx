"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Cloud } from "lucide-react"

/**
 * Greeting Banner - Bannière de salutation dynamique
 * Affiche un message personnalisé selon l'heure et la localisation
 */
export function GreetingBanner() {
  const [greeting, setGreeting] = useState("")
  const [icon, setIcon] = useState<"sun" | "moon" | "cloud">("sun")
  const [location, setLocation] = useState("")

  useEffect(() => {
    const hour = new Date().getHours()

    if (hour >= 5 && hour < 12) {
      setGreeting("Bonjour")
      setIcon("sun")
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Bon après-midi")
      setIcon("cloud")
    } else {
      setGreeting("Bonsoir")
      setIcon("moon")
    }

    // Détection de la localisation (optionnel)
    try {
      const locale = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (locale.includes("Paris") || locale.includes("Europe")) {
        setLocation("🇫🇷")
      }
    } catch (error) {
      console.log("Could not detect location")
    }
  }, [])

  const Icon = icon === "sun" ? Sun : icon === "moon" ? Moon : Cloud

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-6"
    >
      <Badge variant="outline" className="border-[#58A4B0] text-[#D8DBE2] px-4 py-2">
        <Icon className="w-4 h-4 mr-2 text-[#58A4B0]" />
        {greeting} {location && <span className="ml-1">{location}</span>}
      </Badge>
    </motion.div>
  )
}
