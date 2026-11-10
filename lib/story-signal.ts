/** Semantic interactions feed the existing universe; they never start an animation loop. */
export type StorySignal = { project?: string; mode?: number };
export function sendStorySignal(element: HTMLElement, signal: StorySignal) {
  const root = element.closest<HTMLElement>("[data-portfolio-root]");
  if (!root) return;
  if (signal.project) {
    if (element.closest(".work-section"))
      root.dataset.galleryProject = signal.project;
    else root.dataset.storyProject = signal.project;
  }
  if (signal.mode !== undefined) root.dataset.signalMode = String(signal.mode);
  root.dispatchEvent(
    new CustomEvent<StorySignal>("story-signal", { detail: signal }),
  );
}
