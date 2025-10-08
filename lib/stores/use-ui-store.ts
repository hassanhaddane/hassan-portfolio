import { create } from "zustand"

interface UIStore {
  isTerminalOpen: boolean
  isSystemPanelOpen: boolean
  isChatOpen: boolean
  toggleTerminal: () => void
  toggleSystemPanel: () => void
  toggleChat: () => void
  closeAll: () => void
}

export const useUIStore = create<UIStore>((set) => ({
  isTerminalOpen: false,
  isSystemPanelOpen: false,
  isChatOpen: false,
  toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
  toggleSystemPanel: () => set((state) => ({ isSystemPanelOpen: !state.isSystemPanelOpen })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  closeAll: () => set({ isTerminalOpen: false, isSystemPanelOpen: false, isChatOpen: false }),
}))
