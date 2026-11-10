/** Pure scene model; scroll position is the clock, never a wheel-event simulation. */
export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
export const mix = (a: number, b: number, progress: number) =>
  a + (b - a) * progress;
export const smooth = (value: number) => {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
};
export const sceneColors = [
  [238, 236, 228],
  [32, 34, 31],
  [238, 236, 228],
  [221, 221, 207],
  [32, 34, 31],
  [242, 82, 41],
] as const;
export const caseSceneColors = [
  [32, 34, 31],
  [32, 34, 31],
  [238, 236, 228],
  [221, 221, 207],
  [32, 34, 31],
  [242, 82, 41],
] as const;
export type ScenePalette = readonly (readonly [number, number, number])[];
export const sceneWords = [
  "LOWKYZ",
  "WORK",
  "ENGINEERING",
  "JOURNEY",
  "ABOUT",
  "CONTACT",
] as const;
export type ChapterBounds = { id: string; top: number; height: number };

export function narrativeAt(
  scroll: number,
  height: number,
  maxScroll: number,
  chapters: ChapterBounds[],
  palette: ScenePalette = sceneColors,
) {
  const progress = clamp(scroll / Math.max(1, maxScroll));
  // A shared viewport-sized overlap replaces hard scene cuts at section borders.
  const focus = scroll + height * 0.42;
  let scene = 0;
  let blend = 0;
  for (let index = 1; index < chapters.length; index++) {
    const start = chapters[index].top - height * 0.88;
    // Short final scenes must resolve before the native document reaches its end.
    const end = Math.max(
      start + 1,
      Math.min(chapters[index].top + height * 0.04, maxScroll - height * 0.04),
    );
    const t = (scroll - start) / (end - start);
    if (t >= 1) {
      scene = index;
      blend = 0;
    } else if (t > 0) {
      scene = index - 1;
      blend = smooth(t);
      break;
    } else break;
  }
  let active = 0;
  for (let i = 1; i < chapters.length; i++)
    if (chapters[i].top <= scroll + height * 0.35) active = i;
  if (scroll >= maxScroll - 4) active = chapters.length - 1;
  const chapter = chapters[active];
  const local = clamp((focus - chapter.top) / Math.max(1, chapter.height));
  const from = palette[scene];
  const to = palette[Math.min(scene + 1, palette.length - 1)];
  const color = from.map((channel, i) => mix(channel, to[i], blend));
  // Pick the higher-contrast ink rather than fading text through illegible mid-grey.
  const luminance = color.reduce((sum, channel, i) => {
    const c = channel / 255;
    return (
      sum +
      (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4) *
        [0.2126, 0.7152, 0.0722][i]
    );
  }, 0);
  const darkInk = luminance > 0.179;
  const ink = darkInk
    ? luminance < 0.35
      ? "#000000"
      : "#20221f"
    : luminance > 0.1
      ? "#ffffff"
      : "#eeece4";
  const muted =
    luminance > 0.06 && luminance < 0.65
      ? ink
      : darkInk
        ? "#55574e"
        : "#c4c4b9";
  const signalContrast =
    (Math.max(0.25072, luminance) + 0.05) /
    (Math.min(0.25072, luminance) + 0.05);
  return {
    progress,
    scene,
    blend,
    active,
    local,
    darkInk,
    backdrop: `rgb(${color.map(Math.round).join(",")})`,
    ink,
    muted,
    accent: signalContrast >= 3 ? "#f25229" : ink,
  };
}
