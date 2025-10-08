"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, Terminal } from "lucide-react"

/**
 * Section Projets - Showcase des réalisations principales
 * Présente les projets avec technologies utilisées et liens
 */
export function ProjectsSection() {
  const projects = [
    {
      title: "Application d'Audiométrie Médicale",
      description:
        "Application web responsive pour les professionnels de santé permettant de réaliser des tests auditifs complets avec interface intuitive et rapports détaillés.",
      technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "Cypress"],
      category: "Medical App",
      status: "Production",
      highlights: [
        "Interface responsive optimisée",
        "Tests end-to-end automatisés",
        "Modules fonctionnels avancés",
        "Optimisations performance",
      ],
    },
    {
      title: "Plateforme Bora-Connect",
      description:
        "Développement front-end pour une plateforme de connexion professionnelle avec interface moderne et expérience utilisateur optimisée.",
      technologies: ["JavaScript", "React", "Tailwind CSS", "REST API"],
      category: "Web Platform",
      status: "Delivered",
      highlights: [
        "Interface utilisateur moderne",
        "Intégration API REST",
        "Design responsive",
        "Performance optimisée",
      ],
    },
    {
      title: "Simulateurs de Calculs Médicaux",
      description:
        "Création de simulateurs interactifs pour calculs médicaux spécialisés, intégrés dans un environnement WebFlow avec logique JavaScript avancée.",
      technologies: ["JavaScript", "WebFlow", "CSS3", "HTML5"],
      category: "Medical Tools",
      status: "Deployed",
      highlights: ["Calculs médicaux précis", "Interface interactive", "Intégration WebFlow", "Validation des données"],
    },
    {
      title: "Site Web Santé Respiratoire",
      description:
        "Développement et mise à jour d'un site WordPress pour une organisation de santé, avec optimisations SEO et amélioration de l'expérience utilisateur.",
      technologies: ["WordPress", "PHP", "MySQL", "JavaScript", "CSS3"],
      category: "Institutional",
      status: "Maintained",
      highlights: ["Optimisation SEO", "Mise à jour sécurisée", "Performance améliorée", "Accessibilité renforcée"],
    },
  ]

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary font-mono">
            <Terminal className="w-3 h-3 mr-2" />
            Projets
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance font-mono">
            <span className="text-secondary">const</span> projects = <span className="text-primary">[...]</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Découvrez une sélection de mes projets les plus significatifs, allant des applications médicales aux
            plateformes web modernes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className="group hover:border-primary/50 transition-all duration-300 border-border bg-card"
            >
              <CardHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs font-mono border-primary/30">
                      {project.category}
                    </Badge>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors font-mono">
                      {project.title}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={project.status === "Production" ? "default" : "secondary"}
                    className="text-xs font-mono"
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="text-pretty leading-relaxed">{project.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Points forts */}
                <div>
                  <h4 className="font-medium mb-3 text-sm font-mono text-primary">Features</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2 flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-medium mb-3 text-sm font-mono text-primary">Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-mono">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent border-primary/30 hover:bg-primary/10"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Détails
                  </Button>
                  {index < 2 && (
                    <Button variant="ghost" size="sm" className="hover:bg-primary/10">
                      <Github className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Card className="p-8 bg-card border-primary/20">
            <h3 className="text-xl font-bold mb-4 font-mono">Intéressé par mes projets ?</h3>
            <p className="text-muted-foreground mb-6 text-pretty">
              Je serais ravi de discuter de mes réalisations en détail et de voir comment nous pourrions collaborer sur
              vos futurs projets.
            </p>
            <Button
              onClick={() => {
                const element = document.querySelector("#contact")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
            >
              Discutons de vos projets
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
