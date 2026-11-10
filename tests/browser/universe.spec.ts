import { test, expect, type Page } from "@playwright/test";

const root = "[data-portfolio-root]";
function monitor(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  return errors;
}
async function ready(page: Page) {
  await expect(page.locator(root)).toHaveAttribute("data-universe", "webgl", {
    timeout: 20000,
  });
  await expect(page.locator(".signal-canvas")).toHaveAttribute(
    "data-running",
    "true",
  );
}
async function highQuality(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });
    const pending = new Set<number>();
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        pending.delete(id);
        callback(time);
      });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      pending.delete(id);
      cancel(id);
    };
    Object.defineProperty(window, "universeFrameCount", {
      get: () => pending.size,
    });
  });
  await page.emulateMedia({ reducedMotion: "no-preference" });
}

test("one persistent renderer morphs through every chapter and converges to LOWKYZ", async ({
  page,
}, info) => {
  const errors = monitor(page);
  await highQuality(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/fr");
  await ready(page);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { universeFrameCount: number })
            .universeFrameCount,
      ),
    )
    .toBe(1);
  const canvas = page.locator(".signal-canvas");
  await canvas.evaluate((e) => (e.dataset.instance = "persistent"));
  await expect(canvas).toHaveAttribute("data-engine", "three.js r185");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-frames")))
    .toBeGreaterThan(0);
  await page.screenshot({ path: info.outputPath("sculpture.png") });
  const geometries: number[] = [],
    textures: number[] = [];
  for (const id of ["projets", "stack", "experience", "about", "contact"]) {
    await page.locator(`.living-signal a[href="#${id}"]`).click();
    await expect(page.locator(root)).toHaveAttribute("data-chapter", id);
    await ready(page);
    await expect(canvas).toHaveAttribute("data-instance", "persistent");
    await expect(page.locator("canvas")).toHaveCount(1);
    await expect
      .poll(async () => Number(await canvas.getAttribute("data-draw-calls")))
      .toBeGreaterThan(0);
    geometries.push(Number(await canvas.getAttribute("data-geometries")));
    textures.push(Number(await canvas.getAttribute("data-textures")));
    await page.screenshot({ path: info.outputPath(`${id}.png`) });
  }
  await page.keyboard.press("End");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-stage")))
    .toBe(5);
  expect(Math.max(...geometries)).toBeLessThanOrEqual(4);
  expect(Math.max(...textures)).toBeLessThanOrEqual(2);
  expect(
    Number(await canvas.getAttribute("data-draw-calls")),
  ).toBeLessThanOrEqual(5);
  expect(errors).toEqual([]);
});

test("pointer inertia, keyboard modulation and project selection drive the same scene", async ({
  page,
}) => {
  const errors = monitor(page);
  await highQuality(page);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/en");
  await ready(page);
  const canvas = page.locator(".signal-canvas");
  await page.mouse.move(1300, 400);
  await expect
    .poll(() => canvas.getAttribute("data-pointer"))
    .not.toBe("0.000,0.000");
  await page
    .getByRole("button", { name: "Change frequency", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(root)).toHaveAttribute("data-signal-mode", "1");
  await expect.poll(() => canvas.getAttribute("data-intent")).toBe("1");
  await page.locator("#greecheck h3 a").focus();
  await expect(page.locator(root)).toHaveAttribute(
    "data-signal-project",
    "greecheck",
  );
  await expect.poll(() => canvas.getAttribute("data-project")).toBe("0");
  await page.locator("#tech-express h3 a").focus();
  await expect(page.locator(root)).toHaveAttribute(
    "data-signal-project",
    "tech-express",
  );
  await expect.poll(() => canvas.getAttribute("data-project")).toBe("2");
  await expect(page.locator("#tech-express")).toHaveAttribute(
    "data-signal-active",
    "true",
  );
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("context loss reveals SVG immediately and restoration reuses the canvas", async ({
  page,
}) => {
  const errors = monitor(page);
  await highQuality(page);
  await page.goto("/fr");
  await ready(page);
  const canvas = page.locator(".signal-canvas");
  await canvas.evaluate((element) => {
    element.dataset.instance = "restored";
    const gl = (element as HTMLCanvasElement).getContext("webgl2")!;
    const extension = gl.getExtension("WEBGL_lose_context")!;
    (window as unknown as { signalLoss: WEBGL_lose_context }).signalLoss =
      extension;
    extension.loseContext();
  });
  await expect(page.locator(root)).toHaveAttribute(
    "data-universe-state",
    "lost",
  );
  await expect(page.locator(root)).toHaveAttribute("data-universe", "svg");
  await expect(page.locator("[data-signal-vessel]")).toBeVisible();
  await page.evaluate(() =>
    (
      window as unknown as { signalLoss: WEBGL_lose_context }
    ).signalLoss.restoreContext(),
  );
  await ready(page);
  await expect(canvas).toHaveAttribute("data-instance", "restored");
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("GPU resources remain bounded and are released across motion preference cycles", async ({
  page,
}) => {
  const errors = monitor(page);
  await highQuality(page);
  await page.goto("/en");
  await ready(page);
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.locator(".signal-canvas").evaluate((element) => {
      (
        window as unknown as { retiredSignal: HTMLCanvasElement }
      ).retiredSignal = element as HTMLCanvasElement;
    });
    await page
      .getByRole("button", { name: "Reduce motion", exact: true })
      .click();
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(root)).toHaveAttribute("data-narrative", "off");
    const retired = await page.evaluate(() => {
      const canvas = (window as unknown as { retiredSignal: HTMLCanvasElement })
        .retiredSignal;
      return {
        disposed: canvas.dataset.disposed,
        geometries: Number(canvas.dataset.geometries),
        textures: Number(canvas.dataset.textures),
        lost: canvas.getContext("webgl2")!.isContextLost(),
      };
    });
    expect(retired.disposed).toBe("true");
    expect(retired.lost).toBe(true);
    expect(retired.geometries).toBe(0);
    // Three may retain bookkeeping for its internal placeholder textures;
    // forceContextLoss releases that allocation with the entire native context.
    expect(retired.textures).toBeLessThanOrEqual(1);
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as unknown as { universeFrameCount: number })
              .universeFrameCount,
        ),
      )
      .toBe(0);
    await page
      .getByRole("button", { name: "Enable motion", exact: true })
      .click();
    await ready(page);
    expect(
      Number(
        await page.locator(".signal-canvas").getAttribute("data-geometries"),
      ),
    ).toBeLessThanOrEqual(4);
    await expect(page.locator("canvas")).toHaveCount(1);
  }
  expect(errors).toEqual([]);
});

test("mobile GPU budget is capped and the scene pauses outside the viewport", async ({
  page,
}) => {
  const errors = monitor(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 2 });
    Object.defineProperty(navigator, "deviceMemory", { get: () => 2 });
    const parameter = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (
      this: WebGL2RenderingContext,
      name: number,
    ) {
      return name === this.MAX_RENDERBUFFER_SIZE
        ? 512
        : parameter.call(this, name);
    };
  });
  await page.goto("/fr");
  await ready(page);
  const canvas = page.locator(".signal-canvas");
  expect(Number(await canvas.getAttribute("data-dpr"))).toBeLessThanOrEqual(
    0.8,
  );
  expect(
    await canvas.evaluate((e) => (e as HTMLCanvasElement).height),
  ).toBeLessThanOrEqual(512);
  await expect(canvas).toHaveAttribute("data-quality", "low");
  await canvas.evaluate((e) => ((e as HTMLElement).style.display = "none"));
  await expect(canvas).toHaveAttribute("data-running", "false");
  const frames = await canvas.getAttribute("data-frames");
  await page.waitForTimeout(150);
  expect(await canvas.getAttribute("data-frames")).toBe(frames);
  await canvas.evaluate((e) =>
    (e as HTMLElement).style.removeProperty("display"),
  );
  await expect(canvas).toHaveAttribute("data-running", "true");
  await expect(page.locator("canvas")).toHaveCount(1);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-running", "false");
  const hiddenFrames = await canvas.getAttribute("data-frames");
  await page.waitForTimeout(150);
  expect(await canvas.getAttribute("data-frames")).toBe(hiddenFrames);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(canvas).toHaveAttribute("data-running", "true");
  expect(errors).toEqual([]);
});

for (const mode of ["no-gpu", "tiny-device", "reduced"] as const) {
  test(`${mode}: native content and frequency control retain their SVG fallback`, async ({
    page,
  }) => {
    const errors = monitor(page);
    await page.emulateMedia({
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    await page.addInitScript((mode) => {
      if (mode === "tiny-device")
        Object.defineProperty(navigator, "deviceMemory", { get: () => 1 });
      if (mode === "no-gpu") {
        const original = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          type: string,
          ...args: unknown[]
        ) {
          if (type.includes("webgl")) return null;
          return original.apply(this, [type, ...args] as never);
        } as typeof original;
      }
    }, mode);
    await page.goto("/en");
    const button = page.getByRole("button", {
      name: "Change frequency",
      exact: true,
    });
    await expect(button).toBeEnabled();
    await expect(page.locator("canvas")).toHaveCount(0);
    await button.click();
    await expect(page.locator(root)).toHaveAttribute("data-signal-mode", "1");
    await expect(page.locator("h1")).toBeVisible();
    await page.locator('.living-signal a[href="#contact"]').click();
    await expect(page.locator(root)).toHaveAttribute("data-chapter", "contact");
    await expect(
      page.getByRole("link", { name: "hassanhaddane33s@gmail.com" }),
    ).toHaveAttribute("href", "mailto:hassanhaddane33s@gmail.com");
    expect(errors).toEqual([]);
  });
}
