import type { MotionFrame } from "./motion-runtime";
import { invalidateMotionFrame } from "./motion-runtime";
import type {
  SignalUniverse,
  UniverseInput,
  UniverseQuality,
} from "./signal-universe";

const projects = ["greecheck", "808bloom", "tech-express", "ceo19"];
export type UniverseSession = {
  update(
    frame: MotionFrame,
    input: Omit<UniverseInput, "intent" | "pulse">,
  ): void;
  dispose(): void;
};

/** Lightweight owner: probe before importing Three, preserve one canvas, release late imports. */
export function createUniverseSession(
  root: HTMLElement,
  animated: boolean,
): UniverseSession {
  const host = root.querySelector<HTMLElement>("[data-universe-host]");
  const button = root.querySelector<HTMLButtonElement>(
    "[data-signal-modulate]",
  );
  let controller: SignalUniverse | undefined;
  let disposed = false,
    canvas: HTMLCanvasElement | undefined,
    pendingContext: WebGL2RenderingContext | null = null;
  let hover = -1,
    focus = -1,
    selected = -1,
    intent = Number(root.dataset.signalMode || 0),
    pulse = 0;
  root.dataset.universe = "svg";
  const change = () => {
    intent = (intent + 1) % 3;
    pulse = 1;
    root.dataset.signalMode = String(intent);
    root.style.setProperty(
      "--signal-intent-amplitude",
      String([1, 0.68, 1.24][intent]),
    );
    if (button)
      button.setAttribute(
        "aria-label",
        `${button.textContent?.trim()} · ${intent + 1}/3`,
      );
    invalidateMotionFrame();
  };
  button?.addEventListener("click", change);
  if (button) button.disabled = false;
  const projectOf = (target: EventTarget | null) =>
    target instanceof Element
      ? projects.indexOf(target.closest<HTMLElement>(".work-entry")?.id ?? "")
      : -1;
  const over = (event: PointerEvent) => {
    const next = projectOf(event.target);
    if (next !== hover) {
      hover = next;
      invalidateMotionFrame();
    }
  };
  const out = (event: PointerEvent) => {
    const next = projectOf(event.relatedTarget);
    if (next !== hover) {
      hover = next;
      invalidateMotionFrame();
    }
  };
  const focusIn = (event: FocusEvent) => {
    focus = projectOf(event.target);
    invalidateMotionFrame();
  };
  const focusOut = (event: FocusEvent) => {
    focus = projectOf(event.relatedTarget);
    invalidateMotionFrame();
  };
  root.addEventListener("pointerover", over);
  root.addEventListener("pointerout", out);
  root.addEventListener("focusin", focusIn);
  root.addEventListener("focusout", focusOut);

  const navigatorHints = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  const memory = navigatorHints.deviceMemory ?? 8,
    cores = navigator.hardwareConcurrency || 4;
  const quality: UniverseQuality =
    memory <= 2 || cores <= 2
      ? "low"
      : innerWidth <= 760 || memory <= 4 || cores <= 4
        ? "mobile"
        : "full";
  const eligible =
    animated &&
    host &&
    "WebGL2RenderingContext" in window &&
    memory > 1 &&
    !navigatorHints.connection?.saveData;
  if (eligible) {
    canvas = document.createElement("canvas");
    canvas.className = "signal-canvas";
    canvas.setAttribute("aria-hidden", "true");
    canvas.dataset.running = "false";
    try {
      pendingContext = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        powerPreference: quality === "full" ? "high-performance" : "low-power",
      });
    } catch {
      /* The SVG is already the complete visual fallback. */
    }
    if (
      pendingContext &&
      pendingContext.getParameter(pendingContext.MAX_TEXTURE_SIZE) >= 2048
    ) {
      root.dataset.universeLoading = "true";
      const currentCanvas = canvas,
        context = pendingContext;
      import("./signal-universe")
        .then(({ createSignalUniverse }) => {
          if (disposed) return;
          if (
            !root.isConnected ||
            document.documentElement.dataset.motion === "off" ||
            matchMedia("(prefers-reduced-motion: reduce)").matches
          ) {
            context.getExtension("WEBGL_lose_context")?.loseContext();
            pendingContext = null;
            return;
          }
          host.appendChild(currentCanvas);
          try {
            controller = createSignalUniverse(
              currentCanvas,
              context,
              quality,
              (state) => {
                if (disposed) return;
                root.dataset.universe = state === "webgl" ? "webgl" : "svg";
                root.dataset.universeState = state;
              },
            );
            pendingContext = null;
          } catch {
            context.getExtension("WEBGL_lose_context")?.loseContext();
            currentCanvas.remove();
            pendingContext = null;
            canvas = undefined;
            root.dataset.universeState = "unavailable";
          }
        })
        .catch(() => {
          if (!disposed) {
            context.getExtension("WEBGL_lose_context")?.loseContext();
            pendingContext = null;
            canvas = undefined;
            root.dataset.universeState = "unavailable";
          }
        })
        .finally(() => {
          if (!disposed) delete root.dataset.universeLoading;
        });
    } else {
      pendingContext?.getExtension("WEBGL_lose_context")?.loseContext();
      pendingContext = null;
      root.dataset.universeState = "unavailable";
    }
  }
  return {
    update(frame, input) {
      const project = focus >= 0 ? focus : hover >= 0 ? hover : input.project;
      if (project !== selected) {
        selected = project;
        root.dataset.signalProject = projects[project];
        root.querySelectorAll<HTMLElement>(".work-entry").forEach((entry) => {
          if (entry.id === projects[project])
            entry.dataset.signalActive = "true";
          else delete entry.dataset.signalActive;
        });
      }
      pulse *= Math.exp(-frame.delta / 380);
      root.style.setProperty("--signal-pulse", pulse.toFixed(3));
      if (
        controller &&
        !controller.update(frame, { ...input, project, intent, pulse })
      ) {
        root.dataset.universe = "svg";
        controller.dispose();
        controller = undefined;
      }
    },
    dispose() {
      disposed = true;
      button?.removeEventListener("click", change);
      if (button) button.disabled = true;
      root.removeEventListener("pointerover", over);
      root.removeEventListener("pointerout", out);
      root.removeEventListener("focusin", focusIn);
      root.removeEventListener("focusout", focusOut);
      controller?.dispose();
      controller = undefined;
      pendingContext?.getExtension("WEBGL_lose_context")?.loseContext();
      pendingContext = null;
      canvas?.remove();
      root.dataset.universe = "svg";
      delete root.dataset.universeLoading;
    },
  };
}
