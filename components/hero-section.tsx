"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ExternalLink, Github, Linkedin, Mail, MapPin, Phone, Briefcase } from "lucide-react"
import { Badge } from "@/components/ui/badge"

/**
 * Section Hero - Présentation principale avec informations de contact
 * Première section visible avec photo, titre, description et liens
 */
export function HeroSection() {
  const handleViewCV = () => {
    window.open(
      "https://www.canva.com/design/DAG0kGKt3XE/3fmYO14hbkmxtD7AMlvvWw/view?utm_content=DAG0kGKt3XE&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h813810c1df",
      "_blank",
    )
  }

  const handleContactClick = (type: "email" | "phone" | "linkedin" | "github") => {
    const contacts = {
      email: "mailto:hassanhaddane33s@gmail.com",
      phone: "tel:+33760582674",
      linkedin: "https://www.linkedin.com/in/hassanhaddane/",
      github: "https://github.com/lowkyz",
    }

    window.open(contacts[type], "_blank")
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu principal */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <Badge variant="outline" className="text-sm border-primary/50 text-primary w-fit">
                <span className="inline-block w-2 h-2 bg-primary rounded-full mr-2 animate-pulse" />
                Disponible pour CDI - Rennes / Remote
              </Badge>
              <Badge variant="outline" className="text-sm border-secondary/50 text-secondary w-fit">
                <Briefcase className="w-3 h-3 mr-2" />
                Disponible en Freelance
              </Badge>
            </div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance font-mono"
              >
                Hassan <span className="text-primary">Haddane</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl sm:text-2xl text-muted-foreground font-medium font-mono"
              >
                <span className="text-secondary">&lt;</span>Développeur Full-Stack
                <span className="text-primary"> | </span>
                Focus Front-End
                <span className="text-secondary">/&gt;</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg text-muted-foreground text-pretty leading-relaxed"
              >
                💡 Développeur Full-Stack orienté Front-end, j'aime transformer des idées complexes en interfaces
                fluides, intuitives et élégantes. Mon parcours m'a permis d'explorer l'ensemble du cycle de vie d'une
                application web — de la conception à la mise en production — en plaçant toujours l'expérience
                utilisateur et la qualité du code au centre.
              </motion.p>
            </div>

            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button onClick={handleViewCV} size="lg" className="font-medium group font-mono">
                <ExternalLink className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Consulter le CV
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => handleContactClick("email")}
                className="font-medium border-primary/50 hover:bg-primary/10 font-mono"
              >
                <Mail className="w-5 h-5 mr-2" />
                Me contacter
              </Button>
            </motion.div>

            {/* Liens sociaux */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-4"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleContactClick("linkedin")}
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Linkedin className="w-5 h-5" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleContactClick("github")}
                className="text-muted-foreground hover:text-secondary hover:bg-secondary/10"
              >
                <Github className="w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Carte d'informations */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="lg:justify-self-end"
          >
            <Card className="p-8 space-y-6 bg-card border-border hover:border-primary/50 transition-all">
              {/* Photo de profil */}
              <div className="flex justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative w-32 h-32 rounded-sm bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center text-4xl font-bold text-primary-foreground font-mono"
                >
                  HH
                  <div className="absolute inset-0 rounded-sm bg-gradient-to-br from-primary to-secondary opacity-50 blur-xl animate-pulse" />
                </motion.div>
              </div>

              {/* Informations de contact */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-mono">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Rennes, Bretagne, France</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-mono">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>+33 7 60 58 26 74</span>
                </div>

                <div className="flex items-center gap-3 text-sm font-mono">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="truncate">hassanhaddane33s@gmail.com</span>
                </div>
              </div>

              {/* Langues */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-primary font-mono">Langues</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Français</span>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      Bilingue
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Arabe</span>
                    <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                      Bilingue
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Anglais</span>
                    <Badge variant="secondary" className="bg-secondary/20 text-secondary border-secondary/30">
                      Professionnel
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Centres d'intérêt */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-primary font-mono">
                  Centres d'intérêt
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-primary/30 hover:border-primary/50 transition-colors">
                    Sport
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 hover:border-primary/50 transition-colors">
                    Lecture
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 hover:border-primary/50 transition-colors">
                    Musique
                  </Badge>
                  <Badge variant="outline" className="border-primary/30 hover:border-primary/50 transition-colors">
                    Mix/Mastering
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
