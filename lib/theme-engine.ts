"use client"

import { useEffect } from "react"
import { useThemeStore } from "./stores/use-theme-store"

export function useSmartTheme() {
  const { isDark, setTheme, getTimeBasedTheme } = useThemeStore()

  useEffect(() => {
    const themeType = getTimeBasedTheme()

    // Apply time-based color variations
    if (themeType === "warm") {
      document.documentElement.style.setProperty("--accent-primary", "#58A4B0")
      document.documentElement.style.setProperty("--accent-secondary", "#A9BCD0")
    } else {
      document.documentElement.style.setProperty("--accent-primary", "#7B9FB0")
      document.documentElement.style.setProperty("--accent-secondary", "#8BA9C0")
    }
  }, [isDark, getTimeBasedTheme])
}
