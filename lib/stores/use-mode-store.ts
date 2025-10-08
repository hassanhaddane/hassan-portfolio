import { create } from "zustand"
import { persist } from "zustand/middleware"

type Mode = "dev" | "product"

interface ModeStore {
  mode: Mode
  toggleMode: () => void
  setMode: (mode: Mode) => void
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set) => ({
      mode: "dev",
      toggleMode: () => set((state) => ({ mode: state.mode === "dev" ? "product" : "dev" })),
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "portfolio-mode",
    },
  ),
)
