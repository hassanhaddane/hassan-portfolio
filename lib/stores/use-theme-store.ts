import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ThemeStore {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
  getTimeBasedTheme: () => "warm" | "cool"
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
      setTheme: (isDark) => set({ isDark }),
      getTimeBasedTheme: () => {
        const hour = new Date().getHours()
        // Warm tones during day (6am-6pm), cool tones at night
        return hour >= 6 && hour < 18 ? "warm" : "cool"
      },
    }),
    {
      name: "portfolio-theme",
    },
  ),
)
