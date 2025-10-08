"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Rocket, Users, Target } from "lucide-react"

/**
 * Section À propos - Présentation détaillée du profil
 * Met en avant la personnalité, les valeurs et l'approche professionnelle
 */
export function AboutSection() {
  const values = [
    {
      icon: Code,
      title: "Code de qualité",
      description: "Je privilégie la lisibilité, la maintenabilité et les bonnes pratiques dans chaque ligne de code.",
    },
    {
      icon: Rocket,
      title: "Innovation",
      description: "Toujours à l'affût des dernières technologies pour créer des solutions modernes et performantes.",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Travail d'équipe, communication claire et partage de connaissances sont mes priorités.",
    },
    {
      icon: Target,
      title: "Orienté résultats",
      description: "Focus sur la valeur business et l'expérience utilisateur pour des projets qui ont du sens.",
    },
  ]

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary font-mono">
            <span className="text-secondary">//</span> À propos
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance font-mono">
            Développeur passionné par l'innovation
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            🌱 J'évolue dans un écosystème moderne où design, performance et innovation se rencontrent. Passionné par la
            technologie, j'ai un vrai goût pour les produits bien pensés, les équipes soudées et les défis qui demandent
            autant de créativité que de rigueur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:border-primary/50 transition-all group bg-card border-border h-full">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-12 h-12 bg-primary/10 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors"
                  >
                    <Icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="font-semibold mb-2 font-mono text-sm">{value.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">{value.description}</p>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold font-mono">
              <span className="text-secondary">{"{"}</span> Mon approche <span className="text-secondary">{"}"}</span>
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p className="text-pretty leading-relaxed">
                💡 Développeur Full-Stack orienté Front-end, j'aime transformer des idées complexes en interfaces
                fluides, intuitives et élégantes. Mon parcours m'a permis d'explorer l'ensemble du cycle de vie d'une
                application web — de la conception à la mise en production — en plaçant toujours l'expérience
                utilisateur et la qualité du code au centre.
              </p>
              <p className="text-pretty leading-relaxed">
                Passionné par la technologie, j'ai un vrai goût pour les produits bien pensés, les équipes soudées et
                les défis qui demandent autant de créativité que de rigueur.
              </p>
              <p className="text-pretty leading-relaxed">
                🚨 Aujourd'hui, je cherche à rejoindre une équipe qui valorise le sens du détail, la collaboration et la
                vision produit, afin de continuer à apprendre, créer et livrer des solutions qui font la différence.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-card border-primary/20 hover:border-primary/50 transition-all">
              <h4 className="font-semibold mb-4 text-primary font-mono uppercase text-sm tracking-wide">
                <span className="text-secondary">$</span> Situation actuelle
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-primary">Recherche CDI</p>
                  <p className="text-sm text-muted-foreground">Développeur Full-Stack / Front-End</p>
                  <p className="text-xs text-muted-foreground font-mono">Rennes / Remote</p>
                </div>
                <div>
                  <p className="font-medium text-secondary">Disponible en Freelance</p>
                  <p className="text-sm text-muted-foreground">Missions courtes et longues durées</p>
                </div>
                <div>
                  <p className="font-medium">Diplômé en Ingénierie Informatique</p>
                  <p className="text-sm text-muted-foreground">EPSI</p>
                  <p className="text-xs text-muted-foreground font-mono">Bac+5 - 2025</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3 font-mono">Stack favorite</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="font-mono text-xs bg-primary/20 text-primary border-primary/30">
                    React
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs bg-primary/20 text-primary border-primary/30">
                    Next.js
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-xs bg-primary/20 text-primary border-primary/30">
                    TypeScript
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="font-mono text-xs bg-secondary/20 text-secondary border-secondary/30"
                  >
                    Node.js
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
