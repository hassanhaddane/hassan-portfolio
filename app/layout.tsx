import type { Metadata, Viewport } from "next";
import { GeistSans } from "@/lib/fonts";
import localFont from "next/font/local";
import "./globals.css";
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
  themeColor: "#101210",
  colorScheme: "dark",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={barlow.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var l=location.pathname.split('/')[1];if(l==='fr'||l==='en')document.documentElement.lang=l;var p=JSON.parse(localStorage.getItem('lowkyz.accessibility.v2')||'{}');document.documentElement.dataset.motion=p.motion===false||matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'on';if(['/fr','/en','/fr/','/en/'].includes(location.pathname)&&!sessionStorage.getItem('lowkyz.cinematic.v2')&&!location.hash&&document.documentElement.dataset.motion==='on'&&!navigator.connection?.saveData)document.documentElement.dataset.introPending='true'}catch(e){}",
          }}
        />
      </head>
      <body className={GeistSans.variable}>{children}</body>
    </html>
  );
}
