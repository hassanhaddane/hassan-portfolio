import { useSyncExternalStore } from "react";

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

const signalFamilies: Record<Technology, number> = {
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

export const signalFamily = (technology: Technology | null) =>
  technology ? signalFamilies[technology] : -1;

// Discrete interaction state only. Animation frames read it without rendering React.
let active: Technology | null = null;
const listeners = new Set<() => void>();
export function setFieldSignal(value: Technology | null) {
  if (active === value) return;
  active = value;
  listeners.forEach((listener) => listener());
}
export const getFieldSignal = () => active;
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export function useFieldSignal() {
  return useSyncExternalStore(subscribe, getFieldSignal, () => null);
}
