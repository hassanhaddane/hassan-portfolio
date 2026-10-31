import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";
import "./globals.css";
import "./hero-system.css";
import "./narrative-system.css";
import "./theme-system.css";
import "./entity-type-system.css";
import "./story-motion.css";
import "./clarity-system.css";
import "./intro-system.css";
import { SITE_ORIGIN, seoContent } from "@/lib/seo";

const barlow = localFont({
  src: "./fonts/barlow-condensed-latin-800-normal.woff2",
  weight: "800",
  style: "normal",
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  applicationName: "LOWKYZ // Hassan Haddane",
  title: {
    default: seoContent.fr.title,
    template: "%s // LOWKYZ",
  },
  description: seoContent.fr.description,
  authors: [{ name: "Hassan Haddane" }],
  category: "technology",
};
export const viewport: Viewport = {
  themeColor: "#080a0e",
  colorScheme: "light dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={barlow.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{var l=location.pathname.split('/')[1];if(l==='fr'||l==='en')document.documentElement.lang=l;var p=JSON.parse(localStorage.getItem('lowkyz.preferences.v1')||'{}');var t=p.theme==='light'?'light':'dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;if(!sessionStorage.getItem('lowkyz.cinematic.v1')&&!location.hash&&p.motion!==false&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData)document.documentElement.dataset.introPending='true'}catch(e){document.documentElement.dataset.theme='dark';document.documentElement.style.colorScheme='dark'}",
          }}
        />
      </head>
      <body className={GeistSans.variable}>
        {children}
      </body>
    </html>
  );
}
