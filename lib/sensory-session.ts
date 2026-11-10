import type { MotionFrame } from "./motion-runtime";
import { clamp } from "./scroll-narrative";

const words = {
  fr: {
    view: "OUVRIR",
    zoom: "AGRANDIR",
    tune: "MODULER",
    copy: "COPIER",
    go: "ALLER",
  },
  en: { view: "OPEN", zoom: "ENLARGE", tune: "TUNE", copy: "COPY", go: "GO" },
};

/** Desktop feedback shares the story frame and never changes the native hit target. */
export function createSensorySession(root: HTMLElement) {
  const cursor = root.querySelector<HTMLElement>("[data-context-cursor]");
  const caption = cursor?.querySelector<HTMLElement>("[data-cursor-caption]");
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const labels = words[root.lang === "fr" ? "fr" : "en"];
  let target: HTMLElement | null = null;
  let magnet: HTMLElement | null = null;
  let rect: DOMRect | null = null;
  function clearMagnet() {
    magnet?.style.removeProperty("--magnet-x");
    magnet?.style.removeProperty("--magnet-y");
    magnet = null;
    rect = null;
  }
  const clear = () => {
    target = null;
    cursor?.removeAttribute("data-visible");
    clearMagnet();
  };
  const keyboard = (event: KeyboardEvent) => {
    if (event.key === "Tab" || event.key === "Escape") clear();
  };
  root.addEventListener("keydown", keyboard);
  document.addEventListener("visibilitychange", clear);
  return {
    update(frame: MotionFrame) {
      if (
        !fine.matches ||
        frame.width < 1000 ||
        !frame.pointerInside ||
        frame.pointerType !== "mouse" ||
        frame.scrolled
      ) {
        if (target || magnet) clear();
        return;
      }
      if (!frame.pointerChanged && !frame.resized) return;
      const next =
        frame.pointerTarget instanceof Element
          ? frame.pointerTarget.closest<HTMLElement>(
              "[data-cursor], .creative-action",
            )
          : null;
      if (
        !next ||
        !root.contains(next) ||
        next.matches(":disabled, :focus-visible")
      ) {
        if (target || magnet) clear();
        return;
      }
      if (next !== target || frame.resized) {
        clearMagnet();
        target = next;
        if (caption)
          caption.textContent =
            labels[next.dataset.cursor as keyof typeof labels] ?? labels.go;
        if (next.matches(".creative-action, [data-magnetic]")) {
          magnet = next;
          rect = next.getBoundingClientRect();
        }
      }
      if (cursor) {
        const x =
          frame.pointerX + (frame.pointerX > frame.width - 115 ? -105 : 15);
        const y =
          frame.pointerY + (frame.pointerY > frame.height - 44 ? -36 : 12);
        cursor.style.transform = `translate3d(${x}px,${y}px,0)`;
        cursor.dataset.visible = "true";
      }
      if (magnet && rect) {
        magnet.style.setProperty(
          "--magnet-x",
          `${clamp((frame.pointerX - rect.left - rect.width / 2) * 0.1, -6, 6).toFixed(2)}px`,
        );
        magnet.style.setProperty(
          "--magnet-y",
          `${clamp((frame.pointerY - rect.top - rect.height / 2) * 0.15, -4, 4).toFixed(2)}px`,
        );
      }
    },
    dispose() {
      clear();
      root.removeEventListener("keydown", keyboard);
      document.removeEventListener("visibilitychange", clear);
      cursor?.style.removeProperty("transform");
    },
  };
}
