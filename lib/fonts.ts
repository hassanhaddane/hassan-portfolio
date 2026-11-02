import localFont from "next/font/local";

// Keep text stable on slow connections: use the fallback if the font misses its first paint.
export const GeistSans = localFont({
  src: "../node_modules/geist/dist/fonts/geist-sans/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "optional",
});
