"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Building } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Section Expérience - Timeline des expériences professionnelles
 * Présentation chronologique avec détails des missions et réalisations
 */
export function ExperienceSection() {
  const experiences = [
    {
      title: "Développeur Full Stack",
      company: "iAudiogram - My Medical Assistant",
      type: "Contrat en alternance",
      location: "Reims, Grand Est, France · Hybride",
      period: "Sept. 2022 - Sept. 2025",
      duration: "3 ans 1 mois",
      description:
        "Participation au développement d'applications web innovantes dans le domaine de la e-santé. Une expérience marquée par la rigueur du domaine médical, le travail en équipe et la recherche permanente d'un équilibre entre performance et simplicité.",
      achievements: [
        "Conception d'interfaces utilisateur dynamiques et intuitives en étroite collaboration avec les équipes produit et design",
        "Développement de nouvelles fonctionnalités et amélioration continue du code existant",
        "Contribution à la stabilité et la fluidité de l'expérience utilisateur sur l'ensemble de la plateforme",
        "Implication dans les phases de tests, d'optimisation et de documentation technique",
        "Organisation du travail autour d'un backlog GitHub et réunions régulières d'équipe (approche collaborative et itérative)",
      ],
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Cypress", "Jest", "JavaScript"],
      current: false,
    },
    {
      title: "Développeur front-end",
      company: "Association Santé respiratoire France",
      type: "Stage",
      location: "Ville de Paris, Île-de-France, France · Hybride",
      period: "Janv. 2022 - Févr. 2022",
      duration: "2 mois",
      description:
        "Développement et modernisation du site institutionnel de l'association. Résultat : une interface plus fluide et accessible aux utilisateurs.",
      achievements: [
        "Développement et mise à jour d'un site web institutionnel",
        "Création de modules interactifs et de fonctionnalités dynamiques",
        "Optimisation de la structure et de la navigation du site",
        "Modernisation du site et mise à disposition de fonctionnalités pratiques pour les utilisateurs",
      ],
      technologies: ["WordPress", "JavaScript", "WebFlow", "HTML/CSS"],
      current: false,
    },
    {
      title: "Développeur front-end",
      company: "Biosency",
      type: "Stage puis CDD",
      location: "Rennes, Bretagne, France · Sur site",
      period: "Mai 2021 - Juin 2021",
      duration: "2 mois",
      description:
        "Développement front-end sur une plateforme de suivi médical connecté. Impact : amélioration de la fiabilité et de la stabilité du produit.",
      achievements: [
        "Développement front-end sur une plateforme de suivi médical connecté",
        "Participation à l'automatisation de tests pour garantir la qualité et la stabilité de l'application",
        "Collaboration avec l'équipe technique pour améliorer et valider de nouvelles fonctionnalités",
        "Renforcement de la qualité logicielle et meilleure fiabilité de l'outil destiné aux professionnels de santé",
      ],
      technologies: ["JavaScript", "TypeScript", "Cypress", "React", "HTML/CSS", "Git"],
      current: false,
    },
    {
      title: "Technicien spécialisé réparation matériel informatique",
      company: "Baghdad Computers",
      type: "Stage",
      location: "Fès, Fès-Meknès, Maroc · Sur site",
      period: "Févr. 2020 - Avr. 2020",
      duration: "3 mois",
      description:
        "Expérience formatrice sur le lien entre matériel, logiciel et service client. Amélioration du support client et optimisation des solutions matérielles et logicielles proposées.",
      achievements: [
        "Support technique (maintenance hardware & software)",
        "Assemblage et configuration d'ordinateurs sur mesure adaptés aux besoins clients",
        "Participation à la mise à jour et à l'administration d'un site web vitrine",
        "Community management (Facebook, Instagram, Forums)",
        "Amélioration du support client et optimisation des solutions proposées",
      ],
      technologies: ["Hardware", "Windows", "Linux", "Diagnostic", "Assembly"],
      current: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-[#58A4B0]/50 text-[#58A4B0] font-mono">
            <span className="text-[#A9BCD0]">//</span> Expérience
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance font-mono text-[#D8DBE2]">
            Mon expérience professionnelle
          </h2>
          <p className="text-lg text-[#A9BCD0] max-w-3xl mx-auto text-pretty leading-relaxed">
            Un parcours riche et diversifié, du support technique au développement web, avec une spécialisation
            progressive dans les technologies modernes.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#58A4B0] via-[#A9BCD0] to-[#373F51] hidden md:block" />

          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {experiences.map((exp, index) => (
              <motion.div key={index} className="relative" variants={itemVariants}>
                {/* Timeline dot */}
                <div className="absolute left-6 w-4 h-4 bg-[#58A4B0] rounded-full border-4 border-[#1B1B1E] hidden md:block shadow-lg shadow-[#58A4B0]/50" />

                <Card
                  className={`md:ml-16 hover:border-[#58A4B0]/50 transition-all bg-[#373F51]/20 border-[#373F51] hover:shadow-lg hover:shadow-[#58A4B0]/10 ${
                    exp.current ? "ring-2 ring-[#58A4B0]/20 bg-[#58A4B0]/5" : ""
                  }`}
                >
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-xl">{exp.title}</CardTitle>
                          {exp.current && (
                            <Badge variant="default" className="text-xs bg-accent text-accent-foreground">
                              En cours
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="w-4 h-4 text-primary" />
                          <span className="font-medium">{exp.company}</span>
                          <Badge variant="outline" className="text-xs border-primary/30">
                            {exp.type}
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground font-mono">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-accent" />
                            <span>{exp.period}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-secondary" />
                            <span>{exp.location}</span>
                          </div>
                        </div>
                      </div>

                      <Badge variant="secondary" className="self-start bg-primary/20 text-primary border-primary/30">
                        {exp.duration}
                      </Badge>
                    </div>

                    <CardDescription className="text-pretty leading-relaxed">{exp.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Réalisations */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-primary font-mono">Principales réalisations</h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start">
                            <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 mt-2 flex-shrink-0" />
                            <span className="text-pretty">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="font-medium mb-3 text-sm text-primary font-mono">Technologies utilisées</h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs border-primary/30 hover:border-primary/50 transition-colors"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Résumé de l'expérience */}
        <div className="mt-16">
          <Card className="p-8 bg-card border-primary/20 glow-primary">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 font-mono">Bilan de mon parcours</h3>
              <div className="grid sm:grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-2xl font-bold text-primary">3+</div>
                  <div className="text-sm text-muted-foreground">Années d'expérience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">4</div>
                  <div className="text-sm text-muted-foreground">Entreprises</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">10+</div>
                  <div className="text-sm text-muted-foreground">Projets réalisés</div>
                </div>
              </div>
              <p className="text-muted-foreground text-pretty">
                Un parcours qui m'a permis d'acquérir une vision complète du développement web, de la technique pure aux
                enjeux business et utilisateur.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
