import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Vérification de la clé API
if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not configured in environment variables")
}

const resend = new Resend(process.env.RESEND_API_KEY || "")

export async function POST(request: NextRequest) {
  try {
    // Vérification de la configuration
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Service d'email non configuré. Contactez l'administrateur." },
        { status: 500 }
      )
    }

    const { name, email, subject, message } = await request.json()

    // Validation basique
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      )
    }

    // Envoi de l'email
    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>", // Domaine par défaut Resend
      to: ["hassanhaddane33s@gmail.com"],
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nouveau message depuis ton portfolio
          </h2>

          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #007bff; margin-top: 0;">Détails du contact</h3>
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Sujet:</strong> ${subject}</p>
          </div>

          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Ce message a été envoyé depuis ton portfolio : <a href="https://lowkyz.xyz">lowkyz.xyz</a></p>
            <p>Pour répondre directement, utilise l'adresse : ${email}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true, id: data.data?.id })
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    )
  }
}