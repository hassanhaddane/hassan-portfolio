"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Code, Database, Smartphone, Server, TestTube, Wrench } from "lucide-react"
import { motion } from "framer-motion"

/**
 * Section Compétences - Présentation détaillée des compétences techniques
 * Organisée par catégories avec niveaux de maîtrise
 */
export function SkillsSection() {
  const skillCategories = [
    {
      icon: Code,
      title: "Front-End",
      skills: [
        { name: "JavaScript", level: 90, experience: "3+ ans" },
        { name: "TypeScript", level: 85, experience: "2+ ans" },
        { name: "React", level: 90, experience: "3+ ans" },
        { name: "Next.js", level: 85, experience: "2+ ans" },
        { name: "Tailwind CSS", level: 90, experience: "2+ ans" },
        { name: "Shadcn/ui", level: 80, experience: "1+ an" },
      ],
    },
    {
      icon: Server,
      title: "Back-End",
      skills: [
        { name: "Node.js", level: 80, experience: "2+ ans" },
        { name: "Python", level: 75, experience: "2+ ans" },
        { name: "Django", level: 70, experience: "1+ an" },
        { name: "REST APIs", level: 85, experience: "2+ ans" },
        { name: "GraphQL", level: 60, experience: "6 mois" },
      ],
    },
    {
      icon: Database,
      title: "Databases",
      skills: [
        { name: "PostgreSQL", level: 80, experience: "2+ ans" },
        { name: "MySQL", level: 85, experience: "3+ ans" },
        { name: "MongoDB", level: 70, experience: "1+ an" },
        { name: "Prisma", level: 75, experience: "1+ an" },
      ],
    },
    {
      icon: Smartphone,
      title: "Mobile",
      skills: [
        { name: "Flutter", level: 70, experience: "1+ an" },
        { name: "Dart", level: 70, experience: "1+ an" },
        { name: "React Native", level: 60, experience: "6 mois" },
      ],
    },
    {
      icon: Wrench,
      title: "DevOps",
      skills: [
        { name: "Git/GitHub", level: 90, experience: "3+ ans" },
        { name: "Docker", level: 75, experience: "1+ an" },
        { name: "CI/CD", level: 70, experience: "1+ an" },
        { name: "Vercel", level: 85, experience: "2+ ans" },
      ],
    },
    {
      icon: TestTube,
      title: "Testing",
      skills: [
        { name: "Cypress", level: 80, experience: "1+ an" },
        { name: "Jest", level: 75, experience: "1+ an" },
        { name: "Tests unitaires", level: 80, experience: "2+ ans" },
        { name: "ESLint/Prettier", level: 85, experience: "2+ ans" },
      ],
    },
  ]

  const getSkillLevel = (level: number) => {
    if (level >= 85) return { label: "Avancé", color: "text-[#58A4B0]" }
    if (level >= 75) return { label: "Intermédiaire+", color: "text-[#A9BCD0]" }
    if (level >= 65) return { label: "Intermédiaire", color: "text-[#A9BCD0]/70" }
    return { label: "Débutant", color: "text-[#A9BCD0]/50" }
  }

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-4 border-[#58A4B0]/50 text-[#58A4B0] font-mono">
            <Code className="w-3 h-3 mr-2" />
            Skills
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance font-mono text-[#D8DBE2]">
            <span className="text-[#A9BCD0]">{"{"}</span> Technologies <span className="text-[#A9BCD0]">{"}"}</span>
          </h2>
          <p className="text-lg text-[#A9BCD0] max-w-3xl mx-auto text-pretty leading-relaxed">
            Un aperçu de mes compétences techniques acquises au fil de mes expériences professionnelles et projets
            personnels.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.1 }}
        >
          {skillCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="hover:border-[#58A4B0]/50 transition-all bg-[#373F51]/20 border-[#373F51] h-full hover:shadow-lg hover:shadow-[#58A4B0]/10">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-sm bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-mono">{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.skills.map((skill, skillIndex) => {
                      const skillLevel = getSkillLevel(skill.level)
                      return (
                        <div key={skillIndex} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm font-mono">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs font-mono ${skillLevel.color} border-primary/30`}
                              >
                                {skillLevel.label}
                              </Badge>
                            </div>
                          </div>
                          <Progress value={skill.level} className="h-1.5" />
                          <span className="text-xs text-muted-foreground font-mono">{skill.experience}</span>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Technologies émergentes */}
        <div className="mt-16">
          <Card className="p-8 bg-card border-primary/20">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2 font-mono">
                <span className="text-secondary">{"["}</span> En apprentissage{" "}
                <span className="text-secondary">{"]"}</span>
              </h3>
              <p className="text-muted-foreground text-pretty">
                Toujours en veille technologique, je me forme continuellement aux dernières innovations
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="bg-background/50 border-primary/30 font-mono">
                Astro
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/30 font-mono">
                Svelte
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/30 font-mono">
                Rust
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/30 font-mono">
                WebAssembly
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/30 font-mono">
                Three.js
              </Badge>
              <Badge variant="outline" className="bg-background/50 border-primary/30 font-mono">
                AI/ML
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
