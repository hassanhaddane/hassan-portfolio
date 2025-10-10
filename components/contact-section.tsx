"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Linkedin, Github, Send, MessageCircle } from "lucide-react"

/**
 * Section Contact - Formulaire de contact et informations
 * Permet aux visiteurs de prendre contact facilement
 */
export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("🚀 Formulaire soumis", formData)
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      console.log("📡 Envoi de la requête à /api/contact")
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log("📥 Réponse reçue:", response.status, response.statusText)
      const result = await response.json()
      console.log("📋 Données de réponse:", result)

      if (response.ok) {
        console.log("✅ Succès!")
        setSubmitStatus('success')
        setFormData({ name: "", email: "", subject: "", message: "" })
        alert("Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.")
      } else {
        console.log("❌ Erreur côté serveur:", result)
        setSubmitStatus('error')
        alert(result.error || "Erreur lors de l'envoi du message. Veuillez réessayer.")
      }
    } catch (error) {
      console.log("💥 Erreur de connexion:", error)
      setSubmitStatus('error')
      alert("Erreur de connexion. Veuillez vérifier votre connexion internet et réessayer.")
      console.error('Erreur lors de l\'envoi:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hassanhaddane33s@gmail.com",
      action: () => window.open("mailto:hassanhaddane33s@gmail.com", "_blank"),
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+33 7 60 58 26 74",
      action: () => window.open("tel:+33760582674", "_blank"),
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Rennes, France",
      action: () => {},
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      value: "/hassanhaddane",
      action: () => window.open("https://www.linkedin.com/in/hassanhaddane/", "_blank"),
    },
    {
      icon: Github,
      label: "GitHub",
      value: "/lowkyz",
      action: () => window.open("https://github.com/lowkyz", "_blank"),
    },
  ]

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 border-primary/50 text-primary font-mono">
            <span className="text-secondary">//</span> Contact
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-balance font-mono">Discutons de vos projets</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
            Vous avez un projet en tête ? Une opportunité à discuter ? N'hésitez pas à me contacter, je serais ravi
            d'échanger avec vous.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <Card className="hover:border-primary/50 transition-all hover:glow-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Envoyez-moi un message
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire et je vous répondrai dans les plus brefs délais.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nom complet *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Sujet *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Objet de votre message"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre projet ou votre demande..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-8">
            <Card className="hover:border-primary/50 transition-all hover:glow-primary">
              <CardHeader>
                <CardTitle className="font-mono">Informations de contact</CardTitle>
                <CardDescription>Vous préférez me contacter directement ? Voici mes coordonnées.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        info.action && info.label !== "Localisation"
                          ? "hover:bg-muted cursor-pointer hover:border-primary/30 border border-transparent"
                          : ""
                      }`}
                      onClick={info.action}
                    >
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm font-mono">{info.label}</p>
                        <p className="text-muted-foreground text-sm">{info.value}</p>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 glow-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚨</span>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 font-mono text-accent">Disponibilité</h3>
                    <p className="text-sm text-muted-foreground text-pretty leading-relaxed">
                      Actuellement, je cherche à rejoindre une équipe qui valorise le sens du détail, la collaboration
                      et la vision produit, afin de continuer à apprendre, créer et livrer des solutions qui font la
                      différence.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-all">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold mb-4 font-mono">Réseaux sociaux</h3>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://www.linkedin.com/in/hassanhaddane/", "_blank")}
                    className="border-primary/30 hover:border-primary/50 hover:bg-primary/10"
                  >
                    <Linkedin className="w-4 h-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://github.com/lowkyz", "_blank")}
                    className="border-accent/30 hover:border-accent/50 hover:bg-accent/10"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
