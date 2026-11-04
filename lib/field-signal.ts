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
const families: Record<Technology, number> = {
  React: 0,
  "Next.js": 1,
  TypeScript: 2,
  Python: 3,
  FastAPI: 4,
  Docker: 5,
  "CI/CD": 6,
  Cypress: 5,
  JavaScript: 2,
  Vercel: 6,
};
let active: Technology | null = null;
export const signalFamily = (technology: Technology | null) =>
  technology ? families[technology] : -1;
export function setFieldSignal(value: Technology | null) {
  active = value;
}
export const getFieldSignal = () => active;
