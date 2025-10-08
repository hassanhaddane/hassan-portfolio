import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, GraduationCap } from "lucide-react"

/**
 * Section Formation - Parcours académique et certifications
 * Présentation du cursus éducatif avec diplômes et spécialisations
 */
export function EducationSection() {
  const education = [
    {
      degree: "Expert en Informatique et système d'information",
      level: "Master Ingénierie Informatique (Bac+5)",
      school: "EPSI - L'école d'ingénierie informatique",
      location: "Montpellier, France",
      period: "Sept. 2023 - Sept. 2025",
      status: "Obtenu",
      description:
        "Formation d'ingénieur en informatique avec spécialisation en développement web et systèmes d'information. Certification RNCP de niveau 7.",
      specializations: [
        "Développement web full-stack",
        "Architecture logicielle",
        "Gestion de projet agile",
        "Sécurité informatique",
        "Intelligence artificielle",
        "DevOps et Cloud",
      ],
      current: false,
    },
    {
      degree: "Concepteur Développeur D'application",
      level: "Licence - Bachelor Informatique (Bac+3)",
      school: "EPSI - L'école d'ingénierie informatique",
      location: "Montpellier, France",
      period: "Sept. 2020 - Sept. 2023",
      status: "Obtenu",
      description:
        "Formation spécialisée dans la conception et le développement d'applications web et mobiles. Certification RNCP31678 de niveau 6.",
      specializations: [
        "Programmation orientée objet",
        "Bases de données relationnelles",
        "Développement web responsive",
        "Méthodologies agiles",
        "Tests et qualité logicielle",
      ],
      current: false,
    },
    {
      degree: "Technicien spécialisé en maintenance support informatique et réseaux",
      level: "Technicien Spécialisé (Bac+2)",
      school: "Institut de Formation aux Métiers de l'Offshoring des Tic et de l'Audiovisuel - Fès (ISMOTICA)",
      location: "Fès, Maroc",
      period: "2018 - 2020",
      status: "Obtenu",
      description:
        "Formation technique approfondie en maintenance informatique, support utilisateur et administration réseau.",
      specializations: [
        "Maintenance hardware et software",
        "Administration système",
        "Réseaux informatiques",
        "Support technique",
        "Sécurité des systèmes",
      ],
      current: false,
    },
  ]

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary font-mono">
            <span className="text-secondary">//</span> Formation
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance font-mono">Mon parcours académique</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Une formation solide et progressive, du technique au conceptuel, complétée par une veille technologique
            constante.
          </p>
        </div>

        {/* Formations */}
        <div className="space-y-8 mb-16">
          {education.map((edu, index) => (
            <Card
              key={index}
              className={`hover:border-primary/50 transition-all hover:glow-primary ${
                edu.current ? "ring-2 ring-primary/20 bg-primary/5" : ""
              }`}
            >
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl text-balance">{edu.degree}</CardTitle>
                      {edu.current && (
                        <Badge variant="default" className="text-xs bg-accent text-accent-foreground">
                          En cours
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span className="font-medium">{edu.school}</span>
                      <Badge variant="outline" className="text-xs border-primary/30">
                        {edu.level}
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground font-mono">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span>{edu.period}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  </div>

                  <Badge
                    variant={edu.status === "En cours" ? "default" : "secondary"}
                    className={
                      edu.status === "En cours"
                        ? "self-start bg-accent text-accent-foreground"
                        : "self-start bg-primary/20 text-primary border-primary/30"
                    }
                  >
                    {edu.status}
                  </Badge>
                </div>

                <CardDescription className="text-pretty leading-relaxed">{edu.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div>
                  <h4 className="font-medium mb-3 text-sm text-primary font-mono">Spécialisations</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {edu.specializations.map((spec, idx) => (
                      <div key={idx} className="text-sm text-muted-foreground flex items-center">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full mr-3 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Résumé formation */}
        <div className="mt-16">
          <Card className="p-8 bg-card border-primary/20 glow-primary">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4 font-mono">Formation continue</h3>
              <p className="text-muted-foreground mb-6 text-pretty">
                Au-delà des diplômes, je maintiens une veille technologique active et me forme continuellement aux
                dernières innovations du développement web.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Badge variant="outline" className="bg-background/50 border-primary/30 hover:border-primary/50">
                  Veille technologique
                </Badge>
                <Badge variant="outline" className="bg-background/50 border-accent/30 hover:border-accent/50">
                  Formations en ligne
                </Badge>
                <Badge variant="outline" className="bg-background/50 border-secondary/30 hover:border-secondary/50">
                  Conférences tech
                </Badge>
                <Badge variant="outline" className="bg-background/50 border-primary/30 hover:border-primary/50">
                  Projets personnels
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
