import { useSyncExternalStore } from "react";

export const technologyGroups = [
  ["React", "Next.js", "TypeScript"],
  ["Python", "FastAPI"],
  ["Docker", "CI/CD"],
] as const;
export const technologies = technologyGroups.flat();
export type Technology = (typeof technologies)[number];

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
