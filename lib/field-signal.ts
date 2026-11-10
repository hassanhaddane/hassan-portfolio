export const technologies = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "FastAPI",
  "Docker",
  "CI/CD",
  "Cypress",
  "JavaScript",
  "Vercel",
] as const;
export type Technology = (typeof technologies)[number];
