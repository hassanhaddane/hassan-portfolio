import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Hassan Haddane - Développeur Web Full-Stack",
  description:
    "Portfolio de Hassan Haddane, développeur web spécialisé en React, Next.js, TypeScript et technologies modernes. Découvrez mes projets et compétences.",
  keywords: ["Hassan Haddane", "Développeur Web", "React", "Next.js", "TypeScript", "Full-Stack", "Portfolio"],
  authors: [{ name: "Hassan Haddane" }],
  creator: "Hassan Haddane",
  openGraph: {
    title: "Hassan Haddane - Développeur Web Full-Stack",
    description: "Portfolio professionnel de Hassan Haddane, développeur web passionné par les technologies modernes.",
    url: "https://lowkyz.xyz",
    siteName: "Hassan Haddane Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassan Haddane - Développeur Web Full-Stack",
    description: "Portfolio professionnel de Hassan Haddane, développeur web passionné par les technologies modernes.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
