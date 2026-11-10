/** Yield work to rendering and input; never impose a minimum loading duration. */
export function yieldToBrowser(): Promise<void> {
  const scheduler = (
    globalThis as typeof globalThis & { scheduler?: { yield(): Promise<void> } }
  ).scheduler;
  return scheduler?.yield() ?? new Promise((resolve) => setTimeout(resolve, 0));
}

export function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    if ("requestIdleCallback" in window)
      window.requestIdleCallback(() => resolve(), { timeout: 1000 });
    else setTimeout(resolve, 0);
  });
}
