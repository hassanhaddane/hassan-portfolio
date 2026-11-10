/** The only event/RAF pipeline. Continuous subscribers stop with page visibility. */
export type MotionFrame = Readonly<{
  time: number;
  delta: number;
  scrollY: number;
  velocity: number;
  direction: "up" | "down";
  width: number;
  height: number;
  pointerX: number;
  pointerY: number;
  pointerType: string;
  pointerTarget: EventTarget | null;
  pointerInside: boolean;
  scrolled: boolean;
  resized: boolean;
  pointerChanged: boolean;
}>;

type Listener = (frame: MotionFrame) => void;
const listeners = new Set<Listener>();
const continuous = new Set<Listener>();
let raf = 0;
let watching = false;
let lastTime = 0;
let currentScroll = 0;
let velocity = 0;
let direction: "up" | "down" = "down";
let pointerX = 0;
let pointerY = 0;
let pointerType = "";
let pointerTarget: EventTarget | null = null;
let pointerInside = false;
let pointerDirty = false;
let resizeDirty = true;

function schedule() {
  if (!raf && !document.hidden) raf = requestAnimationFrame(tick);
}

function tick(time: number) {
  raf = 0;
  const delta = Math.min(64, Math.max(1, time - (lastTime || time - 16)));
  lastTime = time;
  const nextScroll = window.scrollY;
  const scrolled = Math.abs(nextScroll - currentScroll) > 0.1;
  if (scrolled) {
    velocity = (nextScroll - currentScroll) / delta;
    direction = velocity < 0 ? "up" : "down";
    currentScroll = nextScroll;
  } else {
    velocity *= Math.exp(-delta / 105);
    if (Math.abs(velocity) < 0.008) velocity = 0;
  }
  const frame: MotionFrame = {
    time,
    delta,
    scrollY: currentScroll,
    velocity,
    direction,
    width: innerWidth,
    height: innerHeight,
    pointerX,
    pointerY,
    pointerType,
    pointerTarget,
    pointerInside,
    scrolled,
    resized: resizeDirty,
    pointerChanged: pointerDirty,
  };
  resizeDirty = false;
  pointerDirty = false;
  listeners.forEach((listener) => listener(frame));
  if (velocity !== 0 || continuous.size > 0) schedule();
}

function onPointer(event: PointerEvent) {
  pointerX = event.clientX;
  pointerY = event.clientY;
  pointerType = event.pointerType;
  pointerTarget = event.target;
  pointerInside = true;
  pointerDirty = true;
  schedule();
}

function onPointerLeave() {
  pointerInside = false;
  pointerDirty = true;
  schedule();
}

function onPointerEnd(event: PointerEvent) {
  if (event.pointerType !== "mouse") onPointerLeave();
}

function onResize() {
  resizeDirty = true;
  schedule();
}

function onVisibility() {
  if (document.hidden) {
    cancelAnimationFrame(raf);
    raf = 0;
    lastTime = 0;
  } else {
    resizeDirty = true;
    currentScroll = window.scrollY;
    velocity = 0;
    schedule();
  }
}

function start() {
  if (watching) return;
  watching = true;
  resizeDirty = true;
  currentScroll = window.scrollY;
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", onResize, { passive: true });
  addEventListener("pointermove", onPointer, { passive: true });
  addEventListener("pointerdown", onPointer, { passive: true });
  addEventListener("pointerup", onPointerEnd, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);
  schedule();
}

function stop() {
  if (!watching) return;
  watching = false;
  cancelAnimationFrame(raf);
  raf = 0;
  lastTime = 0;
  velocity = 0;
  pointerTarget = null;
  pointerInside = false;
  removeEventListener("scroll", schedule);
  removeEventListener("resize", onResize);
  removeEventListener("pointermove", onPointer);
  removeEventListener("pointerdown", onPointer);
  removeEventListener("pointerup", onPointerEnd);
  document.removeEventListener("pointerleave", onPointerLeave);
  document.removeEventListener("visibilitychange", onVisibility);
}

export function subscribeMotionFrame(
  listener: Listener,
  options: { continuous?: boolean } = {},
) {
  listeners.add(listener);
  if (options.continuous) continuous.add(listener);
  start();
  schedule();
  return () => {
    listeners.delete(listener);
    continuous.delete(listener);
    if (!listeners.size) stop();
  };
}

export function invalidateMotionFrame() {
  if (watching) onResize();
}
