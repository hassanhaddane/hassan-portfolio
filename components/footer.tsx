"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, ArrowUp } from "lucide-react"

/**
 * Footer du site - Informations finales et navigation
 * Footer simple avec copyright et bouton retour en haut
 */
export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Logo/Nom */}
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">Hassan Haddane</h3>
            <p className="text-muted-foreground text-sm">Développeur Web Full-Stack</p>
          </div>

          {/* Technologies utilisées */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Site développé avec les technologies modernes</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Badge variant="outline" className="text-xs">
                Next.js 15
              </Badge>
              <Badge variant="outline" className="text-xs">
                React 18
              </Badge>
              <Badge variant="outline" className="text-xs">
                TypeScript
              </Badge>
              <Badge variant="outline" className="text-xs">
                Tailwind CSS
              </Badge>
              <Badge variant="outline" className="text-xs">
                Shadcn/ui
              </Badge>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p className="flex items-center gap-1">
              © {currentYear} Hassan Haddane. Fait avec <Heart className="w-4 h-4 text-red-500 fill-current" /> à Rennes
            </p>
            <div className="flex items-center gap-4">
              <span>•</span>
              <a href="mailto:hassanhaddane33s@gmail.com" className="hover:text-primary transition-colors">
                Contact
              </a>
              <span>•</span>
              <a
                href="https://linkedin.com/in/hassanhaddane"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>

          {/* Bouton retour en haut */}
          <Button variant="outline" size="sm" onClick={scrollToTop} className="mt-8 bg-transparent">
            <ArrowUp className="w-4 h-4 mr-2" />
            Retour en haut
          </Button>
        </div>
      </div>
    </footer>
  )
}
