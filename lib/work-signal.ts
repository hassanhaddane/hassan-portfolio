import { useSyncExternalStore } from "react";

export type WorkSignal = "greecheck" | "iaudiogram" | "sante" | "biosency";

let active: WorkSignal = "greecheck";
const listeners = new Set<() => void>();

export function setWorkSignal(value: WorkSignal) {
  if (value === active) return;
  active = value;
  listeners.forEach((listener) => listener());
}

const getWorkSignal = () => active;

export function useWorkSignal() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getWorkSignal,
    () => "greecheck" as const,
  );
}
